import NewsCard from "@/components/NewsCard";
import LatestNewsSlider from "@/components/LatestNewsSlider";
import { fetchPublishedNewsPage, fetchLatestPublishedNews } from "@/lib/news";
import { Fragment } from "react";

export default async function Home({ searchParams }: { searchParams?: { page?: string } }) {
	const page = Number(searchParams?.page || "1");
	let total = 0;
	let items: Awaited<ReturnType<typeof fetchPublishedNewsPage>>["items"] = [];
  const latest = await fetchLatestPublishedNews(12);
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
			{/* Reklam alanı (header altı geniş banner) */}
			<section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-4">
				<div className="relative w-full h-24 sm:h-28 md:h-32 lg:h-36 rounded border border-black/10 dark:border-white/10 bg-white/70 dark:bg-white/5 flex items-center justify-center text-sm text-black/60 dark:text-white/60">
					Reklam Alanı
				</div>
			</section>

			{/* Son Haberler slider */}
			<section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-2">
				<h2 className="text-lg font-semibold mb-3">Son Haberler</h2>
				<LatestNewsSlider items={latest} />
			</section>

			<section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 mt-4">
				{items.length === 0 ? (
					<p className="text-sm text_black/70 dark:text-white/70 py-10">Şu anda yayınlanmış haber bulunamadı.</p>
				) : (
					<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
						{items.map((n, idx) => (
							<Fragment key={n.id}>
								<NewsCard
									id={n.id}
									title={n.title}
									excerpt={n.summary || ""}
									date={n.published_at || new Date().toISOString()}
									slug={n.slug}
									imageSrc={n.cover_image_url || undefined}
									viewCount={typeof n.views === "number" ? n.views : 0}
								/>
								{(idx + 1) % 3 === 0 && (
									<div className="rounded-2xl border border-black/10 dark:border-white/10 bg-white/70 dark:bg-white/5 flex items_center justify_center min_h-48 h-48 text_sm text_black/60 dark:text_white/60">
										Reklam Alanı
									</div>
								)}
							</Fragment>
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
							className="px-3 py-1 rounded border border_black/10 dark:border_white/10 disabled:opacity-50"
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
