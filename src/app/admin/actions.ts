"use server";

import { revalidatePath } from "next/cache";
import { createSupabaseServerClient } from "@/lib/supabaseServer";
import { slugify } from "@/lib/slugify";

export async function insertNewsAction(formData: FormData): Promise<void> {
	const supabase = await createSupabaseServerClient();
	const title = String(formData.get("title") || "");
	const summary = String(formData.get("summary") || "");
	const content = String(formData.get("content") || "");
	const categoryId = String(formData.get("categoryId") || "");
	const status = String(formData.get("status") || "draft");
	const coverImageUrl = String(formData.get("coverImageUrl") || "");
	const slug = slugify(title);

	const { error } = await supabase.from("news").insert({ title, slug, summary, content, category_id: categoryId || null, status, cover_image_url: coverImageUrl || null, published_at: status === "published" ? new Date().toISOString() : null });
	if (error) throw new Error(error.message);
	revalidatePath("/admin");
}

export async function updateStatusAction(formData: FormData): Promise<void> {
	const supabase = await createSupabaseServerClient();
	const id = String(formData.get("id") || "");
	const status = (String(formData.get("status") || "draft") as "draft" | "published");
	const { error } = await supabase
		.from("news")
		.update({ status, published_at: status === "published" ? new Date().toISOString() : null })
		.eq("id", id);
	if (error) throw new Error(error.message);
	revalidatePath("/admin");
}

export async function deleteNewsAction(formData: FormData): Promise<void> {
	const supabase = await createSupabaseServerClient();
	const id = String(formData.get("id") || "");
	const { error } = await supabase.from("news").delete().eq("id", id);
	if (error) throw new Error(error.message);
	revalidatePath("/admin");
}
