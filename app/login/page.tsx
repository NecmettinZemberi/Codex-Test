import { AuthButtons } from '@/components/ui/AuthButtons';
import { isSupabaseConfigured } from '@/lib/supabase/client';

export default function LoginPage() {
  return (
    <main className="container-base py-12 sm:py-16">
      <section className="surface max-w-2xl p-8">
        <h1 className="text-3xl font-semibold text-white">Giriş Yap</h1>
        <p className="mt-3 text-slate-300">
          Google ile giriş yaptıktan sonra kişisel çalışma listenizi yönetebilirsiniz.
        </p>
        <p className="mt-3 text-sm text-slate-400">
          {isSupabaseConfigured
            ? 'Supabase yapılandırması bulundu. Google OAuth akışı başlatılabilir.'
            : 'Supabase env değişkenleri eksik. Demo amaçlı mock giriş kullanılacaktır.'}
        </p>
        <div className="mt-6">
          <AuthButtons />
        </div>
      </section>
    </main>
  );
}
