import Link from 'next/link';
import { footerNavigation } from '@/lib/site';

export function Footer() {
  return (
    <footer className="border-t border-border bg-[linear-gradient(180deg,rgba(255,255,255,0.02),rgba(255,255,255,0)),linear-gradient(180deg,#0d0d0d,#0a0a0a)]">
      <div className="container-base py-8 sm:py-10">
        <nav
          aria-label="Alt gezinme"
          className="flex flex-wrap items-center gap-x-5 gap-y-3 border-b border-border/80 pb-5 text-sm text-muted sm:gap-x-6"
        >
          {footerNavigation.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="break-words leading-6 transition hover:text-text"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <section className="surface-alt mt-6 p-5 sm:p-6">
          <p className="eyebrow text-accent">Yaşayan arşiv</p>
          <h2 className="mt-3 font-display text-3xl font-semibold text-text sm:text-4xl">
            BozlakLab
          </h2>
          <p className="mt-4 max-w-4xl text-sm leading-7 text-stone-300 sm:text-[15px]">
            Bozlak geleneğini, halk müziği repertuvarını ve disiplinli çalışma kültürünü dijital
            ortamda erişilebilir kılan; not, repertuvar ve araştırma akışlarını aynı yerde
            buluşturan yaşayan bir arşiv ve çalışma alanı olarak gelişiyor.
          </p>
        </section>
      </div>
    </footer>
  );
}
