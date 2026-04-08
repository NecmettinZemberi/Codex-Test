'use client';

import Link from 'next/link';
import { addPracticeItem } from '@/app/dashboard/actions';
import { getSongDetailHref, getSongHref, songTypeLabels } from '@/lib/utils';
import { Song } from '@/types/domain';

type SongCardProps = {
  song: Song;
};

export function SongCard({ song }: SongCardProps) {
  return (
    <article className="surface-alt p-5">
      <div className="flex flex-wrap items-center gap-2">
        <h3 className="font-display text-2xl font-semibold leading-none text-text">
          <Link href={getSongDetailHref(song)} className="transition hover:text-accent">
            {song.title}
          </Link>
        </h3>
        <span className="rounded-full border border-border px-2 py-1 text-[11px] uppercase tracking-[0.18em] text-muted">
          {songTypeLabels[song.type]}
        </span>
      </div>
      <p className="mt-3 text-sm text-muted">
        Sanatçı:{' '}
        <Link href={getSongHref(song)} className="text-text transition hover:text-accent">
          {song.artist}
        </Link>
      </p>
      <p className="mt-4 text-sm leading-6 text-text/88">{song.lyrics_or_notes}</p>

      <div className="mt-5 flex flex-wrap items-center gap-3">
        <form action={addPracticeItem}>
          <input type="hidden" name="song_id" value={song.id} />
          <input type="hidden" name="redirect_to" value="/dashboard?tab=practice" />
          <button type="submit" className="button-primary px-4 py-2 text-sm">
            Çalışma listeme ekle
          </button>
        </form>

        <Link href={getSongDetailHref(song)} className="text-sm font-medium text-accent transition hover:text-warm">
          Parça sayfasına git →
        </Link>

        <Link
          href={song.youtube_url}
          target="_blank"
          className="text-sm font-medium text-muted transition hover:text-text"
        >
          YouTube kaynağını aç
        </Link>
      </div>
    </article>
  );
}
