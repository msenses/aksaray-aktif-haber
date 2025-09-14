import NewsCard from "@/components/NewsCard";
import { searchPublishedNews } from "@/lib/news";

export const metadata = { title: "Arama | AKSARAY AKTİF HABER" };

export default async function SearchPage({ searchParams }: { searchParams?: Promise<{ q?: string; page?: string }> }) {
	const sp = (await searchParams) || {};
	const q = (sp.q || "").trim();
	const page = Number(sp.page || "1");
	let items: Awaited<ReturnType<typeof searchPublishedNews>>["items"] = [];
	let total = 0;
	if (q) {
		const res = await searchPublishedNews(q, page, 9);
		items = res.items;
		total = res.total;
	}
	const totalPages = Math.max(1, Math.ceil(total / 9));

	return (
		<div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
			<h1 className="text-2xl font-bold mb-4">Arama</h1>
			<form action="/arama" method="get" className="mb-6 flex gap-2">
				<input name="q" defaultValue={q} placeholder="Haber arayın..." className="flex-1 rounded border border-black/10 dark:border-white/10 px-3 py-2 bg-white/70 dark:bg-white/5" />
				<button className="px-4 py-2 rounded bg-blue-600 text-white">Ara</button>
			</form>

			{!q && <p className="text-black/70 dark:text-white/70">Aramak için bir terim girin.</p>}
			{q && items.length === 0 && <p className="text-black/70 dark:text-white/70">Sonuç bulunamadı.</p>}
			{q && items.length > 0 && (
				<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
					{items.map((n) => (
						<NewsCard key={n.id} id={n.id} title={n.title} excerpt={n.summary || ""} date={n.published_at || "1970-01-01T00:00:00.000Z"} slug={n.slug} imageSrc={n.cover_image_url || undefined} viewCount={0} />
					))}
				</div>
			)}

			{q && totalPages > 1 && (
				<div className="flex items-center justify-center gap-2 my-10">
					<a className="px-3 py-1 rounded border border-black/10 dark:border-white/10 disabled:opacity-50" href={`/arama?q=${encodeURIComponent(q)}&page=${Math.max(1, page - 1)}`} aria-disabled={page <= 1}>Önceki</a>
					<span className="text-sm text-black/70 dark:text-white/70">Sayfa {page} / {totalPages}</span>
					<a className="px-3 py-1 rounded border border-black/10 dark:border-white/10 disabled:opacity-50" href={`/arama?q=${encodeURIComponent(q)}&page=${Math.min(totalPages, page + 1)}`} aria-disabled={page >= totalPages}>Sonraki</a>
				</div>
			)}
		</div>
	);
}
