"use client";
import Image from "next/image";
import Link from "next/link";

export type NewsCardProps = {
	id?: string;
	title: string;
	excerpt: string;
	date: string;
	viewCount?: number;
	imageSrc?: string;
	slug?: string;
};

export default function NewsCard({ id, title, excerpt, date, viewCount, imageSrc, slug }: NewsCardProps) {
	const href = slug ? `/haber/${slug}` : id ? `/haber/${id}` : undefined;
	if (href) {
		return (
			<Link href={href} className="group block rounded-2xl overflow-hidden border border-black/5 dark:border-white/10 bg-white/70 dark:bg-white/5 backdrop-blur transition-shadow hover:shadow-lg hover:shadow-blue-500/10 focus:outline-none focus:ring-2 focus:ring-blue-500/40">
				<article>
					<div className="relative h-48 w-full">
						<Image
							src={imageSrc || "/window.svg"}
							alt="Haber görseli"
							fill
							className="object-cover dark:invert-0"
							priority
						/>
					</div>
					<div className="p-4 space-y-2">
						<div className="flex items-center gap-3 text-xs text-black/60 dark:text-white/60">
							<time dateTime={date}>{new Date(date).toLocaleDateString("tr-TR")} {new Date(date).toLocaleTimeString("tr-TR", { hour: "2-digit", minute: "2-digit" })}</time>
							<span>•</span>
							<span>{typeof viewCount === "number" ? viewCount : 0} görüntülenme</span>
						</div>
						<h3 className="text-base font-semibold tracking-tight group-hover:underline underline-offset-4">{title}</h3>
						<p className="text-sm/6 text-black/70 dark:text-white/70 line-clamp-3">{excerpt}</p>
					</div>
				</article>
			</Link>
		);
	}
	return (
		<article className="group rounded-2xl overflow-hidden border border-black/5 dark:border-white/10 bg-white/70 dark:bg-white/5 backdrop-blur transition-shadow hover:shadow-lg hover:shadow-blue-500/10">
			<div className="relative h-48 w-full">
				<Image
					src={imageSrc || "/window.svg"}
					alt="Haber görseli"
					fill
					className="object-cover dark:invert-0"
					priority
				/>
			</div>
			<div className="p-4 space-y-2">
				<div className="flex items-center gap-3 text-xs text-black/60 dark:text-white/60">
					<time dateTime={date}>{new Date(date).toLocaleDateString("tr-TR")} {new Date(date).toLocaleTimeString("tr-TR", { hour: "2-digit", minute: "2-digit" })}</time>
					<span>•</span>
					<span>{typeof viewCount === "number" ? viewCount : 0} görüntülenme</span>
				</div>
				<h3 className="text-base font-semibold tracking-tight">{title}</h3>
				<p className="text-sm/6 text-black/70 dark:text-white/70 line-clamp-3">{excerpt}</p>
			</div>
		</article>
	);
}
