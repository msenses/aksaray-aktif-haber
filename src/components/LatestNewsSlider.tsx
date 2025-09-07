"use client";
import Image from "next/image";
import type { PublishedNews } from "@/lib/news";
import { useEffect, useMemo, useRef, useState } from "react";

export default function LatestNewsSlider({ items }: { items: PublishedNews[] }) {
	const slides = useMemo(() => items.slice(0, 12), [items]);
	const containerRef = useRef<HTMLDivElement | null>(null);
	const [autoPlay, setAutoPlay] = useState(true);

	useEffect(() => {
		if (!autoPlay) return;
		const el = containerRef.current;
		if (!el) return;
		const interval = setInterval(() => {
			const scrollBy = 300;
			const maxScroll = el.scrollWidth - el.clientWidth;
			if (el.scrollLeft + scrollBy >= maxScroll - 4) {
				el.scrollTo({ left: 0, behavior: "smooth" });
			} else {
				el.scrollBy({ left: scrollBy, behavior: "smooth" });
			}
		}, 3000);
		return () => clearInterval(interval);
	}, [autoPlay]);

	if (slides.length === 0) return null;

	function handlePrev() {
		const el = containerRef.current;
		if (!el) return;
		el.scrollBy({ left: -300, behavior: "smooth" });
	}

	function handleNext() {
		const el = containerRef.current;
		if (!el) return;
		el.scrollBy({ left: 300, behavior: "smooth" });
	}

	return (
		<div className="relative">
			<div ref={containerRef} className="overflow-x-auto no-scrollbar" onMouseEnter={() => setAutoPlay(false)} onMouseLeave={() => setAutoPlay(true)}>
				<ul className="flex gap-4 snap-x snap-mandatory pr-2">
					{slides.map((n) => (
						<li key={n.id} className="min-w-[260px] max-w-[280px] snap-start">
							<a href={`/haber/${n.slug}`} className="block rounded-lg overflow-hidden border border-black/10 dark:border-white/10 bg-white/70 dark:bg-white/5">
								<div className="relative h-40 w-full">
									<Image src={n.cover_image_url || "/window.svg"} alt={n.title} fill className="object-cover" sizes="(max-width: 768px) 60vw, 33vw" />
								</div>
								<div className="p-3">
									<h3 className="text-sm font-semibold line-clamp-2">{n.title}</h3>
									<p className="text-xs text-black/60 dark:text-white/60 line-clamp-2">{n.summary || ""}</p>
								</div>
							</a>
						</li>
					))}
				</ul>
			</div>

			<button aria-label="Önceki" onClick={handlePrev} className="absolute left-0 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/80 dark:bg-black/50 border border-black/10 dark:border-white/10 shadow">
				<span className="inline-block rotate-180">➜</span>
			</button>
			<button aria-label="Sonraki" onClick={handleNext} className="absolute right-0 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/80 dark:bg-black/50 border border-black/10 dark:border-white/10 shadow">
				<span>➜</span>
			</button>
		</div>
	);
}


