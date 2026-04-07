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
      <h2 className="text-lg font-semibold text-white">Arama ve Filtre</h2>
      <div className="mt-4 grid gap-4 sm:grid-cols-3">
        <label className="text-sm">
          <span className="mb-2 block text-slate-300">Türkü ara</span>
          <input
            value={query}
            onChange={(event) => onQueryChange(event.target.value)}
            className="w-full rounded-lg border border-border bg-slate-900 px-3 py-2 text-sm"
            placeholder="Örn. Neredesin"
          />
        </label>

        <label className="text-sm">
          <span className="mb-2 block text-slate-300">Sanatçı</span>
          <select
            value={artistFilter}
            onChange={(event) => onArtistChange(event.target.value)}
            className="w-full rounded-lg border border-border bg-slate-900 px-3 py-2 text-sm"
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
          <span className="mb-2 block text-slate-300">Tür</span>
          <select
            value={typeFilter}
            onChange={(event) => onTypeChange(event.target.value as SongType | 'all')}
            className="w-full rounded-lg border border-border bg-slate-900 px-3 py-2 text-sm"
          >
            <option value="all">Tümü</option>
            <option value="bozlak">Bozlak</option>
            <option value="turku">Türkü</option>
            <option value="uzun hava">Uzun Hava</option>
          </select>
        </label>
      </div>
    </section>
  );
}
