import { createSupabaseServerClient } from "@/lib/supabaseServer";
import { deleteAdSlotAction } from "../actions";

export const dynamic = "force-dynamic";
export const revalidate = 0;

type AdSlotRow = {
	id: string;
	key: string;
	title: string;
	html: string | null;
	image_url: string | null;
	link_url: string | null;
	is_active: boolean;
};

export default async function AdminAdsPage({ searchParams }: { searchParams?: { edit?: string; ok?: string; error?: string } }) {
	const supabase = await createSupabaseServerClient();
	const sp = searchParams || {};
	const editId = sp.edit || "";
	const { data: slots } = await supabase
		.from("ad_slots")
		.select("id, key, title, html, image_url, link_url, is_active, updated_at")
		.order("updated_at", { ascending: false });

	let editing: AdSlotRow | null = null;
	if (editId) {
		const { data } = await supabase
			.from("ad_slots")
			.select("id, key, title, html, image_url, link_url, is_active")
			.eq("id", editId)
			.maybeSingle();
		editing = (data as AdSlotRow) || null;
	}

	return (
		<div className="space-y-6">
			<h1 className="text-xl font-semibold">Reklam Yönetimi</h1>
			{sp.ok && (
				<div className="rounded border border-green-600 text-green-700 dark:text-green-400 px-3 py-2 bg-green-50 dark:bg-green-900/20">Kaydedildi.</div>
			)}
			{sp.error && (
				<div className="rounded border border-red-600 text-red-700 dark:text-red-400 px-3 py-2 bg-red-50 dark:bg-red-900/20">Hata: {sp.error}</div>
			)}
			<section className="rounded-2xl border border-black/10 dark:border-white/10 p-4 bg-white/70 dark:bg-white/5">
				<h2 className="text-base font-medium mb-3">Yeni / Düzenle</h2>
				<form action="/admin/ads/submit" method="post" encType="multipart/form-data" className="grid gap-3 grid-cols-1 md:grid-cols-2">
					<input type="hidden" name="id" defaultValue={editing?.id || ""} />
					<label className="text-sm">Reklam Alanı
						<select name="key" required defaultValue={editing?.key || "ana_reklam_alani"} className="mt-1 w-full rounded border border-black/10 bg-transparent px-3 py-2">
							<option value="ana_reklam_alani">ana_reklam_alani</option>
							<option value="toplu_reklamlar">toplu_reklamlar</option>
						</select>
					</label>
					<label className="text-sm">Başlık
						<input name="title" required defaultValue={editing?.title || ""} className="mt-1 w-full rounded border border-black/10 bg-transparent px-3 py-2" placeholder="Başlık" />
					</label>
					<label className="text-sm md:col-span-2">HTML (opsiyonel)
						<textarea name="html" rows={4} defaultValue={editing?.html || ""} className="mt-1 w-full rounded border border-black/10 bg-transparent px-3 py-2" placeholder="<iframe ...></iframe>"></textarea>
					</label>
					<label className="text-sm">Görsel URL (opsiyonel)
						<input name="image_url" defaultValue={editing?.image_url || ""} className="mt-1 w-full rounded border border-black/10 bg-transparent px-3 py-2" placeholder="https://...png" />
					</label>
					<label className="text-sm">Görsel Dosyası (opsiyonel)
						<input name="image_file" type="file" accept="image/*" className="mt-1 w-full rounded border border-black/10 bg-transparent px-3 py-2" />
						<span className="mt-1 block text-xs text-black/60 dark:text-white/60">Yüklerseniz URL otomatik doldurulur.</span>
					</label>
					<label className="text-sm">Link URL (opsiyonel)
						<input name="link_url" defaultValue={editing?.link_url || ""} className="mt-1 w-full rounded border border-black/10 bg-transparent px-3 py-2" placeholder="https://..." />
					</label>
					<label className="text-sm flex items-center gap-2">
						<input type="checkbox" name="is_active" defaultChecked={editing ? editing.is_active : true} className="size-4" /> Aktif
					</label>
					<div className="md:col-span-2 flex items-center gap-3">
						<button className="px-4 py-2 rounded bg-blue-600 text-white">{editing ? "Güncelle" : "Kaydet"}</button>
						{editing && (
							<a href="/admin/ads" className="text-sm underline">Yeni kayıt</a>
						)}
					</div>
				</form>
			</section>

			<section className="rounded-2xl border border-black/10 dark:border-white/10 p-4 bg-white/70 dark:bg-white/5">
				<h2 className="text-base font-medium mb-3">Kayıtlı Alanlar</h2>
				<div className="overflow-x-auto">
					<table className="min-w-full text-sm">
						<thead>
							<tr className="text-left">
								<th className="py-2 pr-4">Key</th>
								<th className="py-2 pr-4">Başlık</th>
								<th className="py-2 pr-4">Aktif</th>
								<th className="py-2 pr-4">İşlemler</th>
							</tr>
						</thead>
						<tbody>
							{(slots || []).map((r) => (
								<tr key={r.id} className="border-t border-black/10">
									<td className="py-2 pr-4 font-mono">{r.key}</td>
									<td className="py-2 pr-4">{r.title}</td>
									<td className="py-2 pr-4">{r.is_active ? "Evet" : "Hayır"}</td>
									<td className="py-2 pr-4 flex gap-2">
										<a href={`/admin/ads?edit=${r.id}`} className="px-3 py-1 rounded border border-blue-600 text-blue-600">Düzenle</a>
										<form action={deleteAdSlotAction}>
											<input type="hidden" name="id" value={r.id} />
											<button className="px-3 py-1 rounded border border-red-600 text-red-600">Sil</button>
										</form>
									</td>
								</tr>
							))}
						</tbody>
					</table>
				</div>
			</section>
		</div>
	);
}


