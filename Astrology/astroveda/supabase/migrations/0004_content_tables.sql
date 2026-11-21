-- 0004_content_tables.sql
-- Blog, horoscope posts, testimonials, and FAQs.

-- 10. blog_posts
create table public.blog_posts (
  id                 uuid primary key default gen_random_uuid(),
  slug               text not null unique check (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),
  post_type          text not null default 'article' check (post_type in ('article', 'horoscope')),
  status             text not null default 'draft' check (status in ('draft', 'published', 'archived')),
  category           text,
  tags               text[] not null default '{}',
  cover_image_path   text,
  horoscope_sign     text check (horoscope_sign in (
                       'aries', 'taurus', 'gemini', 'cancer', 'leo', 'virgo',
                       'libra', 'scorpio', 'sagittarius', 'capricorn', 'aquarius', 'pisces')),
  horoscope_period   text check (horoscope_period in ('daily', 'weekly', 'monthly', 'yearly')),
  period_start       date,
  published_at       timestamptz,
  author_admin_id    uuid references public.admin_profiles (id) on delete set null,
  created_at         timestamptz not null default now(),
  updated_at         timestamptz not null default now(),
  constraint blog_posts_type_fields check (
    (post_type = 'article'
       and horoscope_sign is null and horoscope_period is null and period_start is null)
    or (post_type = 'horoscope'
       and horoscope_sign is not null and horoscope_period is not null and period_start is not null)),
  constraint blog_posts_published_has_date check (status <> 'published' or published_at is not null)
);
create index blog_posts_listing_idx on public.blog_posts (status, post_type, published_at desc);
create unique index blog_posts_horoscope_unique
  on public.blog_posts (horoscope_sign, horoscope_period, period_start)
  where post_type = 'horoscope';

-- 11. blog_translations
create table public.blog_translations (
  id                uuid primary key default gen_random_uuid(),
  post_id           uuid not null references public.blog_posts (id) on delete cascade,
  locale            text not null check (locale in ('en', 'hi', 'mr')),
  title             text not null,
  excerpt           text,
  body_markdown     text not null,
  meta_title        text,
  meta_description  text,
  created_at        timestamptz not null default now(),
  updated_at        timestamptz not null default now(),
  unique (post_id, locale)
);

-- 12. testimonials
create table public.testimonials (
  id                   uuid primary key default gen_random_uuid(),
  display_name         text not null,
  location             text,
  rating               smallint check (rating between 1 and 5),
  original_locale      text not null default 'en' check (original_locale in ('en', 'hi', 'mr')),
  body                 text not null,
  translations         jsonb not null default '{}'::jsonb,
  source               text not null check (source in ('direct', 'whatsapp', 'google', 'other')),
  source_note          text,
  consent_to_publish   boolean not null default false,
  consent_recorded_at  timestamptz,
  is_published         boolean not null default false,
  sort_order           integer not null default 0,
  created_at           timestamptz not null default now(),
  updated_at           timestamptz not null default now(),
  constraint testimonials_consent_before_publish check (not is_published or consent_to_publish)
);
create index testimonials_listing_idx on public.testimonials (is_published, sort_order);

-- 13. faqs
create table public.faqs (
  id            uuid primary key default gen_random_uuid(),
  category      text not null default 'general'
                check (category in ('general', 'booking', 'payments', 'policies', 'astrology')),
  question      jsonb not null,
  answer        jsonb not null,
  is_published  boolean not null default false,
  sort_order    integer not null default 0,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now(),
  constraint faqs_english_required check (question ? 'en' and answer ? 'en')
);
create index faqs_listing_idx on public.faqs (is_published, category, sort_order);

-- updated_at triggers
do $$
declare t text;
begin
  foreach t in array array[
    'admin_profiles', 'site_settings', 'services', 'service_translations',
    'availability_rules', 'availability_exceptions', 'customers',
    'blog_posts', 'blog_translations', 'testimonials', 'faqs']
  loop
    execute format(
      'create trigger %I before update on public.%I for each row execute function public.set_updated_at()',
      t || '_set_updated_at', t);
  end loop;
end $$;

