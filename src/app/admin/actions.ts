"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
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
	try {
		const title = String(formData.get("title") || "");
		const summary = String(formData.get("summary") || "");
		const content = String(formData.get("content") || "");
		const categoryId = String(formData.get("categoryId") || "");
		const status = String(formData.get("status") || "draft");
		const slug = slugify(title);

		// User -> author_id çöz
		const { data: userRes, error: userErr } = await supabase.auth.getUser();
		if (userErr || !userRes?.user) {
			redirect("/admin?error=auth");
		}
		const email = userRes.user.email || "editor@local";
		let authorId: string | null = null;
		{
			const { data: a1 } = await supabase.from("authors").select("id").eq("full_name", email).limit(1).maybeSingle();
			if (a1?.id) authorId = a1.id as string;
		}
		if (!authorId) {
			const { data: a2, error: aErr } = await supabase.from("authors").insert({ full_name: email, bio: null, avatar_url: null }).select("id").single();
			if (aErr) redirect(`/admin?error=${encodeURIComponent(aErr.message)}`);
			authorId = a2.id as string;
		}

		// Kapak görseli yükle
		let coverUrl: string | null = null;
		const coverFile = formData.get("cover") as File | null;
		if (coverFile && typeof coverFile === "object" && coverFile.size > 0) {
			const ext = extFromMime(coverFile.type);
			const path = `news/${slug}/cover-${Date.now()}.${ext}`;
			const { error: upErr } = await supabase.storage.from("news-media").upload(path, coverFile, { upsert: true, contentType: coverFile.type || undefined });
			if (upErr) redirect(`/admin?error=${encodeURIComponent(upErr.message)}`);
			const { data } = supabase.storage.from("news-media").getPublicUrl(path);
			coverUrl = data.publicUrl;
		}

		// Haberi ekle ve id al
		const { data: inserted, error } = await supabase
			.from("news")
			.insert({ title, slug, summary, content, author_id: authorId, category_id: categoryId || null, status, cover_image_url: coverUrl, published_at: status === "published" ? new Date().toISOString() : null })
			.select("id")
			.single();
		if (error) redirect(`/admin?error=${encodeURIComponent(error.message)}`);
		const newsId = inserted!.id as string;

		// Galeri görselleri
		const galleryFiles = formData.getAll("gallery") as File[];
		const mediaRows: { news_id: string; url: string; media_type: string | null }[] = [];
		for (let i = 0; i < galleryFiles.length; i++) {
			const f = galleryFiles[i];
			if (!f || typeof f !== "object" || f.size === 0) continue;
			const ext = extFromMime(f.type);
			const path = `news/${slug}/gallery-${i}-${Date.now()}.${ext}`;
			const { error: gErr } = await supabase.storage.from("news-media").upload(path, f, { upsert: true, contentType: f.type || undefined });
			if (gErr) redirect(`/admin?error=${encodeURIComponent(gErr.message)}`);
			const { data } = supabase.storage.from("news-media").getPublicUrl(path);
			mediaRows.push({ news_id: newsId, url: data.publicUrl, media_type: f.type || null });
		}
		if (mediaRows.length > 0) {
			const { error: mErr } = await supabase.from("media").insert(mediaRows);
			if (mErr) redirect(`/admin?error=${encodeURIComponent(mErr.message)}`);
		}

		revalidatePath("/admin");
		redirect("/admin?ok=1");
	} catch (e: unknown) {
		const msg = (e as { message?: string })?.message || "unknown";
		redirect(`/admin?error=${encodeURIComponent(msg)}`);
	}
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

export async function upsertAdSlotAction(formData: FormData): Promise<void> {
	const supabase = await createSupabaseServerClient();
	try {
		const id = String(formData.get("id") || "");
		const key = String(formData.get("key") || "").trim();
		const title = String(formData.get("title") || "").trim();
		const html = String(formData.get("html") || "");
		let image_url = String(formData.get("image_url") || "");
		const link_url = String(formData.get("link_url") || "");
		// Checkbox: işaretliyse form alanı mevcuttur
		const is_active = formData.has("is_active");
		if (!key || !title) throw new Error("key ve title zorunlu");

		// Opsiyonel: Görsel dosyası yükle ve image_url alanını güncelle
		const imageFile = formData.get("image_file") as File | null;
		if (imageFile && typeof imageFile === "object" && imageFile.size > 0) {
			const ext = extFromMime(imageFile.type);
			const path = `ads/${key}/banner-${Date.now()}.${ext}`;
			const { error: upErr } = await supabase.storage
				.from("news-media")
				.upload(path, imageFile, {
					upsert: true,
					contentType: imageFile.type || undefined,
				});
			if (upErr) throw new Error(upErr.message);
			const { data } = supabase.storage.from("news-media").getPublicUrl(path);
			image_url = data.publicUrl;
		}

		// Her zaman key'e göre upsert: var ise güncelle, yoksa ekle
		const { error } = await supabase
			.from("ad_slots")
			.upsert(
				{ key, title, html, image_url, link_url, is_active },
				{ onConflict: "key" }
			);
		if (error) throw new Error(error.message);

		revalidatePath("/admin/ads");
		redirect("/admin/ads?ok=1");
	} catch (e: unknown) {
		const msg = (e as { message?: string })?.message || "unknown";
		redirect(`/admin/ads?error=${encodeURIComponent(msg)}`);
	}
}

export async function deleteAdSlotAction(formData: FormData): Promise<void> {
	const supabase = await createSupabaseServerClient();
	const id = String(formData.get("id") || "");
	const { error } = await supabase.from("ad_slots").delete().eq("id", id);
	if (error) throw new Error(error.message);
	revalidatePath("/admin/ads");
}
