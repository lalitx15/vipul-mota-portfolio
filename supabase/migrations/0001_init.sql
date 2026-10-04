-- ========================================================
-- VIPUL MOTA / JAVI GROUPS PORTFOLIO
-- 0001_init.sql — Complete Database Schema, RLS, Functions & Storage
-- ========================================================

-- Enable necessary extensions
create extension if not exists "uuid-ossp";

-- ========================================================
-- 1. HELPER FUNCTIONS
-- ========================================================

-- Generic updated_at trigger function
create or replace function public.handle_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- ========================================================
-- 2. TABLES
-- ========================================================

-- Profiles
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null,
  full_name text,
  phone text,
  avatar_url text,
  role text not null default 'member' check (role in ('member', 'admin')),
  status text not null default 'active' check (status in ('active', 'suspended')),
  newsletter_opt_in boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Site Settings (Single Row)
create table if not exists public.site_settings (
  id integer primary key default 1 check (id = 1),
  site_name text not null default 'Vipul Mota',
  tagline text not null default 'Style. Wealth. Presence.',
  contact_email text not null default 'vipul@javigroups.com',
  contact_phone text not null default '+91 98200 00000',
  address text not null default 'Marine Drive, Mumbai, India',
  whatsapp_url text,
  instagram_url text not null default 'https://instagram.com/javigroups',
  youtube_url text not null default 'https://youtube.com/@VibewithVipulMota',
  facebook_url text not null default 'https://facebook.com/javigroups',
  threads_url text not null default 'https://threads.net/@javigroups',
  x_url text,
  linkedin_url text,
  instagram_followers_count text not null default '900K+',
  youtube_subscribers_count text not null default '100K+',
  announcement_bar text,
  maintenance_mode boolean not null default false,
  footer_text text not null default '© 2026 Vipul Mota. All rights reserved.',
  finance_disclaimer text not null default 'Content is for inspiration and information only and is not financial advice.',
  updated_at timestamptz not null default now()
);

-- SEO Settings (Single Row)
create table if not exists public.seo_settings (
  id integer primary key default 1 check (id = 1),
  default_title text not null default 'Vipul Mota | Actor, Fashion Model & Founder of Javi Groups',
  title_template text not null default '%s | Vipul Mota',
  default_description text not null default 'Official portfolio of Vipul Mota — Mumbai-based actor, fashion model, financier, and founder of Javi Groups. Style, wealth, and presence.',
  og_image_url text,
  google_analytics_id text,
  search_console_tag text,
  meta_pixel_id text,
  robots_txt text not null default 'User-agent: *\nAllow: /\nDisallow: /admin\nDisallow: /member\nSitemap: https://javigroups.com/sitemap.xml',
  updated_at timestamptz not null default now()
);

-- Per-Page SEO
create table if not exists public.page_seo (
  id uuid primary key default gen_random_uuid(),
  page_path text unique not null,
  title text,
  description text,
  og_image_url text,
  canonical_url text,
  no_index boolean not null default false,
  updated_at timestamptz not null default now()
);

-- Home Sections (Toggles and Content)
create table if not exists public.home_sections (
  id uuid primary key default gen_random_uuid(),
  key text unique not null,
  title text not null,
  content jsonb not null default '{}'::jsonb,
  sort_order integer not null default 0,
  is_visible boolean not null default true,
  updated_at timestamptz not null default now()
);

