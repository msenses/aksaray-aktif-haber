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
	const [open, setOpen] = useState(true);
	useEffect(() => {
		// md ve üstü için varsayılan açık
		const mq = window.matchMedia("(min-width: 768px)");
		setOpen(mq.matches);
		const handler = (e: MediaQueryListEvent) => setOpen(e.matches);
		mq.addEventListener?.("change", handler);
		return () => mq.removeEventListener?.("change", handler);
	}, []);

	return (
		<div className={`transition-all duration-200 ${open ? "w-56" : "w-0 md:w-16"} overflow-hidden border-r border-black/10 dark:border-white/10 bg-white/70 dark:bg-white/5`}> 
			<div className="p-3">
				<button onClick={() => setOpen(!open)} className="mb-3 w-full md:w-auto text-xs px-2 py-1 rounded border border-black/10 dark:border-white/10">
					{open ? "Menüyü Gizle" : "Menü"}
				</button>
				<nav className="space-y-1">
					<NavLink href="/admin" label="Dashboard" />
					<NavLink href="/admin?view=compose" label="Yeni Haber" />
					<NavLink href="/admin/categories" label="Kategoriler" />
					<NavLink href="/admin?view=comments" label="Yorumlar" />
				</nav>
			</div>
		</div>
	);
}
