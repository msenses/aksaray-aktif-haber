import { createSupabaseServerClient } from "@/lib/supabaseServer";
import { fetchCategories } from "@/lib/categories";
import { revalidatePath } from "next/cache";

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

	// Opsiyonel kapak yükleme
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

export default async function EditNewsPage({ params }: { params: { id: string } }) {
	const n = await fetchNews(params.id);
	const categories = await fetchCategories();
	if (!n) {
		return (
			<div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-10">
				<p>Haber bulunamadı.</p>
			</div>
		);
	}

	return (
		<div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-10 space-y-8">
			<h1 className="text-2xl font-bold">Haber Düzenle</h1>
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
		</div>
	);
}
