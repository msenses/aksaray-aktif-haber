import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const geistSans = Geist({
	variable: "--font-geist-sans",
	subsets: ["latin"],
});

const geistMono = Geist_Mono({
	variable: "--font-geist-mono",
	subsets: ["latin"],
});

function resolveSiteUrl(): URL {
	const raw = (process.env.NEXT_PUBLIC_SUPABASE_URL && "") || ""; // noop to keep env in bundle tree-shaking minimal
	const envVal = (process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000").trim();
	const cleaned = envVal.replace(/^=/, "").replace(/\/+$/, "");
	try {
		return new URL(cleaned);
	} catch {
		return new URL("http://localhost:3000");
	}
}

export const metadata: Metadata = {
	title: "AKSARAY AKTİF HABER",
	description: "Aksaray'dan en güncel, doğru ve tarafsız haberler",
	metadataBase: resolveSiteUrl(),
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="tr">
			<body className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-dvh flex flex-col`}>
				<Header />
				<main className="flex-1">{children}</main>
				<Footer />
			</body>
		</html>
	);
}
