-- Enable Row Level Security
alter table public.news enable row level security;
alter table public.categories enable row level security;
alter table public.authors enable row level security;
alter table public.media enable row level security;
alter table public.comments enable row level security;

-- Public read for published news
drop policy if exists "Public can read published news" on public.news;
create policy "Public can read published news" on public.news
for select using (
	status = 'published'
);

-- Public read categories
drop policy if exists "Public can read categories" on public.categories;
create policy "Public can read categories" on public.categories
for select using (true);

-- Authenticated manage categories
drop policy if exists "Authenticated can insert categories" on public.categories;
create policy "Authenticated can insert categories" on public.categories
for insert to authenticated with check (true);

drop policy if exists "Authenticated can update categories" on public.categories;
create policy "Authenticated can update categories" on public.categories
for update to authenticated using (true) with check (true);

drop policy if exists "Authenticated can delete categories" on public.categories;
create policy "Authenticated can delete categories" on public.categories
for delete to authenticated using (true);

-- Public read authors
drop policy if exists "Public can read authors" on public.authors;
create policy "Public can read authors" on public.authors
for select using (true);

-- Public read media
drop policy if exists "Public can read media" on public.media;
create policy "Public can read media" on public.media
for select using (true);

-- Authenticated can insert/update/delete news (basic)
drop policy if exists "Authenticated can insert news" on public.news;
create policy "Authenticated can insert news" on public.news
for insert to authenticated with check (true);

drop policy if exists "Authenticated can update own news" on public.news;
create policy "Authenticated can update own news" on public.news
for update to authenticated using (true) with check (true);

drop policy if exists "Authenticated can delete news" on public.news;
create policy "Authenticated can delete news" on public.news
for delete to authenticated using (true);

-- Comments policies
drop policy if exists "Public can read approved comments" on public.comments;
create policy "Public can read approved comments" on public.comments
for select using (is_approved = true);

drop policy if exists "Public can insert comments" on public.comments;
create policy "Public can insert comments" on public.comments
for insert with check (true);

-- Authors insert for authenticated
drop policy if exists "Authenticated can insert authors" on public.authors;
create policy "Authenticated can insert authors" on public.authors
for insert to authenticated with check (true);

-- Media insert for authenticated
drop policy if exists "Authenticated can insert media" on public.media;
create policy "Authenticated can insert media" on public.media
for insert to authenticated with check (true);
