'use client';

import Link from 'next/link';
import { FormEvent, useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { artists, songs } from '@/data/mockData';
import { SongSearchSuggestions } from '@/components/songs/SongSearchSuggestions';
import { getSearchHref, getSongHref } from '@/lib/utils';

type NavbarProps = {
  authMode?: 'anonymous' | 'demo' | 'supabase';
};

const navLinks = [
  { label: 'Türküler', href: '/turkuler' },
  { label: 'Sanatçılar', href: '/artists' },
];

const authHref = '/login';

function getLinkClass(pathname: string, href: string) {
  const isActive = pathname === href || pathname.startsWith(`${href}/`);

  return isActive
    ? 'text-sm text-text'
    : 'text-sm text-muted transition hover:text-text';
}

function AuthArea({ authMode }: { authMode: NavbarProps['authMode'] }) {
  if (authMode === 'supabase') {
    return (
      <div className="flex items-center gap-2">
        <Link href="/dashboard" className="button-primary px-4 py-2">
          Çalışma listem
        </Link>
        <form action="/auth/logout" method="post">
          <button type="submit" className="button-secondary px-4 py-2">
            Çıkış
          </button>
        </form>
      </div>
    );
  }

  if (authMode === 'demo') {
    return (
      <div className="flex items-center gap-2">
        <Link href="/dashboard" className="button-primary px-4 py-2">
          Çalışma listem
        </Link>
        <form action="/api/mock-logout" method="get">
          <button type="submit" className="button-secondary px-4 py-2">
            Çıkış
          </button>
        </form>
      </div>
    );
  }

  return (
    <Link href={authHref} className="button-primary px-4 py-2">
      Giriş yap
    </Link>
  );
}

function HeaderAction({ authMode }: { authMode: NavbarProps['authMode'] }) {
  if (authMode === 'supabase' || authMode === 'demo') {
    return (
      <Link
        href="/dashboard"
        className="button-primary px-3 py-2 text-[11px] uppercase tracking-[0.16em]"
      >
        Çalışma listem
      </Link>
    );
  }

  return (
    <Link
      href={authHref}
      className="rounded-lg border border-border bg-accent px-3 py-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-base transition hover:bg-stone-300"
    >
      Giriş
    </Link>
  );
}

export function Navbar({ authMode = 'anonymous' }: NavbarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);
  const [desktopQuery, setDesktopQuery] = useState('');
  const [mobileQuery, setMobileQuery] = useState('');

  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!menuOpen) {
      document.body.style.removeProperty('overflow');
      return;
    }

    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.removeProperty('overflow');
    };
  }, [menuOpen]);

  const handleSearch = (
    event: FormEvent<HTMLFormElement>,
    query: string,
    reset?: () => void,
  ) => {
    event.preventDefault();

    const trimmed = query.trim();
    if (!trimmed) {
      return;
    }

    if (reset) {
      reset();
    }

    router.push(getSearchHref(trimmed));
  };

  return (
    <header className="sticky top-0 z-[80] border-b border-border bg-base/90 backdrop-blur-sm">
      <nav className="container-base" aria-label="Ana menü">
        <div className="grid h-16 grid-cols-[48px_1fr_auto] items-center gap-3 md:hidden">
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

          <div className="justify-self-end">
            <HeaderAction authMode={authMode} />
          </div>
        </div>

        <div
          id="mobile-menu"
          aria-hidden={!menuOpen}
          className={`absolute inset-x-0 top-full z-[90] bg-base/80 backdrop-blur-[2px] transition duration-300 md:hidden ${
            menuOpen ? 'pointer-events-auto opacity-100' : 'pointer-events-none opacity-0'
          }`}
        >
          <div className="container-base py-4">
            <div
              className={`flex h-[calc(100dvh-4rem-1px)] max-h-[calc(100dvh-4rem-1px)] flex-col overflow-hidden rounded-2xl border border-border bg-[linear-gradient(180deg,rgba(255,255,255,0.02),rgba(255,255,255,0)),linear-gradient(180deg,#121212,#181818)] shadow-soft transition duration-300 ease-out ${
                menuOpen ? 'translate-y-0 scale-100' : '-translate-y-3 scale-[0.985]'
              }`}
            >
              <div className="overflow-y-auto overscroll-contain px-5 pb-5 pt-5">
                <div className="mb-5 flex items-end justify-between gap-4 border-b border-border pb-4">
                  <div>
                    <p className="eyebrow">Gezinme</p>
                    <p className="mt-2 font-display text-3xl font-semibold text-text">
                      Arşiv menüsü
                    </p>
                  </div>
                  <AuthArea authMode={authMode} />
                </div>

                <form
                  onSubmit={(event) =>
                    handleSearch(event, mobileQuery, () => {
                      setMobileQuery('');
                      setMenuOpen(false);
                    })
                  }
                  className="mb-5"
                >
                  <label className="relative block text-sm">
                    <span className="mb-2 block text-muted">Türkü ara</span>
                    <div className="relative">
                      <input
                        value={mobileQuery}
                        onChange={(event) => setMobileQuery(event.target.value)}
                        className="field-input pr-10"
                        placeholder="Türkü adı yaz"
                      />
                      {mobileQuery ? (
                        <button
                          type="button"
                          onClick={() => setMobileQuery('')}
                          aria-label="Aramayı temizle"
                          className="absolute right-3 top-1/2 inline-flex h-6 w-6 -translate-y-1/2 items-center justify-center rounded-full text-base text-muted transition hover:bg-surface2 hover:text-text"
                        >
                          ×
                        </button>
                      ) : null}
                    </div>
                    <SongSearchSuggestions
                      songs={songs}
                      query={mobileQuery}
                      onSelect={(song) => {
                        setMobileQuery(song.title);
                        setMenuOpen(false);
                        router.push(getSongHref(song));
                      }}
                    />
                  </label>
                  <button type="submit" className="button-secondary mt-3 w-full px-4 py-2">
                    Sanatçı sayfasında ara
                  </button>
                </form>

                <div className="space-y-2">
                  {navLinks.map((link) => (
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
                  <div className="flex items-end justify-between gap-3">
                    <p className="eyebrow">Sanatçılar</p>
                    <p className="text-xs text-muted">{artists.length} sanatçı</p>
                  </div>
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

                <div className="mt-6 rounded-xl border border-dashed border-border/80 bg-surface/70 px-4 py-3 text-center">
                  <p className="text-xs font-medium uppercase tracking-[0.18em] text-muted">
                    Liste sonu
                  </p>
                  <p className="mt-2 text-sm text-stone-300">
                    Tüm sanatçılar burada listelendi.
                  </p>
                </div>
              </div>

            </div>
          </div>
        </div>

        <div className="hidden min-h-[4.5rem] items-center gap-6 py-4 lg:grid lg:grid-cols-[auto_auto_minmax(320px,420px)_auto]">
          <Link href="/" className="font-display text-4xl font-semibold leading-none text-text">
            BozlakLab
          </Link>

          <div className="flex items-center gap-5">
            {navLinks.map((link) => (
              <Link key={link.href} href={link.href} className={getLinkClass(pathname, link.href)}>
                {link.label}
              </Link>
            ))}
          </div>

          <form onSubmit={(event) => handleSearch(event, desktopQuery)} className="w-full">
            <label className="sr-only" htmlFor="global-song-search">
              Türkü ara
            </label>

            <div className="relative">
              <div className="flex items-center gap-2">
                <div className="relative min-w-0 flex-1">
                  <input
                    id="global-song-search"
                    value={desktopQuery}
                    onChange={(event) => setDesktopQuery(event.target.value)}
                    className="field-input pr-10"
                    placeholder="Türkü ara"
                  />
                  {desktopQuery ? (
                    <button
                      type="button"
                      onClick={() => setDesktopQuery('')}
                      aria-label="Aramayı temizle"
                      className="absolute right-3 top-1/2 inline-flex h-6 w-6 -translate-y-1/2 items-center justify-center rounded-full text-base text-muted transition hover:bg-surface2 hover:text-text"
                    >
                      ×
                    </button>
                  ) : null}
                </div>
                <button type="submit" className="button-secondary shrink-0 px-4 py-2">
                  Ara
                </button>
              </div>

              <SongSearchSuggestions
                songs={songs}
                query={desktopQuery}
                onSelect={(song) => {
                  setDesktopQuery(song.title);
                  router.push(getSongHref(song));
                }}
              />
            </div>
          </form>

          <div className="justify-self-end">
            <AuthArea authMode={authMode} />
          </div>
        </div>
      </nav>
    </header>
  );
}
