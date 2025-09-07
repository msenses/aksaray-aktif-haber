"use client";
import Image from "next/image";
import Link from "next/link";
import type { PublishedNews } from "@/lib/news";
import { useMemo } from "react";

export default function LatestNewsSlider({ items }: { items: PublishedNews[] }) {
	const slides = useMemo(() => items.slice(0, 12), [items]);
	if (slides.length === 0) return null;
	return (
		<div className="relative">
			<div className="overflow-x-auto no-scrollbar">
				<ul className="flex gap-4 snap-x snap-mandatory pr-2">
					{slides.map((n) => (
						<li key={n.id} className="min-w-[260px] max-w-[280px] snap-start">
							<Link href={`/haber/${n.slug}`} className="block rounded-lg overflow-hidden border border-black/10 dark:border-white/10 bg-white/70 dark:bg-white/5">
								<div className="relative h-40 w-full">
									<Image src={n.cover_image_url || "/window.svg"} alt={n.title} fill className="object-cover" sizes="(max-width: 768px) 60vw, 33vw" />
								</div>
								<div className="p-3">
									<h3 className="text-sm font-semibold line-clamp-2">{n.title}</h3>
									<p className="text-xs text-black/60 dark:text-white/60 line-clamp-2">{n.summary || ""}</p>
								</div>
							</Link>
						</li>
					))}
				</ul>
			</div>
		</div>
	);
}


