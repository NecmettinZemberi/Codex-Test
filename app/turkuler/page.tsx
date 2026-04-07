'use client';

import { useMemo, useState } from 'react';
import { EmptyState } from '@/components/ui/EmptyState';
import { SongCard } from '@/components/songs/SongCard';
import { SongFilters } from '@/components/songs/SongFilters';
import { songs } from '@/data/mockData';
import { SongType } from '@/types/domain';

export default function TurkulerPage() {
  const [query, setQuery] = useState('');
  const [artistFilter, setArtistFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState<SongType | 'all'>('all');

  const artists = useMemo(() => Array.from(new Set(songs.map((song) => song.artist))), []);

  const filteredSongs = useMemo(() => {
    return songs.filter((song) => {
      const matchesQuery = song.title.toLowerCase().includes(query.toLowerCase());
      const matchesArtist = artistFilter === 'all' || song.artist === artistFilter;
      const matchesType = typeFilter === 'all' || song.type === typeFilter;
      return matchesQuery && matchesArtist && matchesType;
    });
  }, [query, artistFilter, typeFilter]);

  return (
    <main className="container-base py-12 sm:py-16">
      <h1 className="text-3xl font-semibold text-white">Türküler</h1>
      <p className="mt-3 text-slate-300">Tüm sanatçıların eserleri tek ekranda.</p>

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

      <section className="mt-6 space-y-4">
        {filteredSongs.length > 0 ? (
          filteredSongs.map((song) => <SongCard key={song.id} song={song} />)
        ) : (
          <EmptyState
            title="Sonuç bulunamadı"
            description="Arama kelimesini veya filtreleri değiştirerek tekrar deneyin."
          />
        )}
      </section>
    </main>
  );
}
