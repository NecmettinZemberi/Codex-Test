import { notFound } from 'next/navigation';
import Image from 'next/image';
import { artists, songs } from '@/data/mockData';
import { SongCard } from '@/components/songs/SongCard';

type ArtistPageProps = {
  params: {
    slug: string;
  };
};

export default function ArtistPage({ params }: ArtistPageProps) {
  const artist = artists.find((item) => item.slug === params.slug);

  if (!artist) {
    notFound();
  }

  const artistSongs = songs.filter((song) => song.artist === artist.name);

  return (
    <main className="container-base py-12 sm:py-16">
      <section className="surface overflow-hidden">
        <div className="relative h-56 w-full sm:h-72">
          <Image src={artist.image_url} alt={artist.name} fill className="object-cover" />
        </div>
        <div className="p-6 sm:p-8">
          <h1 className="text-3xl font-semibold text-white">{artist.name}</h1>
          <p className="mt-4 max-w-3xl leading-relaxed text-slate-300">{artist.short_bio}</p>
        </div>
      </section>

      <section className="mt-10">
        <h2 className="text-2xl font-semibold text-white">Parçalar</h2>
        <div className="mt-5 grid gap-4">
          {artistSongs.map((song) => (
            <SongCard key={song.id} song={song} />
          ))}
        </div>
      </section>
    </main>
  );
}
