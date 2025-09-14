import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabaseServer";

function extFromMime(mime: string): string {
    if (!mime) return "bin";
    if (mime === "image/jpeg") return "jpg";
    if (mime === "image/png") return "png";
    if (mime === "image/webp") return "webp";
    if (mime === "image/gif") return "gif";
    const parts = mime.split("/");
    return parts[1] || "bin";
}

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
    const supabase = await createSupabaseServerClient();
    try {
        const formData = await req.formData();
        const key = String(formData.get("key") || "").trim();
        const title = String(formData.get("title") || "").trim();
        const html = String(formData.get("html") || "");
        let image_url = String(formData.get("image_url") || "");
        const link_url = String(formData.get("link_url") || "");
        const is_active = formData.has("is_active");
        if (!key || !title) throw new Error("key ve title zorunlu");

        const imageFile = formData.get("image_file") as File | null;
        if (imageFile && typeof imageFile === "object" && imageFile.size > 0) {
            const ext = extFromMime(imageFile.type);
            const path = `ads/${key}/banner-${Date.now()}.${ext}`;
            const { error: upErr } = await supabase.storage
                .from("news-media")
                .upload(path, imageFile, { upsert: true, contentType: imageFile.type || undefined });
            if (upErr) throw new Error(upErr.message);
            const { data } = supabase.storage.from("news-media").getPublicUrl(path);
            image_url = data.publicUrl;
        }

        const { error } = await supabase
            .from("ad_slots")
            .upsert({ key, title, html, image_url, link_url, is_active }, { onConflict: "key" });
        if (error) throw new Error(error.message);

        const url = new URL(req.url);
        url.pathname = "/admin/ads";
        url.search = "?ok=1";
        return NextResponse.redirect(url, 303);
    } catch (e: unknown) {
        const msg = (e as { message?: string })?.message || "unknown";
        const url = new URL(req.url);
        url.pathname = "/admin/ads";
        url.search = `?error=${encodeURIComponent(msg)}`;
        return NextResponse.redirect(url, 303);
    }
}


