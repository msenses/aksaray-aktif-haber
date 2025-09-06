import { fetchNewsBySlug } from "@/lib/news";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
	const data = await fetchNewsBySlug(params.slug);
	if (!data) return { title: "Haber bulunamadı" };
	return {
		title: `${data.title} | AKSARAY AKTİF HABER`,
		description: data.summary || undefined,
		openGraph: {
			title: data.title,
			description: data.summary || undefined,
			images: data.cover_image_url ? [{ url: data.cover_image_url }] : undefined,
		},
		twitter: {
			card: "summary_large_image",
			title: data.title,
			description: data.summary || undefined,
			images: data.cover_image_url ? [data.cover_image_url] : undefined,
		},
	};
}

export default async function NewsDetail({ params }: { params: { slug: string } }) {
	const data = await fetchNewsBySlug(params.slug);
	if (!data) return notFound();

	return (
		<div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-10">
			<h1 className="text-2xl sm:text-3xl font-bold tracking-tight mb-3">{data.title}</h1>
			<p className="text-black/70 dark:text-white/70 mb-6">{data.summary}</p>
			{data.cover_image_url && (
				<img src={data.cover_image_url} alt={data.title} className="w-full rounded-lg mb-6" />
			)}
			<article className="prose prose-blue dark:prose-invert max-w-none">
				{data.content}
			</article>

			<div className="mt-8 flex items-center gap-3 text-sm">
				<span>Paylaş:</span>
				<a className="underline underline-offset-4" href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(process.env.NEXT_PUBLIC_SITE_URL || '')}/haber/${data.slug}`} target="_blank" rel="noopener noreferrer">Facebook</a>
				<a className="underline underline-offset-4" href={`https://twitter.com/intent/tweet?url=${encodeURIComponent((process.env.NEXT_PUBLIC_SITE_URL || '') + '/haber/' + data.slug)}&text=${encodeURIComponent(data.title)}`} target="_blank" rel="noopener noreferrer">X</a>
				<a className="underline underline-offset-4" href={`https://wa.me/?text=${encodeURIComponent(data.title + ' ' + ((process.env.NEXT_PUBLIC_SITE_URL || '') + '/haber/' + data.slug))}`} target="_blank" rel="noopener noreferrer">WhatsApp</a>
			</div>
		</div>
	);
}
