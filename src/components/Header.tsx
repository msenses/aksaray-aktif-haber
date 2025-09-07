import Link from "next/link";
import Image from "next/image";

export default function Header() {
	return (
		<header className="sticky top-0 z-50 backdrop-blur supports-[backdrop-filter]:bg-white/70 dark:supports-[backdrop-filter]:bg-black/30 border-b border-black/5 dark:border-white/10">
			<div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 h-[120px] flex items-center justify-between gap-4">
				<Link href="/" className="flex items-center gap-3 min-w-0">
					<Image src="/aktif_logo.png" alt="AKSARAY AKTİF HABER Logo" width={120} height={120} priority />
					<div className="flex flex-col leading-tight">
						<span className="text-lg font-semibold tracking-tight uppercase whitespace-nowrap">AKSARAY AKTİF HABER</span>
						<span className="text-xs text-gray-600 dark:text-gray-300 whitespace-nowrap">Tarafsızlığın Adresi, Aksaray&apos;ın Sesi</span>
					</div>
				</Link>

				<form action="/arama" method="get" className="hidden md:flex items-center gap-2 flex-1 max-w-lg">
					<input name="q" placeholder="Haber ara..." className="w-full rounded border border-black/10 dark:border-white/10 px-3 py-2 bg-white/70 dark:bg-white/5" />
					<button className="px-3 py-2 rounded bg-blue-600 text-white">Ara</button>
				</form>

				<nav className="hidden md:flex items-center gap-6 text-sm">
					<Link href="/" className="hover:underline underline-offset-4">Anasayfa</Link>
					<Link href="/kategoriler" className="hover:underline underline-offset-4">Kategoriler</Link>
					<Link href="/hakkimizda" className="hover:underline underline-offset-4">Hakkımızda</Link>
					<Link href="/iletisim" className="hover:underline underline-offset-4">İletişim</Link>
				</nav>
			</div>
		</header>
	);
}
