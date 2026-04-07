import Link from 'next/link';
import { artists } from '@/data/mockData';

const staticLinks = [
  { label: 'Anasayfa', href: '/' },
  { label: 'Türküler', href: '/turkuler' },
];

export function Navbar() {
  return (
    <header className="border-b border-border bg-base/95 backdrop-blur">
      <nav className="container-base flex flex-wrap items-center gap-4 py-4" aria-label="Ana menü">
        <Link href="/" className="mr-3 text-lg font-semibold text-white">
          BozlakLab
        </Link>

        {staticLinks.map((link) => (
          <Link key={link.href} href={link.href} className="text-sm text-slate-300 hover:text-white">
            {link.label}
          </Link>
        ))}

        {artists.map((artist) => (
          <Link
            key={artist.id}
            href={`/artists/${artist.slug}`}
            className="text-sm text-slate-400 hover:text-slate-100"
          >
            {artist.name}
          </Link>
        ))}

        <Link
          href="/dashboard"
          className="ml-auto rounded-lg bg-accent px-4 py-2 text-sm font-semibold text-slate-900 hover:bg-amber-300"
        >
          Çalışma Alanım
        </Link>
      </nav>
    </header>
  );
}
