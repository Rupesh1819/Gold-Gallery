-- 0002_services_and_availability.sql
-- Services, translation tables, availability models, and customers.

-- 3. services
create table public.services (
  id                  uuid primary key default gen_random_uuid(),
  slug                text not null unique check (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),
  duration_minutes    integer not null check (duration_minutes > 0),
  buffer_minutes      integer not null default 15 check (buffer_minutes >= 0),
  price_inr           numeric(10,2) check (price_inr is null or price_inr >= 0),
  consultation_modes  text[] not null default '{"video", "phone"}',
  sort_order          integer not null default 0,
  is_active           boolean not null default true,
  image_path          text,
  created_at          timestamptz not null default now(),
  updated_at          timestamptz not null default now()
);
create index services_active_sort_idx on public.services (is_active, sort_order);

-- 4. service_translations
create table public.service_translations (
  id                 uuid primary key default gen_random_uuid(),
  service_id         uuid not null references public.services (id) on delete cascade,
  locale             text not null check (locale in ('en', 'hi', 'mr')),
  title              text not null,
  short_description  text not null,
  description        text,
  what_to_prepare    text,
  created_at         timestamptz not null default now(),
  updated_at         timestamptz not null default now(),
  unique (service_id, locale)
);

-- 5. availability_rules
create table public.availability_rules (
  id          uuid primary key default gen_random_uuid(),
  weekday     smallint not null check (weekday between 0 and 6), -- 0 = Sunday
  kind        text not null default 'working' check (kind in ('working', 'break')),
  start_time  time not null,
  end_time    time not null,
  is_active   boolean not null default true,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now(),
  check (end_time > start_time)
);
create index availability_rules_lookup_idx on public.availability_rules (weekday, kind) where is_active;

-- 6. availability_exceptions
create table public.availability_exceptions (
  id          uuid primary key default gen_random_uuid(),
  kind        text not null check (kind in ('holiday', 'blocked', 'extra_hours')),
  date_from   date not null,
  date_to     date not null,
  start_time  time,
  end_time    time,
  reason      text,
  created_by  uuid references public.admin_profiles (id) on delete set null,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now(),
  constraint ae_date_order check (date_to >= date_from),
  constraint ae_time_pair check ((start_time is null) = (end_time is null)),
  constraint ae_time_order check (start_time is null or end_time > start_time),
  constraint ae_extra_needs_times check (kind <> 'extra_hours' or start_time is not null)
);
create index availability_exceptions_dates_idx on public.availability_exceptions (date_from, date_to);

-- 7. customers: one row per phone number
create table public.customers (
  id                uuid primary key default gen_random_uuid(),
  full_name         text not null,
  phone_e164        text not null unique,
  email             text,
  preferred_locale  text not null default 'en' check (preferred_locale in ('en', 'hi', 'mr')),
  user_id           uuid unique references auth.users (id) on delete set null,
  anonymized_at     timestamptz,
  created_at        timestamptz not null default now(),
  updated_at        timestamptz not null default now(),
  constraint customers_phone_format
    check (anonymized_at is not null or phone_e164 ~ '^\+[1-9][0-9]{7,14}$'),
  constraint customers_email_format
    check (email is null or email ~* '^[^@\s]+@[^@\s]+\.[^@\s]+$')
);
create index customers_email_idx on public.customers (lower(email)) where email is not null;

