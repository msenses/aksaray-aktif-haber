"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";

export default function SupabaseStatus() {
	const [status, setStatus] = useState<"idle" | "ok" | "error">("idle");
	const [message, setMessage] = useState<string>("");

	useEffect(() => {
		async function test() {
			try {
				const { data, error } = await supabase.auth.getSession();
				if (error) {
					setStatus("error");
					setMessage(error.message);
					return;
				}
				setStatus("ok");
				setMessage(data.session ? "Oturum var" : "Bağlantı başarılı (oturum yok)");
			} catch (e: any) {
				setStatus("error");
				setMessage(e?.message || "Bilinmeyen hata");
			}
		}
		test();
	}, []);

	return (
		<div className="text-sm text-black/70 dark:text-white/70">
			Durum: {status === "idle" ? "Kontrol ediliyor..." : status === "ok" ? "OK" : "Hata"}
			{message && <span className="ml-2">— {message}</span>}
		</div>
	);
}
