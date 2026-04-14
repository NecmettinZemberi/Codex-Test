'use client';

import { useEffect, useMemo, useState } from 'react';
import type { Song } from '@/types/domain';
import { PaginationControls } from '@/components/songs/PaginationControls';
import { SongStudyCard } from '@/components/songs/SongStudyCard';

type BeginnerArchiveListProps = {
  songs: Song[];
};

export function BeginnerArchiveList({ songs }: BeginnerArchiveListProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(20);

  useEffect(() => {
    setCurrentPage(1);
  }, [itemsPerPage, songs]);

  const totalPages = Math.max(1, Math.ceil(songs.length / itemsPerPage));
  const safePage = Math.min(currentPage, totalPages);

  const visibleSongs = useMemo(() => {
    const start = (safePage - 1) * itemsPerPage;
    return songs.slice(start, start + itemsPerPage);
  }, [itemsPerPage, safePage, songs]);

  return (
    <div>
      <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {visibleSongs.map((song) => (
          <SongStudyCard key={song.id} song={song} />
        ))}
      </div>

      <PaginationControls
        currentPage={safePage}
        totalPages={totalPages}
        totalItems={songs.length}
        itemsPerPage={itemsPerPage}
        onItemsPerPageChange={setItemsPerPage}
        onPageChange={setCurrentPage}
      />
    </div>
  );
}
