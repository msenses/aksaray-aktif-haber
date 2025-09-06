export function slugify(input: string): string {
	return input
		.normalize("NFKD")
		.replace(/[\u0300-\u036f]/g, "")
		.replace(/Ç/g, "C").replace(/ç/g, "c")
		.replace(/Ğ/g, "G").replace(/ğ/g, "g")
		.replace(/İ/g, "I").replace(/ı/g, "i")
		.replace(/Ö/g, "O").replace(/ö/g, "o")
		.replace(/Ş/g, "S").replace(/ş/g, "s")
		.replace(/Ü/g, "U").replace(/ü/g, "u")
		.toLowerCase()
		.replace(/[^a-z0-9]+/g, "-")
		.replace(/(^-|-$)+/g, "");
}
