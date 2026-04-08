import { redirect } from 'next/navigation';
import { createClient } from '@/utils/supabase/server';
import { EmptyState } from '@/components/ui/EmptyState';
import { AuthButtons } from '@/components/ui/AuthButtons';
import { songTypeLabels } from '@/lib/utils';
import { addPracticeItem, updatePracticeStatus } from './actions';

const statuses = [
  { value: 'planlandi', label: 'Planlandı' },
  { value: 'siraya_alindi', label: 'Sıraya Alındı' },
  { value: 'calisiliyor', label: 'Çalışılıyor' },
  { value: 'tamamlandi', label: 'Tamamlandı' },
];

export default async function DashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  const { data: songs } = await supabase
    .from('songs')
    .select('id,title,artist,type')
    .order('created_at', { ascending: false });

  const { data: practiceItems } = await supabase
    .from('user_practice_list')
    .select(
      `
      id,
      status,
      sort_order,
      personal_note,
      songs (id, title, artist, type)
    `,
    )
    .eq('user_id', user.id)
    .order('sort_order', { ascending: true });

  return (
    <main className="container-base py-12 sm:py-16">
      <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-semibold text-white">Çalışma Listem</h1>
          <p className="mt-2 text-slate-300">Sadece sana ait parçalar burada listelenir.</p>
        </div>
        <AuthButtons authenticated />
      </div>

      <section className="surface p-5">
        <h2 className="text-lg font-semibold text-white">Listeye Parça Ekle</h2>
        <form action={addPracticeItem} className="mt-4 flex flex-col gap-3 sm:flex-row">
          <select
            name="song_id"
            className="w-full rounded-lg border border-border bg-slate-900 px-3 py-2 text-sm"
            required
          >
            <option value="">Parça seç</option>
            {(songs ?? []).map((song) => (
              <option key={song.id} value={song.id}>
                {song.title} - {song.artist} ({songTypeLabels[song.type]})
              </option>
            ))}
          </select>
          <button
            type="submit"
            className="rounded-lg bg-accent px-5 py-2 text-sm font-semibold text-slate-900 hover:bg-amber-300"
          >
            Ekle
          </button>
        </form>
      </section>

      <section className="mt-6 grid gap-4">
        {(practiceItems ?? []).length === 0 ? (
          <EmptyState
            title="Henüz parça eklenmedi"
            description="Yukarıdaki alandan bir türkü seçip çalışma listene ekleyebilirsin."
          />
        ) : (
          (practiceItems ?? []).map((item) => {
            const song = Array.isArray(item.songs) ? item.songs[0] : item.songs;
            if (!song) return null;

            return (
              <article key={item.id} className="surface p-5">
                <h3 className="text-lg font-semibold text-white">
                  {song.title} <span className="text-sm text-slate-400">({song.artist})</span>
                </h3>
                <p className="mt-2 text-sm text-slate-400">Tür: {songTypeLabels[song.type]}</p>

                <form action={updatePracticeStatus} className="mt-4 flex items-center gap-3">
                  <input type="hidden" name="item_id" value={item.id} />
                  <select
                    name="status"
                    defaultValue={item.status}
                    className="rounded-lg border border-border bg-slate-900 px-3 py-2 text-sm"
                  >
                    {statuses.map((status) => (
                      <option key={status.value} value={status.value}>
                        {status.label}
                      </option>
                    ))}
                  </select>
                  <button
                    type="submit"
                    className="rounded-lg border border-border px-4 py-2 text-sm text-slate-200 hover:bg-slate-800"
                  >
                    Güncelle
                  </button>
                </form>
              </article>
            );
          })
        )}
      </section>
    </main>
  );
}
