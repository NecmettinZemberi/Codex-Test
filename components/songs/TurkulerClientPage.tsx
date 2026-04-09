'use client';

import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { SongFilters } from '@/components/songs/SongFilters';
import { PaginatedSongList } from '@/components/songs/PaginatedSongList';
import { songs } from '@/data/mockData';
import { SongType } from '@/types/domain';

type TurkulerClientPageProps = {
  authMode: 'anonymous' | 'demo' | 'supabase';
  initialPracticeSongIds: string[];
};

const demoStorageKey = 'bozlaklab-demo-practice-list';

export function TurkulerClientPage({
  authMode,
  initialPracticeSongIds,
}: TurkulerClientPageProps) {
  const searchParams = useSearchParams();
  const [query, setQuery] = useState(searchParams.get('q') ?? '');
  const [artistFilter, setArtistFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState<SongType | 'all'>('all');
  const [showUnlistedOnly, setShowUnlistedOnly] = useState(false);
  const [practiceSongIds, setPracticeSongIds] = useState<string[]>(initialPracticeSongIds);

  useEffect(() => {
    setQuery(searchParams.get('q') ?? '');
  }, [searchParams]);

  useEffect(() => {
    setPracticeSongIds(initialPracticeSongIds);
  }, [initialPracticeSongIds]);

  useEffect(() => {
    if (authMode !== 'demo') {
      return;
    }

    const syncPracticeList = () => {
      const saved = window.localStorage.getItem(demoStorageKey);
      if (!saved) {
        setPracticeSongIds(initialPracticeSongIds);
        return;
      }

      try {
        const parsedItems = JSON.parse(saved) as Array<{ song_id: string }>;
        setPracticeSongIds(parsedItems.map((item) => item.song_id));
      } catch {
        setPracticeSongIds(initialPracticeSongIds);
      }
    };

    syncPracticeList();
    window.addEventListener('storage', syncPracticeList);
    window.addEventListener('focus', syncPracticeList);

    return () => {
      window.removeEventListener('storage', syncPracticeList);
      window.removeEventListener('focus', syncPracticeList);
    };
  }, [authMode, initialPracticeSongIds]);

  const artists = useMemo(() => Array.from(new Set(songs.map((song) => song.artist))), []);
  const practiceSongIdSet = useMemo(() => new Set(practiceSongIds), [practiceSongIds]);

  const filteredSongs = useMemo(() => {
    return songs.filter((song) => {
      const matchesQuery = song.title
        .toLocaleLowerCase('tr-TR')
        .includes(query.toLocaleLowerCase('tr-TR'));
      const matchesArtist = artistFilter === 'all' || song.artist === artistFilter;
      const matchesType = typeFilter === 'all' || song.type === typeFilter;
      const matchesPractice = !showUnlistedOnly || !practiceSongIdSet.has(song.id);

      return matchesQuery && matchesArtist && matchesType && matchesPractice;
    });
  }, [artistFilter, practiceSongIdSet, query, showUnlistedOnly, typeFilter]);

  return (
    <main className="container-base py-12 sm:py-16">
      <p className="eyebrow">Repertuvar</p>
      <h1 className="page-title mt-4 text-3xl sm:text-4xl">Türküler</h1>
      <p className="muted-copy mt-4 leading-7">Tüm sanatçıların eserleri tek ekranda.</p>

      <div className="mt-6">
        <SongFilters
          query={query}
          artistFilter={artistFilter}
          typeFilter={typeFilter}
          artists={artists}
          onQueryChange={setQuery}
          onArtistChange={setArtistFilter}
          onTypeChange={setTypeFilter}
          showUnlistedOnly={showUnlistedOnly}
          onShowUnlistedOnlyChange={setShowUnlistedOnly}
          canUsePracticeFilter={authMode !== 'anonymous'}
        />
      </div>

      <section className="mt-6">
        <PaginatedSongList
          songs={filteredSongs}
          practiceSongIds={practiceSongIds}
          itemsPerPage={20}
          emptyTitle="Sonuç bulunamadı"
          emptyDescription="Arama kelimesini veya filtreleri değiştirerek tekrar deneyin."
        />
      </section>
    </main>
  );
}
