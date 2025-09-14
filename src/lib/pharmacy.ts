export type DutyPharmacy = {
	name: string;
	address: string;
	phone?: string | null;
	map_url?: string | null;
};

export async function fetchDutyPharmacies(city: string = "aksaray"): Promise<DutyPharmacy[]> {
	const base = (process.env.NOBETCI_API_URL || "").trim();
	const apiKey = (process.env.NOBETCI_API_KEY || "").trim();
	if (!base || !apiKey) {
		return [];
	}
	const url = `${base.replace(/\/$/, "")}?city=${encodeURIComponent(city)}`;
	const res = await fetch(url, {
		headers: { Authorization: `Bearer ${apiKey}` },
		next: { revalidate: 60 * 60 * 24 },
	});
	if (!res.ok) {
		return [];
	}
	const data = (await res.json().catch(() => null)) as unknown;
	if (!data) return [];
	type InputItem = { [k: string]: unknown };
	const raw: InputItem[] = Array.isArray(data) ? (data as InputItem[]) : ((data as { items?: InputItem[] })?.items || []);
	const items: DutyPharmacy[] = raw.map((x) => ({
		name: String((x as InputItem)["name"] || (x as InputItem)["Name"] || (x as InputItem)["eczane_adi"] || "Eczane"),
		address: String((x as InputItem)["address"] || (x as InputItem)["Address"] || (x as InputItem)["adres"] || ""),
		phone: (x as InputItem)["phone"] as string | null || ((x as InputItem)["Phone"] as string | null) || ((x as InputItem)["telefon"] as string | null) || null,
		map_url: (x as InputItem)["map_url"] as string | null || ((x as InputItem)["MapUrl"] as string | null) || ((x as InputItem)["konum"] as string | null) || null,
	}));
	return items;
}


