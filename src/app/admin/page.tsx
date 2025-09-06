import { supabase } from "@/lib/supabaseClient";
import { slugify } from "@/lib/slugify";
import { fetchCategories } from "@/lib/categories";
import { revalidatePath } from "next/cache";
import { uploadPublicFile } from "@/lib/storage";

export const dynamic = "force-dynamic";

async function getSession() {
	const { data } = await supabase.auth.getSession();
	return data.session;
}

async function insertNews(formData: FormData): Promise<void> {
	"use server";
	const title = String(formData.get("title") || "");
	const summary = String(formData.get("summary") || "");
	const content = String(formData.get("content") || "");
	const categoryId = String(formData.get("categoryId") || "");
	const status = String(formData.get("status") || "draft");
	const coverImageUrl = String(formData.get("coverImageUrl") || "");
	const slug = slugify(title);

	const { error } = await supabase.from("news").insert({ title, slug, summary, content, category_id: categoryId || null, status, cover_image_url: coverImageUrl || null, published_at: status === "published" ? new Date().toISOString() : null });
	if (error) {
		throw new Error(error.message);
	}
	revalidatePath("/admin");
}

async function setStatus(id: string, status: "draft" | "published"): Promise<void> {
	"use server";
	const { error } = await supabase
		.from("news")
		.update({ status, published_at: status === "published" ? new Date().toISOString() : null })
		.eq("id", id);
	if (error) throw new Error(error.message);
	revalidatePath("/admin");
}

async function deleteNews(id: string): Promise<void> {
	"use server";
	const { error } = await supabase.from("news").delete().eq("id", id);
	if (error) throw new Error(error.message);
	revalidatePath("/admin");
}

async function fetchLatestNews() {
	const { data, error } = await supabase
		.from("news")
		.select("id,title,slug,status,created_at,published_at")
		.order("created_at", { ascending: false })
		.limit(20);
	if (error) throw new Error(error.message);
	return data || [];
}

export default async function AdminPage() {
	const session = await getSession();
	const categories = await fetchCategories();
	const latest = session ? await fetchLatestNews() : [];

	return (
		<div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-10 space-y-8">
			<h1 className="text-2xl font-bold">Yönetim Paneli</h1>

			{!session && (
				<div className="rounded border border-black/10 dark:border-white/10 p-4">
					<p className="mb-3">Yönetim işlemleri için giriş yapın.</p>
					<a className="px-3 py-2 rounded bg-blue-600 text-white" href="/login">Giriş Sayfası</a>
				</div>
			)}

			{session && (
				<div className="grid gap-8 md:grid-cols-2">
					<section className="rounded border border-black/10 dark:border-white/10 p-4 bg-white/70 dark:bg-white/5">
						<h2 className="font-semibold mb-3">Yeni Haber Ekle</h2>
						<form action={insertNews} className="space-y-3">
							<input name="title" placeholder="Başlık" className="w-full rounded border border-black/10 dark:border-white/10 px-3 py-2 bg-white/70 dark:bg-white/5" required />
							<textarea name="summary" placeholder="Özet" className="w-full rounded border border-black/10 dark:border-white/10 px-3 py-2 bg-white/70 dark:bg-white/5" />
							<textarea name="content" placeholder="İçerik" className="w-full h-32 rounded border border-black/10 dark:border-white/10 px-3 py-2 bg-white/70 dark:bg-white/5" required />
							<select name="categoryId" className="w-full rounded border border-black/10 dark:border-white/10 px-3 py-2 bg-white/70 dark:bg-white/5">
								<option value="">Kategori seç (opsiyonel)</option>
								{categories.map((c) => (
									<option key={c.id} value={c.id}>{c.name}</option>
								))}
							</select>
							<div className="space-y-2">
								<label className="text-sm">Kapak görseli (URL):</label>
								<input name="coverImageUrl" placeholder="https://..." className="w-full rounded border border-black/10 dark:border-white/10 px-3 py-2 bg-white/70 dark:bg-white/5" />
							</div>
							<select name="status" className="w-full rounded border border-black/10 dark:border-white/10 px-3 py-2 bg-white/70 dark:bg-white/5">
								<option value="draft">Taslak</option>
								<option value="published">Yayınla</option>
							</select>
							<button className="px-3 py-2 rounded bg-blue-600 text-white">Kaydet</button>
						</form>
					</section>

					<section className="rounded border border-black/10 dark:border-white/10 p-4 bg-white/70 dark:bg-white/5">
						<h2 className="font-semibold mb-3">Son Haberler</h2>
						<ul className="divide-y divide-black/10 dark:divide-white/10">
							{latest.map((n: any) => (
								<li key={n.id} className="py-3 flex items-center justify-between gap-3">
									<div className="min-w-0">
										<p className="font-medium truncate">{n.title}</p>
										<p className="text-xs text-black/60 dark:text-white/60">Durum: {n.status} {n.published_at ? `— ${new Date(n.published_at).toLocaleDateString('tr-TR')}` : ''}</p>
									</div>
									<div className="flex items-center gap-2">
										<form action={async () => setStatus(n.id, n.status === 'published' ? 'draft' : 'published')}>
											<button className="px-2 py-1 rounded border border-black/10 dark:border-white/10">{n.status === 'published' ? 'Taslağa Al' : 'Yayınla'}</button>
										</form>
										<form action={async () => deleteNews(n.id)}>
											<button className="px-2 py-1 rounded border border-red-300 text-red-700">Sil</button>
										</form>
									</div>
								</li>
							))}
						</ul>
					</section>
				</div>
			)}
		</div>
	);
}
