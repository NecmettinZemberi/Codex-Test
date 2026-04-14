import type { Metadata } from 'next';
import Link from 'next/link';
import { BeginnerArchiveList } from '@/components/songs/BeginnerArchiveList';
import { SongStudyCard } from '@/components/songs/SongStudyCard';
import { songs } from '@/data/mockData';

export const metadata: Metadata = {
  title: 'Yeni Başlayanlar | BozlakLab',
  description:
    'Neşet Ertaş tavrına yeni başlayanlar için kolaydan zora parça çalışma rotası.',
};

const nesetSongs = songs
  .filter((song) => song.artist === 'Neşet Ertaş')
  .sort((left, right) => {
    const leftOrder = left.beginner_order ?? Number.MAX_SAFE_INTEGER;
    const rightOrder = right.beginner_order ?? Number.MAX_SAFE_INTEGER;

    if (leftOrder !== rightOrder) {
      return leftOrder - rightOrder;
    }

    return left.title.localeCompare(right.title, 'tr');
  });

const beginnerSongs = nesetSongs.filter((song) => song.beginner_order);
const archiveSongs = nesetSongs.filter((song) => !song.beginner_order);

export default function YeniBaslayanlarPage() {
  return (
    <main className="container-base py-12 sm:py-16">
      <section className="surface relative overflow-hidden p-8 sm:p-12">
        <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(255,255,255,0.04),transparent_40%),radial-gradient(circle_at_top_right,rgba(143,107,59,0.16),transparent_34%)]" />
        <div className="relative max-w-4xl">
          <p className="eyebrow text-accent">Çalışma rotası</p>
          <h1 className="page-title mt-5">Yeni Başlayanlar</h1>
          <p className="mt-6 text-base leading-8 text-stone-200">
            Neşet Ertaş tavrı notaya tam dökülemediği için sistem, sözleri duyarak ve yavaş
            çalımları izleyerek oturur. Bu rota kolaydan zora ilerleyip parçanın özünü bozmadan
            çalışmak isteyenler için hazırlandı.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link href="/tavrin-temelleri" className="button-primary">
              Önce tavrın temellerini oku
            </Link>
            <Link href="/turkuler" className="button-secondary">
              Tüm türküleri gör
            </Link>
          </div>
        </div>
      </section>

      <section className="mt-10">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="eyebrow">Önerilen başlangıç</p>
            <h2 className="section-title mt-3">Kolaydan zora ilk rota</h2>
          </div>
          <p className="text-sm text-muted">{beginnerSongs.length} parça öne alındı</p>
        </div>

        <div className="mt-6 grid gap-5 lg:grid-cols-2">
          {beginnerSongs.map((song) => (
            <SongStudyCard key={song.id} song={song} />
          ))}
        </div>
      </section>

      <section className="mt-12">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="eyebrow">Neşet Ertaş arşivi</p>
            <h2 className="section-title mt-3">Kalan parçalar</h2>
          </div>
          <p className="text-sm text-muted">{archiveSongs.length} parça</p>
        </div>

        <BeginnerArchiveList songs={archiveSongs} />
      </section>
    </main>
  );
}
