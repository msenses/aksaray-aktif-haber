import type { MetadataRoute } from "next";
import { fetchCategories } from "@/lib/categories";
import { supabase } from "@/lib/supabaseClient";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
	const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
	const categories = await fetchCategories();
	const { data: news } = await supabase
		.from("news")
		.select("slug,published_at")
		.eq("status", "published")
		.order("published_at", { ascending: false });

	const routes: MetadataRoute.Sitemap = [
		{ url: `${siteUrl}/`, lastModified: new Date() },
		{ url: `${siteUrl}/kategoriler`, lastModified: new Date() },
		{ url: `${siteUrl}/arama`, lastModified: new Date() },
		...categories.map((c) => ({ url: `${siteUrl}/kategori/${c.slug}`, lastModified: new Date() })),
		...(news || []).map((n) => ({ url: `${siteUrl}/haber/${n.slug}`, lastModified: n.published_at ? new Date(n.published_at) : new Date() })),
	];
	return routes;
}
