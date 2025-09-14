import { fetchNewsBySlug } from "@/lib/news";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import { supabase } from "@/lib/supabaseClient";
import CommentForm from "@/components/CommentForm";
import GalleryLightbox from "@/components/GalleryLightbox";
import AdSlot from "@/components/AdSlot";

export const dynamic = "force-dynamic";
export const revalidate = 0;

type MediaItem = { id: string; url: string; media_type: string | null };

type CommentItem = { id: string; author_name: string | null; content: string; created_at: string };

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
	const { slug } = await params;
	const data = await fetchNewsBySlug(slug);
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

export default async function NewsDetail({ params }: { params: Promise<{ slug: string }> }) {
	const { slug } = await params;
	const data = await fetchNewsBySlug(slug);
	if (!data) return notFound();
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
			{/* Başlık üstü reklam */}
			<AdSlot slotKey="ana_reklam_alani" className="relative w-full h-24 sm:h-28 md:h-32 lg:h-36 rounded overflow-hidden mb-6" />

			<h1 className="text-2xl sm:text-3xl font-bold tracking-tight mb-3">{data.title}</h1>
			<p className="text-black/70 dark:text-white/70 mb-6">{data.summary}</p>

			{/* Özet altı reklam */}
			<AdSlot slotKey="toplu_reklamlar" className="relative w-full h-24 rounded overflow-hidden mb-6" />

			{data.cover_image_url && (
				<div className="relative w-full h-72 mb-6">
					<Image src={data.cover_image_url} alt={data.title} fill className="object-cover rounded-lg" />
				</div>
			)}
			<article className="prose prose-blue dark:prose-invert max-w-none">
				{data.content}
			</article>

			{/* İçerik altı reklam */}
			<AdSlot slotKey="toplu_reklamlar" className="relative w-full h-24 rounded overflow-hidden mt-6" />

			{mediaItems.length > 0 && (
				<div className="mt-8">
					<GalleryLightbox items={mediaItems.map((m) => ({ id: m.id, url: m.url, alt: data.title }))} />
				</div>
			)}

			{/* Yorumlar üstü reklam */}
			<AdSlot slotKey="toplu_reklamlar" className="relative w-full h-24 rounded overflow-hidden mt-10 mb-6" />

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
				{(() => {
					const base = (process.env.NEXT_PUBLIC_SITE_URL || "").replace(/\/+$/, "");
					const shareUrl = `${base}/haber/${data.slug}`;
					const fb = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`;
					const x = `https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(data.title)}`;
					const wa = `https://wa.me/?text=${encodeURIComponent(data.title + ' ' + shareUrl)}`;
					return (
						<>
							<a href={fb} target="_blank" rel="noopener noreferrer" aria-label="Facebook ile paylaş" title="Facebook ile paylaş" className="p-2 rounded-full border border-black/10 dark:border-white/10 bg-white/80 dark:bg-white/5 hover:bg-white transition inline-flex items-center gap-2">
								<svg aria-hidden="true" focusable="false" viewBox="0 0 24 24" className="w-5 h-5 text-[#1877F2]" fill="currentColor">
									<path d="M22.675 0H1.325C.593 0 0 .593 0 1.326v21.348C0 23.407.593 24 1.325 24h11.495v-9.294H9.692V11.09h3.128V8.413c0-3.1 1.893-4.788 4.659-4.788 1.325 0 2.463.099 2.795.143v3.24l-1.918.001c-1.504 0-1.795.715-1.795 1.763v2.314h3.587l-.467 3.616h-3.12V24h6.116C23.407 24 24 23.407 24 22.674V1.326C24 .593 23.407 0 22.675 0z"/>
								</svg>
								<span className="hidden sm:inline">Facebook</span>
							</a>
							<a href={x} target="_blank" rel="noopener noreferrer" aria-label="X ile paylaş" title="X ile paylaş" className="p-2 rounded-full border border-black/10 dark:border-white/10 bg-white/80 dark:bg-white/5 hover:bg-white transition inline-flex items-center gap-2">
								<svg aria-hidden="true" focusable="false" viewBox="0 0 24 24" className="w-5 h-5" fill="currentColor">
									<path d="M3 2h4l6.5 8.7L20 2h4l-8.5 10.5L24 24h-4l-7-9.4L6 24H2l9-11.1L3 2zm13.445 18h1.91L8.63 4h-1.89l9.705 16z"/>
								</svg>
								<span className="hidden sm:inline">X</span>
							</a>
							<a href={wa} target="_blank" rel="noopener noreferrer" aria-label="WhatsApp ile paylaş" title="WhatsApp ile paylaş" className="p-2 rounded-full border border-black/10 dark:border-white/10 bg-white/80 dark:bg-white/5 hover:bg-white transition inline-flex items-center gap-2">
								<svg aria-hidden="true" focusable="false" viewBox="0 0 24 24" className="w-5 h-5" fill="currentColor">
									<path d="M20.52 3.48A11.9 11.9 0 0012.05 0C5.53 0 .24 5.29.24 11.81c0 2.08.55 4.13 1.6 5.94L0 24l6.4-1.67a11.78 11.78 0 005.65 1.45h.01c6.52 0 11.81-5.29 11.81-11.81 0-3.15-1.23-6.11-3.35-8.22zM12.06 21.4h-.01a9.6 9.6 0 01-4.9-1.35l-.35-.2-3.8.99 1.02-3.7-.23-.38a9.56 9.56 0 01-1.47-5.14c0-5.28 4.3-9.58 9.6-9.58 2.56 0 4.97 1 6.78 2.81a9.53 9.53 0 012.8 6.77c0 5.28-4.3 9.58-9.58 9.58zm5.52-7.15c-.3-.15-1.77-.87-2.05-.97-.27-.1-.47-.15-.67.15-.2.3-.77.97-.95 1.17-.17.2-.35.22-.65.07-.3-.15-1.25-.46-2.38-1.46-.88-.77-1.47-1.72-1.65-2.01-.17-.3-.02-.46.13-.61.13-.13.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.02-.52-.07-.15-.67-1.62-.92-2.22-.24-.58-.48-.5-.67-.5h-.57c-.2 0-.52.07-.8.37-.27.3-1.05 1.03-1.05 2.52s1.08 2.92 1.23 3.12c.15.2 2.13 3.25 5.17 4.56.72.31 1.28.5 1.72.64.72.23 1.38.2 1.9.12.58-.09 1.77-.72 2.02-1.42.25-.7.25-1.3.17-1.42-.08-.12-.27-.2-.57-.35z"/>
								</svg>
								<span className="hidden sm:inline">WhatsApp</span>
							</a>
						</>
					);
				})()}
			</div>
		</div>
	);
}
