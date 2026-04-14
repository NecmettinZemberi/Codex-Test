'use client';

import Link from 'next/link';
import { useMemo, useState } from 'react';
import { PracticeAddAction } from '@/components/songs/PracticeAddAction';
import { formatSongTitle, getSongDetailHref, normalizeForSearch, songTypeLabels } from '@/lib/utils';
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
    <section className="surface overflow-hidden">
      <div className="border-b border-border/80 p-5 sm:p-6">
        <div className="flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">
          <div>
            <p className="eyebrow text-accent">Katalog</p>
            <h2 className="mt-3 font-display text-3xl font-semibold text-text">Tüm parçalar</h2>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-muted">
              Katalogdaki herhangi bir parçayı filtreleyip doğrudan çalışma listene ekleyebilirsin.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-2 sm:flex sm:items-center">
            <div className="rounded-lg border border-border/80 bg-surface2/60 px-3 py-2">
              <p className="text-[11px] uppercase tracking-[0.16em] text-muted">Sıralama</p>
              <p className="mt-1 text-sm font-semibold text-text">Alfabetik</p>
            </div>
            <div className="rounded-lg border border-border/80 bg-surface2/60 px-3 py-2">
              <p className="text-[11px] uppercase tracking-[0.16em] text-muted">Sonuç</p>
              <p className="mt-1 text-sm font-semibold text-text">
                {filteredSongs.length} parça
              </p>
            </div>
          </div>
        </div>

        <div className="mt-5 rounded-xl border border-border/80 bg-base/25 p-4">
          <div className="grid gap-4 lg:grid-cols-[minmax(0,1.35fr)_220px_180px]">
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
        </div>
      </div>

      <div className="grid gap-3 p-5 sm:p-6 lg:grid-cols-2">
        {filteredSongs.map((song) => (
          <article
            key={song.id}
            className="group rounded-xl border border-border/85 bg-surface2/70 p-4 transition-all duration-300 ease-out hover:border-accent/30 hover:bg-[linear-gradient(180deg,rgba(255,255,255,0.035),rgba(255,255,255,0.012))] hover:shadow-[0_18px_42px_rgba(0,0,0,0.18)]"
          >
            <div className="flex h-full flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="min-w-0">
                <h3 className="font-display text-[1.55rem] font-semibold leading-tight text-text">
                  <Link
                    href={getSongDetailHref(song)}
                    className="transition-colors duration-300 ease-out hover:text-accent"
                  >
                    {formatSongTitle(song.title)}
                  </Link>
                </h3>
                <div className="mt-3 flex flex-wrap gap-2">
                  <span className="rounded-lg border border-border/80 bg-base/25 px-2.5 py-1 text-xs text-stone-300">
                    {song.artist}
                  </span>
                  <span className="rounded-lg border border-border/80 bg-base/25 px-2.5 py-1 text-xs text-muted">
                    {songTypeLabels[song.type]}
                  </span>
                </div>
              </div>

              <form action={addAction} className="w-full sm:w-auto sm:shrink-0">
                <input type="hidden" name="song_id" value={song.id} />
                <input type="hidden" name="redirect_to" value={redirectTo} />
                <input type="hidden" name="feedback_mode" value="inline" />
                <PracticeAddAction
                  isInPracticeList={practiceSongIdSet.has(song.id)}
                  idleLabel="Ekle"
                  variant="catalog"
                />
              </form>
            </div>
          </article>
        ))}
      </div>

      {filteredSongs.length === 0 ? (
        <div className="mx-5 mb-5 rounded-xl border border-border bg-surface2/60 p-6 text-sm text-muted sm:mx-6 sm:mb-6">
          Bu filtrelerle eşleşen parça bulunamadı.
        </div>
      ) : null}
    </section>
  );
}
