"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabaseClient";

export const metadata = { title: "Şifre Sıfırlama | AKSARAY AKTİF HABER" };

export default function ResetPage() {
	const [email, setEmail] = useState("");
	const [loading, setLoading] = useState(false);
	const [msg, setMsg] = useState<string | null>(null);

	async function onSubmit(e: React.FormEvent) {
		e.preventDefault();
		setLoading(true);
		setMsg(null);
		const origin = typeof window !== "undefined" ? window.location.origin : (process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000");
		const { error } = await supabase.auth.resetPasswordForEmail(email, { redirectTo: `${origin}/admin/reset/confirm` });
		setLoading(false);
		if (error) setMsg(error.message);
		else setMsg("Sıfırlama bağlantısı e‑postana gönderildi.");
	}

	return (
		<div className="mx-auto max-w-md px-4 sm:px-6 lg:px-8 py-10">
			<h1 className="text-2xl font-bold mb-4">Şifre Sıfırlama</h1>
			<form onSubmit={onSubmit} className="space-y-3">
				<input type="email" required placeholder="E‑posta" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full rounded border border-black/10 dark:border-white/10 px-3 py-2 bg-white/70 dark:bg-white/5" />
				<button disabled={loading} className="w-full px-3 py-2 rounded bg-blue-600 text-white disabled:opacity-50">Bağlantıyı Gönder</button>
			</form>
			{msg && <p className="text-sm text-black/70 dark:text-white/70 mt-2">{msg}</p>}
		</div>
	);
}
