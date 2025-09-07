import Image from "next/image";
import Link from "next/link";

export type NewsCardProps = {
	title: string;
	excerpt: string;
	category: string;
	date: string;
	imageSrc?: string;
	slug?: string;
};

export default function NewsCard({ title, excerpt, category, date, imageSrc, slug }: NewsCardProps) {
	if (slug) {
		return (
			<Link href={`/haber/${slug}`} className="group block rounded-2xl overflow-hidden border border-black/5 dark:border-white/10 bg-white/70 dark:bg-white/5 backdrop-blur transition-shadow hover:shadow-lg hover:shadow-blue-500/10 focus:outline-none focus:ring-2 focus:ring-blue-500/40">
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
						<div className="flex items-center gap-2 text-xs text-blue-600 dark:text-blue-400">
							<span className="px-2 py-0.5 rounded-full bg-blue-50 dark:bg-blue-950/40 border border-blue-200/60 dark:border-blue-800/60">{category}</span>
							<time dateTime={date} className="text-black/60 dark:text-white/60">{new Date(date).toLocaleDateString("tr-TR")}</time>
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
				<div className="flex items-center gap-2 text-xs text-blue-600 dark:text-blue-400">
					<span className="px-2 py-0.5 rounded-full bg-blue-50 dark:bg-blue-950/40 border border-blue-200/60 dark:border-blue-800/60">{category}</span>
					<time dateTime={date} className="text-black/60 dark:text-white/60">{new Date(date).toLocaleDateString("tr-TR")}</time>
				</div>
				<h3 className="text-base font-semibold tracking-tight">{title}</h3>
				<p className="text-sm/6 text-black/70 dark:text-white/70 line-clamp-3">{excerpt}</p>
			</div>
		</article>
	);
}
