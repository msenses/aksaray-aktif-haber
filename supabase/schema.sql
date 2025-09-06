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
	updated_at timestamptz not null default now()
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

-- Media (attachments for news)
create table if not exists public.media (
	id uuid primary key default gen_random_uuid(),
	news_id uuid not null references public.news(id) on delete cascade,
	url text not null,
	media_type text,
	created_at timestamptz not null default now()
);

-- Indexes
create index if not exists idx_news_published_at on public.news (published_at desc);
create index if not exists idx_news_status on public.news (status);
create index if not exists idx_news_category on public.news (category_id);
