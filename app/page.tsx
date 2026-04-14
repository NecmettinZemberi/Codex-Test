import Link from 'next/link';
import { ArtistCard } from '@/components/ui/ArtistCard';
import { artists } from '@/data/mockData';
import { getCurrentUserContext } from '@/utils/auth/server';
import { createClient } from '@/utils/supabase/server';

export default async function HomePage() {
  const featuredArtists = artists.slice(0, 3);
  const auth = await getCurrentUserContext();

  let todoNames: string[] = [];

  try {
    const supabase = await createClient();
    const { data: todos } = await supabase.from('todos').select('id,name').limit(3);
    todoNames = (todos ?? []).map((todo: { name: string }) => todo.name);
  } catch {
    // Opsiyonel demo bölümü; hata olursa ana sayfa akışı bozulmaz.
  }

  return (
    <main className="container-base py-12 sm:py-16">
      <section className="surface relative overflow-hidden p-8 sm:p-12">
        <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(255,255,255,0.04),transparent_38%),radial-gradient(circle_at_top_right,rgba(143,107,59,0.18),transparent_32%)]" />
        <div className="relative">
          <p className="eyebrow text-accent">Bozlak Çalışma Platformu</p>
          <h1 className="page-title mt-5 max-w-4xl">
            Neşet Ertaş tavrı saz çalışmak için sade ve güçlü bir başlangıç.
          </h1>
          <p className="mt-6 max-w-3xl text-base leading-8 text-stone-200">
            BozlakLab; türkü arşivini, parça sözleriyle çalışmayı, yavaş çalım bağlantılarını,
            yeni başlayan rotasını ve Neşet Ertaş tavrının temel prensiplerini aynı yerde toplar.
            Giriş yapan kullanıcılar ayrıca kendi çalışma listelerini oluşturup ilerleme durumlarını
            takip edebilir.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link href={auth.isAuthenticated ? '/turkuler' : '/login'} className="button-primary">
              {auth.isAuthenticated ? 'Türküler' : 'Giriş yap'}
            </Link>
            <Link href="/yeni-baslayanlar" className="button-secondary">
              Yeni Başlayanlar
            </Link>
            <Link href="/tavrin-temelleri" className="button-secondary">
              Tavrın Temelleri
            </Link>
          </div>
        </div>
      </section>

      {todoNames.length > 0 ? (
        <section className="surface-alt mt-8 p-6">
          <h2 className="font-display text-3xl font-semibold text-text">
            Supabase örnek todo kayıtları
          </h2>
          <ul className="mt-4 list-disc space-y-2 pl-5 text-sm leading-6 text-muted">
            {todoNames.map((todoName) => (
              <li key={todoName}>{todoName}</li>
            ))}
          </ul>
        </section>
      ) : null}

      <section className="mt-12">
        <h2 className="section-title">Öne çıkan sanatçılar</h2>
        <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {featuredArtists.map((artist) => (
            <ArtistCard key={artist.id} artist={artist} />
          ))}
        </div>
      </section>
    </main>
  );
}
