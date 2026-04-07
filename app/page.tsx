import Link from 'next/link';
import { ArtistCard } from '@/components/ui/ArtistCard';
import { artists } from '@/data/mockData';

export default function HomePage() {
  const featuredArtists = artists.slice(0, 3);

  return (
    <main className="container-base py-12 sm:py-16">
      <section className="surface p-8 sm:p-12">
        <p className="text-sm uppercase tracking-[0.2em] text-accent">Bozlak Çalışma Platformu</p>
        <h1 className="mt-4 text-3xl font-semibold text-white sm:text-5xl">
          Neşet Ertaş tavrı saz çalışmak için sade ve güçlü bir başlangıç.
        </h1>
        <p className="mt-5 max-w-3xl leading-relaxed text-slate-300">
          Bu platform, halk müziği sanatçılarını ve eserlerini tek yerde toplar. Giriş yapan
          kullanıcılar kendi çalışma listelerini oluşturabilir, sıraya koyabilir ve ilerleme
          durumlarını takip edebilir.
        </p>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <Link
            href="/login"
            className="rounded-lg bg-accent px-5 py-3 text-center text-sm font-semibold text-slate-900 transition hover:bg-amber-300"
          >
            Giriş Yap
          </Link>
          <Link
            href="/dashboard"
            className="rounded-lg border border-border px-5 py-3 text-center text-sm font-semibold text-slate-100 transition hover:bg-slate-800"
          >
            Çalışma Listeme Git
          </Link>
        </div>
      </section>

      <section className="mt-12">
        <h2 className="text-2xl font-semibold text-white">Öne Çıkan Sanatçılar</h2>
        <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {featuredArtists.map((artist) => (
            <ArtistCard key={artist.id} artist={artist} />
          ))}
        </div>
      </section>
    </main>
  );
}