import { notFound } from 'next/navigation';
import Image from 'next/image';
import { ArtistSongBrowser } from '@/components/songs/ArtistSongBrowser';
import { artists, songs } from '@/data/mockData';
import { getCurrentUserContext } from '@/utils/auth/server';
import { createClient } from '@/utils/supabase/server';
import type { SongType } from '@/types/domain';

type ArtistPageProps = {
  params: {
    slug: string;
  };
  searchParams?: {
    q?: string;
    type?: string;
  };
};

type PracticeSongRow = {
  songs:
    | {
        title: string;
        artist: string;
        type: SongType;
      }
    | Array<{
        title: string;
        artist: string;
        type: SongType;
      }>
    | null;
};

function getInitialType(value?: string): SongType | 'all' {
  if (value === 'bozlak' || value === 'turku' || value === 'uzun hava') {
    return value;
  }

  return 'all';
}

export default async function ArtistPage({ params, searchParams }: ArtistPageProps) {
  const artist = artists.find((item) => item.slug === params.slug);

  if (!artist) {
    notFound();
  }

  const auth = await getCurrentUserContext();
  let initialPracticeSongIds: string[] = [];

  if (auth.mode === 'supabase' && auth.user) {
    const supabase = await createClient();
    const { data: practiceItems } = await supabase
      .from('user_practice_list')
      .select(
        `
        songs (title, artist, type)
      `,
      )
      .eq('user_id', auth.user.id);

    initialPracticeSongIds = ((practiceItems ?? []) as PracticeSongRow[])
      .map((item) => (Array.isArray(item.songs) ? item.songs[0] : item.songs))
      .filter((song): song is { title: string; artist: string; type: SongType } => Boolean(song))
      .map((practiceSong) =>
        songs.find(
          (catalogSong) =>
            catalogSong.title === practiceSong.title &&
            catalogSong.artist === practiceSong.artist &&
            catalogSong.type === practiceSong.type,
        )?.id,
      )
      .filter((songId): songId is string => Boolean(songId));
  }

  const artistSongs = songs.filter((song) => song.artist === artist.name);

  return (
    <main className="container-base py-12 sm:py-16">
      <section className="surface overflow-hidden">
        <div className="relative h-64 w-full border-b border-border bg-surface2 sm:h-80">
          <div className="absolute inset-0 z-10 bg-gradient-to-t from-base via-base/20 to-transparent" />
          <Image
            src={artist.image_url}
            alt={artist.name}
            fill
            className="object-cover grayscale"
          />
        </div>
        <div className="bg-gradient-to-b from-surface to-surface2 p-6 sm:p-8">
          <p className="eyebrow">Sanatçı arşivi</p>
          <h1 className="page-title mt-4 text-4xl sm:text-5xl">{artist.name}</h1>
          <p className="muted-copy mt-5 max-w-3xl leading-8">{artist.short_bio}</p>
        </div>
      </section>

      <section className="mt-10">
        <h2 className="section-title">Parçalar</h2>
        <ArtistSongBrowser
          songs={artistSongs}
          authMode={auth.mode}
          initialPracticeSongIds={initialPracticeSongIds}
          initialQuery={searchParams?.q ?? ''}
          initialType={getInitialType(searchParams?.type)}
        />
      </section>
    </main>
  );
}
