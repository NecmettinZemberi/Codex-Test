'use client';

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
  return (
    <section className="surface p-5">
      <h2 className="font-display text-3xl font-semibold text-text">Arama ve filtre</h2>
      <div className="mt-4 grid gap-4 sm:grid-cols-3">
        <label className="text-sm">
          <span className="mb-2 block text-muted">Türkü ara</span>
          <input
            value={query}
            onChange={(event) => onQueryChange(event.target.value)}
            className="field-input"
            placeholder="Örn. Neredesin"
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
