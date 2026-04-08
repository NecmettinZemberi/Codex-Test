import Link from 'next/link';
import { Song } from '@/types/domain';
import { songTypeLabels } from '@/lib/utils';

type SongCardProps = {
  song: Song;
};

export function SongCard({ song }: SongCardProps) {
  return (
    <article className="surface-alt p-5">
      <div className="flex flex-wrap items-center gap-2">
        <h3 className="font-display text-2xl font-semibold leading-none text-text">
          {song.title}
        </h3>
        <span className="rounded-full border border-border px-2 py-1 text-[11px] uppercase tracking-[0.18em] text-muted">
          {songTypeLabels[song.type]}
        </span>
      </div>
      <p className="mt-3 text-sm text-muted">Sanatçı: {song.artist}</p>
      <p className="mt-4 text-sm leading-6 text-text/88">{song.lyrics_or_notes}</p>
      <Link
        href={song.youtube_url}
        target="_blank"
        className="mt-5 inline-block text-sm font-medium text-accent transition hover:text-warm"
      >
        YouTube kaynağını aç
      </Link>
    </article>
  );
}
