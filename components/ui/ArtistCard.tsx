import Image from 'next/image';
import Link from 'next/link';
import { Artist } from '@/types/domain';

type ArtistCardProps = {
  artist: Artist;
};

export function ArtistCard({ artist }: ArtistCardProps) {
  return (
    <article className="surface overflow-hidden">
      <div className="relative h-44 w-full">
        <Image src={artist.image_url} alt={artist.name} fill className="object-cover" />
      </div>
      <div className="p-5">
        <h3 className="text-lg font-semibold text-white">{artist.name}</h3>
        <p className="mt-2 line-clamp-3 text-sm text-slate-300">{artist.short_bio}</p>
        <Link
          href={`/artists/${artist.slug}`}
          className="mt-4 inline-flex text-sm font-medium text-accent hover:text-amber-300"
        >
          Sanatçı Sayfasına Git →
        </Link>
      </div>
    </article>
  );
}
