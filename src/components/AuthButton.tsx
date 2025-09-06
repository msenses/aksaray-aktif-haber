"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabaseClient";

export default function AuthButton() {
	const [email, setEmail] = useState("");
	const [loading, setLoading] = useState(false);
	const [message, setMessage] = useState<string | null>(null);

	async function signIn(e: React.FormEvent) {
		e.preventDefault();
		setLoading(true);
		setMessage(null);
		const origin = typeof window !== "undefined" ? window.location.origin : (process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000");
		const { error } = await supabase.auth.signInWithOtp({ email, options: { emailRedirectTo: `${origin}/admin` } });
		setLoading(false);
		if (error) setMessage(error.message);
		else setMessage("E-postana giriş bağlantısı gönderdik.");
	}

	async function signOut() {
		await supabase.auth.signOut();
		location.href = "/";
	}

	return (
		<div className="space-y-3">
			<form onSubmit={signIn} className="flex gap-2">
				<input type="email" required placeholder="E-posta" value={email} onChange={(e) => setEmail(e.target.value)} className="flex-1 rounded border border-black/10 dark:border-white/10 px-3 py-2 bg-white/70 dark:bg-white/5" />
				<button disabled={loading} className="px-3 py-2 rounded bg-blue-600 text-white disabled:opacity-50">Giriş bağlantısı gönder</button>
			</form>
			<button onClick={signOut} className="text-sm underline underline-offset-4">Çıkış yap</button>
			{message && <p className="text-sm text-black/70 dark:text-white/70">{message}</p>}
		</div>
	);
}
