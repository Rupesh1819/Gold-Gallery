-- 0005_rls_and_grants.sql
-- Row Level Security on EVERY table and least-privilege grants.

alter table public.admin_profiles      enable row level security;
alter table public.customers           enable row level security;
alter table public.appointments        enable row level security;
alter table public.appointment_events  enable row level security;

create policy admin_profiles_read on public.admin_profiles
  for select to authenticated
  using (id = auth.uid() or public.is_admin('owner'));

create policy customers_admin_read on public.customers
  for select to authenticated using (public.is_admin());
create policy customers_admin_update on public.customers
  for update to authenticated using (public.is_admin()) with check (public.is_admin());

create policy appointments_admin_read on public.appointments
  for select to authenticated using (public.is_admin());
create policy appointments_admin_update on public.appointments
  for update to authenticated using (public.is_admin()) with check (public.is_admin());

create policy appointment_events_admin_read on public.appointment_events
  for select to authenticated using (public.is_admin());

-- Owner-managed tables
do $$
declare t text;
begin
  foreach t in array array[
    'site_settings', 'services', 'service_translations',
    'availability_rules', 'availability_exceptions']
  loop
    execute format('alter table public.%I enable row level security', t);
    execute format(
      'create policy %I on public.%I for select to authenticated using (public.is_admin())',
      t || '_admin_read', t);
    execute format(
      'create policy %I on public.%I for all to authenticated using (public.is_admin(''owner'')) with check (public.is_admin(''owner''))',
      t || '_owner_write', t);
  end loop;
end $$;

-- Content tables: any active admin can read/write
do $$
declare t text;
begin
  foreach t in array array['blog_posts', 'blog_translations', 'testimonials', 'faqs']
  loop
    execute format('alter table public.%I enable row level security', t);
    execute format(
      'create policy %I on public.%I for all to authenticated using (public.is_admin()) with check (public.is_admin())',
      t || '_admin_all', t);
  end loop;
end $$;

-- Public read access
create policy services_public_read on public.services
  for select to anon, authenticated using (is_active);

create policy service_translations_public_read on public.service_translations
  for select to anon, authenticated
  using (exists (select 1 from public.services s where s.id = service_id and s.is_active));

create policy site_settings_public_read on public.site_settings
  for select to anon, authenticated using (is_public);

create policy blog_posts_public_read on public.blog_posts
  for select to anon, authenticated
  using (status = 'published' and published_at <= now());

create policy blog_translations_public_read on public.blog_translations
  for select to anon, authenticated
  using (exists (select 1 from public.blog_posts p
                 where p.id = post_id and p.status = 'published' and p.published_at <= now()));

create policy testimonials_public_read on public.testimonials
  for select to anon, authenticated using (is_published);

create policy faqs_public_read on public.faqs
  for select to anon, authenticated using (is_published);

-- Revoke all by default, then grant specific access
revoke all on all tables in schema public from anon, authenticated;

grant select on public.services, public.service_translations, public.site_settings,
                public.blog_posts, public.blog_translations, public.testimonials, public.faqs
  to anon, authenticated;

grant select, insert, update, delete on
  public.site_settings, public.services, public.service_translations, public.availability_rules,
  public.availability_exceptions, public.blog_posts, public.blog_translations,
  public.testimonials, public.faqs
  to authenticated;

grant select on public.admin_profiles, public.appointment_events to authenticated;
grant select, update on public.customers, public.appointments to authenticated;

