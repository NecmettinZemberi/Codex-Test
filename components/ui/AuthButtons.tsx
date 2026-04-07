'use client';

import { useState } from 'react';
import { signInWithGoogle, signOut } from '@/lib/supabase/auth';
import { isSupabaseConfigured } from '@/lib/supabase/client';

export function AuthButtons() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGoogleLogin = async () => {
    setLoading(true);
    setError(null);

    try {
      if (isSupabaseConfigured) {
        await signInWithGoogle();
      } else {
        window.location.href = '/api/mock-auth';
      }
    } catch {
      setError('Giriş işlemi başlatılamadı. Env değişkenlerini kontrol edin.');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    setLoading(true);
    await signOut();
    window.location.href = '/api/mock-logout';
  };

  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
      <button
        onClick={handleGoogleLogin}
        disabled={loading}
        className="rounded-lg bg-accent px-5 py-3 text-sm font-semibold text-slate-900 hover:bg-amber-300 disabled:opacity-60"
      >
        {loading ? 'İşleniyor...' : 'Google ile Giriş Yap'}
      </button>
      <button
        onClick={handleLogout}
        disabled={loading}
        className="rounded-lg border border-border px-5 py-3 text-sm font-semibold text-slate-100 hover:bg-slate-800 disabled:opacity-60"
      >
        Çıkış Yap
      </button>
      {error ? <p className="text-sm text-rose-300">{error}</p> : null}
    </div>
  );
}
