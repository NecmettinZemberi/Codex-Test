import Link from 'next/link';
import { AuthMode } from '@/utils/auth/server';

type AuthButtonsProps = {
  mode?: AuthMode;
  demoEnabled?: boolean;
  nextHref?: string;
};

export function AuthButtons({
  mode = 'anonymous',
  demoEnabled = false,
  nextHref = '/dashboard',
}: AuthButtonsProps) {
  if (mode === 'supabase') {
    return (
      <form action="/auth/logout" method="post">
        <button type="submit" className="button-secondary">
          Çıkış yap
        </button>
      </form>
    );
  }

  if (mode === 'demo') {
    return (
      <form action="/api/mock-logout" method="get">
        <button type="submit" className="button-secondary">
          Demo oturumunu kapat
        </button>
      </form>
    );
  }

  return (
    <div className="flex flex-col gap-3 sm:flex-row">
      <Link href={`/auth/login?next=${encodeURIComponent(nextHref)}`} className="button-primary">
        Google ile giriş yap
      </Link>

      {demoEnabled ? (
        <Link href="/api/mock-auth" className="button-secondary">
          Demo kullanıcı olarak devam et
        </Link>
      ) : null}
    </div>
  );
}
