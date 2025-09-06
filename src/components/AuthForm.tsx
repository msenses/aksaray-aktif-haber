"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabaseClient";

export default function AuthForm() {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [loading, setLoading] = useState(false);
	const [message, setMessage] = useState<string | null>(null);
	const [mode, setMode] = useState<"signin" | "signup">("signin");

	async function syncSession(access_token: string, refresh_token: string) {
		await fetch("/api/auth/set", {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({ access_token, refresh_token }),
		});
	}

	async function onSubmit(e: React.FormEvent) {
		e.preventDefault();
		setLoading(true);
		setMessage(null);
		try {
			if (mode === "signin") {
				const { data, error } = await supabase.auth.signInWithPassword({ email, password });
				if (error) throw error;
				if (data.session) {
					await syncSession(data.session.access_token, data.session.refresh_token);
					location.href = "/admin";
					return;
				}
				setMessage("Giriş başarısız: oturum oluşturulamadı.");
			} else {
				const { data, error } = await supabase.auth.signUp({ email, password });
				if (error) throw error;
				if (data.session) {
					await syncSession(data.session.access_token, data.session.refresh_token);
					location.href = "/admin";
				} else {
					setMessage("Kayıt oluşturuldu. E‑posta doğrulaması gerekebilir, lütfen e‑postanı kontrol et.");
				}
			}
		} catch (err: unknown) {
			const e2 = err as { message?: string };
			setMessage(e2?.message || "Beklenmeyen hata");
		} finally {
			setLoading(false);
		}
	}

	return (
		<div className="space-y-4">
			<div className="inline-flex rounded-lg border border-black/10 dark:border-white/10 overflow-hidden">
				<button type="button" onClick={() => setMode("signin")} className={`px-3 py-2 text-sm ${mode === "signin" ? "bg-blue-600 text-white" : "bg-transparent"}`}>Giriş yap</button>
				<button type="button" onClick={() => setMode("signup")} className={`px-3 py-2 text-sm ${mode === "signup" ? "bg-blue-600 text-white" : "bg-transparent"}`}>Kayıt ol</button>
			</div>

			<form onSubmit={onSubmit} className="space-y-2">
				<input type="email" required placeholder="E-posta" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full rounded border border-black/10 dark:border-white/10 px-3 py-2 bg-white/70 dark:bg-white/5" />
				<input type="password" required placeholder="Şifre" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full rounded border border-black/10 dark:border-white/10 px-3 py-2 bg-white/70 dark:bg-white/5" />
				<button disabled={loading} className="w-full px-3 py-2 rounded bg-blue-600 text-white disabled:opacity-50">{mode === "signin" ? "Giriş yap" : "Kayıt ol"}</button>
			</form>

			{message && <p className="text-sm text-black/70 dark:text-white/70">{message}</p>}
		</div>
	);
}
