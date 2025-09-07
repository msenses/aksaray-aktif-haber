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
	const publishedAt = data.published_at || data.created_at;
	const shareUrl = `${process.env.NEXT_PUBLIC_SITE_URL || ''}/haber/${data.slug}`;
	const supabase = await createSupabaseServerClient();
	try {
		await supabase.rpc("increment_news_views", { p_news_id: data.id });
	} catch {}
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
			<div className="relative w-full h-24 sm:h-28 md:h-32 lg:h-36 rounded border border-black/10 dark:border-white/10 bg-white/70 dark:bg-white/5 flex items-center justify-center text-sm text-black/60 dark:text-white/60 mb-6">
				Reklam Alanı
			</div>
			{data.cover_image_url && (
				<div className="relative w-full h-72 mb-6">
					<Image src={data.cover_image_url} alt={data.title} fill className="object-cover rounded-lg" />
				</div>
			)}
			<div className="flex items-center gap-3 text-xs text-black/60 dark:text-white/60 mb-4">
				<time dateTime={publishedAt}>{new Date(publishedAt).toLocaleDateString("tr-TR")} {new Date(publishedAt).toLocaleTimeString("tr-TR", { hour: "2-digit", minute: "2-digit" })}</time>
				<span>•</span>
				<span>{typeof data.views === "number" ? data.views : 0} görüntülenme</span>
			</div>
			<article className="prose prose-blue dark:prose-invert max-w-none">
				{data.content}
			</article>
			<div className="mt-8 rounded-2xl border border-black/10 dark:border-white/10 bg-white/70 dark:bg-white/5 flex items-center justify-center min-h-48 h-48 text-sm text-black/60 dark:text-white/60">
				Reklam Alanı
			</div>

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
				<a href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`} target="_blank" rel="noopener noreferrer" aria-label="Facebook" title="Facebook" className="p-2 rounded-full border border-black/10 dark:border-white/10 bg-white/80 dark:bg-white/5 hover:bg-white transition">
					<svg aria-hidden="true" focusable="false" viewBox="0 0 24 24" className="w-5 h-5 text-[#1877F2]" fill="currentColor">
						<path d="M22.675 0H1.325C.593 0 0 .593 0 1.326v21.348C0 23.407.593 24 1.325 24h11.495v-9.294H9.692V11.09h3.128V8.413c0-3.1 1.893-4.788 4.659-4.788 1.325 0 2.463.099 2.795.143v3.24l-1.918.001c-1.504 0-1.795.715-1.795 1.763v2.314h3.587l-.467 3.616h-3.12V24h6.116C23.407 24 24 23.407 24 22.674V1.326C24 .593 23.407 0 22.675 0z"/>
					</svg>
				</a>
				<a href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(data.title)}`} target="_blank" rel="noopener noreferrer" aria-label="X" title="X" className="p-2 rounded-full border border-black/10 dark:border-white/10 bg-white/80 dark:bg-white/5 hover:bg-white transition">
					<svg aria-hidden="true" focusable="false" viewBox="0 0 24 24" className="w-5 h-5 text-black dark:text-white" fill="currentColor">
						<path d="M3 2h4l6.5 8.7L20 2h4l-8.5 10.5L24 24h-4l-7-9.4L6 24H2l9-11.1L3 2zm13.445 18h1.91L8.63 4h-1.89l9.705 16z"/>
					</svg>
				</a>
				<a href={`https://wa.me/?text=${encodeURIComponent(data.title + ' ' + shareUrl)}`} target="_blank" rel="noopener noreferrer" aria-label="WhatsApp" title="WhatsApp" className="p-2 rounded-full border border-black/10 dark:border-white/10 bg-white/80 dark:bg-white/5 hover:bg-white transition">
					<svg aria-hidden="true" focusable="false" viewBox="0 0 24 24" className="w-5 h-5 text-[#25D366]" fill="currentColor">
						<path d="M.057 24l1.687-6.163a11.867 11.867 0 01-1.62-6.003C.122 5.281 5.403 0 12.06 0c3.2 0 6.2 1.246 8.475 3.522A11.86 11.86 0 0124 12.06c-.003 6.658-5.284 11.94-11.942 11.94a11.9 11.9 0 01-6.003-1.62L.057 24zm6.597-3.807c1.741.995 3.027 1.591 5.347 1.591 5.448 0 9.886-4.434 9.889-9.877.003-5.462-4.415-9.89-9.881-9.893H12.06c-5.442 0-9.878 4.434-9.881 9.881 0 2.213.651 3.891 1.746 5.556l-.999 3.648 3.728-.906zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.03-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.149-.173.198-.298.298-.496.099-.198.05-.372-.025-.521-.074-.149-.669-1.611-.916-2.206-.242-.579-.487-.5-.669-.51l-.57-.01c-.198 0-.521.074-.793.372-.272.297-1.04 1.016-1.04 2.479s1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.262.489 1.694.626.712.227 1.36.195 1.872.118.571-.085 1.758-.718 2.006-1.41.248-.694.248-1.29.173-1.415z"/>
					</svg>
				</a>
			</div>
		</div>
	);
}
