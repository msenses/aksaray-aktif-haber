import NewsCard from "@/components/NewsCard";
import SupabaseStatus from "@/components/SupabaseStatus";
import { fetchPublishedNewsPage } from "@/lib/news";

export default async function Home({ searchParams }: { searchParams?: { page?: string } }) {
	const page = Number(searchParams?.page || "1");
	let total = 0;
	let items: Awaited<ReturnType<typeof fetchPublishedNewsPage>>["items"] = [];
	try {
		const res = await fetchPublishedNewsPage(page, 9);
		total = res.total;
		items = res.items;
	} catch {
		items = [];
	}

	const totalPages = Math.max(1, Math.ceil(total / 9));

	return (
		<div className="font-sans">
			<section className="hero-gradient text-white">
				<div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
					<h1 className="text-3xl sm:text-4xl font-bold tracking-tight">AKSARAY AKTİF HABER</h1>
					<p className="mt-2 text-white/90">Aksaray'dan anlık, doğru ve tarafsız haberler.</p>
					<div className="mt-3"><SupabaseStatus /></div>
				</div>
			</section>

			<section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 -mt-8">
				{items.length === 0 ? (
					<p className="text-sm text-black/70 dark:text-white/70 py-10">Şu anda yayınlanmış haber bulunamadı.</p>
				) : (
					<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
						{items.map((n) => (
							<NewsCard
								key={n.id}
								title={n.title}
								excerpt={n.summary || ""}
								category={"Yayın"}
								date={n.published_at || new Date().toISOString()}
								slug={n.slug}
								imageSrc={n.cover_image_url || undefined}
							/>
						))}
					</div>
				)}

				{totalPages > 1 && (
					<div className="flex items-center justify-center gap-2 my-10">
						<a
							className="px-3 py-1 rounded border border-black/10 dark:border-white/10 disabled:opacity-50"
							href={`/?page=${Math.max(1, page - 1)}`}
							aria-disabled={page <= 1}
						>
							Önceki
						</a>
						<span className="text-sm text-black/70 dark:text-white/70">Sayfa {page} / {totalPages}</span>
						<a
							className="px-3 py-1 rounded border border-black/10 dark:border-white/10 disabled:opacity-50"
							href={`/?page=${Math.min(totalPages, page + 1)}`}
							aria-disabled={page >= totalPages}
						>
							Sonraki
						</a>
					</div>
				)}
			</section>
		</div>
	);
}
