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
  showUnlistedOnly?: boolean;
  canUsePracticeFilter?: boolean;
  onQueryChange: (value: string) => void;
  onArtistChange: (value: string) => void;
  onTypeChange: (value: SongType | 'all') => void;
  onShowUnlistedOnlyChange?: (value: boolean) => void;
};

export function SongFilters({
  query,
  artistFilter,
  typeFilter,
  artists,
  showUnlistedOnly = false,
  canUsePracticeFilter = false,
  onQueryChange,
  onArtistChange,
  onTypeChange,
  onShowUnlistedOnlyChange,
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

      {canUsePracticeFilter && onShowUnlistedOnlyChange ? (
        <div className="mt-5 border-t border-border/80 pt-4">
          <label className="flex cursor-pointer items-start gap-3 rounded-lg border border-border/80 bg-surface2/70 px-4 py-3 transition hover:border-stone-500/60 hover:bg-surface2">
            <span className="relative mt-0.5">
              <input
                type="checkbox"
                checked={showUnlistedOnly}
                onChange={(event) => onShowUnlistedOnlyChange(event.target.checked)}
                className="peer sr-only"
              />
              <span className="flex h-5 w-5 items-center justify-center rounded-md border border-border bg-surface text-transparent transition peer-checked:border-accent peer-checked:bg-accent peer-checked:text-base">
                ✓
              </span>
            </span>
            <span className="space-y-1">
              <span className="block text-sm font-medium text-text">
                Çalışma listemde olmayan türküleri göster
              </span>
              <span className="block text-sm text-muted">
                Repertuvarda henüz listene eklemediğin parçaları hızlıca ayıkla.
              </span>
            </span>
          </label>
        </div>
      ) : null}
    </section>
  );
}
