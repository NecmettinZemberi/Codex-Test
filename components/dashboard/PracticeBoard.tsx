'use client';

import { useMemo, useState } from 'react';
import { songs } from '@/data/mockData';
import { UserPracticeItem, PracticeStatus } from '@/types/domain';
import { getSongById, statusLabels } from '@/lib/utils';

type PracticeBoardProps = {
  initialItems: UserPracticeItem[];
};

export function PracticeBoard({ initialItems }: PracticeBoardProps) {
  const [items, setItems] = useState(initialItems);
  const [selectedSongId, setSelectedSongId] = useState(songs[0]?.id ?? '');

  const orderedItems = useMemo(
    () => [...items].sort((a, b) => a.sort_order - b.sort_order),
    [items],
  );

  const addSong = () => {
    if (!selectedSongId || items.some((item) => item.song_id === selectedSongId)) {
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
        created_at: now,
        updated_at: now,
      },
    ]);
  };

  const updateStatus = (id: string, status: PracticeStatus) => {
    setItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, status, updated_at: new Date().toISOString() } : item,
      ),
    );
  };

  const moveUp = (id: string) => {
    setItems((prev) => {
      const sorted = [...prev].sort((a, b) => a.sort_order - b.sort_order);
      const index = sorted.findIndex((item) => item.id === id);
      if (index <= 0) return prev;
      [sorted[index - 1], sorted[index]] = [sorted[index], sorted[index - 1]];
      return sorted.map((item, idx) => ({ ...item, sort_order: idx + 1 }));
    });
  };

  return (
    <section className="space-y-6">
      <div className="surface p-5">
        <h2 className="text-lg font-semibold text-white">Parça Ekle</h2>
        <div className="mt-3 flex flex-col gap-3 sm:flex-row">
          <select
            value={selectedSongId}
            onChange={(event) => setSelectedSongId(event.target.value)}
            className="w-full rounded-lg border border-border bg-slate-900 px-3 py-2 text-sm"
          >
            {songs.map((song) => (
              <option key={song.id} value={song.id}>
                {song.title} - {song.artist}
              </option>
            ))}
          </select>
          <button
            onClick={addSong}
            className="rounded-lg bg-accent px-5 py-2 text-sm font-semibold text-slate-900 hover:bg-amber-300"
          >
            Listeye Ekle
          </button>
        </div>
      </div>

      <div className="grid gap-4">
        {orderedItems.map((item) => {
          const song = getSongById(item.song_id);
          if (!song) return null;

          return (
            <article key={item.id} className="surface p-5">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <h3 className="text-lg font-semibold text-white">
                  {song.title} <span className="text-sm text-slate-400">({song.artist})</span>
                </h3>
                <button onClick={() => moveUp(item.id)} className="text-sm text-accent">
                  ↑ Üste Al
                </button>
              </div>

              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                <label className="text-sm text-slate-300">
                  Durum
                  <select
                    value={item.status}
                    onChange={(event) => updateStatus(item.id, event.target.value as PracticeStatus)}
                    className="mt-1 w-full rounded-lg border border-border bg-slate-900 px-3 py-2"
                  >
                    <option value="planlandi">Planlandı</option>
                    <option value="siraya_alindi">Sıraya Alındı</option>
                    <option value="calisiliyor">Çalışılıyor</option>
                    <option value="tamamlandi">Tamamlandı</option>
                  </select>
                </label>
                <p className="text-sm text-slate-300">
                  Güncel Durum: <strong>{statusLabels[item.status]}</strong>
                </p>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}
