## PRD - Yerel Haber

### 1) Proje İskeleti
- Next.js 15, TypeScript, App Router, Tailwind v4 kuruldu.
- Eslint yapılandırıldı.

### 2) UI İskeleti
- Header ve Footer eklendi (sticky, blur, modern mavi tema).
- Anasayfa için responsive 1/2/3 kolon grid ve haber kartları (placeholder) hazırlandı.

### 3) Marka ve Logo
- Uygulama logosu `public/aktif_logo.png` olarak kullanılıyor.
- Marka renkleri CSS değişkenleri ile eklendi (`globals.css`), hero gradyanı bu renklerle çalışıyor.

### 4) Supabase Entegrasyonu ve Şema
- Env değişkenleri `.env.local` eklendi: `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`.
- `src/lib/supabaseClient.ts` oluşturuldu ve bağlantı test bileşeni eklendi.
- Veritabanı şeması dosyaları eklendi:
  - `supabase/schema.sql`
  - `supabase/policies.sql`
  - `supabase/seed.sql`

Uygulama adımları (Supabase Dashboard):
- SQL Editor > `schema.sql` içeriklerini çalıştır
- SQL Editor > `policies.sql` içeriklerini çalıştır
- SQL Editor > `seed.sql` içeriklerini çalıştır

Not: `news` tablosunda yalnızca `status = 'published'` olan kayıtlar herkese görünür.

### Sonraki Adım (Onay Gerektirir)
- Anasayfada gerçek veriyi göstermek, sayfalama ve SEO meta geliştirmeleri.