-- Hero Slides
create table if not exists public.hero_slides (
  id uuid primary key default gen_random_uuid(),
  headline_line1 text not null,
  headline_line2 text not null,
  tagline text,
  image_url text not null,
  mobile_image_url text,
  cta_text text,
  cta_link text,
  sort_order integer not null default 0,
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

-- Stats / Counters
create table if not exists public.stats (
  id uuid primary key default gen_random_uuid(),
  label text not null,
  value text not null,
  suffix text,
  description text,
  sort_order integer not null default 0,
  is_visible boolean not null default true,
  updated_at timestamptz not null default now()
);

-- Timeline Items (About Page)
create table if not exists public.timeline_items (
  id uuid primary key default gen_random_uuid(),
  year text not null,
  title text not null,
  description text not null,
  image_url text,
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);

-- Work Items (Acting / Modeling / Ventures)
create table if not exists public.work_items (
  id uuid primary key default gen_random_uuid(),
  type text not null check (type in ('acting', 'modeling', 'venture')),
  slug text unique not null,
  title text not null,
  role text,
  year text,
  platform text,
  description text not null,
  cover_url text not null,
  external_url text,
  is_featured boolean not null default false,
  status text not null default 'draft' check (status in ('draft', 'published')),
  sort_order integer not null default 0,
  meta jsonb default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Work Images (Detail Galleries)
create table if not exists public.work_images (
  id uuid primary key default gen_random_uuid(),
  work_id uuid not null references public.work_items(id) on delete cascade,
  image_url text not null,
  caption text,
  sort_order integer not null default 0
);

-- Gallery Items (Lookbook)
create table if not exists public.gallery_items (
  id uuid primary key default gen_random_uuid(),
  image_url text not null,
  category text not null default 'Portraits' check (category in ('Portraits', 'Editorial', 'Lifestyle', 'Events', 'Behind the scenes')),
  caption text,
  alt_text text,
  is_featured boolean not null default false,
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);

-- Videos
create table if not exists public.videos (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  platform text not null default 'youtube' check (platform in ('youtube', 'instagram')),
  video_id text not null,
  url text not null,
  thumbnail_url text,
  category text not null default 'Reel',
  is_featured boolean not null default false,
  members_only boolean not null default false,
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);

-- Posts (Journal / Blog)
create table if not exists public.posts (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  title text not null,
  excerpt text not null,
  content text not null,
  cover_url text not null,
  tags text[] default '{}'::text[],
  members_only boolean not null default false,
  status text not null default 'draft' check (status in ('draft', 'published')),
  published_at timestamptz,
  reading_minutes integer not null default 3,
  views integer not null default 0,
  meta jsonb default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Post Likes
create table if not exists public.post_likes (
  id uuid primary key default gen_random_uuid(),
  post_id uuid not null references public.posts(id) on delete cascade,
  user_id uuid not null references public.profiles(id) on delete cascade,
  created_at timestamptz not null default now(),
  unique (post_id, user_id)
);

-- Comments (Moderated)
create table if not exists public.comments (
  id uuid primary key default gen_random_uuid(),
  post_id uuid not null references public.posts(id) on delete cascade,
  user_id uuid not null references public.profiles(id) on delete cascade,
  body text not null,
  status text not null default 'pending' check (status in ('pending', 'approved', 'rejected')),
  created_at timestamptz not null default now()
);

-- Saved Items (Bookmarks for Members)
create table if not exists public.saved_items (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  item_type text not null check (item_type in ('gallery', 'video', 'post')),
  item_id uuid not null,
  created_at timestamptz not null default now(),
  unique (user_id, item_type, item_id)
);

-- Testimonials (Drafts by default, client publishes later)
create table if not exists public.testimonials (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  role text not null,
  body text not null,
  avatar_url text,
  is_published boolean not null default false,
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);

-- Press Items
create table if not exists public.press_items (
  id uuid primary key default gen_random_uuid(),
  outlet text not null,
  title text not null,
  url text not null,
  date text not null,
  logo_url text,
  is_published boolean not null default false,
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);

-- Enquiries / Booking flow
create table if not exists public.enquiries (
  id uuid primary key default gen_random_uuid(),
  type text not null default 'general' check (type in ('general', 'brand', 'booking')),
  name text not null,
  email text not null,
  phone text,
  subject text not null,
  budget text,
  message text not null,
  contact_method text not null default 'email' check (contact_method in ('email', 'phone', 'whatsapp')),
  status text not null default 'new' check (status in ('new', 'in_review', 'replied', 'closed')),
  user_id uuid references public.profiles(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Enquiry Internal Notes
create table if not exists public.enquiry_notes (
  id uuid primary key default gen_random_uuid(),
  enquiry_id uuid not null references public.enquiries(id) on delete cascade,
  note text not null,
  created_by uuid not null references public.profiles(id) on delete cascade,
  created_at timestamptz not null default now()
);

-- Newsletter Subscribers
create table if not exists public.subscribers (
  id uuid primary key default gen_random_uuid(),
  email text unique not null,
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

-- Custom / Legal Rich Text Pages
create table if not exists public.pages (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  title text not null,
  content text not null,
  updated_at timestamptz not null default now()
);

-- Storage Media Library Tracker
create table if not exists public.media (
  id uuid primary key default gen_random_uuid(),
  url text not null,
  storage_path text not null,
  filename text not null,
  size integer not null default 0,
  mime_type text not null,
  uploaded_by uuid references public.profiles(id) on delete set null,
  created_at timestamptz not null default now()
);

-- Privacy-Friendly Page Views Tracker
create table if not exists public.page_views (
  id uuid primary key default gen_random_uuid(),
  path text not null,
  referrer text,
  device text,
  country text,
  created_at timestamptz not null default now()
);

-- Admin Activity Log
create table if not exists public.admin_activity (
  id uuid primary key default gen_random_uuid(),
  admin_id uuid not null references public.profiles(id) on delete cascade,
  action text not null,
  entity text not null,
  entity_id text,
  meta jsonb default '{}'::jsonb,
  created_at timestamptz not null default now()
);

-- ========================================================
-- 3. FUNCTIONS & TRIGGERS
-- ========================================================

-- Security definer admin check to prevent RLS recursion
create or replace function public.is_admin()
returns boolean
language plpgsql
security definer
set search_path = public
stable
as $$
begin
  return exists (
    select 1 from public.profiles
    where id = auth.uid() and role = 'admin' and status = 'active'
  );
end;
$$;

-- Trigger to automatically create profile row on user signup
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, email, full_name, avatar_url, role)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'name', ''),
    coalesce(new.raw_user_meta_data->>'avatar_url', new.raw_user_meta_data->>'picture', ''),
    'member'
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- Trigger to prevent self-elevation of role
create or replace function public.prevent_role_change()
returns trigger
language plpgsql
as $$
begin
  if new.role <> old.role and not public.is_admin() then
    raise exception 'Unauthorized role modification.';
  end if;
  return new;
end;
$$;

drop trigger if exists guard_profile_role on public.profiles;
create trigger guard_profile_role
  before update of role on public.profiles
  for each row execute function public.prevent_role_change();

-- Attach updated_at triggers
drop trigger if exists set_profiles_updated_at on public.profiles;
create trigger set_profiles_updated_at before update on public.profiles for each row execute function public.handle_updated_at();

drop trigger if exists set_site_settings_updated_at on public.site_settings;
create trigger set_site_settings_updated_at before update on public.site_settings for each row execute function public.handle_updated_at();

drop trigger if exists set_seo_settings_updated_at on public.seo_settings;
create trigger set_seo_settings_updated_at before update on public.seo_settings for each row execute function public.handle_updated_at();

drop trigger if exists set_page_seo_updated_at on public.page_seo;
create trigger set_page_seo_updated_at before update on public.page_seo for each row execute function public.handle_updated_at();

drop trigger if exists set_home_sections_updated_at on public.home_sections;
create trigger set_home_sections_updated_at before update on public.home_sections for each row execute function public.handle_updated_at();

drop trigger if exists set_stats_updated_at on public.stats;
create trigger set_stats_updated_at before update on public.stats for each row execute function public.handle_updated_at();

drop trigger if exists set_work_items_updated_at on public.work_items;
create trigger set_work_items_updated_at before update on public.work_items for each row execute function public.handle_updated_at();

drop trigger if exists set_posts_updated_at on public.posts;
create trigger set_posts_updated_at before update on public.posts for each row execute function public.handle_updated_at();

drop trigger if exists set_enquiries_updated_at on public.enquiries;
create trigger set_enquiries_updated_at before update on public.enquiries for each row execute function public.handle_updated_at();

drop trigger if exists set_pages_updated_at on public.pages;
create trigger set_pages_updated_at before update on public.pages for each row execute function public.handle_updated_at();

-- ========================================================
-- 4. VIEWS
-- ========================================================

-- View for posts hiding full body content from anonymous users if members_only
create or replace view public.posts_public_view as
select
  p.id,
  p.slug,
  p.title,
  p.excerpt,
  case
    when not p.members_only then p.content
    when auth.uid() is not null then p.content
    else null
  end as content,
  p.cover_url,
  p.tags,
  p.members_only,
  p.status,
  p.published_at,
  p.reading_minutes,
  p.views,
  p.meta,
  p.created_at,
  p.updated_at
from public.posts p;

-- ========================================================
-- 5. RPC PROCEDURES (Analytics, Views counter)
-- ========================================================

-- Atomic post view counter
create or replace function public.increment_post_views(p_post_id uuid)
returns void
language sql
security definer
as $$
  update public.posts
  set views = views + 1
  where id = p_post_id;
$$;

-- Analytics: Views by day (Admin only)
create or replace function public.get_analytics_views_by_day(p_days int default 30)
returns table (day date, views bigint)
language plpgsql
security definer
set search_path = public
as $$
begin
  if not public.is_admin() then
    raise exception 'Access denied: Administrator privileges required.';
  end if;

  return query
  select
    date_trunc('day', created_at)::date as day,
    count(*)::bigint as views
  from public.page_views
  where created_at >= (now() - (p_days || ' days')::interval)
  group by 1
  order by 1 asc;
end;
$$;

-- Analytics: Top pages (Admin only)
create or replace function public.get_analytics_top_pages(p_limit int default 10)
returns table (path text, views bigint)
language plpgsql
security definer
set search_path = public
as $$
begin
  if not public.is_admin() then
    raise exception 'Access denied: Administrator privileges required.';
  end if;

  return query
  select
    pv.path,
    count(*)::bigint as views
  from public.page_views pv
  group by pv.path
  order by views desc
  limit p_limit;
end;
$$;

-- Analytics: Top referrers (Admin only)
create or replace function public.get_analytics_top_referrers(p_limit int default 10)
returns table (referrer text, count bigint)
language plpgsql
security definer
set search_path = public
as $$
begin
  if not public.is_admin() then
    raise exception 'Access denied: Administrator privileges required.';
  end if;

  return query
  select
    coalesce(pv.referrer, 'Direct') as referrer,
    count(*)::bigint as count
  from public.page_views pv
  group by 1
  order by count desc
  limit p_limit;
end;
$$;

-- Analytics: Members by day (Admin only)
create or replace function public.get_analytics_members_by_day(p_days int default 30)
returns table (day date, new_members bigint)
language plpgsql
security definer
set search_path = public
as $$
begin
  if not public.is_admin() then
    raise exception 'Access denied: Administrator privileges required.';
  end if;

  return query
  select
    date_trunc('day', created_at)::date as day,
    count(*)::bigint as new_members
  from public.profiles
  where created_at >= (now() - (p_days || ' days')::interval)
  group by 1
  order by 1 asc;
end;
$$;

-- Analytics: Enquiries by day (Admin only)
create or replace function public.get_analytics_enquiries_by_day(p_days int default 30)
returns table (day date, count bigint)
language plpgsql
security definer
set search_path = public
as $$
begin
  if not public.is_admin() then
    raise exception 'Access denied: Administrator privileges required.';
  end if;

  return query
  select
    date_trunc('day', created_at)::date as day,
    count(*)::bigint as count
  from public.enquiries
  where created_at >= (now() - (p_days || ' days')::interval)
  group by 1
  order by 1 asc;
end;
$$;

-- ========================================================
-- 6. ROW LEVEL SECURITY (RLS)
-- ========================================================

-- Enable RLS on every table
alter table public.profiles enable row level security;
alter table public.site_settings enable row level security;
alter table public.seo_settings enable row level security;
alter table public.page_seo enable row level security;
alter table public.home_sections enable row level security;
alter table public.hero_slides enable row level security;
alter table public.stats enable row level security;
alter table public.timeline_items enable row level security;
alter table public.work_items enable row level security;
alter table public.work_images enable row level security;
alter table public.gallery_items enable row level security;
alter table public.videos enable row level security;
alter table public.posts enable row level security;
alter table public.post_likes enable row level security;
alter table public.comments enable row level security;
alter table public.saved_items enable row level security;
alter table public.testimonials enable row level security;
alter table public.press_items enable row level security;
alter table public.enquiries enable row level security;
alter table public.enquiry_notes enable row level security;
alter table public.subscribers enable row level security;
alter table public.pages enable row level security;
alter table public.media enable row level security;
alter table public.page_views enable row level security;
alter table public.admin_activity enable row level security;

-- PROFILES
create policy "Public can read limited profile info" on public.profiles
  for select using (true);
create policy "Users can update own profile" on public.profiles
  for update using (auth.uid() = id);
create policy "Admin has full access to profiles" on public.profiles
  for all using (public.is_admin());

-- SITE SETTINGS
create policy "Public read site_settings" on public.site_settings
  for select using (true);
create policy "Admin manage site_settings" on public.site_settings
  for all using (public.is_admin());

-- SEO SETTINGS & PAGE SEO
create policy "Public read seo_settings" on public.seo_settings
  for select using (true);
create policy "Admin manage seo_settings" on public.seo_settings
  for all using (public.is_admin());
create policy "Public read page_seo" on public.page_seo
  for select using (true);
create policy "Admin manage page_seo" on public.page_seo
  for all using (public.is_admin());

-- HOME SECTIONS & HERO SLIDES
create policy "Public read visible home_sections" on public.home_sections
  for select using (is_visible or public.is_admin());
create policy "Admin manage home_sections" on public.home_sections
  for all using (public.is_admin());
create policy "Public read active hero_slides" on public.hero_slides
  for select using (is_active or public.is_admin());
create policy "Admin manage hero_slides" on public.hero_slides
  for all using (public.is_admin());

-- STATS & TIMELINE
create policy "Public read visible stats" on public.stats
  for select using (is_visible or public.is_admin());
create policy "Admin manage stats" on public.stats
  for all using (public.is_admin());
create policy "Public read timeline_items" on public.timeline_items
  for select using (true);
create policy "Admin manage timeline_items" on public.timeline_items
  for all using (public.is_admin());

-- WORK & WORK IMAGES
create policy "Public read published work" on public.work_items
  for select using (status = 'published' or public.is_admin());
create policy "Admin manage work" on public.work_items
  for all using (public.is_admin());
create policy "Public read work images" on public.work_images
  for select using (true);
create policy "Admin manage work images" on public.work_images
  for all using (public.is_admin());

-- GALLERY & VIDEOS
create policy "Public read gallery_items" on public.gallery_items
  for select using (true);
create policy "Admin manage gallery_items" on public.gallery_items
  for all using (public.is_admin());
create policy "Public read videos" on public.videos
  for select using (not members_only or auth.uid() is not null or public.is_admin());
create policy "Admin manage videos" on public.videos
  for all using (public.is_admin());

-- POSTS (JOURNAL)
create policy "Public read published posts" on public.posts
  for select using (status = 'published' or public.is_admin());
create policy "Admin manage posts" on public.posts
  for all using (public.is_admin());

-- POST LIKES
create policy "Public read post likes" on public.post_likes
  for select using (true);
create policy "Authenticated insert own post like" on public.post_likes
  for insert with check (auth.uid() = user_id);
create policy "Authenticated delete own post like" on public.post_likes
  for delete using (auth.uid() = user_id);

-- COMMENTS
create policy "Public read approved comments" on public.comments
  for select using (status = 'approved' or auth.uid() = user_id or public.is_admin());
create policy "Authenticated member insert comment" on public.comments
  for insert with check (auth.uid() = user_id and status = 'pending');
create policy "Admin manage all comments" on public.comments
  for all using (public.is_admin());

-- SAVED ITEMS
create policy "Users read own saved items" on public.saved_items
  for select using (auth.uid() = user_id or public.is_admin());
create policy "Users insert own saved items" on public.saved_items
  for insert with check (auth.uid() = user_id);
create policy "Users delete own saved items" on public.saved_items
  for delete using (auth.uid() = user_id);

-- TESTIMONIALS & PRESS (Only published items visible to public)
create policy "Public read published testimonials" on public.testimonials
  for select using (is_published or public.is_admin());
create policy "Admin manage testimonials" on public.testimonials
  for all using (public.is_admin());
create policy "Public read published press" on public.press_items
  for select using (is_published or public.is_admin());
create policy "Admin manage press" on public.press_items
  for all using (public.is_admin());

-- ENQUIRIES & ENQUIRY NOTES
create policy "Users read own enquiries" on public.enquiries
  for select using (auth.uid() = user_id or public.is_admin());
create policy "Public insert enquiry" on public.enquiries
  for insert with check (true);
create policy "Admin manage enquiries" on public.enquiries
  for all using (public.is_admin());
create policy "Admin manage enquiry notes" on public.enquiry_notes
  for all using (public.is_admin());

-- SUBSCRIBERS
create policy "Public insert subscriber" on public.subscribers
  for insert with check (true);
create policy "Admin manage subscribers" on public.subscribers
  for all using (public.is_admin());

-- PAGES (LEGAL & RICH TEXT)
create policy "Public read pages" on public.pages
  for select using (true);
create policy "Admin manage pages" on public.pages
  for all using (public.is_admin());

-- MEDIA LIBRARY
create policy "Public read media metadata" on public.media
  for select using (true);
create policy "Admin manage media metadata" on public.media
  for all using (public.is_admin());

-- PAGE VIEWS
create policy "Public insert page views" on public.page_views
  for insert with check (true);
create policy "Admin read page views" on public.page_views
  for select using (public.is_admin());

-- ADMIN ACTIVITY LOG
create policy "Admin manage activity log" on public.admin_activity
  for all using (public.is_admin());

-- ========================================================
-- 7. STORAGE BUCKETS & POLICIES
-- ========================================================

-- Insert storage buckets into storage.buckets if not exist
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values
  ('site-assets', 'site-assets', true, 10485760, array['image/jpeg', 'image/png', 'image/webp', 'image/svg+xml']),
  ('gallery', 'gallery', true, 15728640, array['image/jpeg', 'image/png', 'image/webp']),
  ('journal', 'journal', true, 10485760, array['image/jpeg', 'image/png', 'image/webp']),
  ('press-kit', 'press-kit', true, 26214400, array['application/pdf', 'image/jpeg', 'image/png', 'image/webp']),
  ('avatars', 'avatars', true, 5242880, array['image/jpeg', 'image/png', 'image/webp'])
on conflict (id) do update set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

-- Storage RLS Policies
-- Public buckets: Anyone can read
create policy "Public read site-assets" on storage.objects
  for select using (bucket_id = 'site-assets');
create policy "Public read gallery" on storage.objects
  for select using (bucket_id = 'gallery');
create policy "Public read journal" on storage.objects
  for select using (bucket_id = 'journal');
create policy "Public read press-kit" on storage.objects
  for select using (bucket_id = 'press-kit');
create policy "Public read avatars" on storage.objects
  for select using (bucket_id = 'avatars');

-- Admin write access for general buckets
create policy "Admin write site-assets" on storage.objects
  for insert with check (bucket_id = 'site-assets' and public.is_admin());
create policy "Admin update site-assets" on storage.objects
  for update using (bucket_id = 'site-assets' and public.is_admin());
create policy "Admin delete site-assets" on storage.objects
  for delete using (bucket_id = 'site-assets' and public.is_admin());

create policy "Admin write gallery" on storage.objects
  for insert with check (bucket_id = 'gallery' and public.is_admin());
create policy "Admin update gallery" on storage.objects
  for update using (bucket_id = 'gallery' and public.is_admin());
create policy "Admin delete gallery" on storage.objects
  for delete using (bucket_id = 'gallery' and public.is_admin());

create policy "Admin write journal" on storage.objects
  for insert with check (bucket_id = 'journal' and public.is_admin());
create policy "Admin update journal" on storage.objects
  for update using (bucket_id = 'journal' and public.is_admin());
create policy "Admin delete journal" on storage.objects
  for delete using (bucket_id = 'journal' and public.is_admin());

create policy "Admin write press-kit" on storage.objects
  for insert with check (bucket_id = 'press-kit' and public.is_admin());
create policy "Admin update press-kit" on storage.objects
  for update using (bucket_id = 'press-kit' and public.is_admin());
create policy "Admin delete press-kit" on storage.objects
  for delete using (bucket_id = 'press-kit' and public.is_admin());

-- Avatars: authenticated user can upload and manage ONLY in their own subfolder
create policy "User upload own avatar" on storage.objects
  for insert with check (
    bucket_id = 'avatars'
    and auth.uid() is not null
    and (storage.foldername(name))[1] = auth.uid()::text
  );

create policy "User update own avatar" on storage.objects
  for update using (
    bucket_id = 'avatars'
    and auth.uid() is not null
    and (storage.foldername(name))[1] = auth.uid()::text
  );

create policy "User delete own avatar" on storage.objects
  for delete using (
    bucket_id = 'avatars'
    and auth.uid() is not null
    and (storage.foldername(name))[1] = auth.uid()::text
  );
