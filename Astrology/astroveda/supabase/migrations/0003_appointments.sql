-- 0003_appointments.sql
-- Appointments, audit trail, and database constraints.

-- 8. appointments
create table public.appointments (
  id                    uuid primary key default gen_random_uuid(),
  reference             text not null unique,
  customer_id           uuid not null references public.customers (id) on delete restrict,
  service_id            uuid not null references public.services (id) on delete restrict,
  resource_key          text not null default 'primary',
  starts_at             timestamptz not null,
  ends_at               timestamptz not null,
  occupied_until        timestamptz not null,
  duration_minutes      integer not null check (duration_minutes > 0),
  price_inr_snapshot    numeric(10,2),
  consultation_mode     text not null check (consultation_mode in ('in_person', 'phone', 'video')),
  status                text not null default 'pending'
                        check (status in ('pending', 'confirmed', 'rejected', 'cancelled',
                                          'completed', 'no_show', 'expired')),
  payment_status        text not null default 'unpaid'
                        check (payment_status in ('unpaid', 'paid', 'waived', 'refunded')),
  payment_method        text check (payment_method in ('cash', 'upi_direct', 'bank_transfer', 'other')),
  payment_amount_inr    numeric(10,2) check (payment_amount_inr >= 0),
  payment_recorded_at   timestamptz,
  payment_recorded_by   uuid references public.admin_profiles (id) on delete set null,
  payment_note          text,
  customer_name         text not null,
  customer_notes        text check (char_length(customer_notes) <= 1000),
  admin_notes           text,
  locale                text not null check (locale in ('en', 'hi', 'mr')),
  consent_accepted_at   timestamptz not null,
  consent_policy_version text not null,
  manage_token_hash     text not null,
  reschedule_count      integer not null default 0,
  cancelled_by          text check (cancelled_by in ('customer', 'admin', 'system')),
  cancellation_reason   text,
  confirmed_at          timestamptz,
  completed_at          timestamptz,
  cancelled_at          timestamptz,
  created_at            timestamptz not null default now(),
  updated_at            timestamptz not null default now(),

  constraint appointments_time_order check (starts_at < ends_at and ends_at <= occupied_until),

  constraint appointments_payment_after_completion
    check (payment_status in ('unpaid', 'waived') or status = 'completed'),
  constraint appointments_payment_details
    check (payment_status not in ('paid', 'refunded')
           or (payment_amount_inr is not null
               and payment_method is not null
               and payment_recorded_at is not null)),

  -- Concurrency & Double-Booking Guard
  constraint appointments_no_overlap
    exclude using gist (
      resource_key with =,
      tstzrange(starts_at, occupied_until, '[)') with &&
    ) where (status in ('pending', 'confirmed'))
);

create index appointments_starts_at_idx        on public.appointments (starts_at);
create index appointments_status_starts_idx    on public.appointments (status, starts_at);
create index appointments_customer_idx         on public.appointments (customer_id);
create index appointments_service_idx          on public.appointments (service_id);
create index appointments_unpaid_idx           on public.appointments (starts_at)
  where status = 'completed' and payment_status = 'unpaid';

-- 9. appointment_events: append-only history
create table public.appointment_events (
  id              bigint generated always as identity primary key,
  appointment_id  uuid not null references public.appointments (id) on delete cascade,
  event_type      text not null check (event_type in (
                    'created', 'confirmed', 'rejected', 'cancelled', 'rescheduled', 'completed',
                    'no_show', 'expired', 'status_changed', 'payment_updated', 'note_updated')),
  from_status     text,
  to_status       text,
  actor_type      text not null check (actor_type in ('customer', 'admin', 'system')),
  actor_id        uuid,
  details         jsonb not null default '{}'::jsonb,
  created_at      timestamptz not null default now()
);
create index appointment_events_appointment_idx on public.appointment_events (appointment_id, created_at);

create or replace function public.audit_actor_type()
returns text language sql stable as $$
  select case when auth.uid() is not null then 'admin'
              else coalesce(nullif(current_setting('app.actor_type', true), ''), 'system') end
$$;

create or replace function public.audit_actor_id()
returns uuid language sql stable as $$
  select coalesce(auth.uid(), nullif(current_setting('app.actor_id', true), '')::uuid)
$$;

