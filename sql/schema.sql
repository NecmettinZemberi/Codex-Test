-- Supabase / PostgreSQL schema taslağı
-- Amaç: sanatçılar, parçalar ve kullanıcı çalışma listesi ilişkisini yönetmek

create extension if not exists "pgcrypto";

create table if not exists artists (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text unique not null,
  short_bio text not null,
  image_url text not null,
  created_at timestamptz not null default now()
);

create table if not exists songs (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  artist text not null,
  type text not null check (type in ('bozlak', 'turku', 'uzun hava')),
  youtube_url text not null,
  lyrics_or_notes text not null,
  difficulty text check (difficulty in ('kolay', 'orta', 'zor')),
  created_at timestamptz not null default now()
);

create table if not exists user_practice_list (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  song_id uuid not null references songs(id) on delete cascade,
  status text not null check (status in ('planlandi', 'siraya_alindi', 'calisiliyor', 'tamamlandi')),
  sort_order integer not null default 1,
  personal_note text not null default '',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- RLS örnek başlangıç politikaları
alter table user_practice_list enable row level security;

create policy "Users can read own practice list"
  on user_practice_list for select
  using (auth.uid() = user_id);

create policy "Users can manage own practice list"
  on user_practice_list for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);
