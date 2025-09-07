import Link from "next/link";

export default function Footer() {
	return (
		<footer className="mt-16 border-t border-black/5 dark:border-white/10">
			<div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
				<div>
					<h3 className="text-sm font-semibold mb-3">AKSARAY AKTİF HABER</h3>
					<p className="text-sm/6 text-black/60 dark:text-white/60">Aksaray&#39;dan en güncel ve güvenilir haberler.</p>
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
					<h4 className="font-medium mb-2">Sosyal</h4>
					<div className="flex items-center gap-3">
						<a href={(process.env.NEXT_PUBLIC_FACEBOOK_URL || "https://facebook.com/aksarayaktifhaber")} target="_blank" rel="noopener noreferrer" aria-label="Facebook" title="Facebook" className="p-2 rounded-full border border-black/10 dark:border-white/10 bg-white/80 dark:bg-white/5 hover:bg-white transition">
							<svg aria-hidden="true" focusable="false" viewBox="0 0 24 24" className="w-5 h-5 text-[#1877F2]" fill="currentColor">
								<path d="M22.675 0H1.325C.593 0 0 .593 0 1.326v21.348C0 23.407.593 24 1.325 24h11.495v-9.294H9.692V11.09h3.128V8.413c0-3.1 1.893-4.788 4.659-4.788 1.325 0 2.463.099 2.795.143v3.24l-1.918.001c-1.504 0-1.795.715-1.795 1.763v2.314h3.587l-.467 3.616h-3.12V24h6.116C23.407 24 24 23.407 24 22.674V1.326C24 .593 23.407 0 22.675 0z"/>
							</svg>
						</a>
						<a href={(process.env.NEXT_PUBLIC_TWITTER_URL || "https://twitter.com/aksarayaktifha1")} target="_blank" rel="noopener noreferrer" aria-label="X" title="X" className="p-2 rounded-full border border-black/10 dark:border-white/10 bg-white/80 dark:bg-white/5 hover:bg-white transition">
							<svg aria-hidden="true" focusable="false" viewBox="0 0 24 24" className="w-5 h-5 text-black dark:text-white" fill="currentColor">
								<path d="M3 2h4l6.5 8.7L20 2h4l-8.5 10.5L24 24h-4l-7-9.4L6 24H2l9-11.1L3 2zm13.445 18h1.91L8.63 4h-1.89l9.705 16z"/>
							</svg>
						</a>
						<a href={(process.env.NEXT_PUBLIC_INSTAGRAM_URL || "https://instagram.com/aksaray.aktif.haber")} target="_blank" rel="noopener noreferrer" aria-label="Instagram" title="Instagram" className="p-2 rounded-full border border-black/10 dark:border-white/10 bg-white/80 dark:bg-white/5 hover:bg-white transition">
							<svg aria-hidden="true" focusable="false" viewBox="0 0 24 24" className="w-5 h-5" fill="none" xmlns="http://www.w3.org/2000/svg">
								<defs>
									<linearGradient id="igGradientFooter" x1="0" y1="0" x2="1" y2="1">
										<stop offset="0%" stopColor="#F58529"/>
										<stop offset="50%" stopColor="#DD2A7B"/>
										<stop offset="100%" stopColor="#8134AF"/>
									</linearGradient>
								</defs>
								<rect x="3" y="3" width="18" height="18" rx="5" ry="5" stroke="url(#igGradientFooter)" strokeWidth="2"/>
								<circle cx="12" cy="12" r="5" stroke="url(#igGradientFooter)" strokeWidth="2"/>
								<circle cx="18" cy="6" r="1.5" fill="#DD2A7B"/>
							</svg>
						</a>
					</div>
				</div>
				<div className="text-sm">
					<h4 className="font-medium mb-2">Yasal</h4>
					<div className="flex gap-4 flex-wrap">
						<Link href="/gizlilik" className="hover:underline underline-offset-4">Gizlilik</Link>
						<Link href="/kosullar" className="hover:underline underline-offset-4">Kullanım Koşulları</Link>
					</div>
				</div>
				<div className="text-sm text-black/60 dark:text-white/60 sm:col-span-2 lg:col-span-1 sm:text-right lg:text-left">
					<p>© 2019 AKSARAY AKTİF HABER. Tüm hakları saklıdır.</p>
				</div>
			</div>
		</footer>
	);
}
