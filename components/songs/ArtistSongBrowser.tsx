'use client';

import { useEffect, useMemo, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { PaginatedSongList } from '@/components/songs/PaginatedSongList';
import { SongSearchSuggestions } from '@/components/songs/SongSearchSuggestions';
import { songTypeLabels } from '@/lib/utils';
import { Song, SongType } from '@/types/domain';

type ArtistSongBrowserProps = {
  songs: Song[];
  authMode: 'anonymous' | 'demo' | 'supabase';
  initialPracticeSongIds?: string[];
  initialQuery?: string;
  initialType?: SongType | 'all';
};

const demoStorageKey = 'bozlaklab-demo-practice-list';

export function ArtistSongBrowser({
  songs,
  authMode,
  initialPracticeSongIds = [],
  initialQuery = '',
  initialType = 'all',
}: ArtistSongBrowserProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [query, setQuery] = useState(initialQuery);
  const [typeFilter, setTypeFilter] = useState<SongType | 'all'>(initialType);
  const [practiceSongIds, setPracticeSongIds] = useState<string[]>(initialPracticeSongIds);

  useEffect(() => {
    setQuery(initialQuery);
  }, [initialQuery]);

  useEffect(() => {
    setTypeFilter(initialType);
  }, [initialType]);

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

  const filteredSongs = useMemo(() => {
    return songs.filter((song) => {
      const matchesQuery = song.title
        .toLocaleLowerCase('tr-TR')
        .includes(query.toLocaleLowerCase('tr-TR'));
      const matchesType = typeFilter === 'all' || song.type === typeFilter;
      return matchesQuery && matchesType;
    });
  }, [query, songs, typeFilter]);

  const replaceUrlState = (nextQuery: string, nextType: SongType | 'all') => {
    const params = new URLSearchParams();

    if (nextQuery.trim()) {
      params.set('q', nextQuery.trim());
    }

    if (nextType !== 'all') {
      params.set('type', nextType);
    }

    const nextHref = params.toString() ? `${pathname}?${params.toString()}` : pathname;
    router.replace(nextHref);
  };

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
                  onClick={() => {
                    setQuery('');
                    replaceUrlState('', typeFilter);
                  }}
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
              onSelect={(song) => {
                setQuery(song.title);
                replaceUrlState(song.title, typeFilter);
              }}
            />
          </label>

          <label className="text-sm">
            <span className="mb-2 block text-muted">Tür</span>
            <select
              value={typeFilter}
              onChange={(event) => {
                const nextType = event.target.value as SongType | 'all';
                setTypeFilter(nextType);
                replaceUrlState(query, nextType);
              }}
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
          practiceSongIds={practiceSongIds}
          itemsPerPage={20}
          emptyTitle="Sonuç bulunamadı"
          emptyDescription="Arama ifadesini veya tür filtresini değiştirerek tekrar deneyin."
        />
      </div>
    </div>
  );
}
