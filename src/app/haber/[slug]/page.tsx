import { fetchNewsBySlug } from "@/lib/news";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import { createSupabaseServerClient } from "@/lib/supabaseServer";
import CommentForm from "@/components/CommentForm";

type MediaItem = { id: string; url: string; media_type: string | null };

type CommentItem = { id: string; author_name: string | null; content: string; created_at: string };

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
	const supabase = await createSupabaseServerClient();
	const { data: media } = await supabase
		.from("media")
		.select("id,url,media_type")
		.eq("news_id", data.id)
		.order("created_at", { ascending: true });
	const mediaItems: MediaItem[] = (media || []) as MediaItem[];
	const { data: comments } = await supabase
		.from("comments")
		.select("id,author_name,content,created_at")
		.eq("news_id", data.id)
		.eq("is_approved", true)
		.order("created_at", { ascending: false });
	const commentItems: CommentItem[] = (comments || []) as CommentItem[];

	return (
		<div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-10">
			<h1 className="text-2xl sm:text-3xl font-bold tracking-tight mb-3">{data.title}</h1>
			<p className="text-black/70 dark:text-white/70 mb-6">{data.summary}</p>
			{data.cover_image_url && (
				<div className="relative w-full h-72 mb-6">
					<Image src={data.cover_image_url} alt={data.title} fill className="object-cover rounded-lg" />
				</div>
			)}
			<article className="prose prose-blue dark:prose-invert max-w-none">
				{data.content}
			</article>

			{mediaItems.length > 0 && (
				<div className="mt-8 grid grid-cols-2 sm:grid-cols-3 gap-3">
					{mediaItems.map((m) => (
						<div key={m.id} className="relative w-full aspect-[4/3]">
							<Image src={m.url} alt={data.title} fill className="object-cover rounded" />
						</div>
					))}
				</div>
			)}

			<section className="mt-10 space-y-4">
				<h2 className="text-lg font-semibold">Yorumlar</h2>
				{commentItems.length === 0 && <p className="text-sm text-black/60 dark:text-white/60">Henüz yorum yok.</p>}
				<ul className="space-y-3">
					{commentItems.map((c) => (
						<li key={c.id} className="rounded border border-black/10 dark:border-white/10 p-3 bg-white/70 dark:bg-white/5">
							<p className="text-sm font-medium">{c.author_name || "Ziyaretçi"}</p>
							<p className="text-sm text-black/80 dark:text-white/80">{c.content}</p>
							<p className="text-[11px] text-black/60 dark:text-white/60 mt-1">{new Date(c.created_at).toLocaleString("tr-TR")}</p>
						</li>
					))}
				</ul>
				<div className="mt-4">
					<CommentForm newsId={data.id} />
				</div>
			</section>

			<div className="mt-8 flex items-center gap-3 text-sm">
				<span>Paylaş:</span>
				<a className="underline underline-offset-4" href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(process.env.NEXT_PUBLIC_SITE_URL || '')}/haber/${data.slug}`} target="_blank" rel="noopener noreferrer">Facebook</a>
				<a className="underline underline-offset-4" href={`https://twitter.com/intent/tweet?url=${encodeURIComponent((process.env.NEXT_PUBLIC_SITE_URL || '') + '/haber/' + data.slug)}&text=${encodeURIComponent(data.title)}`} target="_blank" rel="noopener noreferrer">X</a>
				<a className="underline underline-offset-4" href={`https://wa.me/?text=${encodeURIComponent(data.title + ' ' + ((process.env.NEXT_PUBLIC_SITE_URL || '') + '/haber/' + data.slug))}`} target="_blank" rel="noopener noreferrer">WhatsApp</a>
			</div>
		</div>
	);
}
