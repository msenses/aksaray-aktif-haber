import { fetchAdSlotByKey } from "@/lib/ads";

export default async function AdSlot({ slotKey, className }: { slotKey: string; className?: string }) {
	const ad = await fetchAdSlotByKey(slotKey);
	if (!ad) {
		return (
			<div className={`rounded border border-black/10 dark:border-white/10 bg-white/70 dark:bg-white/5 text-sm text-black/60 dark:text-white/60 flex items-center justify-center ${className || "h-24"}`}>
				Reklam Alanı
			</div>
		);
	}
	if (ad.html && ad.html.trim().length > 0) {
		return (
			<div className={className} dangerouslySetInnerHTML={{ __html: ad.html }} />
		);
	}
	if (ad.image_url) {
		const img = <img src={ad.image_url} alt={ad.title} style={{ width: "100%", height: "100%", objectFit: "cover" }} />;
		return ad.link_url ? (
			<a href={ad.link_url} target="_blank" rel="noopener noreferrer" className={className}>
				{img}
			</a>
		) : (
			<div className={className}>{img}</div>
		);
	}
	return (
		<div className={`rounded border border-black/10 dark:border-white/10 bg-white/70 dark:bg-white/5 text-sm text-black/60 dark:text-white/60 flex items-center justify-center ${className || "h-24"}`}>
			Reklam Alanı
		</div>
	);
}


