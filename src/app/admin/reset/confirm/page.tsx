"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";

export default function ResetConfirmPage() {
	const [password, setPassword] = useState("");
	const [password2, setPassword2] = useState("");
	const [msg, setMsg] = useState<string | null>(null);
	const [ok, setOk] = useState(false);

	useEffect(() => {
		// Supabase, reset linkinden gelince recover session’ı kurar
		async function checkSession() {
			const { data } = await supabase.auth.getSession();
			setOk(!!data.session);
		}
		checkSession();
	}, []);

	async function onSubmit(e: React.FormEvent) {
		e.preventDefault();
		setMsg(null);
		if (password !== password2) {
			setMsg("Şifreler eşleşmiyor");
			return;
		}
		const { error } = await supabase.auth.updateUser({ password });
		if (error) setMsg(error.message);
		else setMsg("Şifre güncellendi. Giriş sayfasına yönlendiriliyorsunuz...");
		setTimeout(() => (location.href = "/admin/login"), 1500);
	}

	return (
		<div className="mx-auto max-w-md px-4 sm:px-6 lg:px-8 py-10">
			<h1 className="text-2xl font-bold mb-4">Yeni Şifre Belirle</h1>
			{!ok ? (
				<p className="text-sm text-black/70 dark:text-white/70">Geçersiz ya da süresi dolmuş bağlantı.</p>
			) : (
				<form onSubmit={onSubmit} className="space-y-3">
					<input type="password" required placeholder="Yeni Şifre" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full rounded border border-black/10 dark:border-white/10 px-3 py-2 bg-white/70 dark:bg-white/5" />
					<input type="password" required placeholder="Yeni Şifre (Tekrar)" value={password2} onChange={(e) => setPassword2(e.target.value)} className="w-full rounded border border-black/10 dark:border-white/10 px-3 py-2 bg-white/70 dark:bg-white/5" />
					<button className="w-full px-3 py-2 rounded bg-blue-600 text-white">Parolayı Güncelle</button>
				</form>
			)}
			{msg && <p className="text-sm text-black/70 dark:text-white/70 mt-2">{msg}</p>}
		</div>
	);
}
