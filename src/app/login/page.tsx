import AuthButton from "@/components/AuthButton";

export const metadata = { title: "Giriş | AKSARAY AKTİF HABER" };

export default function LoginPage() {
	return (
		<div className="mx-auto max-w-md px-4 sm:px-6 lg:px-8 py-10">
			<h1 className="text-2xl font-bold mb-4">Giriş</h1>
			<AuthButton />
		</div>
	);
}
