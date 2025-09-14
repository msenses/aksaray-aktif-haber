import { fetchDutyPharmacies } from "@/lib/pharmacy";

export default async function DutyPharmacies({ variant = "default" }: { variant?: "default" | "sidebar" }) {
	const wrapperClass = variant === "sidebar"
		? "py-0"
		: "mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6";
	return (
		<section className={wrapperClass}>
			<h2 className="text-lg font-semibold mb-3">Aksaray Nöbetçi Eczaneler</h2>
			<div className="mx-auto w-full max-w-md text-center">
				<a href="https://www.eczaneler.gen.tr/nobetci-aksaray" target="_blank" rel="noopener noreferrer">
					<img src="https://www.eczaneler.gen.tr/resimler/nobetci-eczane.jpg" alt="Aksaray nöbetçi eczaneleri" style={{ width: "100%", borderRadius: "2px" }} />
				</a>
				<iframe
					src="https://www.eczaneler.gen.tr/iframe.php?lokasyon=68"
					name="Aksaray nöbetçi eczaneleri"
					style={{ width: "100%", height: 240, border: "none" }}
					loading="lazy"
				/>
			</div>
		</section>
	);
}


