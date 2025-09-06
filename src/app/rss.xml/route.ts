import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabaseClient";

export const dynamic = "force-dynamic";

export async function GET() {
	const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
	const siteTitle = "AKSARAY AKTİF HABER";
	const { data } = await supabase
		.from("news")
		.select("title,slug,summary,published_at")
		.eq("status", "published")
		.order("published_at", { ascending: false })
		.limit(50);

	const items = (data || []).map((n) => `
		<item>
			<title><![CDATA[${n.title}]]></title>
			<link>${siteUrl}/haber/${n.slug}</link>
			<guid>${siteUrl}/haber/${n.slug}</guid>
			<pubDate>${n.published_at ? new Date(n.published_at).toUTCString() : new Date().toUTCString()}</pubDate>
			<description><![CDATA[${n.summary || ""}]]></description>
		</item>
	`).join("");

	const xml = `<?xml version="1.0" encoding="UTF-8" ?>
		<rss version="2.0">
			<channel>
				<title>${siteTitle}</title>
				<link>${siteUrl}</link>
				<description>Aksaray'dan en güncel, doğru ve tarafsız haberler</description>
				${items}
			</channel>
		</rss>`;

	return new NextResponse(xml, { headers: { "Content-Type": "application/rss+xml; charset=utf-8" } });
}
