import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "İletişim | AKSARAY AKTİF HABER",
  description: "Aksaray Aktif Haber ile iletişime geçin.",
};

async function submitContact(formData: FormData) {
  "use server";
  // Burada gerçek bir e-posta/CRM entegrasyonu yok. 
  // Mevcut kapsamda sadece server-side log atıyoruz.
  const name = String(formData.get("name") || "");
  const email = String(formData.get("email") || "");
  const phone = String(formData.get("phone") || "");
  const message = String(formData.get("message") || "");
  console.log("CONTACT_FORM", { name, email, phone, message, at: new Date().toISOString() });
}

export default function ContactPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
      <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">İletişim</h1>
      <p className="mt-2 text-black/70 dark:text-white/70 max-w-2xl">
        Sorularınız, önerileriniz veya iş birlikleri için bizimle iletişime geçin.
      </p>

      <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* İletişim Bilgileri */}
        <section className="rounded border border-black/10 dark:border-white/10 bg-white/70 dark:bg-white/5 p-5 space-y-5">
          <div>
            <h2 className="font-semibold">Ofis</h2>
            <p className="mt-1 text-sm text-black/70 dark:text-white/70">
              Adres: Taşpazar Mahallesi Ebulfez Elçibey Caddesi Şensesler Apartmanı No:9 Merkez / AKSARAY
            </p>
            <p className="mt-1 text-xs text-black/60 dark:text-white/60">İmtiyaz Sahibi: Çiğdem Şenses</p>
          </div>

          <div>
            <h2 className="font-semibold">Telefon</h2>
            <p className="mt-1 text-sm"><a className="hover:underline" href="tel:+905307492785">0 530 749 27 85</a></p>
          </div>

          <div>
            <h2 className="font-semibold">E-posta</h2>
            <p className="mt-1 text-sm"><a className="hover:underline" href="mailto:info@aksarayaktifhaber.com">info@aksarayaktifhaber.com</a></p>
          </div>

          <div>
            <h2 className="font-semibold">Çalışma Saatleri</h2>
            <ul className="mt-1 text-sm text-black/70 dark:text-white/70 space-y-1">
              <li>Pazartesi - Cuma: 08:00 - 17:59</li>
              <li>Cumartesi - Pazar: 09:00 - 13:59</li>
            </ul>
          </div>
        </section>

        {/* İletişim Formu */}
        <section className="lg:col-span-2 rounded border border-black/10 dark:border-white/10 bg-white/70 dark:bg-white/5 p-5">
          <h2 className="font-semibold mb-3">Mesajını gönder!</h2>
          <form action={submitContact} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-1">
              <label className="block text-sm mb-1">Ad Soyad</label>
              <input name="name" required placeholder="Adınız Soyadınız" className="w-full rounded border border-black/10 dark:border-white/10 px-3 py-2 bg-white/70 dark:bg-white/5" />
            </div>
            <div className="sm:col-span-1">
              <label className="block text-sm mb-1">E-posta</label>
              <input name="email" required type="email" placeholder="ornek@mail.com" className="w-full rounded border border-black/10 dark:border-white/10 px-3 py-2 bg-white/70 dark:bg-white/5" />
            </div>
            <div className="sm:col-span-2">
              <label className="block text-sm mb-1">Telefon</label>
              <input name="phone" type="tel" placeholder="05xx xxx xx xx" className="w-full rounded border border-black/10 dark:border-white/10 px-3 py-2 bg-white/70 dark:bg-white/5" />
            </div>
            <div className="sm:col-span-2">
              <label className="block text-sm mb-1">Mesajınız</label>
              <textarea name="message" required rows={6} placeholder="Mesajınızı yazın..." className="w-full rounded border border-black/10 dark:border-white/10 px-3 py-2 bg-white/70 dark:bg-white/5" />
            </div>
            <div className="sm:col-span-2">
              <button className="px-4 py-2 rounded bg-blue-600 text-white">Gönder</button>
            </div>
          </form>
        </section>
      </div>
    </div>
  );
}


