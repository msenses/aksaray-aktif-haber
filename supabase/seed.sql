insert into public.categories (id, name, slug, description) values
	(gen_random_uuid(), 'Gündem', 'gundem', 'Gündem haberleri'),
	(gen_random_uuid(), 'Spor', 'spor', 'Spor haberleri'),
	(gen_random_uuid(), 'Ekonomi', 'ekonomi', 'Ekonomi haberleri')
on conflict do nothing;

insert into public.authors (id, full_name, bio, avatar_url) values
	(gen_random_uuid(), 'Editör', 'Yerel haber editörü', null)
on conflict do nothing;

-- pick one category and author for sample news
with c as (
	select id from public.categories order by created_at asc limit 1
), a as (
	select id from public.authors order by created_at asc limit 1
)
insert into public.news (id, title, slug, summary, content, author_id, category_id, status, published_at)
select gen_random_uuid(), 'Aksaray''da Gündem', 'aksaray-gundem-ornek', 'Aksaray''da gündeme dair kısa özet', 'Detaylı haber içeriği...', a.id, c.id, 'published', now()
from a, c
on conflict do nothing;
