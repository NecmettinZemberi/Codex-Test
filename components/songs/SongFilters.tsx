'use client';

import { usePathname, useRouter } from 'next/navigation';
import { songs } from '@/data/mockData';
import { SongSearchSuggestions } from '@/components/songs/SongSearchSuggestions';
import { getSongHref } from '@/lib/utils';
import { SongType } from '@/types/domain';

type SongFiltersProps = {
  query: string;
  artistFilter: string;
  typeFilter: SongType | 'all';
  artists: string[];
  onQueryChange: (value: string) => void;
  onArtistChange: (value: string) => void;
  onTypeChange: (value: SongType | 'all') => void;
};

export function SongFilters({
  query,
  artistFilter,
  typeFilter,
  artists,
  onQueryChange,
  onArtistChange,
  onTypeChange,
}: SongFiltersProps) {
  const pathname = usePathname();
  const router = useRouter();

  const clearQuery = () => {
    onQueryChange('');
    router.replace(pathname);
  };

  return (
    <section className="surface p-5">
      <h2 className="font-display text-3xl font-semibold text-text">Arama ve filtre</h2>

      <div className="mt-4 grid gap-4 sm:grid-cols-3">
        <label className="relative text-sm">
          <span className="mb-2 block text-muted">Türkü ara</span>
          <div className="relative">
            <input
              value={query}
              onChange={(event) => onQueryChange(event.target.value)}
              className="field-input pr-10"
              placeholder="Örn. Neredesin"
            />
            {query ? (
              <button
                type="button"
                onClick={clearQuery}
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
              onQueryChange(song.title);
              router.push(getSongHref(song));
            }}
          />
        </label>

        <label className="text-sm">
          <span className="mb-2 block text-muted">Sanatçı</span>
          <select
            value={artistFilter}
            onChange={(event) => onArtistChange(event.target.value)}
            className="field-input"
          >
            <option value="all">Tümü</option>
            {artists.map((artist) => (
              <option key={artist} value={artist}>
                {artist}
              </option>
            ))}
          </select>
        </label>

        <label className="text-sm">
          <span className="mb-2 block text-muted">Tür</span>
          <select
            value={typeFilter}
            onChange={(event) => onTypeChange(event.target.value as SongType | 'all')}
            className="field-input"
          >
            <option value="all">Tümü</option>
            <option value="bozlak">Bozlak</option>
            <option value="turku">Türkü</option>
            <option value="uzun hava">Uzun hava</option>
          </select>
        </label>
      </div>
    </section>
  );
}
