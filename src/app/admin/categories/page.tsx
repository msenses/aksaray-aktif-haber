import { createSupabaseServerClient } from "@/lib/supabaseServer";
import { revalidatePath } from "next/cache";

export const dynamic = "force-dynamic";

type Category = { id: string; name: string; slug: string; description: string | null };

async function fetchCategories(): Promise<Category[]> {
	const supabase = await createSupabaseServerClient();
	const { data, error } = await supabase
		.from("categories")
		.select("id,name,slug,description")
		.order("name", { ascending: true });
	if (error) throw new Error(error.message);
	return (data || []) as Category[];
}

async function addCategory(formData: FormData) {
	"use server";
	const supabase = await createSupabaseServerClient();
	const name = String(formData.get("name") || "").trim();
	const slug = String(formData.get("slug") || "").trim();
	const description = String(formData.get("description") || "").trim() || null;
	if (!name || !slug) return;
	await supabase.from("categories").insert({ name, slug, description });
	revalidatePath("/admin/categories");
}

async function updateCategory(formData: FormData) {
	"use server";
	const supabase = await createSupabaseServerClient();
	const id = String(formData.get("id") || "");
	const name = String(formData.get("name") || "").trim();
	const slug = String(formData.get("slug") || "").trim();
	const description = String(formData.get("description") || "").trim() || null;
	if (!id) return;
	await supabase.from("categories").update({ name, slug, description }).eq("id", id);
	revalidatePath("/admin/categories");
}

async function deleteCategory(formData: FormData) {
	"use server";
	const supabase = await createSupabaseServerClient();
	const id = String(formData.get("id") || "");
	if (!id) return;
	await supabase.from("categories").delete().eq("id", id);
	revalidatePath("/admin/categories");
}

export default async function CategoriesAdminPage() {
	const categories = await fetchCategories();
	return (
		<div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-10 space-y-8">
			<h1 className="text-2xl font-bold">Kategoriler</h1>

			<section className="rounded border border-black/10 dark:border-white/10 p-4 bg-white/70 dark:bg-white/5">
				<h2 className="font-semibold mb-3">Yeni Kategori Ekle</h2>
				<form action={addCategory} className="grid gap-2 sm:grid-cols-3">
					<input name="name" placeholder="Ad" className="rounded border border-black/10 dark:border-white/10 px-3 py-2 bg-white/70 dark:bg-white/5" required />
					<input name="slug" placeholder="Slug (gundem)" className="rounded border border-black/10 dark:border-white/10 px-3 py-2 bg-white/70 dark:bg-white/5" required />
					<input name="description" placeholder="Açıklama (opsiyonel)" className="rounded border border-black/10 dark:border-white/10 px-3 py-2 bg-white/70 dark:bg-white/5" />
					<div className="sm:col-span-3">
						<button className="px-3 py-2 rounded bg-blue-600 text-white">Ekle</button>
					</div>
				</form>
			</section>

			<section className="rounded border border-black/10 dark:border-white/10 p-4 bg-white/70 dark:bg-white/5">
				<h2 className="font-semibold mb-3">Kategoriler</h2>
				<ul className="divide-y divide-black/10 dark:divide-white/10">
					{categories.length === 0 && <li className="py-3 text-sm text-black/60 dark:text-white/60">Kategori yok.</li>}
					{categories.map((c) => (
						<li key={c.id} className="py-3 flex flex-col gap-2">
							<form action={updateCategory} className="grid gap-2 sm:grid-cols-3">
								<input type="hidden" name="id" value={c.id} />
								<input name="name" defaultValue={c.name} className="rounded border border-black/10 dark:border-white/10 px-3 py-2 bg-white/70 dark:bg-white/5" />
								<input name="slug" defaultValue={c.slug} className="rounded border border-black/10 dark:border-white/10 px-3 py-2 bg-white/70 dark:bg-white/5" />
								<input name="description" defaultValue={c.description || ""} className="rounded border border-black/10 dark:border-white/10 px-3 py-2 bg-white/70 dark:bg-white/5" />
								<div className="flex items-center gap-2 sm:col-span-3">
									<button className="px-3 py-2 rounded border border-black/10 dark:border-white/10">Kaydet</button>
								</div>
							</form>
							<form action={deleteCategory}>
								<input type="hidden" name="id" value={c.id} />
								<button className="text-red-700 text-sm underline underline-offset-4">Sil</button>
							</form>
						</li>
					))}
				</ul>
			</section>
		</div>
	);
}
