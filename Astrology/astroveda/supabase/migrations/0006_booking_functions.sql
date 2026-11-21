-- 0006_booking_functions.sql
-- Server-side booking logic. Single source of truth for slot availability.

-- 1. get_available_slots
create or replace function public.get_available_slots(
  p_service_id uuid,
  p_date date,
  p_exclude_appointment_id uuid default null
)
returns table (slot_start timestamptz, slot_end timestamptz)
language plpgsql
stable
security definer
set search_path = public
as $$
declare
  v_svc      public.services;
  v_tz       constant text := 'Asia/Kolkata';
  v_interval integer;
  v_notice   integer;
  v_max_days integer;
  v_today    date := (now() at time zone 'Asia/Kolkata')::date;
  v_weekday  integer := extract(dow from p_date)::integer;
  v_earliest timestamptz;
begin
  select * into v_svc from public.services s where s.id = p_service_id and s.is_active;
  if not found then return; end if;

  select (st.value #>> '{}')::integer into v_interval from public.site_settings st where st.key = 'booking.slot_interval_minutes';
  select (st.value #>> '{}')::integer into v_notice   from public.site_settings st where st.key = 'booking.min_notice_hours';
  select (st.value #>> '{}')::integer into v_max_days from public.site_settings st where st.key = 'booking.max_advance_days';
  v_interval := coalesce(v_interval, 30);
  v_notice   := coalesce(v_notice, 12);
  v_max_days := coalesce(v_max_days, 30);

  if p_date < v_today or p_date > v_today + v_max_days then return; end if;
  v_earliest := now() + make_interval(hours => v_notice);

  if exists (select 1 from public.availability_exceptions e
             where e.kind in ('holiday', 'blocked') and e.start_time is null
               and p_date between e.date_from and e.date_to) then
    return;
  end if;

  return query
  with windows as (
    select (p_date + r.start_time) at time zone v_tz as w_start,
           (p_date + r.end_time)   at time zone v_tz as w_end
    from public.availability_rules r
    where r.is_active and r.kind = 'working' and r.weekday = v_weekday
    union all
    select (p_date + e.start_time) at time zone v_tz,
           (p_date + e.end_time)   at time zone v_tz
    from public.availability_exceptions e
    where e.kind = 'extra_hours' and p_date between e.date_from and e.date_to
  ),
  cand as (
    select s as c_start,
           s + make_interval(mins => v_svc.duration_minutes) as c_end
    from windows w,
    lateral generate_series(
      w.w_start,
      w.w_end - make_interval(mins => v_svc.duration_minutes),
      make_interval(mins => v_interval)) as s
  )
  select distinct c.c_start, c.c_end
  from cand c
  where c.c_start >= v_earliest
    and not exists (
      select 1 from public.availability_rules b
      where b.is_active and b.kind = 'break' and b.weekday = v_weekday
        and tstzrange((p_date + b.start_time) at time zone v_tz,
                      (p_date + b.end_time)   at time zone v_tz, '[)')
            && tstzrange(c.c_start, c.c_end, '[)'))
    and not exists (
      select 1 from public.availability_exceptions e
      where e.kind in ('holiday', 'blocked') and e.start_time is not null
        and p_date between e.date_from and e.date_to
        and tstzrange((p_date + e.start_time) at time zone v_tz,
                      (p_date + e.end_time)   at time zone v_tz, '[)')
            && tstzrange(c.c_start, c.c_end, '[)'))
    and not exists (
      select 1 from public.appointments a
      where a.resource_key = 'primary'
        and a.status in ('pending', 'confirmed')
        and a.id is distinct from p_exclude_appointment_id
        and tstzrange(a.starts_at, a.occupied_until, '[)')
            && tstzrange(c.c_start, c.c_end + make_interval(mins => v_svc.buffer_minutes), '[)'))
  order by 1;
end $$;

-- 2. create_appointment_request
create or replace function public.create_appointment_request(
  p_service_id         uuid,
  p_starts_at          timestamptz,
  p_customer_name      text,
  p_phone_e164         text,
  p_email              text,
  p_locale             text,
  p_mode               text,
  p_notes              text,
  p_policy_version     text,
  p_reference          text,
  p_manage_token_hash  text
)
returns public.appointments
language plpgsql
security definer
set search_path = public
as $$
declare
  v_svc         public.services;
  v_approval    text;
  v_status      text;
  v_max_pending integer;
  v_pending     integer;
  v_customer    uuid;
  v_ends        timestamptz;
  v_occupied    timestamptz;
  v_row         public.appointments;
begin
  select * into v_svc from public.services s where s.id = p_service_id and s.is_active;
  if not found then raise exception 'SERVICE_UNAVAILABLE' using errcode = 'P0001'; end if;

  if not (p_mode = any (v_svc.consultation_modes)) then
    raise exception 'MODE_UNAVAILABLE' using errcode = 'P0001';
  end if;

  if not exists (
    select 1
    from public.get_available_slots(p_service_id, (p_starts_at at time zone 'Asia/Kolkata')::date) g
    where g.slot_start = p_starts_at
  ) then
    raise exception 'SLOT_NOT_AVAILABLE' using errcode = 'P0001';
  end if;

  select (st.value #>> '{}')::integer into v_max_pending
    from public.site_settings st where st.key = 'booking.max_pending_per_phone';
  v_max_pending := coalesce(v_max_pending, 3);
  select count(*) into v_pending
    from public.appointments a join public.customers c on c.id = a.customer_id
    where c.phone_e164 = p_phone_e164 and a.status = 'pending';
  if v_pending >= v_max_pending then raise exception 'TOO_MANY_PENDING' using errcode = 'P0001'; end if;

  select st.value #>> '{}' into v_approval from public.site_settings st where st.key = 'booking.approval_mode';
  v_status := case when coalesce(v_approval, 'manual') = 'auto' then 'confirmed' else 'pending' end;

  v_ends     := p_starts_at + make_interval(mins => v_svc.duration_minutes);
  v_occupied := v_ends + make_interval(mins => v_svc.buffer_minutes);

  insert into public.customers (full_name, phone_e164, email, preferred_locale)
  values (p_customer_name, p_phone_e164, nullif(p_email, ''), p_locale)
  on conflict (phone_e164) do update
    set email            = coalesce(public.customers.email, excluded.email),
        preferred_locale = excluded.preferred_locale
  returning id into v_customer;

  perform set_config('app.actor_type', 'customer', true);

  begin
    insert into public.appointments (
      reference, customer_id, service_id, starts_at, ends_at, occupied_until, duration_minutes,
      price_inr_snapshot, consultation_mode, status, customer_name, customer_notes, locale,
      consent_accepted_at, consent_policy_version, manage_token_hash, confirmed_at)
    values (
      p_reference, v_customer, p_service_id, p_starts_at, v_ends, v_occupied, v_svc.duration_minutes,
      v_svc.price_inr, p_mode, v_status, p_customer_name, nullif(p_notes, ''), p_locale,
      now(), p_policy_version, p_manage_token_hash,
      case when v_status = 'confirmed' then now() end)
    returning * into v_row;
  exception
    when exclusion_violation then raise exception 'SLOT_TAKEN' using errcode = 'P0001';
    when unique_violation    then raise exception 'REFERENCE_COLLISION' using errcode = 'P0001';
  end;

  return v_row;
end $$;

-- 3. cancel_appointment_by_token
create or replace function public.cancel_appointment_by_token(
  p_reference   text,
  p_token_hash  text,
  p_reason      text default null
)
returns public.appointments
language plpgsql
security definer
set search_path = public
as $$
declare
  v_row    public.appointments;
  v_cutoff integer;
begin
  select * into v_row from public.appointments a
   where a.reference = p_reference and a.manage_token_hash = p_token_hash
   for update;
  if not found then raise exception 'NOT_FOUND' using errcode = 'P0001'; end if;
  if v_row.status not in ('pending', 'confirmed') then raise exception 'NOT_CANCELLABLE' using errcode = 'P0001'; end if;
  if now() >= v_row.starts_at then raise exception 'ALREADY_STARTED' using errcode = 'P0001'; end if;

  select (st.value #>> '{}')::integer into v_cutoff
    from public.site_settings st where st.key = 'booking.cancellation_cutoff_hours';
  v_cutoff := coalesce(v_cutoff, 24);
  if v_row.status = 'confirmed' and now() > v_row.starts_at - make_interval(hours => v_cutoff) then
    raise exception 'CANCEL_CUTOFF_PASSED' using errcode = 'P0001';
  end if;

  perform set_config('app.actor_type', 'customer', true);
  update public.appointments
     set status = 'cancelled', cancelled_by = 'customer', cancellation_reason = left(p_reason, 500)
   where id = v_row.id
   returning * into v_row;
  return v_row;
end $$;

-- 4. reschedule_appointment
create or replace function public.reschedule_appointment(
  p_appointment_id  uuid,
  p_new_starts_at   timestamptz,
  p_actor_type      text,
  p_actor_id        uuid default null
)
returns public.appointments
language plpgsql
security definer
set search_path = public
as $$
declare
  v_row      public.appointments;
  v_cutoff   integer;
  v_approval text;
  v_status   text;
  v_ends     timestamptz;
  v_occupied timestamptz;
  v_buffer   integer;
begin
  if p_actor_type not in ('customer', 'admin') then raise exception 'BAD_ACTOR' using errcode = 'P0001'; end if;

  select * into v_row from public.appointments a where a.id = p_appointment_id for update;
  if not found then raise exception 'NOT_FOUND' using errcode = 'P0001'; end if;
  if v_row.status not in ('pending', 'confirmed') then raise exception 'NOT_RESCHEDULABLE' using errcode = 'P0001'; end if;

  if p_actor_type = 'customer' then
    select (st.value #>> '{}')::integer into v_cutoff
      from public.site_settings st where st.key = 'booking.cancellation_cutoff_hours';
    v_cutoff := coalesce(v_cutoff, 24);
    if v_row.status = 'confirmed' and now() > v_row.starts_at - make_interval(hours => v_cutoff) then
      raise exception 'RESCHEDULE_CUTOFF_PASSED' using errcode = 'P0001';
    end if;
  end if;

  if not exists (
    select 1
    from public.get_available_slots(v_row.service_id, (p_new_starts_at at time zone 'Asia/Kolkata')::date, v_row.id) g
    where g.slot_start = p_new_starts_at
  ) then
    raise exception 'SLOT_NOT_AVAILABLE' using errcode = 'P0001';
  end if;

  select s.buffer_minutes into v_buffer from public.services s where s.id = v_row.service_id;
  v_ends     := p_new_starts_at + make_interval(mins => v_row.duration_minutes);
  v_occupied := v_ends + make_interval(mins => coalesce(v_buffer, 0));

  select st.value #>> '{}' into v_approval from public.site_settings st where st.key = 'booking.approval_mode';
  v_status := case when p_actor_type = 'customer' and coalesce(v_approval, 'manual') = 'manual'
                   then 'pending' else v_row.status end;

  perform set_config('app.actor_type', p_actor_type, true);
  perform set_config('app.actor_id', coalesce(p_actor_id::text, ''), true);

  begin
    update public.appointments
       set starts_at = p_new_starts_at, ends_at = v_ends, occupied_until = v_occupied,
           status = v_status, reschedule_count = reschedule_count + 1,
           confirmed_at = case when v_status = 'pending' then null else confirmed_at end
     where id = v_row.id
     returning * into v_row;
  exception
    when exclusion_violation then raise exception 'SLOT_TAKEN' using errcode = 'P0001';
  end;
  return v_row;
end $$;

-- 5. anonymize_customer
create or replace function public.anonymize_customer(p_customer_id uuid)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  if not public.is_admin('owner') then raise exception 'OWNER_REQUIRED' using errcode = '42501'; end if;

  update public.customers
     set full_name = 'Deleted customer', phone_e164 = 'deleted:' || id::text,
         email = null, user_id = null, anonymized_at = now()
   where id = p_customer_id and anonymized_at is null;

  update public.appointments
     set customer_name = 'Deleted customer', customer_notes = null,
         admin_notes = null, manage_token_hash = 'revoked'
   where customer_id = p_customer_id;
end $$;

-- Function Privileges
revoke execute on all functions in schema public from public, anon, authenticated;

grant execute on function public.get_available_slots(uuid, date, uuid) to anon, authenticated, service_role;
grant execute on function public.is_admin(text)                        to authenticated, service_role;
grant execute on function public.anonymize_customer(uuid)              to authenticated;
grant execute on function public.create_appointment_request(
  uuid, timestamptz, text, text, text, text, text, text, text, text, text)  to service_role;
grant execute on function public.cancel_appointment_by_token(text, text, text) to service_role;
grant execute on function public.reschedule_appointment(uuid, timestamptz, text, uuid) to service_role;

