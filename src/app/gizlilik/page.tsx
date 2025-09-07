import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Gizlilik Politikası | AKSARAY AKTİF HABER",
  description: "AKSARAY AKTİF HABER gizlilik politikası ve kişisel verilerin korunmasına ilişkin esaslar.",
};

export default function PrivacyPolicyPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-10">
      <h1 className="text-2xl sm:text-3xl font-bold tracking-tight mb-6">Gizlilik Politikası</h1>

      <div className="prose prose-blue dark:prose-invert max-w-none text-sm sm:text-base">
        <p>
          aksarayaktifhaber.com olarak kişisel gizlilik haklarınıza saygı duyuyor ve sitemizde
          geçirdiğiniz süre zarfında gizliliğinizi korumak için azami özen gösteriyoruz. Bu sayfada,
          kişisel bilgilerinizin işlenmesine ve korunmasına ilişkin temel esasları bulabilirsiniz.
        </p>

        <h2>Kişisel Bilgileriniz</h2>
        <p>
          Birçok standart web sunucusunda olduğu gibi aksarayaktifhaber.com da istatistiksel amaçlarla log
          dosyaları tutabilir. Bu dosyalarda; IP adresiniz, internet servis sağlayıcınız, tarayıcı
          özellikleriniz, işletim sisteminiz ve siteye giriş/çıkış sayfalarınız gibi bilgiler yer alabilir.
          Bu veriler istatistiksel analiz dışında kullanılmaz ve kimliğinizle ilişkilendirilmez.
        </p>

        <h2>Çerezler (Cookies)</h2>
        <p>
          Sitemizin bazı bölümlerinde kullanıcı deneyimini iyileştirmek için çerezler kullanılabilir.
          Ayrıca sitede yer alan reklam alanları aracılığıyla, reklam verilerinin toplanması için çerez ve
          web işaretçileri (web beacon) kullanılabilir. Tarayıcı ayarlarınızı değiştirerek çerezleri
          engelleyebilir veya silmeyi tercih edebilirsiniz.
        </p>

        <h2>Çocukların Gizliliği</h2>
        <p>
          Sitemiz 18 yaşın altındaki kişilere yönelik değildir. 18 yaşın altındaki çocuklardan bilerek
          kişisel olarak tanımlanabilir bilgi toplamamaktayız. Böyle bir durum tespit edilirse ilgili
          bilgiler silinir. Ebeveyn iseniz ve çocuğunuzun bize kişisel bilgi sağladığını düşünüyorsanız
          bizimle iletişime geçebilirsiniz.
        </p>

        <h2>Dış Bağlantılar</h2>
        <p>
          aksarayaktifhaber.com, internetin doğası gereği farklı internet adreslerine bağlantılar
          verebilir. Bağlantı verilen sitelerin içeriklerinden ve gizlilik uygulamalarından sorumlu
          tutulamayız.
        </p>

        <h2>Politikada Değişiklikler</h2>
        <p>
          Gizlilik politikamızda zaman zaman güncellemeler yapabiliriz. Değişikliklerden haberdar olmak
          için bu sayfayı düzenli olarak kontrol etmenizi öneririz.
        </p>

        <h2>İletişim</h2>
        <p>
          Gizlilik politikamızla ilgili sorularınız veya önerileriniz için bizimle iletişime geçebilirsiniz:
          <br />
          E-posta: <a href="mailto:info@aksarayaktifhaber.com">info@aksarayaktifhaber.com</a>
        </p>
      </div>
    </div>
  );
}


