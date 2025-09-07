import type { Metadata } from "next";
import Image from "next/image";
import AdminMenuButton from "@/components/AdminMenuButton";
import AdminNav from "@/components/AdminNav";
import "../globals.css";
import { Suspense } from "react";

export const metadata: Metadata = {
	title: "Admin | AKSARAY AKTİF HABER",
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
	return (
		<html lang="tr">
			<body className="admin-body min-h-dvh antialiased">
				<header className="admin-header sticky top-0 z-40 border-b border-black/10 dark:border-white/10 bg-white/70 dark:bg-white/5 backdrop-blur">
					<div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 h-[120px] flex items-center justify-between">
						<div className="flex items-center gap-4">
							<Image src="/aktif_logo.png" alt="Logo" width={84} height={84} />
							<div className="flex flex-col">
								<span className="font-semibold text-xl sm:text-2xl">AKSARAY AKTİF HABER</span>
								<span className="mt-1 text-xs sm:text-sm px-2 py-0.5 rounded bg-blue-600 text-white self-start">Admin Paneli</span>
							</div>
						</div>
						<AdminMenuButton />
					</div>
				</header>
				<div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex">
					<Suspense fallback={<div className="w-56 h-10" />}> 
						<AdminNav />
					</Suspense>
					<main className="flex-1 py-6">{children}</main>
				</div>
			</body>
		</html>
	);
}