create or replace function public.enforce_appointment_rules()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  new.updated_at := now();

  if new.reference is distinct from old.reference
     or new.customer_id is distinct from old.customer_id
     or new.created_at is distinct from old.created_at then
    raise exception 'IMMUTABLE_COLUMN' using errcode = 'P0001';
  end if;

  if old.status in ('rejected', 'cancelled', 'completed', 'no_show', 'expired')
     and (new.status is distinct from old.status
          or new.starts_at is distinct from old.starts_at
          or new.service_id is distinct from old.service_id) then
    raise exception 'APPOINTMENT_CLOSED' using errcode = 'P0001';
  end if;

  if new.status is distinct from old.status then
    if not ((old.status = 'pending'   and new.status in ('confirmed', 'rejected', 'cancelled', 'expired'))
         or (old.status = 'confirmed' and new.status in ('pending', 'completed', 'cancelled', 'no_show'))) then
      raise exception 'INVALID_STATUS_TRANSITION: % -> %', old.status, new.status using errcode = 'P0001';
    end if;
    if new.status in ('completed', 'no_show') and now() < old.starts_at then
      raise exception 'TOO_EARLY' using errcode = 'P0001';
    end if;
    if new.status = 'confirmed' then new.confirmed_at := coalesce(new.confirmed_at, now()); end if;
    if new.status = 'completed' then new.completed_at := now(); end if;
    if new.status = 'cancelled' then new.cancelled_at := now(); end if;
  end if;

  if new.payment_status is distinct from old.payment_status then
    if not ((old.payment_status = 'unpaid' and new.payment_status in ('paid', 'waived'))
         or (old.payment_status = 'paid'   and new.payment_status = 'refunded')) then
      raise exception 'INVALID_PAYMENT_TRANSITION: % -> %', old.payment_status, new.payment_status
        using errcode = 'P0001';
    end if;
    if new.payment_status = 'refunded' and auth.uid() is not null and not public.is_admin('owner') then
      raise exception 'OWNER_REQUIRED' using errcode = '42501';
    end if;
    new.payment_recorded_at := now();
    new.payment_recorded_by := public.audit_actor_id();
  end if;

  return new;
end $$;

create trigger appointments_enforce_rules
  before update on public.appointments
  for each row execute function public.enforce_appointment_rules();

create or replace function public.log_appointment_changes()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if tg_op = 'INSERT' then
    insert into public.appointment_events (appointment_id, event_type, to_status, actor_type, actor_id, details)
    values (new.id, 'created', new.status, public.audit_actor_type(), public.audit_actor_id(),
            jsonb_build_object('starts_at', new.starts_at, 'service_id', new.service_id));
    return null;
  end if;

  if new.status is distinct from old.status then
    insert into public.appointment_events
      (appointment_id, event_type, from_status, to_status, actor_type, actor_id, details)
    values (new.id,
            case new.status when 'confirmed' then 'confirmed' when 'rejected' then 'rejected'
                            when 'cancelled' then 'cancelled' when 'completed' then 'completed'
                            when 'no_show' then 'no_show'     when 'expired' then 'expired'
                            else 'status_changed' end,
            old.status, new.status, public.audit_actor_type(), public.audit_actor_id(),
            jsonb_build_object('reason', new.cancellation_reason));
  end if;

  if new.starts_at is distinct from old.starts_at then
    insert into public.appointment_events (appointment_id, event_type, actor_type, actor_id, details)
    values (new.id, 'rescheduled', public.audit_actor_type(), public.audit_actor_id(),
            jsonb_build_object('old_starts_at', old.starts_at, 'new_starts_at', new.starts_at));
  end if;

  if new.payment_status is distinct from old.payment_status then
    insert into public.appointment_events (appointment_id, event_type, actor_type, actor_id, details)
    values (new.id, 'payment_updated', public.audit_actor_type(), public.audit_actor_id(),
            jsonb_build_object('from', old.payment_status, 'to', new.payment_status,
                               'amount_inr', new.payment_amount_inr, 'method', new.payment_method));
  end if;

  if new.admin_notes is distinct from old.admin_notes then
    insert into public.appointment_events (appointment_id, event_type, actor_type, actor_id)
    values (new.id, 'note_updated', public.audit_actor_type(), public.audit_actor_id());
  end if;

  return null;
end $$;

create trigger appointments_log_changes
  after insert or update on public.appointments
  for each row execute function public.log_appointment_changes();

