import { redirect } from 'next/navigation';
import { createClient } from '@/utils/supabase/server';
import { EmptyState } from '@/components/ui/EmptyState';
import { AuthButtons } from '@/components/ui/AuthButtons';
import { songs as catalogSongs } from '@/data/mockData';
import { songTypeLabels } from '@/lib/utils';
import type { SongType } from '@/types/domain';
import { addPracticeItem, updatePracticeStatus } from './actions';

type DashboardPageProps = {
  searchParams?: {
    error?: string;
  };
};

type PracticeItemRow = {
  id: string;
  status: string;
  songs: {
    id: string;
    title: string;
    artist: string;
    type: SongType;
  } | Array<{
    id: string;
    title: string;
    artist: string;
    type: SongType;
  }> | null;
};

const statuses = [
  { value: 'planlandi', label: 'Planlandı' },
  { value: 'siraya_alindi', label: 'Sıraya alındı' },
  { value: 'calisiliyor', label: 'Çalışılıyor' },
  { value: 'tamamlandi', label: 'Tamamlandı' },
];

const dashboardErrors: Record<string, string> = {
  song_not_found: 'Seçilen parça katalogda bulunamadı.',
  catalog_lookup_failed: 'Parça kataloğu kontrol edilirken bir sorun oluştu.',
  catalog_sync_required:
    'Bu parça kullanıcı paneli veritabanına henüz aktarılmadı. Yönetici senkron ayarları tamamlandığında tekrar deneyin.',
  catalog_sync_failed:
    'Parça kullanıcı paneline eklenmeden önce veritabanına aktarılırken bir sorun oluştu.',
  duplicate_song: 'Bu parça zaten çalışma listende yer alıyor.',
  practice_insert_failed: 'Parça çalışma listesine eklenemedi. Lütfen tekrar deneyin.',
};

export default async function DashboardPage({ searchParams }: DashboardPageProps) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

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

  const errorMessage = searchParams?.error ? dashboardErrors[searchParams.error] : null;

  return (
    <main className="container-base py-10 sm:py-16">
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="eyebrow">Kişisel arşiv</p>
          <h1 className="page-title mt-4 text-3xl sm:text-4xl">Çalışma listem</h1>
          <p className="muted-copy mt-3">Sadece sana ait parçalar burada listelenir.</p>
        </div>
        <div className="sm:self-end">
          <AuthButtons authenticated />
        </div>
      </div>

      {errorMessage ? (
        <p className="mb-6 rounded-lg border border-warm/40 bg-warm/10 p-4 text-sm leading-6 text-stone-200">
          {errorMessage}
        </p>
      ) : null}

      <section className="surface p-5">
        <h2 className="font-display text-3xl font-semibold text-text">Listeye parça ekle</h2>
        <p className="mt-3 text-sm leading-6 text-muted">
          Repertuvar seçimi sitedeki katalogla senkron çalışır. Parça ilk kez ekleniyorsa sistem
          kullanıcı paneli veritabanında da hazırlamayı dener.
        </p>

        <form action={addPracticeItem} className="mt-4 flex flex-col gap-3 sm:flex-row">
          <select name="song_id" className="field-input min-w-0" required>
            <option value="">Parça seç</option>
            {catalogSongs.map((song) => (
              <option key={song.id} value={song.id}>
                {song.title} - {song.artist} ({songTypeLabels[song.type]})
              </option>
            ))}
          </select>
          <button type="submit" className="button-primary w-full py-2 sm:w-auto">
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
          ((practiceItems ?? []) as PracticeItemRow[]).map((item) => {
            const song = Array.isArray(item.songs) ? item.songs[0] : item.songs;
            if (!song) return null;

            return (
              <article key={item.id} className="surface-alt p-5">
                <h3 className="font-display text-3xl font-semibold text-text">
                  {song.title} <span className="font-body text-sm text-muted">({song.artist})</span>
                </h3>
                <p className="mt-2 text-sm text-muted">Tür: {songTypeLabels[song.type]}</p>

                <form
                  action={updatePracticeStatus}
                  className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center"
                >
                  <input type="hidden" name="item_id" value={item.id} />
                  <select
                    name="status"
                    defaultValue={item.status}
                    className="field-input w-full sm:max-w-xs"
                  >
                    {statuses.map((status) => (
                      <option key={status.value} value={status.value}>
                        {status.label}
                      </option>
                    ))}
                  </select>
                  <button type="submit" className="button-secondary w-full px-4 py-2 sm:w-auto">
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
