import Link from "next/link";

export default function Footer() {
	return (
		<footer className="mt-16 border-t border-black/5 dark:border-white/10">
			<div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
				<div>
					<h3 className="text-sm font-semibold mb-3">AKSARAY AKTİF HABER</h3>
					<p className="text-sm/6 text-black/60 dark:text-white/60">Aksaray'dan en güncel ve güvenilir haberler.</p>
				</div>
				<nav className="space-y-2 text-sm">
					<h4 className="font-medium">Site</h4>
					<div className="flex gap-4 flex-wrap">
						<Link href="/" className="hover:underline underline-offset-4">Anasayfa</Link>
						<Link href="/kategoriler" className="hover:underline underline-offset-4">Kategoriler</Link>
						<Link href="/hakkimizda" className="hover:underline underline-offset-4">Hakkımızda</Link>
						<Link href="/iletisim" className="hover:underline underline-offset-4">İletişim</Link>
					</div>
				</nav>
				<div className="text-sm">
					<h4 className="font-medium mb-2">Yasal</h4>
					<div className="flex gap-4 flex-wrap">
						<Link href="/gizlilik" className="hover:underline underline-offset-4">Gizlilik</Link>
						<Link href="/kosullar" className="hover:underline underline-offset-4">Kullanım Koşulları</Link>
					</div>
				</div>
				<div className="text-sm text-black/60 dark:text-white/60 sm:col-span-2 lg:col-span-1 sm:text-right lg:text-left">
					<p>© {new Date().getFullYear()} AKSARAY AKTİF HABER. Tüm hakları saklıdır.</p>
				</div>
			</div>
		</footer>
	);
}
