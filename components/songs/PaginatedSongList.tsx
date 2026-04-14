'use client';

import { useEffect, useMemo, useState } from 'react';
import { Song } from '@/types/domain';
import { SongCard } from '@/components/songs/SongCard';
import { EmptyState } from '@/components/ui/EmptyState';
import { PaginationControls } from '@/components/songs/PaginationControls';

type PaginatedSongListProps = {
  songs: Song[];
  practiceSongIds?: string[];
  itemsPerPage?: number;
  emptyTitle?: string;
  emptyDescription?: string;
};

export function PaginatedSongList({
  songs,
  practiceSongIds = [],
  itemsPerPage = 20,
  emptyTitle = 'Sonuç bulunamadı',
  emptyDescription = 'Arama kelimesini veya filtreleri değiştirerek tekrar deneyin.',
}: PaginatedSongListProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedItemsPerPage, setSelectedItemsPerPage] = useState(itemsPerPage);

  useEffect(() => {
    setCurrentPage(1);
  }, [selectedItemsPerPage, songs]);

  const totalPages = Math.max(1, Math.ceil(songs.length / selectedItemsPerPage));
  const safePage = Math.min(currentPage, totalPages);

  const visibleSongs = useMemo(() => {
    const start = (safePage - 1) * selectedItemsPerPage;
    return songs.slice(start, start + selectedItemsPerPage);
  }, [safePage, selectedItemsPerPage, songs]);

  const practiceSongIdSet = useMemo(() => new Set(practiceSongIds), [practiceSongIds]);

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

      <PaginationControls
        currentPage={safePage}
        totalPages={totalPages}
        totalItems={songs.length}
        itemsPerPage={selectedItemsPerPage}
        onItemsPerPageChange={setSelectedItemsPerPage}
        onPageChange={setCurrentPage}
      />
    </div>
  );
}
