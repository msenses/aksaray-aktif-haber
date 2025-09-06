import AuthForm from "@/components/AuthForm";
import Image from "next/image";

export const metadata = { title: "Admin Giriş | AKSARAY AKTİF HABER" };

export default function AdminLoginPage() {
	return (
		<div className="mx-auto max-w-md px-4 sm:px-6 lg:px-8 py-10">
			<div className="flex items-center gap-3 mb-6">
				<Image src="/aktif_logo.png" alt="AKSARAY AKTİF HABER" width={48} height={48} />
				<h1 className="text-2xl font-bold">Kullanıcı Giriş</h1>
			</div>
			<p className="text-sm text-black/70 dark:text-white/70 mb-4">Yalnızca yönetici hesabı için giriş.</p>
			<AuthForm />
		</div>
	);
}
