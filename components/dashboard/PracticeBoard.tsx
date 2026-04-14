'use client';

import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import { songs } from '@/data/mockData';
import {
  getSongById,
  getSongDetailHref,
  formatSongTitle,
  songTypeLabels,
  statusClasses,
  statusLabels,
} from '@/lib/utils';
import { PracticeStatus, UserPracticeItem } from '@/types/domain';

type PracticeBoardProps = {
  initialItems: UserPracticeItem[];
  pendingSongId?: string;
  initialStatusFilter?: PracticeStatus | 'all';
  activeTab?: 'all-songs' | 'practice' | 'account';
};

const storageKey = 'bozlaklab-demo-practice-list';

const sortedSongs = [...songs].sort((left, right) => {
  const titleCompare = left.title.localeCompare(right.title, 'tr');
  if (titleCompare !== 0) {
    return titleCompare;
  }

  return left.artist.localeCompare(right.artist, 'tr');
});

const statusOptions: Array<{ value: PracticeStatus | 'all'; label: string }> = [
  { value: 'all', label: 'Tüm durumlar' },
  { value: 'planlandi', label: 'Planlandı' },
  { value: 'siraya_alindi', label: 'Sıraya alındı' },
  { value: 'calisiliyor', label: 'Çalışılıyor' },
  { value: 'tamamlandi', label: 'Tamamlandı' },
];

