"use client";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";

export type NewsCardProps = {
	title: string;
	excerpt: string;
	date: string;
	viewCount?: number;
	imageSrc?: string;
	slug?: string;
};

export default function NewsCard({ title, excerpt, date, viewCount, imageSrc, slug }: NewsCardProps) {
	const router = useRouter();
	if (slug) {
		const href = `/haber/${slug}`;
		const handleClick: React.MouseEventHandler<HTMLDivElement> = (e) => {
			if (e.defaultPrevented) return;
			if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
			router.push(href);
		};
		const handleKeyDown: React.KeyboardEventHandler<HTMLDivElement> = (e) => {
			if (e.key === "Enter" || e.key === " ") {
				e.preventDefault();
				router.push(href);
			}
		};
		return (
			<div role="link" tabIndex={0} onClick={handleClick} onKeyDown={handleKeyDown} className="group block rounded-2xl overflow-hidden border border-black/5 dark:border-white/10 bg-white/70 dark:bg-white/5 backdrop-blur transition-shadow hover:shadow-lg hover:shadow-blue-500/10 focus:outline-none focus:ring-2 focus:ring-blue-500/40 cursor-pointer">
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
				<Link href={href} className="sr-only">{title}</Link>
			</div>
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
