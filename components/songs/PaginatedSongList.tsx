'use client';

import { useEffect, useMemo, useState } from 'react';
import { Song } from '@/types/domain';
import { SongCard } from '@/components/songs/SongCard';
import { EmptyState } from '@/components/ui/EmptyState';

type PaginatedSongListProps = {
  songs: Song[];
  practiceSongIds?: string[];
  itemsPerPage?: number;
  emptyTitle?: string;
  emptyDescription?: string;
};

function buildPageItems(currentPage: number, totalPages: number): Array<number | 'ellipsis'> {
  if (totalPages <= 5) {
    return Array.from({ length: totalPages }, (_, index) => index + 1);
  }

  if (currentPage <= 3) {
    return [1, 2, 3, 4, 'ellipsis', totalPages];
  }

  if (currentPage >= totalPages - 2) {
    return [1, 'ellipsis', totalPages - 3, totalPages - 2, totalPages - 1, totalPages];
  }

  return [1, 'ellipsis', currentPage - 1, currentPage, currentPage + 1, 'ellipsis', totalPages];
}

export function PaginatedSongList({
  songs,
  practiceSongIds = [],
  itemsPerPage = 20,
  emptyTitle = 'Sonuç bulunamadı',
  emptyDescription = 'Arama kelimesini veya filtreleri değiştirerek tekrar deneyin.',
}: PaginatedSongListProps) {
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    setCurrentPage(1);
  }, [songs]);

  const totalPages = Math.max(1, Math.ceil(songs.length / itemsPerPage));
  const safePage = Math.min(currentPage, totalPages);

  const visibleSongs = useMemo(() => {
    const start = (safePage - 1) * itemsPerPage;
    return songs.slice(start, start + itemsPerPage);
  }, [itemsPerPage, safePage, songs]);

  const practiceSongIdSet = useMemo(() => new Set(practiceSongIds), [practiceSongIds]);
  const pageItems = useMemo(() => buildPageItems(safePage, totalPages), [safePage, totalPages]);

  if (songs.length === 0) {
    return <EmptyState title={emptyTitle} description={emptyDescription} />;
  }

  return (
    <div>
      <div className="space-y-4 lg:grid lg:grid-cols-2 lg:gap-4 lg:space-y-0">
        {visibleSongs.map((song) => (
          <SongCard key={song.id} song={song} isInPracticeList={practiceSongIdSet.has(song.id)} />
        ))}
      </div>

      {totalPages > 1 ? (
        <div className="surface mt-6 p-4">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <p className="text-xs uppercase tracking-[0.18em] text-muted">
              Sayfa {safePage} / {totalPages} · Toplam {songs.length} parça
            </p>

            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-end">
              <div className="flex items-center justify-between gap-2 sm:justify-end">
                <button
                  type="button"
                  onClick={() => setCurrentPage((page) => Math.max(1, page - 1))}
                  disabled={safePage === 1}
                  className="button-secondary w-full px-4 py-2 disabled:cursor-not-allowed disabled:opacity-40 sm:w-auto"
                >
                  Önceki
                </button>
                <button
                  type="button"
                  onClick={() => setCurrentPage((page) => Math.min(totalPages, page + 1))}
                  disabled={safePage === totalPages}
                  className="button-secondary w-full px-4 py-2 disabled:cursor-not-allowed disabled:opacity-40 sm:w-auto"
                >
                  Sonraki
                </button>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                {pageItems.map((item, index) =>
                  item === 'ellipsis' ? (
                    <span key={`ellipsis-${index}`} className="px-2 text-sm text-muted">
                      …
                    </span>
                  ) : (
                    <button
                      key={item}
                      type="button"
                      onClick={() => setCurrentPage(item)}
                      aria-current={safePage === item ? 'page' : undefined}
                      className={
                        safePage === item
                          ? 'inline-flex min-w-10 items-center justify-center rounded-lg border border-accent bg-accent px-3 py-2 text-sm font-semibold text-base'
                          : 'button-secondary min-w-10 px-3 py-2'
                      }
                    >
                      {item}
                    </button>
                  ),
                )}
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
