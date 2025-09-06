import { fetchCategories } from "@/lib/categories";
import { createSupabaseServerClient } from "@/lib/supabaseServer";
import { insertNewsAction, updateStatusAction, deleteNewsAction } from "./actions";

export const dynamic = "force-dynamic";

type LatestItem = {
	id: string;
	title: string;
	slug: string;
	status: "draft" | "published";
	created_at: string;
	published_at: string | null;
};

async function fetchLatestNews(limit = 5) {
	const supabase = await createSupabaseServerClient();
	const { data, error } = await supabase
		.from("news")
		.select("id,title,slug,status,created_at,published_at")
		.order("created_at", { ascending: false })
		.limit(limit);
	if (error) throw new Error(error.message);
	return (data || []) as LatestItem[];
}

async function fetchStats() {
	const supabase = await createSupabaseServerClient();
	const [totalRes, pubRes, draftRes, pendingCommentsRes] = await Promise.all([
		supabase.from("news").select("id", { count: "exact", head: true }),
		supabase.from("news").select("id", { count: "exact", head: true }).eq("status", "published"),
		supabase.from("news").select("id", { count: "exact", head: true }).eq("status", "draft"),
		supabase.from("comments").select("id", { count: "exact", head: true }).eq("is_approved", false),
	]);
	return {
		total: totalRes.count || 0,
		published: pubRes.count || 0,
		draft: draftRes.count || 0,
		pendingComments: pendingCommentsRes.count || 0,
	};
}

