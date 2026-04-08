import { AuthButtons } from '@/components/ui/AuthButtons';
import { getCurrentUserContext } from '@/utils/auth/server';
import { redirect } from 'next/navigation';

type LoginPageProps = {
  searchParams?: {
    error?: string;
  };
};

const loginErrors: Record<string, string> = {
  google_auth_not_configured:
    'Google ile giriş bu ortamda henüz yapılandırılmadı. Supabase provider ve env ayarlarını tamamlayın.',
  oauth_start_failed:
    'Google giriş akışı başlatılamadı. Supabase Auth ve redirect ayarlarını kontrol edin.',
  demo_auth_disabled:
    'Demo giriş bu ortamda kapalı. Geliştirme için ENABLE_DEMO_AUTH=true tanımlanmalıdır.',
};

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const auth = await getCurrentUserContext();

  if (auth.isAuthenticated) {
    redirect('/dashboard');
  }

  const errorMessage = searchParams?.error ? loginErrors[searchParams.error] : null;

  return (
    <main className="container-base py-12 sm:py-16">
      <section className="surface max-w-2xl p-8">
        <p className="eyebrow">Arşiv erişimi</p>
        <h1 className="page-title mt-4 text-3xl sm:text-4xl">Giriş yap</h1>
        <p className="muted-copy mt-4 leading-7">
          Google ile giriş yaptıktan sonra kişisel çalışma listenizi yönetebilir, parçalara not
          ekleyebilir ve hedef tarih planlayabilirsiniz.
        </p>

        {!auth.isGoogleAuthEnabled ? (
          <p className="mt-5 rounded-lg border border-border bg-surface2 p-3 text-sm leading-6 text-muted">
            Google OAuth aktif edildiğinde birincil giriş yöntemi burada çalışacak. Geliştirme
            aşamasında istersen demo kullanıcı ile devam edebilirsin.
          </p>
        ) : null}

        {errorMessage ? (
          <p className="mt-5 rounded-lg border border-warm/40 bg-warm/10 p-3 text-sm text-stone-200">
            {errorMessage}
          </p>
        ) : null}

        <div className="mt-7">
          <AuthButtons
            demoEnabled={auth.isDemoEnabled}
            nextHref="/dashboard"
          />
        </div>
      </section>
    </main>
  );
}
