import { createSupabaseServerClient } from "@/lib/supabaseServer";
import { fetchCategories } from "@/lib/categories";
import { revalidatePath } from "next/cache";
import Image from "next/image";

export const dynamic = "force-dynamic";

type News = {
	id: string;
	title: string;
	slug: string;
	summary: string | null;
	content: string;
	category_id: string | null;
	cover_image_url: string | null;
	status: "draft" | "published";
};

type MediaItem = { id: string; url: string; media_type: string | null };

function parseStoragePath(publicUrl: string): { bucket: string; path: string } | null {
	try {
		const u = new URL(publicUrl);
		const idx = u.pathname.indexOf("/object/public/");
		if (idx === -1) return null;
		const after = u.pathname.substring(idx + "/object/public/".length); // bucket/path
		const firstSlash = after.indexOf("/");
		if (firstSlash === -1) return null;
		return { bucket: after.substring(0, firstSlash), path: after.substring(firstSlash + 1) };
	} catch {
		return null;
	}
}

async function fetchNews(id: string): Promise<News | null> {
	const supabase = await createSupabaseServerClient();
	const { data, error } = await supabase
		.from("news")
		.select("id,title,slug,summary,content,category_id,cover_image_url,status")
		.eq("id", id)
		.single();
	if (error) return null;
	return data as News;
}

async function fetchMedia(newsId: string): Promise<MediaItem[]> {
	const supabase = await createSupabaseServerClient();
	const { data } = await supabase
		.from("media")
		.select("id,url,media_type")
		.eq("news_id", newsId)
		.order("created_at", { ascending: true });
	return (data || []) as MediaItem[];
}

async function updateNews(formData: FormData) {
	"use server";
	const supabase = await createSupabaseServerClient();
	const id = String(formData.get("id") || "");
	const title = String(formData.get("title") || "");
	const summary = String(formData.get("summary") || "");
	const content = String(formData.get("content") || "");
	const categoryId = String(formData.get("categoryId") || "");
	const status = String(formData.get("status") || "draft");
	let coverUrl = String(formData.get("coverUrl") || "");

	const cover = formData.get("cover") as File | null;
	if (cover && cover.size > 0) {
		const ext = cover.type.split("/")[1] || "jpg";
		const path = `news/${id}/cover-${Date.now()}.${ext}`;
		const { error: upErr } = await supabase.storage.from("news-media").upload(path, cover, { upsert: true, contentType: cover.type || undefined });
		if (!upErr) {
			const { data } = supabase.storage.from("news-media").getPublicUrl(path);
			coverUrl = data.publicUrl;
		}
	}

	await supabase
		.from("news")
		.update({ title, summary, content, category_id: categoryId || null, status, cover_image_url: coverUrl || null })
		.eq("id", id);

	revalidatePath(`/admin/news/${id}`);
	revalidatePath("/admin");
}

async function addGallery(formData: FormData) {
	"use server";
	const supabase = await createSupabaseServerClient();
	const id = String(formData.get("id") || "");
	const files = formData.getAll("gallery") as File[];
	const rows: { news_id: string; url: string; media_type: string | null }[] = [];
	for (let i = 0; i < files.length; i++) {
		const f = files[i];
		if (!f || f.size === 0) continue;
		const ext = f.type.split("/")[1] || "jpg";
		const path = `news/${id}/gallery-${i}-${Date.now()}.${ext}`;
		const { error: upErr } = await supabase.storage.from("news-media").upload(path, f, { upsert: true, contentType: f.type || undefined });
		if (upErr) continue;
		const { data } = supabase.storage.from("news-media").getPublicUrl(path);
		rows.push({ news_id: id, url: data.publicUrl, media_type: f.type || null });
	}
	if (rows.length > 0) await supabase.from("media").insert(rows);
	revalidatePath(`/admin/news/${id}`);
}

async function deleteMedia(formData: FormData) {
	"use server";
	const supabase = await createSupabaseServerClient();
	const id = String(formData.get("id") || "");
	const mediaId = String(formData.get("mediaId") || "");
	const url = String(formData.get("url") || "");
	const parsed = parseStoragePath(url);
	if (parsed) {
		await supabase.storage.from(parsed.bucket).remove([parsed.path]);
	}
	await supabase.from("media").delete().eq("id", mediaId);
	revalidatePath(`/admin/news/${id}`);
}

async function replaceMedia(formData: FormData) {
	"use server";
	const supabase = await createSupabaseServerClient();
	const id = String(formData.get("id") || "");
	const mediaId = String(formData.get("mediaId") || "");
	const oldUrl = String(formData.get("oldUrl") || "");
	const file = formData.get("file") as File | null;
	if (!file || file.size === 0) return;
	const ext = file.type.split("/")[1] || "jpg";
	const path = `news/${id}/gallery-repl-${Date.now()}.${ext}`;
	const { error: upErr } = await supabase.storage.from("news-media").upload(path, file, { upsert: true, contentType: file.type || undefined });
	if (!upErr) {
		const { data } = supabase.storage.from("news-media").getPublicUrl(path);
		await supabase.from("media").update({ url: data.publicUrl, media_type: file.type || null }).eq("id", mediaId);
		const parsed = parseStoragePath(oldUrl);
		if (parsed) await supabase.storage.from(parsed.bucket).remove([parsed.path]);
	}
	revalidatePath(`/admin/news/${id}`);
}

