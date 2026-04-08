# Bozlak Calisma Platformu (Next.js + Supabase SSR)

Neset Ertas tavri saz calismak isteyen kullanicilar icin hazirlanmis modern, sade ve production-style bir web uygulamasi.

## Teknoloji

- Next.js (App Router)
- TypeScript
- Tailwind CSS
- Supabase (Auth + Database)
- `@supabase/ssr` resmi SSR pattern

## Tamamlanan Ozellikler

- Anasayfa, sanatci detay sayfalari, turkuler sayfasi
- Google OAuth login/logout (Supabase Auth)
- Session persistence (middleware + SSR client pattern)
- Korumali dashboard (`/dashboard`)
- Kullaniciya ozel calisma listesi (RLS ile izole)
- SQL schema + RLS policy taslagi

## 1) Kurulum

```bash
npm install
```

## 2) Environment

`.env.local` olusturun:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=your-publishable-key
```

## 3) Supabase Dashboard Ayarlari

- **Authentication > Providers > Google**: enable edin
- **Authentication > URL Configuration** icine ekleyin:
  - `http://localhost:3000/auth/callback`

## 4) Veritabani

`sql/schema.sql` dosyasini Supabase SQL Editor icinde calistirin.

## 5) Calistirma

```bash
npm run dev
```

Tarayici: `http://localhost:3000`

## Onemli Akislar

- Login: `/login` -> `/auth/login` -> Google -> `/auth/callback` -> `/dashboard`
- Logout: `/auth/logout` (POST)
- Dashboard server-side `auth.getUser()` kontrolu yapar; user yoksa `/login` yonlendirmesi.

## Klasor Yapisi

```text
app/
  auth/login/route.ts
  auth/callback/route.ts
  auth/logout/route.ts
  dashboard/page.tsx
  login/page.tsx
  artists/[slug]/page.tsx
  turkuler/page.tsx
  page.tsx
utils/
  supabase/client.ts
  supabase/server.ts
  supabase/middleware.ts
middleware.ts
sql/schema.sql
data/mockData.ts
types/domain.ts
```

## Not

- Mock auth kaldirildi, gercek Supabase Auth kullanilmaktadir.
- Dashboard artik mock liste yerine `user_practice_list` tablosunu kullanir.
