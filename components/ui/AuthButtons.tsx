import Link from 'next/link';

type AuthButtonsProps = {
  authenticated?: boolean;
};

export function AuthButtons({ authenticated = false }: AuthButtonsProps) {
  if (authenticated) {
    return (
      <form action="/auth/logout" method="post">
        <button
          type="submit"
          className="rounded-lg border border-border px-5 py-3 text-sm font-semibold text-slate-100 hover:bg-slate-800"
        >
          Çıkış Yap
        </button>
      </form>
    );
  }

  return (
    <Link
      href="/auth/login?next=/dashboard"
      className="inline-flex rounded-lg bg-accent px-5 py-3 text-sm font-semibold text-slate-900 hover:bg-amber-300"
    >
      Google ile Giriş Yap
    </Link>
  );
}