export default async function EditNewsPage({ params }: { params: { id: string } }) {
	const [n, categories, media] = await Promise.all([
		fetchNews(params.id),
		fetchCategories(),
		fetchMedia(params.id),
	]);
	if (!n) {
		return (
			<div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-10">
				<p>Haber bulunamadı.</p>
			</div>
		);
	}

	return (
		<div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-10 space-y-10">
			<h1 className="text-2xl font-bold">Haber Düzenle</h1>

			<section className="rounded border border-black/10 dark:border-white/10 p-4 bg-white/70 dark:bg-white/5">
				<h2 className="font-semibold mb-3">Bilgiler</h2>
				<form action={updateNews} className="space-y-3" encType="multipart/form-data">
					<input type="hidden" name="id" value={n.id} />
					<input name="title" defaultValue={n.title} className="w-full rounded border border-black/10 dark:border-white/10 px-3 py-2 bg-white/70 dark:bg-white/5" />
					<textarea name="summary" defaultValue={n.summary || ""} className="w-full h-24 rounded border border-black/10 dark:border-white/10 px-3 py-2 bg-white/70 dark:bg-white/5" />
					<textarea name="content" defaultValue={n.content} className="w-full h-48 rounded border border-black/10 dark:border-white/10 px-3 py-2 bg-white/70 dark:bg-white/5" />
					<select name="categoryId" defaultValue={n.category_id || ""} className="w-full rounded border border-black/10 dark:border-white/10 px-3 py-2 bg-white/70 dark:bg-white/5">
						<option value="">Kategori seç</option>
						{categories.map((c) => (
							<option key={c.id} value={c.id}>{c.name}</option>
						))}
					</select>
					<input type="hidden" name="coverUrl" value={n.cover_image_url || ""} />
					<div className="space-y-2">
						<label className="text-sm font-medium">Kapak Fotoğrafı (değiştirmek istersen yükle)</label>
						<input type="file" name="cover" accept="image/*" className="block w-full text-sm" />
					</div>
					<select name="status" defaultValue={n.status} className="w-full rounded border border-black/10 dark:border-white/10 px-3 py-2 bg-white/70 dark:bg-white/5">
						<option value="draft">Taslak</option>
						<option value="published">Yayınla</option>
					</select>
					<button className="px-3 py-2 rounded bg-blue-600 text-white">Güncelle</button>
				</form>
			</section>

			<section className="rounded border border-black/10 dark:border-white/10 p-4 bg-white/70 dark:bg-white/5">
				<h2 className="font-semibold mb-3">Galeri</h2>
				{media.length === 0 && <p className="text-sm text-black/60 dark:text-white/60">Bu habere ait görsel yok.</p>}
				<ul className="grid grid-cols-2 sm:grid-cols-3 gap-3">
					{media.map((m) => (
						<li key={m.id} className="space-y-2">
							<div className="relative w-full aspect-[4/3] overflow-hidden rounded">
								<Image src={m.url} alt="media" fill sizes="(max-width: 768px) 50vw, 33vw" className="object-cover" />
							</div>
							<div className="flex items-center gap-2">
								<form action={deleteMedia}>
									<input type="hidden" name="id" value={n.id} />
									<input type="hidden" name="mediaId" value={m.id} />
									<input type="hidden" name="url" value={m.url} />
									<button className="text-sm px-2 py-1 rounded border border-red-300 text-red-700">Sil</button>
								</form>
								<form action={replaceMedia} encType="multipart/form-data">
									<input type="hidden" name="id" value={n.id} />
									<input type="hidden" name="mediaId" value={m.id} />
									<input type="hidden" name="oldUrl" value={m.url} />
									<input type="file" name="file" accept="image/*" className="text-sm" />
									<button className="text-sm px-2 py-1 rounded border border-black/10 dark:border-white/10">Değiştir</button>
								</form>
							</div>
						</li>
					))}
				</ul>

				<div className="mt-4">
					<h3 className="font-semibold mb-2">Yeni Fotoğraf Ekle</h3>
					<form action={addGallery} encType="multipart/form-data" className="flex items-center gap-2">
						<input type="hidden" name="id" value={n.id} />
						<input type="file" name="gallery" accept="image/*" multiple className="text-sm" />
						<button className="text-sm px-3 py-2 rounded bg-blue-600 text-white">Ekle</button>
					</form>
				</div>
			</section>
		</div>
	);
}
