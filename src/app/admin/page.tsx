import { supabase } from "@/lib/supabaseClient";
import { slugify } from "@/lib/slugify";
import { fetchCategories } from "@/lib/categories";

export const dynamic = "force-dynamic";

async function getSession() {
	const { data } = await supabase.auth.getSession();
	return data.session;
}

async function insertNews(formData: FormData) {
	"use server";
	const title = String(formData.get("title") || "");
	const summary = String(formData.get("summary") || "");
	const content = String(formData.get("content") || "");
	const categoryId = String(formData.get("categoryId") || "");
	const status = String(formData.get("status") || "draft");
	const slug = slugify(title);

	const { error } = await supabase.from("news").insert({ title, slug, summary, content, category_id: categoryId || null, status, published_at: status === "published" ? new Date().toISOString() : null });
	if (error) {
		return { ok: false, message: error.message };
	}
	return { ok: true };
}

export default async function AdminPage() {
	const session = await getSession();
	const categories = await fetchCategories();

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
							<select name="status" className="w-full rounded border border-black/10 dark:border-white/10 px-3 py-2 bg-white/70 dark:bg-white/5">
								<option value="draft">Taslak</option>
								<option value="published">Yayınla</option>
							</select>
							<button className="px-3 py-2 rounded bg-blue-600 text-white">Kaydet</button>
						</form>
					</section>

					<section className="rounded border border-black/10 dark:border-white/10 p-4 bg-white/70 dark:bg-white/5">
						<h2 className="font-semibold mb-3">Son Haberler</h2>
						<p className="text-sm text-black/70 dark:text-white/70">Listeleme ve düzenleme bir sonraki iyileştirmede eklenecek.</p>
					</section>
				</div>
			)}
		</div>
	);
}
