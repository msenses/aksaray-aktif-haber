import { createSupabaseServerClient } from "@/lib/supabaseServer";
import { headers } from "next/headers";
import { revalidatePath } from "next/cache";

export const dynamic = "force-dynamic";

type CommentItem = { id: string; news_id: string; author_name: string | null; content: string; is_approved: boolean; created_at: string };

async function fetchData() {
	const supabase = await createSupabaseServerClient();
	const [pendingRes, approvedRes] = await Promise.all([
		supabase.from("comments").select("id,news_id,author_name,content,is_approved,created_at").eq("is_approved", false).order("created_at", { ascending: false }).limit(50),
		supabase.from("comments").select("id,news_id,author_name,content,is_approved,created_at").eq("is_approved", true).order("created_at", { ascending: false }).limit(50),
	]);
	return { pending: (pendingRes.data || []) as CommentItem[], approved: (approvedRes.data || []) as CommentItem[] };
}

async function approveComment(formData: FormData) {
	"use server";
	const supabase = await createSupabaseServerClient();
	const id = String(formData.get("id") || "");
	await supabase.from("comments").update({ is_approved: true }).eq("id", id);
	revalidatePath("/admin/comments");
}

async function deleteComment(formData: FormData) {
	"use server";
	const supabase = await createSupabaseServerClient();
	const id = String(formData.get("id") || "");
	await supabase.from("comments").delete().eq("id", id);
	revalidatePath("/admin/comments");
}

export default async function CommentsAdminPage() {
	const h = await headers();
	const url = h.get("next-url") || "";
	const showPending = /[?&]tab=pending/.test(url || "");
	const { pending, approved } = await fetchData();
	return (
		<div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-10 space-y-8">
			<h1 className="text-2xl font-bold">Yorumlar</h1>
			<section className="rounded border border-black/10 dark:border-white/10 p-4 bg-white/70 dark:bg-white/5">
				<h2 className="font-semibold mb-3">Onay Bekleyen</h2>
				<ul className="divide-y divide-black/10 dark:divide-white/10">
					{!showPending && <li className="py-3 text-sm text-black/60 dark:text-white/60">Sadece bekleyenleri görmek için adres çubuğuna <code>?tab=pending</code> ekleyin.</li>}
					{showPending && pending.length === 0 && <li className="py-3 text-sm text-black/60 dark:text-white/60">Bekleyen yorum yok.</li>}
					{showPending && pending.map((c) => (
						<li key={c.id} className="py-3 flex items-start justify-between gap-3">
							<div className="min-w-0">
								<p className="text-sm font-medium">{c.author_name || "Ziyaretçi"}</p>
								<p className="text-sm">{c.content}</p>
								<p className="text-[11px] text-black/60 dark:text-white/60 mt-1">{new Date(c.created_at).toLocaleString("tr-TR")} — Haber ID: {c.news_id}</p>
							</div>
							<div className="flex items-center gap-2 shrink-0">
								<form action={approveComment}><input type="hidden" name="id" value={c.id} /><button className="text-sm px-2 py-1 rounded border border-black/10 dark:border-white/10">Onayla</button></form>
								<form action={deleteComment}><input type="hidden" name="id" value={c.id} /><button className="text-sm px-2 py-1 rounded border border-red-300 text-red-700">Sil</button></form>
							</div>
						</li>
					))}
				</ul>
			</section>
			<section className="rounded border border-black/10 dark:border-white/10 p-4 bg-white/70 dark:bg-white/5">
				<h2 className="font-semibold mb-3">Son Onaylananlar</h2>
				<ul className="divide-y divide-black/10 dark:divide-white/10">
					{approved.length === 0 && <li className="py-3 text-sm text-black/60 dark:text-white/60">Onaylı yorum yok.</li>}
					{approved.map((c) => (
						<li key={c.id} className="py-3 flex items-start justify-between gap-3">
							<div className="min-w-0">
								<p className="text-sm font-medium">{c.author_name || "Ziyaretçi"}</p>
								<p className="text-sm">{c.content}</p>
								<p className="text-[11px] text-black/60 dark:text-white/60 mt-1">{new Date(c.created_at).toLocaleString("tr-TR")} — Haber ID: {c.news_id}</p>
							</div>
							<div className="flex items-center gap-2 shrink-0">
								<form action={deleteComment}><input type="hidden" name="id" value={c.id} /><button className="text-sm px-2 py-1 rounded border border-red-300 text-red-700">Sil</button></form>
							</div>
						</li>
					))}
				</ul>
			</section>
		</div>
	);
}
