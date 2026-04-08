import { AuthButtons } from '@/components/ui/AuthButtons';
import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';

type LoginPageProps = {
  searchParams?: {
    error?: string;
  };
};

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) {
    redirect('/dashboard');
  }

  return (
    <main className="container-base py-12 sm:py-16">
      <section className="surface max-w-2xl p-8">
        <p className="eyebrow">Arşiv erişimi</p>
        <h1 className="page-title mt-4 text-3xl sm:text-4xl">Giriş yap</h1>
        <p className="muted-copy mt-4 leading-7">
          Google ile giriş yaptıktan sonra kişisel çalışma listenizi yönetebilirsiniz.
        </p>

        {searchParams?.error ? (
          <p className="mt-5 rounded-lg border border-warm/40 bg-warm/10 p-3 text-sm text-stone-200">
            Giriş başlatılamadı. Supabase Auth ayarlarını kontrol edin.
          </p>
        ) : null}

        <div className="mt-7">
          <AuthButtons />
        </div>
      </section>
    </main>
  );
}
