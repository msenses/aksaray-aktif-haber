import { supabase } from "./supabaseClient";

export type AdSlotRecord = {
	id: string;
	key: string;
	title: string;
	html: string | null;
	image_url: string | null;
	link_url: string | null;
	is_active: boolean;
};

export async function fetchAdSlotByKey(slotKey: string): Promise<AdSlotRecord | null> {
	const { data, error } = await supabase
		.from("ad_slots")
		.select("id,key,title,html,image_url,link_url,is_active")
		.eq("key", slotKey)
		.eq("is_active", true)
		.limit(1)
		.maybeSingle();
	if (error) return null;
	return (data as AdSlotRecord) || null;
}


