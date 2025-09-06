import type { Metadata } from "next";
import Image from "next/image";
import AdminNav from "@/components/AdminNav";
import "../globals.css";

export const metadata: Metadata = {
	title: "Admin | AKSARAY AKTİF HABER",
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
	return (
		<html lang="tr">
			<body className="min-h-dvh antialiased">
				<header className="sticky top-0 z-40 border-b border-black/10 dark:border-white/10 bg-white/70 dark:bg-white/5 backdrop-blur">
					<div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 h-14 flex items-center justify-between">
						<div className="flex items-center gap-2">
							<Image src="/aktif_logo.png" alt="Logo" width={28} height={28} />
							<span className="font-semibold">AKSARAY AKTİF HABER</span>
							<span className="ml-2 text-xs px-2 py-0.5 rounded bg-blue-600 text-white">Admin</span>
						</div>
					</div>
				</header>
				<div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex">
					<AdminNav />
					<main className="flex-1 py-6">{children}</main>
				</div>
			</body>
		</html>
	);
}
