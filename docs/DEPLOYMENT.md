# Dağıtım (Vercel)

## Ortam Değişkenleri
Vercel Project Settings → Environment Variables
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `NEXT_PUBLIC_SITE_URL` (örn. `https://aksaray-aktif-haber.vercel.app`)

## Supabase Ayarları
- SQL Editor: `supabase/schema.sql`, `supabase/policies.sql`, `supabase/seed.sql`
- Authentication → URL Configuration: Site URL ve Redirect URLs → Vercel domaini
- Storage: public bucket (opsiyonel)

## Deploy Akışı
1. GitHub repo bağla: `msenses/aksaray-aktif-haber`
2. Import → Framework: Next.js (auto)
3. Env değişkenlerini ekle
4. Deploy
5. Domain → `NEXT_PUBLIC_SITE_URL` güncelle, gerekiyorsa redeploy

## Kontrol Listesi
- `/`, `/haber/[slug]`, `/kategoriler`, `/kategori/[slug]`, `/arama`
- `/rss.xml`, `/sitemap.xml`, `/robots.txt`
- `/login` → magic link → `/admin` formu çalışıyor
