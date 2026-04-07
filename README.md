# Bozlak Çalışma Platformu (Next.js Starter)

Neşet Ertaş tavrı saz çalışmak isteyen kullanıcılar için hazırlanmış modern, sade ve production-style bir web uygulaması başlangıcı.

## Teknoloji

- Next.js (App Router)
- TypeScript
- Tailwind CSS
- Supabase (auth + database için hazır altyapı)

## Özellikler

- Modern ve responsive navbar
- Anasayfa (tanıtım + öne çıkan sanatçılar + CTA)
- Sanatçı detay sayfaları (bio, fotoğraf, parça listesi)
- Türküler sayfası (arama + sanatçı filtresi + tür filtresi)
- Giriş sayfası (Google auth akışına uygun)
- Korumalı dashboard (mock oturum + çalışma listesi yönetimi)
- Boş durum ekranı ve sade loading/error-friendly yapı
- Supabase schema taslağı (`sql/schema.sql`)

## Kurulum

1. Bağımlılıkları kurun:

```bash
npm install
```

2. Environment değişkenlerini hazırlayın:

```bash
cp .env.example .env.local
```

3. Geliştirme sunucusunu başlatın:

```bash
npm run dev
```

4. Production build alın:

```bash
npm run build
```

## Environment Variables

`.env.local` içinde:

```env
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
```

> Not: Env değişkenleri yoksa login butonu demo amaçlı `mock auth` akışına düşer.

## Klasör Yapısı

```text
app/
  page.tsx                    # Anasayfa
  login/page.tsx              # Giriş
  dashboard/page.tsx          # Korumalı çalışma listesi
  turkuler/page.tsx           # Arama + filtreleme
  artists/[slug]/page.tsx     # Sanatçı detay
  api/mock-auth/route.ts      # Demo login
  api/mock-logout/route.ts    # Demo logout
components/
  layout/Navbar.tsx
  ui/ArtistCard.tsx
  ui/EmptyState.tsx
  ui/AuthButtons.tsx
  songs/SongCard.tsx
  songs/SongFilters.tsx
  dashboard/PracticeBoard.tsx
data/
  mockData.ts                 # Seed/mock veri
lib/
  utils.ts
  supabase/client.ts
  supabase/auth.ts
types/
  domain.ts
sql/
  schema.sql                  # Supabase schema taslağı
```

## Kısa Mimari Açıklama

- **UI katmanı**: `app` + `components`
- **Veri katmanı (mock)**: `data/mockData.ts`
- **Domain tipleri**: `types/domain.ts`
- **Entegrasyon katmanı**: `lib/supabase/*`
- **DB hazırlığı**: `sql/schema.sql`

Bu yapı, yeni başlayan biri için okunabilir olacak kadar sade tutuldu; ileri aşamada Supabase gerçek oturum ve tablo işlemlerine kolayca genişletilebilir.
