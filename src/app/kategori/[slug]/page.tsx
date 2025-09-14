import { fetchCategoryBySlug } from "@/lib/categories";
import { fetchPublishedNewsByCategorySlug } from "@/lib/news";
import NewsCard from "@/components/NewsCard";
import { notFound } from "next/navigation";

export async function generateMetadata({ params }: { params: { slug: string } }) {
	const category = await fetchCategoryBySlug(params.slug);
	if (!category) return { title: "Kategori bulunamadı" };
	return { title: `${category.name} | AKSARAY AKTİF HABER`, description: category.description || undefined };
}

export default async function CategoryPage({ params, searchParams }: { params: { slug: string }; searchParams?: { page?: string } }) {
	const category = await fetchCategoryBySlug(params.slug);
	if (!category) return notFound();
	const page = Number(searchParams?.page || "1");
	const { items, total } = await fetchPublishedNewsByCategorySlug(params.slug, page, 9);
	const totalPages = Math.max(1, Math.ceil(total / 9));

	return (
		<div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
			<h1 className="text-2xl font-bold mb-6">{category.name}</h1>
			{items.length === 0 ? (
				<p className="text-black/70 dark:text-white/70">Bu kategoride yayınlanmış haber yok.</p>
			) : (
				<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
					{items.map((n) => (
						<NewsCard key={n.id} id={n.id} title={n.title} excerpt={n.summary || ""} date={n.published_at || new Date().toISOString()} slug={n.slug} imageSrc={n.cover_image_url || undefined} viewCount={0} />
					))}
				</div>
			)}

			{totalPages > 1 && (
				<div className="flex items-center justify-center gap-2 my-10">
					<a className="px-3 py-1 rounded border border-black/10 dark:border-white/10 disabled:opacity-50" href={`/kategori/${category.slug}?page=${Math.max(1, page - 1)}`} aria-disabled={page <= 1}>Önceki</a>
					<span className="text-sm text-black/70 dark:text-white/70">Sayfa {page} / {totalPages}</span>
					<a className="px-3 py-1 rounded border border-black/10 dark:border-white/10 disabled:opacity-50" href={`/kategori/${category.slug}?page=${Math.min(totalPages, page + 1)}`} aria-disabled={page >= totalPages}>Sonraki</a>
				</div>
			)}
		</div>
	);
}
