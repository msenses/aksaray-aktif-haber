import { createSupabaseServerClient } from "@/lib/supabaseServer";
import { upsertAdSlotAction, deleteAdSlotAction } from "../actions";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function AdminAdsPage() {
	const supabase = await createSupabaseServerClient();
	const { data: slots } = await supabase
		.from("ad_slots")
		.select("id, key, title, html, image_url, link_url, is_active, updated_at")
		.order("updated_at", { ascending: false });

	return (
		<div className="space-y-6">
			<h1 className="text-xl font-semibold">Reklam Yönetimi</h1>
			<section className="rounded-2xl border border-black/10 dark:border-white/10 p-4 bg-white/70 dark:bg-white/5">
				<h2 className="text-base font-medium mb-3">Yeni / Düzenle</h2>
				<form action={upsertAdSlotAction} className="grid gap-3 grid-cols-1 md:grid-cols-2">
					<input type="hidden" name="id" />
					<label className="text-sm">Key
						<input name="key" required className="mt-1 w-full rounded border border-black/10 bg-transparent px-3 py-2" placeholder="header_top" />
					</label>
					<label className="text-sm">Başlık
						<input name="title" required className="mt-1 w-full rounded border border-black/10 bg-transparent px-3 py-2" placeholder="Başlık" />
					</label>
					<label className="text-sm md:col-span-2">HTML (opsiyonel)
						<textarea name="html" rows={4} className="mt-1 w-full rounded border border-black/10 bg-transparent px-3 py-2" placeholder="<iframe ...></iframe>"></textarea>
					</label>
					<label className="text-sm">Görsel URL (opsiyonel)
						<input name="image_url" className="mt-1 w-full rounded border border-black/10 bg-transparent px-3 py-2" placeholder="https://...png" />
					</label>
					<label className="text-sm">Link URL (opsiyonel)
						<input name="link_url" className="mt-1 w-full rounded border border-black/10 bg-transparent px-3 py-2" placeholder="https://..." />
					</label>
					<label className="text-sm flex items-center gap-2">
						<input type="checkbox" name="is_active" defaultChecked className="size-4" /> Aktif
					</label>
					<div className="md:col-span-2">
						<button className="px-4 py-2 rounded bg-blue-600 text-white">Kaydet</button>
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


