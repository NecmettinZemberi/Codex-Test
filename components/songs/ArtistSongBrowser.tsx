'use client';

import { useEffect, useMemo, useState } from 'react';
import { PaginatedSongList } from '@/components/songs/PaginatedSongList';
import { SongSearchSuggestions } from '@/components/songs/SongSearchSuggestions';
import { songTypeLabels } from '@/lib/utils';
import { Song, SongType } from '@/types/domain';

type ArtistSongBrowserProps = {
  songs: Song[];
  initialQuery?: string;
  initialType?: SongType | 'all';
};

export function ArtistSongBrowser({
  songs,
  initialQuery = '',
  initialType = 'all',
}: ArtistSongBrowserProps) {
  const [query, setQuery] = useState(initialQuery);
  const [typeFilter, setTypeFilter] = useState<SongType | 'all'>(initialType);

  useEffect(() => {
    setQuery(initialQuery);
  }, [initialQuery]);

  useEffect(() => {
    setTypeFilter(initialType);
  }, [initialType]);

  const filteredSongs = useMemo(() => {
    return songs.filter((song) => {
      const matchesQuery = song.title
        .toLocaleLowerCase('tr-TR')
        .includes(query.toLocaleLowerCase('tr-TR'));
      const matchesType = typeFilter === 'all' || song.type === typeFilter;
      return matchesQuery && matchesType;
    });
  }, [query, songs, typeFilter]);

  return (
    <div>
      <section className="surface p-5">
        <div className="grid gap-4 md:grid-cols-[minmax(0,1fr)_220px]">
          <label className="relative text-sm">
            <span className="mb-2 block text-muted">Sanatçı içinde ara</span>
            <div className="relative">
              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                className="field-input pr-10"
                placeholder="Türkü adı yaz"
              />
              {query ? (
                <button
                  type="button"
                  onClick={() => setQuery('')}
                  aria-label="Aramayı temizle"
                  className="absolute right-3 top-1/2 inline-flex h-6 w-6 -translate-y-1/2 items-center justify-center rounded-full text-base text-muted transition hover:bg-surface2 hover:text-text"
                >
                  ×
                </button>
              ) : null}
            </div>
            <SongSearchSuggestions
              songs={songs}
              query={query}
              onSelect={(song) => setQuery(song.title)}
            />
          </label>

          <label className="text-sm">
            <span className="mb-2 block text-muted">Tür</span>
            <select
              value={typeFilter}
              onChange={(event) => setTypeFilter(event.target.value as SongType | 'all')}
              className="field-input"
            >
              <option value="all">Tümü</option>
              <option value="turku">{songTypeLabels.turku}</option>
              <option value="bozlak">{songTypeLabels.bozlak}</option>
              <option value="uzun hava">{songTypeLabels['uzun hava']}</option>
            </select>
          </label>
        </div>
      </section>

      <div className="mt-5">
        <PaginatedSongList
          songs={filteredSongs}
          itemsPerPage={20}
          emptyTitle="Sonuç bulunamadı"
          emptyDescription="Arama ifadesini veya tür filtresini değiştirerek tekrar deneyin."
        />
      </div>
    </div>
  );
}
