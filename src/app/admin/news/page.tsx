import { createSupabaseServerClient } from "@/lib/supabaseServer";
import { headers } from "next/headers";

export const dynamic = "force-dynamic";

type Row = {
  id: string;
  title: string;
  slug: string;
  status: "draft" | "published";
  category_id: string | null;
  published_at: string | null;
  created_at: string;
  views: number | null;
};

async function fetchAllNews(status?: "draft" | "published"): Promise<Row[]> {
  const supabase = await createSupabaseServerClient();
  let query = supabase
    .from("news")
    .select("id,title,slug,status,category_id,published_at,created_at,views")
    .order("created_at", { ascending: false });
  if (status) query = query.eq("status", status);
  const { data } = await query;
  return (data || []) as Row[];
}

export default async function AdminNewsListPage() {
  const h = await headers();
  const url = h.get("next-url") || "";
  const statusParam = /[?&]status=(draft|published)/.exec(url || "")?.[1] as "draft" | "published" | undefined;
  const items = await fetchAllNews(statusParam);
  return (
    <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-10">
      <h1 className="text-2xl font-bold mb-6">Haberler {statusParam ? `— ${statusParam === "published" ? "Yayınlananlar" : "Taslaklar"}` : ""}</h1>

      {items.length === 0 ? (
        <p className="text-sm text-black/60 dark:text-white/60">Henüz haber eklenmemiş.</p>
      ) : (
        <div className="overflow-auto rounded border border-black/10 dark:border-white/10 bg-white/70 dark:bg-white/5">
          <table className="min-w-full text-sm">
            <thead className="bg-black/5 dark:bg-white/10">
              <tr>
                <th className="text-left px-3 py-2">Başlık</th>
                <th className="text-left px-3 py-2">Durum</th>
                <th className="text-left px-3 py-2">Görüntülenme</th>
                <th className="text-left px-3 py-2">Yayın Tarihi</th>
                <th className="text-left px-3 py-2">Oluşturma</th>
                <th className="text-left px-3 py-2">İşlem</th>
              </tr>
            </thead>
            <tbody>
              {items.map((n) => (
                <tr key={n.id} className="border-t border-black/5 dark:border-white/10">
                  <td className="px-3 py-2 font-medium">{n.title}</td>
                  <td className="px-3 py-2">
                    <span className={`px-2 py-1 rounded text-xs ${n.status === "published" ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"}`}>
                      {n.status === "published" ? "Yayınlandı" : "Taslak"}
                    </span>
                  </td>
                  <td className="px-3 py-2">{typeof n.views === "number" ? n.views : 0}</td>
                  <td className="px-3 py-2">{n.published_at ? new Date(n.published_at).toLocaleString("tr-TR") : "-"}</td>
                  <td className="px-3 py-2">{new Date(n.created_at).toLocaleString("tr-TR")}</td>
                  <td className="px-3 py-2">
                    <a href={`/admin/news/${n.id}`} className="px-2 py-1 rounded border border-black/10 dark:border-white/10">Düzenle</a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}


