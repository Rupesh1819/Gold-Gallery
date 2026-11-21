-- 0001_initial_schema.sql
-- Extensions, admin profiles, and site settings.

create extension if not exists "uuid-ossp";
create extension if not exists "btree_gist";

-- Function to maintain updated_at column
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- 1. admin_profiles: links a Supabase Auth user to an admin role
create table public.admin_profiles (
  id          uuid primary key references auth.users (id) on delete cascade,
  full_name   text not null,
  role        text not null check (role in ('owner', 'staff')),
  is_active   boolean not null default true,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

-- Helper to check if current user is an active admin
create or replace function public.is_admin(min_role text default 'staff')
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.admin_profiles p
    where p.id = auth.uid()
      and p.is_active
      and (min_role = 'staff' or p.role = 'owner')
  );
$$;

-- 2. site_settings: key-value configuration
create table public.site_settings (
  key         text primary key,
  value       jsonb not null,
  is_public   boolean not null default false,
  description text,
  updated_by  uuid references public.admin_profiles (id) on delete set null,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

