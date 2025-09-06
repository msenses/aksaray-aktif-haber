import { supabase } from "@/lib/supabaseClient";

export async function uploadPublicFile(bucket: string, path: string, file: File) {
	const { error } = await supabase.storage.from(bucket).upload(path, file, { upsert: false });
	if (error) throw new Error(error.message);
	const { data } = supabase.storage.from(bucket).getPublicUrl(path);
	return data.publicUrl;
}
