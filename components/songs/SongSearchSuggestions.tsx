'use client';

import { Song } from '@/types/domain';
import { getSongSuggestions, normalizeForSearch } from '@/lib/utils';

type SongSearchSuggestionsProps = {
  songs: Song[];
  query: string;
  onSelect: (song: Song) => void;
};

export function SongSearchSuggestions({
  songs,
  query,
  onSelect,
}: SongSearchSuggestionsProps) {
  const suggestions = getSongSuggestions(songs, query);
  const normalizedQuery = normalizeForSearch(query);
  const hasExactMatch = suggestions.some(
    (song) => normalizeForSearch(song.title) === normalizedQuery,
  );

  if (!query.trim() || suggestions.length === 0 || hasExactMatch) {
    return null;
  }

  return (
    <div className="absolute left-0 right-0 top-[calc(100%+0.5rem)] z-30 rounded-xl border border-border bg-surface shadow-soft">
      <div className="max-h-80 overflow-y-auto p-2">
        {suggestions.map((song) => (
          <button
            key={song.id}
            type="button"
            onClick={() => onSelect(song)}
            className="flex w-full flex-col rounded-lg px-3 py-3 text-left transition hover:bg-surface2"
          >
            <span className="text-sm font-medium text-text">{song.title}</span>
            <span className="mt-1 text-xs uppercase tracking-[0.14em] text-muted">
              {song.artist}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
