import Image from 'next/image';
import Link from 'next/link';
import { Artist } from '@/types/domain';

type ArtistCardProps = {
  artist: Artist;
};

export function ArtistCard({ artist }: ArtistCardProps) {
  return (
    <article className="surface group flex h-full flex-col overflow-hidden">
      <Link
        href={`/artists/${artist.slug}`}
        className="block focus:outline-none focus-visible:ring-2 focus-visible:ring-accent"
      >
        <div className="relative h-52 w-full overflow-hidden border-b border-border bg-surface2">
          <div className="absolute inset-0 z-10 bg-gradient-to-t from-base via-base/10 to-transparent" />
          <Image
            src={artist.image_url}
            alt={artist.name}
            fill
            className="object-cover grayscale transition duration-500 group-hover:scale-[1.02]"
          />
        </div>
      </Link>

      <div className="flex flex-1 flex-col bg-gradient-to-b from-surface to-surface2 p-5">
        <h3 className="font-display text-3xl font-semibold leading-none text-text">
          <Link
            href={`/artists/${artist.slug}`}
            className="transition hover:text-accent focus:outline-none focus-visible:text-accent"
          >
            {artist.name}
          </Link>
        </h3>

        <p className="mt-3 flex-1 text-sm leading-6 text-muted">{artist.short_bio}</p>

        <Link
          href={`/artists/${artist.slug}`}
          className="mt-5 inline-flex text-sm font-medium text-accent transition hover:text-warm"
        >
          Sanatçı sayfasına git →
        </Link>
      </div>
    </article>
  );
}
