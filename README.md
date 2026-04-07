# Bozlak Çalışma Platformu (Next.js + Supabase SSR)

Neşet Ertaş tavrı saz çalışmak isteyen kullanıcılar için hazırlanmış modern, sade ve production-style bir web uygulaması.

## Stack

- Next.js (App Router)
- TypeScript
- Tailwind CSS
- Supabase (Auth + Database)
- `@supabase/ssr` resmi SSR pattern

## Tamamlanan Özellikler

- Anasayfa, sanatçı detay sayfaları, türküler sayfası
- Google OAuth login/logout (Supabase Auth)
- Session persistence (middleware + SSR client pattern)
- Korumalı dashboard (`/dashboard`)
- Kullanıcıya özel çalışma listesi (RLS ile izole)
- SQL schema + RLS policy taslağı

## 1) Kurulum

```bash
npm install
```

## 2) Environment

`.env.local` oluşturun:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=your-publishable-key
```

## 3) Supabase Dashboard Ayarları

- **Authentication > Providers > Google**: enable edin
- **Authentication > URL Configuration** içine ekleyin:
  - `http://localhost:3000/auth/callback`

## 4) Veritabanı

`sql/schema.sql` dosyasını Supabase SQL Editor içinde çalıştırın.

## 5) Çalıştırma

```bash
npm run dev
```

Tarayıcı: `http://localhost:3000`

## Önemli Akışlar

- Login: `/login` -> `/auth/login` -> Google -> `/auth/callback` -> `/dashboard`
- Logout: `/auth/logout` (POST)
- Dashboard server-side `auth.getUser()` kontrolü yapar; user yoksa `/login` yönlendirmesi.

## Klasör Yapısı

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

- Mock auth kaldırıldı, gerçek Supabase Auth kullanılmaktadır.
- Dashboard artık mock liste yerine `user_practice_list` tablosunu kullanır.
