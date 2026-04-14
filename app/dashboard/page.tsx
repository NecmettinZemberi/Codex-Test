import Link from 'next/link';
import { redirect } from 'next/navigation';
import { AllSongsCatalog } from '@/components/dashboard/AllSongsCatalog';
import { PracticeSaveAction } from '@/components/dashboard/PracticeSaveAction';
import { EmptyState } from '@/components/ui/EmptyState';
import { AuthButtons } from '@/components/ui/AuthButtons';
import { PracticeBoard } from '@/components/dashboard/PracticeBoard';
import { songs as catalogSongs, mockPracticeList } from '@/data/mockData';
import {
  formatSongTitle,
  getSongDetailHref,
  songTypeLabels,
  statusClasses,
  statusLabels,
} from '@/lib/utils';
import { getCurrentUserContext } from '@/utils/auth/server';
import { createClient } from '@/utils/supabase/server';
import type { PracticeStatus, SongType, UserPracticeItem } from '@/types/domain';
import { addPracticeItem, deletePracticeItem, savePracticeItem } from './actions';

type DashboardPageProps = {
  searchParams?: {
    error?: string;
    tab?: string;
    status?: string;
    demo_add?: string;
  };
};

type DashboardTab = 'all-songs' | 'practice' | 'account';

type PracticeItemRow = {
  id: string;
  status: PracticeStatus;
  sort_order?: number;
  personal_note: string;
  target_date?: string | null;
  songs:
    | {
        id: string;
        title: string;
        artist: string;
        type: SongType;
      }
    | Array<{
        id: string;
        title: string;
        artist: string;
        type: SongType;
      }>
    | null;
};

const statuses = [
  { value: 'planlandi', label: 'Planlandı' },
  { value: 'siraya_alindi', label: 'Sıraya alındı' },
  { value: 'calisiliyor', label: 'Çalışılıyor' },
  { value: 'tamamlandi', label: 'Tamamlandı' },
] as const;

const dashboardErrors: Record<string, string> = {
  song_not_found: 'Seçilen parça katalogda bulunamadı.',
  catalog_schema_required:
    'Supabase tarafında gerekli tablolar henüz hazır değil. sql/schema.sql içeriğini SQL Editor üzerinden çalıştırman gerekiyor.',
  catalog_lookup_failed: 'Parça kataloğu kontrol edilirken bir sorun oluştu.',
  catalog_sync_required:
    'Bu parça kullanıcı paneli veritabanına henüz aktarılmadı. SUPABASE_SERVICE_ROLE_KEY tanımlandığında otomatik senkron çalışacak.',
  catalog_sync_failed:
    'Parça kullanıcı paneline eklenmeden önce veritabanına aktarılırken bir sorun oluştu.',
  duplicate_song: 'Bu parça zaten çalışma listende yer alıyor.',
  practice_insert_failed: 'Parça çalışma listesine eklenemedi. Lütfen tekrar deneyin.',
  practice_update_failed: 'Parça bilgileri güncellenemedi. Lütfen tekrar deneyin.',
  practice_delete_failed: 'Parça listeden kaldırılamadı. Lütfen tekrar deneyin.',
};

const sidebarItems: Array<{ key: DashboardTab; label: string; description: string }> = [
  {
    key: 'all-songs',
    label: 'Tüm Parçalar',
    description: 'Katalogdaki tüm kayıtları gör ve çalışma listene ekle.',
  },
  {
    key: 'practice',
    label: 'Çalışma Listem',
    description: 'Durum, hedef tarih ve notlarını burada yönet.',
  },
  {
    key: 'account',
    label: 'Hesap Ayarları',
    description: 'Oturum türünü ve hesap bilgilerini görüntüle.',
  },
];

function getActiveTab(value?: string): DashboardTab {
  if (value === 'all-songs' || value === 'account') {
    return value;
  }

  return 'practice';
}

