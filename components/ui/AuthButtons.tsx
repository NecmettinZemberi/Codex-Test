import Link from 'next/link';

type AuthButtonsProps = {
  authenticated?: boolean;
};

export function AuthButtons({ authenticated = false }: AuthButtonsProps) {
  if (authenticated) {
    return (
      <form action="/auth/logout" method="post">
        <button type="submit" className="button-secondary">
          Çıkış yap
        </button>
      </form>
    );
  }

  return (
    <Link href="/auth/login?next=/dashboard" className="button-primary">
      Google ile giriş yap
    </Link>
  );
}
