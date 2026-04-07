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
        <h1 className="text-3xl font-semibold text-white">Giriş Yap</h1>
        <p className="mt-3 text-slate-300">
          Google ile giriş yaptıktan sonra kişisel çalışma listenizi yönetebilirsiniz.
        </p>

        {searchParams?.error ? (
          <p className="mt-4 rounded-lg border border-rose-500/30 bg-rose-500/10 p-3 text-sm text-rose-200">
            Giriş başlatılamadı. Supabase Auth ayarlarını kontrol edin.
          </p>
        ) : null}

        <div className="mt-6">
          <AuthButtons />
        </div>
      </section>
    </main>
  );
}