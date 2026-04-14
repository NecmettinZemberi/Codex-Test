import Link from 'next/link';
import { formatSongTitle, getSongDetailHref } from '@/lib/utils';
import type { Song } from '@/types/domain';

type SongStudyCardProps = {
  song: Song;
};

export function SongStudyCard({ song }: SongStudyCardProps) {
  const hasSlowPlay = Boolean(song.slow_play_youtube_url);
  const hasStudyNotes = !song.lyrics_or_notes.includes('yakında eklenecek');

  return (
    <article className="surface-alt flex h-full flex-col justify-between p-5">
      <div>
        <div className="flex flex-wrap items-center gap-2">
          {song.beginner_order ? (
            <span className="rounded-full border border-accent/50 bg-accent/10 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-accent">
              Başlangıç {song.beginner_order}
            </span>
          ) : (
            <span className="rounded-full border border-border px-2.5 py-1 text-[11px] uppercase tracking-[0.18em] text-muted">
              Arşiv
            </span>
          )}
          <span className="rounded-full border border-border px-2.5 py-1 text-[11px] uppercase tracking-[0.18em] text-muted">
            Neşet Ertaş
          </span>
        </div>

        <h2 className="mt-4 font-display text-3xl font-semibold leading-tight text-text">
          <Link href={getSongDetailHref(song)} className="transition hover:text-accent">
            {formatSongTitle(song.title)}
          </Link>
        </h2>

        <p className="mt-4 text-sm leading-7 text-stone-300">{song.lyrics_or_notes}</p>
      </div>

      <div className="mt-5 flex flex-col gap-3 border-t border-border/80 pt-4 text-sm sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap gap-2">
          <span className="rounded-lg border border-border bg-surface px-3 py-2 text-muted">
            {hasStudyNotes ? 'Söz notu hazır' : 'Söz notu yakında'}
          </span>
          <span className="rounded-lg border border-border bg-surface px-3 py-2 text-muted">
            {hasSlowPlay ? 'Yavaş çalım hazır' : 'Yavaş çalım yakında'}
          </span>
        </div>
        <Link
          href={getSongDetailHref(song)}
          className="inline-flex w-full shrink-0 items-center justify-center whitespace-nowrap rounded-lg border border-accent/45 bg-accent/10 px-4 py-2 font-semibold text-accent transition-all duration-300 ease-out hover:border-accent/65 hover:bg-accent/18 hover:text-stone-100 hover:shadow-[0_10px_28px_rgba(143,107,59,0.14)] sm:w-auto"
        >
          Parçaya git
        </Link>
      </div>
    </article>
  );
}
