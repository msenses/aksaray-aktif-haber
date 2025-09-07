"use client";

import { useState, useEffect } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import Link from "next/link";

function NavLink({ href, label }: { href: string; label: string }) {
	const pathname = usePathname();
	const search = useSearchParams();
	const current = `${pathname}${search?.toString() ? `?${search.toString()}` : ""}`;
	const active = current === href;
	return (
		<Link
			href={href}
			className={`block px-3 py-2 rounded text-sm ${active ? "bg-blue-600 text-white" : "hover:bg-black/5 dark:hover:bg-white/10"}`}
		>
			{label}
		</Link>
	);
}

export default function AdminNav() {
	const [open, setOpen] = useState(false);
	useEffect(() => {
		const mq = window.matchMedia("(min-width: 1024px)");
		setOpen(mq.matches);
		const handler = (e: MediaQueryListEvent) => setOpen(e.matches);
		mq.addEventListener?.("change", handler);
		return () => mq.removeEventListener?.("change", handler);
	}, []);

	return (
		<>
			{/* Masaüstü sidebar */}
			<div className="hidden lg:block w-56 shrink-0 border-r border-black/10 dark:border-white/10 bg-white/70 dark:bg-white/5">
				<div className="p-3">
					<nav className="space-y-1">
						<NavLink href="/admin" label="Dashboard" />
						<NavLink href="/admin?view=compose" label="Yeni Haber" />
						<NavLink href="/admin/news" label="Haberler" />
						<NavLink href="/admin/categories" label="Kategoriler" />
						<NavLink href="/admin/comments" label="Yorumlar" />
					</nav>
				</div>
			</div>

			{/* Mobil: sabit menü butonu */}
			<button
				onClick={() => setOpen(true)}
				className="fixed left-3 top-[90px] z-[1100] lg:hidden text-xs px-3 py-2 rounded border border-black/10 dark:border-white/10 bg-white/80 dark:bg-white/5"
				aria-label="Menüyü Aç"
			>
				Menü
			</button>

			{/* Mobil: overlay çekmece */}
			{open && (
				<div className="fixed inset-0 z-[1000] lg:hidden">
					<div className="absolute inset-0 bg-black/50" onClick={() => setOpen(false)} aria-label="Kapat"></div>
					<aside className="absolute left-0 top-0 h-dvh w-64 bg-white dark:bg-black border-r border-black/10 dark:border-white/10 shadow-xl">
						<div className="p-3 border-b border-black/10 dark:border-white/10 flex items-center justify-between">
							<span className="text-sm font-medium">Admin Menüsü</span>
							<button onClick={() => setOpen(false)} className="text-xs px-2 py-1 rounded border border-black/10 dark:border-white/10">Kapat</button>
						</div>
						<nav className="p-3 space-y-1">
							<NavLink href="/admin" label="Dashboard" />
							<NavLink href="/admin?view=compose" label="Yeni Haber" />
							<NavLink href="/admin/news" label="Haberler" />
							<NavLink href="/admin/categories" label="Kategoriler" />
							<NavLink href="/admin/comments" label="Yorumlar" />
						</nav>
					</aside>
				</div>
			)}
		</>
	);
}