export function PracticeBoard({
  initialItems,
  pendingSongId,
  initialStatusFilter = 'all',
  activeTab = 'practice',
}: PracticeBoardProps) {
  const [items, setItems] = useState(initialItems);
  const [selectedSongId, setSelectedSongId] = useState(sortedSongs[0]?.id ?? '');
  const [statusFilter, setStatusFilter] = useState<PracticeStatus | 'all'>(initialStatusFilter);

  useEffect(() => {
    const saved = window.localStorage.getItem(storageKey);
    if (!saved) {
      return;
    }

    try {
      const parsedItems = JSON.parse(saved) as UserPracticeItem[];
      setItems(parsedItems);
    } catch {
      window.localStorage.removeItem(storageKey);
    }
  }, []);

  useEffect(() => {
    window.localStorage.setItem(storageKey, JSON.stringify(items));
  }, [items]);

  useEffect(() => {
    if (!pendingSongId) {
      return;
    }

    setItems((prev) => {
      if (prev.some((item) => item.song_id === pendingSongId)) {
        return prev;
      }

      const now = new Date().toISOString();
      return [
        ...prev,
        {
          id: `local-${crypto.randomUUID()}`,
          user_id: 'demo-user',
          song_id: pendingSongId,
          status: 'planlandi',
          sort_order: prev.length + 1,
          personal_note: '',
          target_date: null,
          created_at: now,
          updated_at: now,
        },
      ];
    });
  }, [pendingSongId]);

  const orderedItems = useMemo(
    () => [...items].sort((a, b) => a.sort_order - b.sort_order),
    [items],
  );

  const filteredItems = useMemo(() => {
    return orderedItems.filter((item) => statusFilter === 'all' || item.status === statusFilter);
  }, [orderedItems, statusFilter]);
  const itemSongIdSet = useMemo(() => new Set(items.map((item) => item.song_id)), [items]);

  const addSong = () => {
    if (!selectedSongId || itemSongIdSet.has(selectedSongId)) {
      return;
    }

    const now = new Date().toISOString();
    setItems((prev) => [
      ...prev,
      {
        id: `local-${crypto.randomUUID()}`,
        user_id: 'demo-user',
        song_id: selectedSongId,
        status: 'planlandi',
        sort_order: prev.length + 1,
        personal_note: '',
        target_date: null,
        created_at: now,
        updated_at: now,
      },
    ]);
  };

  const updateItem = (id: string, patch: Partial<UserPracticeItem>) => {
    setItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, ...patch, updated_at: new Date().toISOString() } : item,
      ),
    );
  };

  const removeSong = (id: string) => {
    setItems((prev) =>
      prev
        .filter((item) => item.id !== id)
        .map((item, index) => ({
          ...item,
          sort_order: index + 1,
          updated_at: new Date().toISOString(),
        })),
    );
  };

  const moveUp = (id: string) => {
    setItems((prev) => {
      const sorted = [...prev].sort((a, b) => a.sort_order - b.sort_order);
      const index = sorted.findIndex((item) => item.id === id);
      if (index <= 0) {
        return prev;
      }

      [sorted[index - 1], sorted[index]] = [sorted[index], sorted[index - 1]];
      return sorted.map((item, idx) => ({ ...item, sort_order: idx + 1 }));
    });
  };

  if (activeTab === 'all-songs') {
    return (
      <section className="surface overflow-hidden">
        <div className="border-b border-border/80 p-5 sm:p-6">
          <div className="flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">
            <div>
              <p className="eyebrow text-accent">Katalog</p>
              <h2 className="mt-3 font-display text-3xl font-semibold text-text">Tüm parçalar</h2>
              <p className="mt-3 max-w-2xl text-sm leading-6 text-muted">
                Demo katalogdan dilediğin parçayı seçip çalışma listene yerel olarak ekleyebilirsin.
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
                  {sortedSongs.length} parça
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid gap-3 p-5 sm:p-6 lg:grid-cols-2">
          {sortedSongs.map((song) => {
            const isInPracticeList = itemSongIdSet.has(song.id);

            return (
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
                  <button
                    onClick={() => {
                      setSelectedSongId(song.id);
                      if (!isInPracticeList) {
                        const now = new Date().toISOString();
                        setItems((prev) => [
                          ...prev,
                          {
                            id: `local-${crypto.randomUUID()}`,
                            user_id: 'demo-user',
                            song_id: song.id,
                            status: 'planlandi',
                            sort_order: prev.length + 1,
                            personal_note: '',
                            target_date: null,
                            created_at: now,
                            updated_at: now,
                          },
                        ]);
                      }
                    }}
                    disabled={isInPracticeList}
                    className="inline-flex w-full min-w-[112px] items-center justify-center rounded-lg border border-accent/35 bg-accent/10 px-5 py-2.5 text-sm font-semibold text-stone-100 transition-all duration-300 ease-out hover:border-accent/65 hover:bg-accent/18 hover:text-white hover:shadow-[0_14px_34px_rgba(143,107,59,0.14)] active:bg-accent/14 disabled:cursor-default disabled:border-emerald-500/45 disabled:bg-emerald-500/10 disabled:text-emerald-100 disabled:shadow-[0_10px_28px_rgba(16,185,129,0.09)] sm:w-auto"
                  >
                    {isInPracticeList ? 'Eklendi' : 'Ekle'}
                  </button>
                </div>
              </article>
            );
          })}
        </div>
      </section>
    );
  }

  if (activeTab === 'account') {
    return (
      <section className="surface p-5">
        <h2 className="font-display text-3xl font-semibold text-text">Hesap ayarları</h2>
        <p className="mt-3 text-sm leading-6 text-muted">
          Bu demo hesap gerçek kullanıcı verisi tutmaz. Buradaki değişiklikler yalnızca mevcut
          tarayıcıda saklanır.
        </p>

        <div className="mt-5 grid gap-4 sm:grid-cols-2">
          <div className="rounded-xl border border-border bg-surface2 p-4">
            <p className="eyebrow">Hesap türü</p>
            <p className="mt-3 text-lg font-medium text-text">Demo kullanıcı</p>
          </div>
          <div className="rounded-xl border border-border bg-surface2 p-4">
            <p className="eyebrow">Kayıt durumu</p>
            <p className="mt-3 text-lg font-medium text-text">Yerel tarayıcı verisi</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="space-y-6">
      <div className="surface p-5">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <h2 className="font-display text-3xl font-semibold text-text">Çalışma listem</h2>
            <p className="mt-3 text-sm leading-6 text-muted">
              Demo moddaki değişiklikler bu tarayıcıda saklanır. Gerçek hesaba aktarılmaz.
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <select
              value={selectedSongId}
              onChange={(event) => setSelectedSongId(event.target.value)}
              className="field-input"
            >
              {sortedSongs.map((song) => (
                <option key={song.id} value={song.id}>
                  {formatSongTitle(song.title)} - {song.artist} ({songTypeLabels[song.type]})
                </option>
              ))}
            </select>
            <button onClick={addSong} className="button-primary py-2">
              Listeye ekle
            </button>
          </div>
        </div>
      </div>

      <div className="surface p-5">
        <p className="eyebrow">Durum filtreleri</p>
        <div className="mt-4 flex flex-wrap gap-2">
          {statusOptions.map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => setStatusFilter(option.value)}
              className={
                option.value === 'all'
                  ? statusFilter === option.value
                    ? 'inline-flex items-center justify-center rounded-lg border border-accent bg-accent px-4 py-2 text-sm font-semibold text-base'
                    : 'button-secondary px-4 py-2 text-sm'
                  : statusFilter === option.value
                    ? `inline-flex items-center justify-center rounded-lg border px-4 py-2 text-sm font-semibold ${statusClasses[option.value]}`
                    : `inline-flex items-center justify-center rounded-lg border px-4 py-2 text-sm transition hover:border-border/80 hover:text-text ${statusClasses[option.value]} opacity-80`
              }
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>

      <div className="grid gap-4">
        {filteredItems.map((item) => {
          const song = getSongById(item.song_id);
          if (!song) {
            return null;
          }

          return (
            <article key={item.id} className="surface-alt p-5">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <h3 className="font-display text-3xl font-semibold text-text">
                    <Link href={getSongDetailHref(song)} className="transition hover:text-accent">
                      {formatSongTitle(song.title)}
                    </Link>{' '}
                    <span className="font-body text-sm text-muted">({song.artist})</span>
                  </h3>
                  <p className="mt-2 flex flex-wrap items-center gap-2 text-sm text-muted">
                    <span>Tür: {songTypeLabels[song.type]}</span>
                    <span className="text-border">•</span>
                    <span
                      className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] ${statusClasses[item.status]}`}
                    >
                      {statusLabels[item.status]}
                    </span>
                  </p>
                </div>

                <div className="flex flex-wrap gap-2">
                  <button onClick={() => moveUp(item.id)} className="button-secondary px-4 py-2 text-sm">
                    Üste al
                  </button>
                  <button
                    onClick={() => removeSong(item.id)}
                    className="button-secondary px-4 py-2 text-sm"
                  >
                    Kaldır
                  </button>
                </div>
              </div>

              <div className="mt-4 grid gap-4 sm:grid-cols-2">
                <label className="text-sm text-muted">
                  Durum
                  <select
                    value={item.status}
                    onChange={(event) =>
                      updateItem(item.id, {
                        status: event.target.value as PracticeStatus,
                      })
                    }
                    className="field-input mt-1"
                  >
                    <option value="planlandi">Planlandı</option>
                    <option value="siraya_alindi">Sıraya alındı</option>
                    <option value="calisiliyor">Çalışılıyor</option>
                    <option value="tamamlandi">Tamamlandı</option>
                  </select>
                </label>

                <label className="text-sm text-muted">
                  Hedef çalışma tarihi
                  <input
                    type="date"
                    value={item.target_date ?? ''}
                    onChange={(event) =>
                      updateItem(item.id, {
                        target_date: event.target.value || null,
                      })
                    }
                    className="field-input mt-1"
                  />
                </label>
              </div>

              <label className="mt-4 block text-sm text-muted">
                Kişisel not
                <textarea
                  value={item.personal_note}
                  onChange={(event) =>
                    updateItem(item.id, {
                      personal_note: event.target.value,
                    })
                  }
                  rows={4}
                  className="field-input mt-1 min-h-28 resize-y"
                  placeholder="Bu parça için demo notlarını burada tutabilirsin."
                />
              </label>
            </article>
          );
        })}
      </div>
    </section>
  );
}
