import { ArtistCard } from '@/components/ui/ArtistCard';
import { artists } from '@/data/mockData';

export default function ArtistsPage() {
  return (
    <main className="container-base py-12 sm:py-16">
      <section className="surface relative overflow-hidden p-8 sm:p-12">
        <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(255,255,255,0.04),transparent_38%),radial-gradient(circle_at_top_right,rgba(143,107,59,0.18),transparent_32%)]" />

        <div className="relative">
          <p className="eyebrow text-accent">Sanatçı arşivi</p>
          <h1 className="page-title mt-5 max-w-4xl">Bozlak ve halk müziği ustaları tek yerde.</h1>
          <p className="mt-6 max-w-3xl text-base leading-8 text-stone-200">
            Platformda yer alan tüm sanatçıları buradan toplu halde görebilir, repertuvar
            sayfalarına geçebilir ve ilgili parçalar arasında çalışmak istediğin kaydı hızla
            bulabilirsin.
          </p>
        </div>
      </section>

      <section className="mt-12">
        <h2 className="section-title">Tüm sanatçılar</h2>
        <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {artists.map((artist) => (
            <ArtistCard key={artist.id} artist={artist} />
          ))}
        </div>
      </section>
    </main>
  );
}
