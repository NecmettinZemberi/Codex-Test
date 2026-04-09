'use client';

import Link from 'next/link';
import { useMemo, useState } from 'react';
import { PracticeAddAction } from '@/components/songs/PracticeAddAction';
import { getSongDetailHref, normalizeForSearch, songTypeLabels } from '@/lib/utils';
import type { Song, SongType } from '@/types/domain';

type AllSongsCatalogProps = {
  songs: Song[];
  practiceSongIds?: string[];
  addAction: (formData: FormData) => void | Promise<void>;
  redirectTo: string;
};

export function AllSongsCatalog({
  songs,
  practiceSongIds = [],
  addAction,
  redirectTo,
}: AllSongsCatalogProps) {
  const [query, setQuery] = useState('');
  const [artistFilter, setArtistFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState<SongType | 'all'>('all');

  const artists = useMemo(
    () =>
      Array.from(new Set(songs.map((song) => song.artist))).sort((left, right) =>
        left.localeCompare(right, 'tr'),
      ),
    [songs],
  );

  const practiceSongIdSet = useMemo(() => new Set(practiceSongIds), [practiceSongIds]);

  const filteredSongs = useMemo(() => {
    const normalizedQuery = normalizeForSearch(query);

    return [...songs]
      .sort((left, right) => {
        const titleCompare = left.title.localeCompare(right.title, 'tr');
        if (titleCompare !== 0) {
          return titleCompare;
        }

        return left.artist.localeCompare(right.artist, 'tr');
      })
      .filter((song) => {
        const matchesQuery =
          !normalizedQuery ||
          normalizeForSearch(song.title).includes(normalizedQuery) ||
          normalizeForSearch(song.artist).includes(normalizedQuery);
        const matchesArtist = artistFilter === 'all' || song.artist === artistFilter;
        const matchesType = typeFilter === 'all' || song.type === typeFilter;

        return matchesQuery && matchesArtist && matchesType;
      });
  }, [artistFilter, query, songs, typeFilter]);

  return (
    <section className="surface p-5">
      <h2 className="font-display text-3xl font-semibold text-text">Tüm parçalar</h2>
      <p className="mt-3 text-sm leading-6 text-muted">
        Katalogdaki herhangi bir parçayı filtreleyip doğrudan çalışma listene ekleyebilirsin.
      </p>

      <div className="mt-5 grid gap-4 lg:grid-cols-[minmax(0,1.3fr)_220px_180px]">
        <label className="text-sm">
          <span className="mb-2 block text-muted">Parça veya sanatçı ara</span>
          <div className="relative">
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              className="field-input pr-10"
              placeholder="Örn. Viran, Neşet"
            />
            {query ? (
              <button
                type="button"
                onClick={() => setQuery('')}
                aria-label="Aramayı temizle"
                className="absolute right-3 top-1/2 inline-flex h-6 w-6 -translate-y-1/2 items-center justify-center rounded-full text-base text-muted transition hover:bg-surface hover:text-text"
              >
                ×
              </button>
            ) : null}
          </div>
        </label>

        <label className="text-sm">
          <span className="mb-2 block text-muted">Sanatçı</span>
          <select
            value={artistFilter}
            onChange={(event) => setArtistFilter(event.target.value)}
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
            onChange={(event) => setTypeFilter(event.target.value as SongType | 'all')}
            className="field-input"
          >
            <option value="all">Tümü</option>
            <option value="bozlak">Bozlak</option>
            <option value="turku">Türkü</option>
            <option value="uzun hava">Uzun hava</option>
          </select>
        </label>
      </div>

      <div className="mt-4 flex items-center justify-between gap-3 border-t border-border/80 pt-4">
        <p className="text-sm text-muted">
          Varsayılan sıralama: <span className="text-text">Alfabetik</span>
        </p>
        <p className="text-sm text-muted">{filteredSongs.length} parça gösteriliyor</p>
      </div>

      <div className="mt-5 grid gap-4 lg:grid-cols-2">
        {filteredSongs.map((song) => (
          <article key={song.id} className="rounded-xl border border-border bg-surface2 p-4">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h3 className="font-display text-2xl font-semibold text-text">
                  <Link href={getSongDetailHref(song)} className="transition hover:text-accent">
                    {song.title}
                  </Link>
                </h3>
                <p className="mt-2 text-sm text-muted">
                  {song.artist} · {songTypeLabels[song.type]}
                </p>
              </div>

              <form action={addAction}>
                <input type="hidden" name="song_id" value={song.id} />
                <input type="hidden" name="redirect_to" value={redirectTo} />
                <input type="hidden" name="feedback_mode" value="inline" />
                <PracticeAddAction
                  isInPracticeList={practiceSongIdSet.has(song.id)}
                  idleLabel="Ekle"
                />
              </form>
            </div>
          </article>
        ))}
      </div>

      {filteredSongs.length === 0 ? (
        <div className="mt-5 rounded-xl border border-border bg-surface2/60 p-6 text-sm text-muted">
          Bu filtrelerle eşleşen parça bulunamadı.
        </div>
      ) : null}
    </section>
  );
}
