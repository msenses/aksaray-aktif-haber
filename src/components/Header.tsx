import Link from "next/link";
import Image from "next/image";

export default function Header() {
	return (
		<header className="sticky top-0 z-50 backdrop-blur supports-[backdrop-filter]:bg-white/70 dark:supports-[backdrop-filter]:bg-black/30 border-b border-black/5 dark:border-white/10">
			<input id="mobile-drawer" type="checkbox" className="peer hidden" />

			<div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 h-48 md:h-[120px] relative md:flex md:items-center md:justify-between gap-4">
				{/* Mobile menu button */}
				<label htmlFor="mobile-drawer" className="md:hidden absolute left-4 top-1/2 -translate-y-1/2 p-2 rounded border border-black/10 dark:border-white/10 bg-white/70 dark:bg-white/5 cursor-pointer">
					<span className="block w-6 h-0.5 bg-black dark:bg-white mb-1"></span>
					<span className="block w-6 h-0.5 bg-black dark:bg-white mb-1"></span>
					<span className="block w-6 h-0.5 bg-black dark:bg-white"></span>
				</label>

				<Link href="/" className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 md:static md:translate-x-0 md:translate-y-0 flex items-center gap-3 min-w-0">
					<Image src="/aktif_logo.png" alt="AKSARAY AKTİF HABER Logo" width={120} height={120} priority className="h-48 w-auto md:h-[120px]" />
					<div className="hidden md:flex flex-col leading-tight">
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

			{/* Drawer */}
			<div className="fixed inset-0 z-50 md:hidden pointer-events-none peer-checked:pointer-events-auto">
				<label htmlFor="mobile-drawer" className="absolute inset-0 bg-black/30"></label>
				<aside className="absolute left-0 top-0 h-full w-72 bg-white dark:bg-zinc-900 border-r border-black/10 dark:border-white/10 -translate-x-full peer-checked:translate-x-0 transition-transform">
					<div className="h-[120px] flex items-center gap-3 px-4 border-b border-black/10 dark:border-white/10">
						<Image src="/aktif_logo_yeni.png" alt="Logo" width={84} height={84} />
						<span className="font-semibold">AKSARAY AKTİF HABER</span>
					</div>
					<nav className="p-4 flex flex-col gap-3 text-sm">
						<Link href="/" className="px-2 py-2 rounded hover:bg-black/5 dark:hover:bg-white/5">Anasayfa</Link>
						<Link href="/kategoriler" className="px-2 py-2 rounded hover:bg-black/5 dark:hover:bg-white/5">Kategoriler</Link>
						<Link href="/hakkimizda" className="px-2 py-2 rounded hover:bg-black/5 dark:hover:bg-white/5">Hakkımızda</Link>
						<Link href="/iletisim" className="px-2 py-2 rounded hover:bg-black/5 dark:hover:bg-white/5">İletişim</Link>
					</nav>
				</aside>
			</div>
		</header>
	);
}
