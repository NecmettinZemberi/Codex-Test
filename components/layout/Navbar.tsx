'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import { artists } from '@/data/mockData';

const staticLinks = [
  { label: 'Anasayfa', href: '/' },
  { label: 'Türküler', href: '/turkuler' },
];

const authHref = '/auth/login?next=/dashboard';

export function Navbar() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-base/90 backdrop-blur-sm">
      <nav className="container-base" aria-label="Ana menü">
        <div className="grid h-16 grid-cols-[48px_1fr_64px] items-center md:hidden">
          <button
            type="button"
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
            aria-label={menuOpen ? 'Menüyü kapat' : 'Menüyü aç'}
            onClick={() => setMenuOpen((current) => !current)}
            className="flex h-12 w-12 items-center justify-center rounded-lg border border-border bg-surface2/70 transition hover:bg-surface2"
          >
            <span className="relative block h-4 w-5">
              <span
                className={`absolute left-0 top-0 h-px w-5 bg-text transition duration-300 ${
                  menuOpen ? 'translate-y-[7px] rotate-45' : ''
                }`}
              />
              <span
                className={`absolute left-0 top-[7px] h-px w-5 bg-text transition duration-200 ${
                  menuOpen ? 'opacity-0' : ''
                }`}
              />
              <span
                className={`absolute left-0 top-[14px] h-px w-5 bg-text transition duration-300 ${
                  menuOpen ? '-translate-y-[7px] -rotate-45' : ''
                }`}
              />
            </span>
          </button>

          <Link
            href="/"
            className="justify-self-center font-display text-[2rem] font-semibold leading-none tracking-[0.02em] text-text"
          >
            BozlakLab
          </Link>

          <Link
            href={authHref}
            className="justify-self-end rounded-lg border border-border bg-accent px-3 py-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-base transition hover:bg-stone-300"
          >
            Giriş
          </Link>
        </div>

        <div
          id="mobile-menu"
          aria-hidden={!menuOpen}
          className={`overflow-hidden md:hidden transition-[max-height,opacity,padding] duration-300 ease-out ${
            menuOpen ? 'max-h-[75vh] pb-4 opacity-100' : 'max-h-0 pb-0 opacity-0'
          }`}
        >
          <div
            className={`rounded-2xl border border-border bg-[linear-gradient(180deg,rgba(255,255,255,0.02),rgba(255,255,255,0)),linear-gradient(180deg,#121212,#181818)] p-5 shadow-soft transition duration-300 ease-out ${
              menuOpen ? 'translate-y-0 scale-100' : '-translate-y-3 scale-[0.985]'
            }`}
          >
            <div className="mb-5 flex items-end justify-between gap-4 border-b border-border pb-4">
              <div>
                <p className="eyebrow">Gezinme</p>
                <p className="mt-2 font-display text-3xl font-semibold text-text">Arşiv menüsü</p>
              </div>
              <Link
                href={authHref}
                className="button-primary shrink-0 px-4 py-2 text-[11px] uppercase tracking-[0.16em]"
              >
                Giriş yap
              </Link>
            </div>

            <div className="space-y-2">
              {staticLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="flex items-center justify-between rounded-xl border border-border bg-surface2/60 px-4 py-3 text-sm text-text transition hover:bg-surface2"
                >
                  <span>{link.label}</span>
                  <span className="text-muted">↗</span>
                </Link>
              ))}
            </div>

            <div className="mt-6">
              <p className="eyebrow">Sanatçılar</p>
              <div className="mt-3 grid grid-cols-1 gap-2">
                {artists.map((artist) => (
                  <Link
                    key={artist.id}
                    href={`/artists/${artist.slug}`}
                    className="rounded-xl border border-border bg-surface px-3 py-3 text-sm leading-5 text-muted transition hover:text-text"
                  >
                    {artist.name}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="hidden min-h-[4.5rem] items-center gap-6 py-4 md:flex">
          <Link href="/" className="mr-2 font-display text-4xl font-semibold leading-none text-text">
            BozlakLab
          </Link>

          <div className="flex items-center gap-5">
            {staticLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm text-muted transition hover:text-text"
              >
                {link.label}
              </Link>
            ))}
          </div>

          <div className="flex min-w-0 flex-1 flex-wrap items-center gap-x-4 gap-y-2">
            {artists.map((artist) => (
              <Link
                key={artist.id}
                href={`/artists/${artist.slug}`}
                className="text-sm text-muted transition hover:text-text"
              >
                {artist.name}
              </Link>
            ))}
          </div>

          <Link href={authHref} className="button-primary ml-auto shrink-0 px-4 py-2">
            Giriş yap
          </Link>
        </div>
      </nav>
    </header>
  );
}
