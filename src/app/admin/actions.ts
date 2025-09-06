"use server";

import { revalidatePath } from "next/cache";
import { createSupabaseServerClient } from "@/lib/supabaseServer";
import { slugify } from "@/lib/slugify";

function extFromMime(mime: string): string {
	if (!mime) return "bin";
	if (mime === "image/jpeg") return "jpg";
	if (mime === "image/png") return "png";
	if (mime === "image/webp") return "webp";
	if (mime === "image/gif") return "gif";
	const parts = mime.split("/");
	return parts[1] || "bin";
}

export async function insertNewsAction(formData: FormData): Promise<void> {
	const supabase = await createSupabaseServerClient();
	const title = String(formData.get("title") || "");
	const summary = String(formData.get("summary") || "");
	const content = String(formData.get("content") || "");
	const categoryId = String(formData.get("categoryId") || "");
	const status = String(formData.get("status") || "draft");
	const slug = slugify(title);

	// Kapak görseli yükle
	let coverUrl: string | null = null;
	const coverFile = formData.get("cover") as File | null;
	if (coverFile && typeof coverFile === "object" && coverFile.size > 0) {
		const ext = extFromMime(coverFile.type);
		const path = `news/${slug}/cover-${Date.now()}.${ext}`;
		const { error: upErr } = await supabase.storage.from("news-media").upload(path, coverFile, { upsert: true, contentType: coverFile.type || undefined });
		if (upErr) throw new Error(upErr.message);
		const { data } = supabase.storage.from("news-media").getPublicUrl(path);
		coverUrl = data.publicUrl;
	}

	// Haberi ekle ve id al
	const { data: inserted, error } = await supabase
		.from("news")
		.insert({ title, slug, summary, content, category_id: categoryId || null, status, cover_image_url: coverUrl, published_at: status === "published" ? new Date().toISOString() : null })
		.select("id")
		.single();
	if (error) throw new Error(error.message);
	const newsId = inserted.id as string;

	// Galeri görsellerini yükle ve media tablosuna ekle
	const galleryFiles = formData.getAll("gallery") as File[];
	const mediaRows: { news_id: string; url: string; media_type: string | null }[] = [];
	for (let i = 0; i < galleryFiles.length; i++) {
		const f = galleryFiles[i];
		if (!f || typeof f !== "object" || f.size === 0) continue;
		const ext = extFromMime(f.type);
		const path = `news/${slug}/gallery-${i}-${Date.now()}.${ext}`;
		const { error: gErr } = await supabase.storage.from("news-media").upload(path, f, { upsert: true, contentType: f.type || undefined });
		if (gErr) throw new Error(gErr.message);
		const { data } = supabase.storage.from("news-media").getPublicUrl(path);
		mediaRows.push({ news_id: newsId, url: data.publicUrl, media_type: f.type || null });
	}
	if (mediaRows.length > 0) {
		const { error: mErr } = await supabase.from("media").insert(mediaRows);
		if (mErr) throw new Error(mErr.message);
	}

	revalidatePath("/admin");
}

export async function updateStatusAction(formData: FormData): Promise<void> {
	const supabase = await createSupabaseServerClient();
	const id = String(formData.get("id") || "");
	const status = (String(formData.get("status") || "draft") as "draft" | "published");
	const { error } = await supabase
		.from("news")
		.update({ status, published_at: status === "published" ? new Date().toISOString() : null })
		.eq("id", id);
	if (error) throw new Error(error.message);
	revalidatePath("/admin");
}

export async function deleteNewsAction(formData: FormData): Promise<void> {
	const supabase = await createSupabaseServerClient();
	const id = String(formData.get("id") || "");
	const { error } = await supabase.from("news").delete().eq("id", id);
	if (error) throw new Error(error.message);
	revalidatePath("/admin");
}
