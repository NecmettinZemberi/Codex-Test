import Link from 'next/link';
import { notFound } from 'next/navigation';
import { songs } from '@/data/mockData';
import { getArtistByName, getSongSlug, songTypeLabels } from '@/lib/utils';

type SongDetailPageProps = {
  params: {
    songSlug: string;
  };
};

export default function SongDetailPage({ params }: SongDetailPageProps) {
  const song = songs.find((item) => getSongSlug(item) === params.songSlug);

  if (!song) {
    notFound();
  }

  const artist = getArtistByName(song.artist);

  return (
    <main className="container-base py-12 sm:py-16">
      <section className="surface p-8 sm:p-10">
        <p className="eyebrow">Parça arşivi</p>
        <h1 className="page-title mt-4 text-4xl sm:text-5xl">{song.title}</h1>

        <div className="mt-5 flex flex-wrap items-center gap-3 text-sm text-muted">
          <span>{songTypeLabels[song.type]}</span>
          <span className="text-border">•</span>
          {artist ? (
            <Link href={`/artists/${artist.slug}`} className="text-text transition hover:text-accent">
              {song.artist}
            </Link>
          ) : (
            <span>{song.artist}</span>
          )}
        </div>

        <div className="mt-8 rounded-xl border border-border bg-surface2 p-5 sm:p-6">
          <h2 className="font-display text-3xl font-semibold text-text">Sözler / Notlar</h2>
          <p className="mt-4 whitespace-pre-line text-base leading-8 text-stone-200">
            {song.lyrics_or_notes}
          </p>
        </div>

        <div className="mt-6 flex flex-wrap gap-3">
          {artist ? (
            <Link href={`/artists/${artist.slug}`} className="button-secondary px-4 py-2">
              Sanatçı sayfası
            </Link>
          ) : null}
          <Link href="/turkuler" className="button-secondary px-4 py-2">
            Türkülere dön
          </Link>
          <Link href={song.youtube_url} target="_blank" className="button-primary px-4 py-2">
            YouTube kaynağını aç
          </Link>
        </div>
      </section>
    </main>
  );
}
