"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabaseClient";

export default function CommentForm({ newsId }: { newsId: string }) {
	const [author, setAuthor] = useState("");
	const [content, setContent] = useState("");
	const [loading, setLoading] = useState(false);
	const [msg, setMsg] = useState<string | null>(null);

	async function onSubmit(e: React.FormEvent) {
		e.preventDefault();
		setLoading(true);
		setMsg(null);
		const { error } = await supabase.from("comments").insert({ news_id: newsId, author_name: author || null, content, is_approved: false });
		setLoading(false);
		if (error) setMsg(error.message);
		else {
			setMsg("Yorum alındı. Yayına alınması biraz sürebilir.");
			setAuthor("");
			setContent("");
		}
	}

	return (
		<form onSubmit={onSubmit} className="space-y-2">
			<input value={author} onChange={(e) => setAuthor(e.target.value)} placeholder="Ad (opsiyonel)" className="w-full rounded border border-black/10 dark:border-white/10 px-3 py-2 bg-white/70 dark:bg-white/5" />
			<textarea value={content} onChange={(e) => setContent(e.target.value)} placeholder="Yorumunuz" required className="w-full h-24 rounded border border-black/10 dark:border-white/10 px-3 py-2 bg-white/70 dark:bg-white/5" />
			<button disabled={loading} className="px-3 py-2 rounded bg-blue-600 text-white disabled:opacity-50">Gönder</button>
			{msg && <p className="text-sm text-black/70 dark:text-white/70">{msg}</p>}
		</form>
	);
}