export default async function AdminPage({ searchParams }: { searchParams?: { view?: string; error?: string; ok?: string } }) {
	const supabase = await createSupabaseServerClient();
	const { data: sess } = await supabase.auth.getSession();
	const session = sess.session;
	const view = searchParams?.view || "dashboard";
	const categories = await fetchCategories();
	const latest = session ? await fetchLatestNews(5) : [];
	const stats = session ? await fetchStats() : { total: 0, published: 0, draft: 0, pendingComments: 0 };
	const errorMsg = searchParams?.error ? decodeURIComponent(searchParams.error) : "";
	const okMsg = searchParams?.ok ? "Kayıt başarıyla eklendi." : "";

	return (
		<div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-10 space-y-8">
			<h1 className="text-2xl font-bold">Yönetim Paneli</h1>

			{!session && (
				<div className="rounded border border-black/10 dark:border-white/10 p-4">
					<p className="mb-3">Yönetim işlemleri için giriş yapın.</p>
					<a className="px-3 py-2 rounded bg-blue-600 text-white" href="/admin/login">Giriş Sayfası</a>
				</div>
			)}

			{session && view === "dashboard" && (
				<>
					{(errorMsg || okMsg) && (
						<div className={`rounded p-3 text-sm ${errorMsg ? "bg-red-50 text-red-700" : "bg-green-50 text-green-700"}`}>
							{errorMsg || okMsg}
						</div>
					)}

					<div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
						<div className="rounded-lg border border-black/10 dark:border-white/10 p-4 bg-white/70 dark:bg-white/5">
							<p className="text-xs text-black/60 dark:text-white/60">Toplam Haber</p>
							<p className="text-2xl font-semibold">{stats.total}</p>
						</div>
						<div className="rounded-lg border border-black/10 dark:border-white/10 p-4 bg-white/70 dark:bg-white/5">
							<p className="text-xs text-black/60 dark:text-white/60">Yayında</p>
							<p className="text-2xl font-semibold">{stats.published}</p>
						</div>
						<div className="rounded-lg border border-black/10 dark:border-white/10 p-4 bg-white/70 dark:bg-white/5">
							<p className="text-xs text-black/60 dark:text-white/60">Taslak</p>
							<p className="text-2xl font-semibold">{stats.draft}</p>
						</div>
						<div className="rounded-lg border border-black/10 dark:border-white/10 p-4 bg-white/70 dark:bg-white/5">
							<p className="text-xs text-black/60 dark:text-white/60">Bekleyen Yorum</p>
							<p className="text-2xl font-semibold">{stats.pendingComments}</p>
						</div>
					</div>

					<div className="grid gap-8 md:grid-cols-2">
						<section className="rounded border border-black/10 dark:border-white/10 p-4 bg-white/70 dark:bg-white/5">
							<h2 className="font-semibold mb-3">Son Eklenen Haberler</h2>
							<ul className="divide-y divide-black/10 dark:divide-white/10">
								{latest.length === 0 && <li className="py-3 text-sm text-black/60 dark:text-white/60">Henüz haber yok.</li>}
								{latest.map((n) => (
									<li key={n.id} className="py-3 flex items-center justify-between gap-3">
										<div className="min-w-0">
											<p className="font-medium truncate">{n.title}</p>
											<p className="text-xs text-black/60 dark:text-white/60">Durum: {n.status} {n.published_at ? `— ${new Date(n.published_at).toLocaleDateString('tr-TR')}` : ''}</p>
										</div>
										<div className="flex items-center gap-2">
											<a className="px-2 py-1 rounded border border-black/10 dark:border-white/10" href={`/haber/${n.slug}`} target="_blank">Görüntüle</a>
											<a className="px-2 py-1 rounded border border-black/10 dark:border-white/10" href={`/admin/news/${n.id}`}>Düzenle</a>
										</div>
									</li>
								))}
							</ul>
						</section>

						<section className="rounded border border-black/10 dark:border-white/10 p-4 bg-white/70 dark:bg-white/5">
							<h2 className="font-semibold mb-3">Hızlı İşlemler</h2>
							<div className="flex flex-wrap gap-2">
								<a className="px-3 py-2 rounded bg-blue-600 text-white" href="/admin?view=compose">Yeni Haber Ekle</a>
								<a className="px-3 py-2 rounded border border-black/10 dark:border-white/10" href="/admin/categories">Kategorileri Yönet</a>
							</div>
						</section>
					</div>
				</>
			)}

			{session && view === "compose" && (
				<div className="grid gap-8 md:grid-cols-2">
					<section className="rounded border border-black/10 dark:border-white/10 p-4 bg-white/70 dark:bg-white/5">
						<h2 className="font-semibold mb-3">Yeni Haber Ekle</h2>
						<form action={insertNewsAction} className="space-y-3" encType="multipart/form-data">
							<input name="title" placeholder="Başlık" className="w-full rounded border border-black/10 dark:border-white/10 px-3 py-2 bg-white/70 dark:bg-white/5" required />
							<textarea name="summary" placeholder="Özet" className="w-full h-24 rounded border border-black/10 dark:border-white/10 px-3 py-2 bg-white/70 dark:bg-white/5" />
							<textarea name="content" placeholder="Detaylı İçerik" className="w-full h-48 rounded border border-black/10 dark:border-white/10 px-3 py-2 bg-white/70 dark:bg-white/5" required />
							<select name="categoryId" className="w-full rounded border border-black/10 dark:border-white/10 px-3 py-2 bg-white/70 dark:bg-white/5">
								<option value="">Kategori seç (opsiyonel)</option>
								{categories.map((c) => (
									<option key={c.id} value={c.id}>{c.name}</option>
								))}
							</select>
							<div className="space-y-2">
								<label className="text-sm font-medium">Kapak Fotoğrafı</label>
								<input type="file" name="cover" accept="image/*" className="block w-full text-sm" />
							</div>
							<div className="space-y-2">
								<label className="text-sm font-medium">Galeri Fotoğrafları</label>
								<input type="file" name="gallery" accept="image/*" multiple className="block w-full text-sm" />
							</div>
							<select name="status" className="w-full rounded border border-black/10 dark:border-white/10 px-3 py-2 bg-white/70 dark:bg-white/5">
								<option value="draft">Taslak</option>
								<option value="published">Yayınla</option>
							</select>
							<div className="flex items-center gap-2">
								<button className="px-3 py-2 rounded bg-blue-600 text-white">Kaydet</button>
								<a className="px-3 py-2 rounded border border-black/10 dark:border-white/10" href="/admin">Vazgeç</a>
							</div>
						</form>
					</section>

					<section className="rounded border border-black/10 dark:border-white/10 p-4 bg-white/70 dark:bg-white/5">
						<h2 className="font-semibold mb-3">Son Haberler</h2>
						<ul className="divide-y divide-black/10 dark:divide-white/10">
							{latest.map((n) => (
								<li key={n.id} className="py-3 flex items-center justify-between gap-3">
									<div className="min-w-0">
										<p className="font-medium truncate">{n.title}</p>
										<p className="text-xs text-black/60 dark:text-white/60">Durum: {n.status}</p>
									</div>
									<div className="flex items-center gap-2">
										<form action={updateStatusAction}>
											<input type="hidden" name="id" value={n.id} />
											<input type="hidden" name="status" value={n.status === 'published' ? 'draft' : 'published'} />
											<button className="px-2 py-1 rounded border border-black/10 dark:border-white/10">{n.status === 'published' ? 'Taslağa Al' : 'Yayınla'}</button>
										</form>
										<form action={deleteNewsAction}>
											<input type="hidden" name="id" value={n.id} />
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