function getStatusFilter(value?: string): PracticeStatus | 'all' {
  if (value === 'planlandi' || value === 'siraya_alindi' || value === 'calisiliyor' || value === 'tamamlandi') {
    return value;
  }

  return 'all';
}

function buildDashboardHref(tab: DashboardTab, status?: PracticeStatus | 'all') {
  const params = new URLSearchParams();
  params.set('tab', tab);

  if (tab === 'practice' && status && status !== 'all') {
    params.set('status', status);
  }

  const query = params.toString();
  return query ? `/dashboard?${query}` : '/dashboard';
}

function Sidebar({ activeTab }: { activeTab: DashboardTab }) {
  return (
    <aside className="surface h-fit p-4 lg:sticky lg:top-24">
      <p className="eyebrow">Kullanıcı paneli</p>
      <nav className="mt-4 grid gap-2">
        {sidebarItems.map((item) => (
          <Link
            key={item.key}
            href={buildDashboardHref(item.key)}
            className={
              activeTab === item.key
                ? 'rounded-xl border border-accent bg-accent/10 p-4 text-text'
                : 'rounded-xl border border-border bg-surface2/60 p-4 text-muted transition hover:text-text'
            }
          >
            <p className="font-medium">{item.label}</p>
            <p className="mt-2 text-sm leading-6">{item.description}</p>
          </Link>
        ))}
      </nav>
    </aside>
  );
}

