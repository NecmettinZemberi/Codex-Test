'use client';

import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { SongFilters } from '@/components/songs/SongFilters';
import { PaginatedSongList } from '@/components/songs/PaginatedSongList';
import { songs } from '@/data/mockData';
import { SongType } from '@/types/domain';

export default function TurkulerPage() {
  const searchParams = useSearchParams();
  const [query, setQuery] = useState(searchParams.get('q') ?? '');
  const [artistFilter, setArtistFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState<SongType | 'all'>('all');

  useEffect(() => {
    setQuery(searchParams.get('q') ?? '');
  }, [searchParams]);

  const artists = useMemo(() => Array.from(new Set(songs.map((song) => song.artist))), []);

  const filteredSongs = useMemo(() => {
    return songs.filter((song) => {
      const matchesQuery = song.title.toLocaleLowerCase('tr-TR').includes(query.toLocaleLowerCase('tr-TR'));
      const matchesArtist = artistFilter === 'all' || song.artist === artistFilter;
      const matchesType = typeFilter === 'all' || song.type === typeFilter;
      return matchesQuery && matchesArtist && matchesType;
    });
  }, [query, artistFilter, typeFilter]);

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
        />
      </div>

      <section className="mt-6">
        <PaginatedSongList
          songs={filteredSongs}
          itemsPerPage={20}
          emptyTitle="Sonuç bulunamadı"
          emptyDescription="Arama kelimesini veya filtreleri değiştirerek tekrar deneyin."
        />
      </section>
    </main>
  );
}
