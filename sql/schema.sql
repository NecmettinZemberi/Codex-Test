-- Supabase / PostgreSQL schema (gercek auth + kullaniciya ozel calisma listesi)

create extension if not exists "pgcrypto";

create table if not exists public.artists (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  short_bio text not null,
  image_url text not null,
  created_at timestamptz not null default now()
);

create table if not exists public.songs (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  artist text not null,
  type text not null check (type in ('bozlak', 'turku', 'uzun hava')),
  youtube_url text not null,
  slow_play_youtube_url text,
  lyrics_or_notes text not null,
  difficulty text check (difficulty in ('kolay', 'orta', 'zor')),
  beginner_order integer,
  created_at timestamptz not null default now()
);

alter table public.songs
  add column if not exists slow_play_youtube_url text;

alter table public.songs
  add column if not exists beginner_order integer;

create table if not exists public.user_practice_list (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  song_id uuid not null references public.songs(id) on delete cascade,
  status text not null check (status in ('planlandi', 'siraya_alindi', 'calisiliyor', 'tamamlandi')),
  sort_order integer not null default 1,
  personal_note text not null default '',
  target_date date,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (user_id, song_id)
);

alter table public.user_practice_list
  add column if not exists target_date date;

create or replace function public.set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists trg_user_practice_list_updated_at on public.user_practice_list;
create trigger trg_user_practice_list_updated_at
before update on public.user_practice_list
for each row execute procedure public.set_updated_at();

alter table public.artists enable row level security;
alter table public.songs enable row level security;
alter table public.user_practice_list enable row level security;

-- Artists/Songs herkese acik okunabilir (anon + authenticated)
drop policy if exists "Artists are readable by everyone" on public.artists;
create policy "Artists are readable by everyone"
  on public.artists for select
  using (true);

drop policy if exists "Songs are readable by everyone" on public.songs;
create policy "Songs are readable by everyone"
  on public.songs for select
  using (true);

-- Practice list sadece ilgili kullaniciya acik
drop policy if exists "Users can read own practice list" on public.user_practice_list;
create policy "Users can read own practice list"
  on public.user_practice_list for select
  using (auth.uid() = user_id);

drop policy if exists "Users can insert own practice list" on public.user_practice_list;
create policy "Users can insert own practice list"
  on public.user_practice_list for insert
  with check (auth.uid() = user_id);

drop policy if exists "Users can update own practice list" on public.user_practice_list;
create policy "Users can update own practice list"
  on public.user_practice_list for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

drop policy if exists "Users can delete own practice list" on public.user_practice_list;
create policy "Users can delete own practice list"
  on public.user_practice_list for delete
  using (auth.uid() = user_id);
