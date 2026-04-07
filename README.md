# Bozlak Çalışma Platformu (Next.js + Supabase SSR)

Neşet Ertaş tavrı saz çalışmak isteyen kullanıcılar için hazırlanmış modern, sade ve production-style bir web uygulaması.

## Teknoloji

- Next.js (App Router)
- TypeScript
- Tailwind CSS
- Supabase (Auth + Database)
- `@supabase/ssr`

## Tamamlanan Özellikler

- Anasayfa
- Sanatçı detay sayfaları
- Türküler sayfası
- Arama ve filtreleme
- Google OAuth login/logout (Supabase Auth)
- Session persistence
- Korumalı dashboard (`/dashboard`)
- Kullanıcıya özel çalışma listesi
- SQL schema + RLS policy taslağı

## Kurulum

1. Bağımlılıkları kurun:

```bash
npm install