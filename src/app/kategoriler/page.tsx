import Link from "next/link";
import { fetchCategories } from "@/lib/categories";

export const metadata = {
	title: "Kategoriler | AKSARAY AKTİF HABER",
};

export default async function CategoriesPage() {
	const categories = await fetchCategories();
	return (
		<div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-10">
			<h1 className="text-2xl font-bold mb-6">Kategoriler</h1>
			{categories.length === 0 ? (
				<p className="text-black/70 dark:text-white/70">Henüz kategori bulunmuyor.</p>
			) : (
				<ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
					{categories.map((c) => (
						<li key={c.id} className="rounded-xl border border-black/10 dark:border-white/10 p-4 bg-white/70 dark:bg-white/5 backdrop-blur">
							<Link href={`/kategori/${c.slug}`} className="font-medium hover:underline underline-offset-4">
								{c.name}
							</Link>
							{c.description && <p className="text-sm text-black/60 dark:text-white/60 mt-1">{c.description}</p>}
						</li>
					))}
				</ul>
			)}
		</div>
	);
}
