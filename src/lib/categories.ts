import { supabase } from "@/lib/supabaseClient";

export type Category = {
	id: string;
	name: string;
	slug: string;
	description: string | null;
};

export async function fetchCategories() {
	const { data, error } = await supabase
		.from("categories")
		.select("id,name,slug,description")
		.order("name", { ascending: true });
	if (error) throw new Error(error.message);
	return (data || []) as Category[];
}

export async function fetchCategoryBySlug(slug: string) {
	const { data, error } = await supabase
		.from("categories")
		.select("id,name,slug,description")
		.eq("slug", slug)
		.limit(1)
		.single();
	if (error) {
		if (error.code === "PGRST116") return null;
		throw new Error(error.message);
	}
	return data as Category;
}
