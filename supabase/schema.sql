-- Enable required extensions
create extension if not exists "pgcrypto";

-- Enum for news status
do $$ begin
	create type public.news_status as enum ('draft', 'published');
exception when duplicate_object then null; end $$;

-- Authors
create table if not exists public.authors (
	id uuid primary key default gen_random_uuid(),
	full_name text not null,
	bio text,
	avatar_url text,
	created_at timestamptz not null default now()
);

-- Categories
create table if not exists public.categories (
	id uuid primary key default gen_random_uuid(),
	name text not null,
	slug text not null unique,
	description text,
	created_at timestamptz not null default now()
);

-- News
create table if not exists public.news (
	id uuid primary key default gen_random_uuid(),
	title text not null,
	slug text not null unique,
	summary text,
	content text not null,
	author_id uuid not null references public.authors(id) on delete restrict,
	category_id uuid references public.categories(id) on delete set null,
	cover_image_url text,
	status public.news_status not null default 'draft',
	published_at timestamptz,
	created_at timestamptz not null default now(),
	updated_at timestamptz not null default now(),
	views integer not null default 0
);

-- Auto update updated_at
create or replace function public.set_updated_at()
returns trigger as $$
begin
	new.updated_at = now();
	return new;
end;
$$ language plpgsql;

create trigger trg_news_updated_at
before update on public.news
for each row execute function public.set_updated_at();

-- For existing deployments, ensure the views column exists
alter table public.news add column if not exists views integer not null default 0;

-- Increment views RPC (security definer to bypass RLS safely)
create or replace function public.increment_news_views(p_news_id uuid)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  update public.news
  set views = coalesce(views, 0) + 1
  where id = p_news_id and status = 'published';
end;
$$;

grant execute on function public.increment_news_views(uuid) to anon, authenticated;

-- Media (attachments for news)
create table if not exists public.media (
	id uuid primary key default gen_random_uuid(),
	news_id uuid not null references public.news(id) on delete cascade,
	url text not null,
	media_type text,
	created_at timestamptz not null default now()
);

-- Comments
create table if not exists public.comments (
	id uuid primary key default gen_random_uuid(),
	news_id uuid not null references public.news(id) on delete cascade,
	author_name text,
	content text not null,
	is_approved boolean not null default true,
	created_at timestamptz not null default now()
);

-- Indexes
create index if not exists idx_news_published_at on public.news (published_at desc);
create index if not exists idx_news_status on public.news (status);
create index if not exists idx_news_category on public.news (category_id);
create index if not exists idx_comments_news on public.comments (news_id, created_at);

-- Ad slots (site içi reklam alanları)
create table if not exists public.ad_slots (
    id uuid primary key default gen_random_uuid(),
    key text not null unique, -- ör: header_top, summary_bottom, content_bottom, comments_top
    title text not null,
    html text, -- embed/script veya iframe içerikleri
    image_url text, -- görsel tabanlı reklamlar için
    link_url text, -- görsele tıklanınca gidilecek adres
    is_active boolean not null default true,
    updated_at timestamptz not null default now(),
    created_at timestamptz not null default now()
);

create or replace function public.set_ad_slots_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists trg_ad_slots_updated_at on public.ad_slots;
create trigger trg_ad_slots_updated_at
before update on public.ad_slots
for each row execute function public.set_ad_slots_updated_at();