import { artists, songs } from '@/data/mockData';
import { PracticeStatus, Song, SongType } from '@/types/domain';
export { formatSongTitle } from '@/lib/text';

export const statusLabels: Record<PracticeStatus, string> = {
  planlandi: 'Planlandı',
  siraya_alindi: 'Sıraya alındı',
  calisiliyor: 'Çalışılıyor',
  tamamlandi: 'Tamamlandı',
};

export const statusClasses: Record<PracticeStatus, string> = {
  planlandi:
    'border-stone-600/80 bg-stone-500/10 text-stone-200',
  siraya_alindi:
    'border-amber-700/70 bg-amber-700/10 text-amber-200',
  calisiliyor:
    'border-sky-700/70 bg-sky-700/10 text-sky-200',
  tamamlandi:
    'border-emerald-700/80 bg-emerald-700/15 text-emerald-200',
};

export const songTypeLabels: Record<SongType, string> = {
  bozlak: 'Bozlak',
  turku: 'Türkü',
  'uzun hava': 'Uzun hava',
};

export function getSongById(songId: string) {
  return songs.find((song) => song.id === songId);
}

export function normalizeForSearch(value: string) {
  return value
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')
    .toLocaleLowerCase('tr-TR')
    .trim();
}

export function slugify(value: string) {
  return normalizeForSearch(value)
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
}

export function getSongSlug(song: Pick<Song, 'title' | 'artist'>) {
  return `${slugify(song.artist)}--${slugify(song.title)}`;
}

export function getSongDetailHref(song: Pick<Song, 'title' | 'artist'>) {
  return `/turkuler/${getSongSlug(song)}`;
}

export function getSongSuggestions(items: Song[], query: string, limit = 6) {
  const normalizedQuery = normalizeForSearch(query);

  if (!normalizedQuery) {
    return [];
  }

  return items
    .map((song) => {
      const normalizedTitle = normalizeForSearch(song.title);

      if (normalizedTitle === normalizedQuery) {
        return { song, rank: 0, matchIndex: 0 };
      }

      if (normalizedTitle.startsWith(normalizedQuery)) {
        return { song, rank: 1, matchIndex: 0 };
      }

      const matchIndex = normalizedTitle.indexOf(normalizedQuery);
      if (matchIndex >= 0) {
        return { song, rank: 2, matchIndex };
      }

      return null;
    })
    .filter((item): item is { song: Song; rank: number; matchIndex: number } => item !== null)
    .sort((left, right) => {
      if (left.rank !== right.rank) {
        return left.rank - right.rank;
      }

      if (left.matchIndex !== right.matchIndex) {
        return left.matchIndex - right.matchIndex;
      }

      return left.song.title.localeCompare(right.song.title, 'tr');
    })
    .slice(0, limit)
    .map((item) => item.song);
}

export function findBestSongMatch(items: Song[], query: string) {
  return getSongSuggestions(items, query, 1)[0] ?? null;
}

export function getArtistByName(name: string) {
  return artists.find((artist) => artist.name === name) ?? null;
}

export function getSongHref(song: Pick<Song, 'title' | 'artist'>) {
  const artist = getArtistByName(song.artist);

  if (!artist) {
    return `/turkuler?q=${encodeURIComponent(song.title)}`;
  }

  return `/artists/${artist.slug}?q=${encodeURIComponent(song.title)}`;
}

export function getSearchHref(query: string) {
  const trimmed = query.trim();

  if (!trimmed) {
    return '/turkuler';
  }

  const match = findBestSongMatch(songs, trimmed);

  if (!match) {
    return `/turkuler?q=${encodeURIComponent(trimmed)}`;
  }

  return getSongHref(match);
}
