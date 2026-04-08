import { notFound } from 'next/navigation';
import Image from 'next/image';
import { artists, songs } from '@/data/mockData';
import { ArtistSongBrowser } from '@/components/songs/ArtistSongBrowser';
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

function getInitialType(value?: string): SongType | 'all' {
  if (value === 'bozlak' || value === 'turku' || value === 'uzun hava') {
    return value;
  }

  return 'all';
}

export default function ArtistPage({ params, searchParams }: ArtistPageProps) {
  const artist = artists.find((item) => item.slug === params.slug);

  if (!artist) {
    notFound();
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
          initialQuery={searchParams?.q ?? ''}
          initialType={getInitialType(searchParams?.type)}
        />
      </section>
    </main>
  );
}
