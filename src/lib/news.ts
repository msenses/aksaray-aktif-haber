import { supabase } from "@/lib/supabaseClient";
import { fetchCategoryBySlug } from "@/lib/categories";

export type PublishedNews = {
	id: string;
	slug: string;
	title: string;
	summary: string | null;
	cover_image_url: string | null;
	published_at: string | null;
	views?: number | null;
};

export async function fetchPublishedNewsPage(page: number, pageSize: number) {
	const currentPage = Number.isFinite(page) && page > 0 ? page : 1;
	const limit = Number.isFinite(pageSize) && pageSize > 0 ? pageSize : 9;
	const from = (currentPage - 1) * limit;
	const to = from + limit - 1;

	const { data, count, error } = await supabase
		.from("news")
		.select("id,slug,title,summary,cover_image_url,published_at,views", { count: "exact" })
		.eq("status", "published")
		.order("published_at", { ascending: false, nullsFirst: false })
		.range(from, to);

	if (error) {
		throw new Error(error.message);
	}

	return {
		items: (data || []) as PublishedNews[],
		total: count || 0,
		page: currentPage,
		pageSize: limit,
	};
}

export type FullNews = {
	id: string;
	slug: string;
	title: string;
	summary: string | null;
	content: string;
	cover_image_url: string | null;
	published_at: string | null;
	created_at: string;
	views?: number | null;
};

export async function fetchNewsBySlug(slug: string) {
	const { data, error } = await supabase
		.from("news")
		.select("id,slug,title,summary,content,cover_image_url,published_at,created_at,views")
		.eq("slug", slug)
		.limit(1)
		.single();

	if (error) {
		if (error.code === "PGRST116") return null; // not found
		throw new Error(error.message);
	}
	return data as FullNews;
}

export async function fetchPublishedNewsByCategorySlug(slug: string, page: number, pageSize: number) {
	const category = await fetchCategoryBySlug(slug);
	if (!category) return { items: [] as PublishedNews[], total: 0, page: 1, pageSize };
	const currentPage = Number.isFinite(page) && page > 0 ? page : 1;
	const limit = Number.isFinite(pageSize) && pageSize > 0 ? pageSize : 9;
	const from = (currentPage - 1) * limit;
	const to = from + limit - 1;

	const { data, count, error } = await supabase
		.from("news")
		.select("id,slug,title,summary,cover_image_url,published_at,views", { count: "exact" })
		.eq("status", "published")
		.eq("category_id", category.id)
		.order("published_at", { ascending: false, nullsFirst: false })
		.range(from, to);

	if (error) throw new Error(error.message);
	return { items: (data || []) as PublishedNews[], total: count || 0, page: currentPage, pageSize: limit };
}

export async function searchPublishedNews(query: string, page: number, pageSize: number) {
	const q = (query || "").trim();
	if (!q) return { items: [] as PublishedNews[], total: 0, page: 1, pageSize };
	const currentPage = Number.isFinite(page) && page > 0 ? page : 1;
	const limit = Number.isFinite(pageSize) && pageSize > 0 ? pageSize : 9;
	const from = (currentPage - 1) * limit;
	const to = from + limit - 1;

	const { data, count, error } = await supabase
		.from("news")
		.select("id,slug,title,summary,cover_image_url,published_at,views", { count: "exact" })
		.eq("status", "published")
		.or(`title.ilike.%${q}%,summary.ilike.%${q}%`)
		.order("published_at", { ascending: false, nullsFirst: false })
		.range(from, to);

	if (error) throw new Error(error.message);
	return { items: (data || []) as PublishedNews[], total: count || 0, page: currentPage, pageSize: limit };
}

export async function fetchLatestPublishedNews(limit: number) {
	const take = Number.isFinite(limit) && limit > 0 ? limit : 10;
	const { data, error } = await supabase
		.from("news")
		.select("id,slug,title,summary,cover_image_url,published_at,views")
		.eq("status", "published")
		.order("published_at", { ascending: false, nullsFirst: false })
		.limit(take);
	if (error) throw new Error(error.message);
	return (data || []) as PublishedNews[];
}