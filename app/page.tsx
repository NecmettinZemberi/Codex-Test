import Link from 'next/link';
import { ArtistCard } from '@/components/ui/ArtistCard';
import { artists } from '@/data/mockData';
import { createClient } from '@/utils/supabase/server';

export default async function HomePage() {
  const featuredArtists = artists.slice(0, 3);

  let todoNames: string[] = [];

  try {
    const supabase = await createClient();
    const { data: todos } = await supabase.from('todos').select('id,name').limit(3);
    todoNames = (todos ?? []).map((todo: { name: string }) => todo.name);
  } catch {
    // Opsiyonel demo bolumu; hata olursa ana sayfa akisi bozulmaz.
  }

  return (
    <main className="container-base py-12 sm:py-16">
      <section className="surface p-8 sm:p-12">
        <p className="text-sm uppercase tracking-[0.2em] text-accent">Bozlak Calisma Platformu</p>
        <h1 className="mt-4 text-3xl font-semibold text-white sm:text-5xl">
          Neset Ertas tavri saz calismak icin sade ve guclu bir baslangic.
        </h1>
        <p className="mt-5 max-w-3xl leading-relaxed text-slate-300">
          Bu platform, halk muzigi sanatcilarini ve eserlerini tek yerde toplar. Giris yapan
          kullanicilar kendi calisma listelerini olusturabilir, siraya koyabilir ve ilerleme
          durumlarini takip edebilir.
        </p>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <Link
            href="/login"
            className="rounded-lg bg-accent px-5 py-3 text-center text-sm font-semibold text-slate-900 transition hover:bg-amber-300"
          >
            Giris Yap
          </Link>
          <Link
            href="/dashboard"
            className="rounded-lg border border-border px-5 py-3 text-center text-sm font-semibold text-slate-100 transition hover:bg-slate-800"
          >
            Calisma Listeme Git
          </Link>
        </div>
      </section>

      {todoNames.length > 0 ? (
        <section className="mt-8 surface p-6">
          <h2 className="text-lg font-semibold text-white">Supabase Ornek Todo Kayitlari</h2>
          <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-slate-300">
            {todoNames.map((todoName) => (
              <li key={todoName}>{todoName}</li>
            ))}
          </ul>
        </section>
      ) : null}

      <section className="mt-12">
        <h2 className="text-2xl font-semibold text-white">One Cikan Sanatcilar</h2>
        <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {featuredArtists.map((artist) => (
            <ArtistCard key={artist.id} artist={artist} />
          ))}
        </div>
      </section>
    </main>
  );
}
