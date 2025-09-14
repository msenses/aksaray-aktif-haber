import NewsCard from "@/components/NewsCard";
import LatestNewsSlider from "@/components/LatestNewsSlider";
import DutyPharmacies from "@/components/DutyPharmacies";
import { fetchPublishedNewsPage, fetchLatestPublishedNews } from "@/lib/news";
import { Fragment } from "react";
import AdSlot from "@/components/AdSlot";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function Home({ searchParams }: { searchParams?: Promise<{ page?: string }> }) {
	const sp = (await searchParams) || {};
	const page = Number(sp.page || "1");
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
				<AdSlot slotKey="ana_reklam_alani" className="relative w-full h-24 sm:h-28 md:h-32 lg:h-36 rounded overflow-hidden" />
			</section>

			{/* Son Haberler + Nöbetçi Eczaneler yan yana (lg+) */}
			<section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-2">
				<div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
					<div className="lg:col-span-2">
						<h2 className="text-lg font-semibold mb-3">Son Haberler</h2>
						<LatestNewsSlider items={latest} />
					</div>
					<div className="hidden lg:block lg:col-span-1">
						<DutyPharmacies variant="sidebar" />
					</div>
				</div>
			</section>

			{/* Mobil/tablet: Nöbetçi eczaneler en altta footer'dan önce görünecek, o yüzden burada değil */}

			<section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 mt-4">
				{items.length === 0 ? (
					<p className="text-sm text-black/70 dark:text-white/70 py-10">Şu anda yayınlanmış haber bulunamadı.</p>
				) : (
					<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
						{items.map((n, idx) => (
							<Fragment key={n.id}>
								<NewsCard
									id={n.id}
									title={n.title}
									excerpt={n.summary || ""}
									date={n.published_at || "1970-01-01T00:00:00.000Z"}
									slug={n.slug}
									imageSrc={n.cover_image_url || undefined}
									viewCount={typeof n.views === "number" ? n.views : 0}
								/>
								{(idx + 1) % 3 === 0 && (
									<AdSlot slotKey="toplu_reklamlar" className="rounded-2xl overflow-hidden min-h-48 h-48" />
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
							className="px-3 py-1 rounded border border-black/10 dark:border-white/10 disabled:opacity-50"
							href={`/?page=${Math.min(totalPages, page + 1)}`}
							aria-disabled={page >= totalPages}
						>
							Sonraki
						</a>
					</div>
				)}
			</section>

			{/* Mobil/tablet: duty pharmacies en altta footer öncesi */}
			<section className="block lg:hidden mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6">
				<DutyPharmacies />
			</section>
		</div>
	);
}
