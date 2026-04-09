'use client';

import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';
import { addPracticeItem } from '@/app/dashboard/actions';
import { PracticeAddAction } from '@/components/songs/PracticeAddAction';
import { ArrowUpRightIcon } from '@/components/ui/ArrowUpRightIcon';
import { getSongDetailHref, getSongHref, songTypeLabels } from '@/lib/utils';
import { Song } from '@/types/domain';

type SongCardProps = {
  song: Song;
  isInPracticeList?: boolean;
};

export function SongCard({ song, isInPracticeList = false }: SongCardProps) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const currentSearch = searchParams.toString();
  const redirectTo = currentSearch ? `${pathname}?${currentSearch}` : pathname;

  return (
    <article className="surface-alt overflow-hidden border border-border/90 bg-[linear-gradient(180deg,rgba(28,28,28,0.98),rgba(18,18,18,0.98))] p-5">
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

      <div className="mt-6 border-t border-border/80 pt-4">
        <p className="mb-3 text-[10px] uppercase tracking-[0.24em] text-muted">Çalışma hattı</p>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <form action={addPracticeItem} className="sm:flex-none">
            <input type="hidden" name="song_id" value={song.id} />
            <input type="hidden" name="redirect_to" value={redirectTo} />
            <input type="hidden" name="feedback_mode" value="inline" />
            <PracticeAddAction isInPracticeList={isInPracticeList} />
          </form>

          <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-sm sm:justify-end">
            <Link
              href={getSongDetailHref(song)}
              className="inline-flex items-center gap-1.5 font-medium text-accent transition hover:text-warm"
            >
              <span>Parça arşivine git</span>
              <ArrowUpRightIcon className="h-3.5 w-3.5" />
            </Link>

            <Link
              href={song.youtube_url}
              target="_blank"
              className="inline-flex items-center gap-1.5 font-medium text-muted transition hover:text-text"
            >
              <span>YouTube kaynağı</span>
              <ArrowUpRightIcon className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>
      </div>
    </article>
  );
}