export default async function DashboardPage({ searchParams }: DashboardPageProps) {
  const auth = await getCurrentUserContext();

  if (!auth.isAuthenticated) {
    redirect('/login');
  }

  const activeTab = getActiveTab(searchParams?.tab);
  const statusFilter = getStatusFilter(searchParams?.status);
  const errorMessage = searchParams?.error ? dashboardErrors[searchParams.error] : null;

  if (auth.mode === 'demo') {
    return (
      <main className="container-base py-10 sm:py-16">
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="eyebrow">Demo kullanıcı paneli</p>
            <h1 className="page-title mt-4 text-3xl sm:text-4xl">Çalışma listem</h1>
            <p className="muted-copy mt-3">
              Bu alan geliştirme amaçlıdır. Değişiklikler bu tarayıcıda tutulur ve gerçek kullanıcı
              verisi üretmez.
            </p>
          </div>
          <div className="sm:self-end">
            <AuthButtons mode="demo" />
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-[280px_minmax(0,1fr)]">
          <Sidebar activeTab={activeTab} />
          <PracticeBoard
            initialItems={mockPracticeList as UserPracticeItem[]}
            pendingSongId={searchParams?.demo_add}
            initialStatusFilter={statusFilter}
            activeTab={activeTab}
          />
        </div>
      </main>
    );
  }

  const supabase = await createClient();
  const initialPracticeQuery = await supabase
    .from('user_practice_list')
    .select(
      `
      id,
      status,
      sort_order,
      personal_note,
      target_date,
      songs (id, title, artist, type)
    `,
    )
    .eq('user_id', auth.user?.id)
    .order('sort_order', { ascending: true });

  let practiceItems = (initialPracticeQuery.data as PracticeItemRow[] | null) ?? [];
  let practiceItemsError = initialPracticeQuery.error;

  const isTargetDateMissing =
    (practiceItemsError?.code === '42703' || practiceItemsError?.code === 'PGRST204') &&
    (practiceItemsError.message ?? '').toLowerCase().includes('target_date');

  if (isTargetDateMissing) {
    const fallback = await supabase
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
      .eq('user_id', auth.user?.id)
      .order('sort_order', { ascending: true });

    practiceItems = (fallback.data as PracticeItemRow[] | null) ?? [];
    practiceItemsError = fallback.error;
  }

  const filteredPracticeItems = practiceItems.filter(
    (item) => statusFilter === 'all' || item.status === statusFilter,
  );
  const sortedCatalogSongs = [...catalogSongs].sort((left, right) => {
    const titleCompare = left.title.localeCompare(right.title, 'tr');
    if (titleCompare !== 0) {
      return titleCompare;
    }

    return left.artist.localeCompare(right.artist, 'tr');
  });
  const practiceSongIds = practiceItems
    .map((item) => (Array.isArray(item.songs) ? item.songs[0] : item.songs))
    .filter(
      (
        song,
      ): song is {
        id: string;
        title: string;
        artist: string;
        type: SongType;
      } => Boolean(song),
    )
    .map(
      (practiceSong) =>
        catalogSongs.find(
          (catalogSong) =>
            catalogSong.title === practiceSong.title &&
            catalogSong.artist === practiceSong.artist &&
            catalogSong.type === practiceSong.type,
        )?.id,
    )
    .filter((songId): songId is string => Boolean(songId));

  return (
    <main className="container-base py-10 sm:py-16">
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="eyebrow">Kişisel arşiv</p>
          <h1 className="page-title mt-4 text-3xl sm:text-4xl">Çalışma listem</h1>
          <p className="muted-copy mt-3">
            {auth.user?.displayName} için planlanan parçalar, notlar ve hedef tarihler burada
            tutulur.
          </p>
        </div>
        <div className="sm:self-end">
          <AuthButtons mode="supabase" />
        </div>
      </div>

      {errorMessage ? (
        <p className="mb-6 rounded-lg border border-warm/40 bg-warm/10 p-4 text-sm leading-6 text-stone-200">
          {errorMessage}
        </p>
      ) : null}

      <div className="grid gap-6 lg:grid-cols-[280px_minmax(0,1fr)]">
        <Sidebar activeTab={activeTab} />

        <section className="space-y-6">
          {activeTab === 'all-songs' ? (
            <AllSongsCatalog
              songs={catalogSongs}
              practiceSongIds={practiceSongIds}
              addAction={addPracticeItem}
              redirectTo={buildDashboardHref('all-songs')}
            />
          ) : null}

          {activeTab === 'practice' ? (
            <>
              <section className="surface p-5">
                <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
                  <div>
                    <h2 className="font-display text-3xl font-semibold text-text">Çalışma listem</h2>
                    <p className="mt-3 text-sm leading-6 text-muted">
                      Durum, hedef tarih ve kişisel notlarını burada yönetebilirsin.
                    </p>
                  </div>

                  <form action={addPracticeItem} className="flex flex-col gap-3 sm:flex-row">
                    <select name="song_id" className="field-input min-w-0" required>
                      <option value="">Parça seç</option>
                      {sortedCatalogSongs.map((song) => (
                        <option key={song.id} value={song.id}>
                          {formatSongTitle(song.title)} - {song.artist} ({songTypeLabels[song.type]})
                        </option>
                      ))}
                    </select>
                    <input type="hidden" name="redirect_to" value={buildDashboardHref('practice')} />
                    <button type="submit" className="button-primary w-full py-2 sm:w-auto">
                      Ekle
                    </button>
                  </form>
                </div>
              </section>

              <section className="surface p-5">
                <p className="eyebrow">Durum filtreleri</p>
                <div className="mt-4 flex flex-wrap gap-2">
                  <Link
                    href={buildDashboardHref('practice', 'all')}
                    className={
                      statusFilter === 'all'
                        ? 'inline-flex items-center justify-center rounded-lg border border-accent bg-accent px-4 py-2 text-sm font-semibold text-base'
                        : 'button-secondary px-4 py-2 text-sm'
                    }
                  >
                    Tüm durumlar
                  </Link>
                  {statuses.map((status) => (
                    <Link
                      key={status.value}
                      href={buildDashboardHref('practice', status.value)}
                      className={
                        statusFilter === status.value
                          ? `inline-flex items-center justify-center rounded-lg border px-4 py-2 text-sm font-semibold ${statusClasses[status.value]}`
                          : `inline-flex items-center justify-center rounded-lg border px-4 py-2 text-sm transition hover:border-border/80 hover:text-text ${statusClasses[status.value]} opacity-80`
                      }
                    >
                      {status.label}
                    </Link>
                  ))}
                </div>
              </section>

              <section className="grid gap-4">
                {filteredPracticeItems.length === 0 ? (
                  <EmptyState
                    title="Henüz parça yok"
                    description="Listeye bir parça ekleyerek çalışmanı planlamaya başlayabilirsin."
                  />
                ) : (
                  filteredPracticeItems.map((item) => {
                    const song = Array.isArray(item.songs) ? item.songs[0] : item.songs;
                    if (!song) return null;

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

                          <form action={deletePracticeItem}>
                            <input type="hidden" name="item_id" value={item.id} />
                            <button
                              type="submit"
                              className="button-secondary px-4 py-2 transition hover:border-rose-500/55 hover:bg-rose-500/12 hover:text-rose-100"
                            >
                              Listeden kaldır
                            </button>
                          </form>
                        </div>

                        <form action={savePracticeItem} className="mt-5 grid gap-4">
                          <input type="hidden" name="item_id" value={item.id} />
                          <input
                            type="hidden"
                            name="redirect_to"
                            value={buildDashboardHref('practice', statusFilter)}
                          />

                          <div className="grid gap-4 sm:grid-cols-2">
                            <label className="text-sm text-muted">
                              Durum
                              <select
                                name="status"
                                defaultValue={item.status}
                                className="field-input mt-1 w-full"
                              >
                                {statuses.map((status) => (
                                  <option key={status.value} value={status.value}>
                                    {status.label}
                                  </option>
                                ))}
                              </select>
                            </label>

                            <label className="text-sm text-muted">
                              Hedef çalışma tarihi
                              <input
                                type="date"
                                name="target_date"
                                defaultValue={item.target_date ?? ''}
                                className="field-input mt-1 w-full"
                              />
                            </label>
                          </div>

                          <label className="text-sm text-muted">
                            Kişisel not
                            <textarea
                              name="personal_note"
                              defaultValue={item.personal_note}
                              rows={4}
                              className="field-input mt-1 min-h-28 resize-y"
                              placeholder="Bu parçada odaklanmak istediğin tavır, geçiş veya çalışma notunu yaz."
                            />
                          </label>

                          <PracticeSaveAction itemId={item.id} />
                        </form>
                      </article>
                    );
                  })
                )}
              </section>
            </>
          ) : null}

          {activeTab === 'account' ? (
            <section className="surface p-5">
              <h2 className="font-display text-3xl font-semibold text-text">Hesap ayarları</h2>
              <p className="mt-3 text-sm leading-6 text-muted">
                Hesap bilgilerin ve oturum türün burada görünür. İlerleyen sürümlerde profil
                ayarları da bu alana taşınacak.
              </p>

              <div className="mt-5 grid gap-4 sm:grid-cols-2">
                <div className="rounded-xl border border-border bg-surface2 p-4">
                  <p className="eyebrow">Görünen ad</p>
                  <p className="mt-3 text-lg font-medium text-text">{auth.user?.displayName}</p>
                </div>
                <div className="rounded-xl border border-border bg-surface2 p-4">
                  <p className="eyebrow">E-posta</p>
                  <p className="mt-3 text-lg font-medium text-text">
                    {auth.user?.email ?? 'Demo veya paylaşılmayan hesap'}
                  </p>
                </div>
                <div className="rounded-xl border border-border bg-surface2 p-4">
                  <p className="eyebrow">Oturum türü</p>
                  <p className="mt-3 text-lg font-medium text-text">Google hesabı</p>
                </div>
                <div className="rounded-xl border border-border bg-surface2 p-4">
                  <p className="eyebrow">Hızlı erişim</p>
                  <div className="mt-3">
                    <AuthButtons mode="supabase" />
                  </div>
                </div>
              </div>
            </section>
          ) : null}
        </section>
      </div>
    </main>
  );
}
