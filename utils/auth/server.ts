import 'server-only';

import { cookies } from 'next/headers';
import { createClient } from '@/utils/supabase/server';

export type AuthMode = 'anonymous' | 'demo' | 'supabase';

export type CurrentUserContext = {
  mode: AuthMode;
  isAuthenticated: boolean;
  isDemoEnabled: boolean;
  isGoogleAuthEnabled: boolean;
  user: {
    id: string;
    displayName: string;
    email: string | null;
  } | null;
};

export function isDemoAuthEnabled() {
  return process.env.ENABLE_DEMO_AUTH === 'true';
}

export function isGoogleAuthEnabled() {
  return process.env.ENABLE_GOOGLE_AUTH === 'true';
}

export async function getCurrentUserContext(): Promise<CurrentUserContext> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) {
    return {
      mode: 'supabase',
      isAuthenticated: true,
      isDemoEnabled: isDemoAuthEnabled(),
      isGoogleAuthEnabled: isGoogleAuthEnabled(),
      user: {
        id: user.id,
        displayName:
          user.user_metadata?.full_name ??
          user.user_metadata?.name ??
          user.email ??
          'Kullanıcı',
        email: user.email ?? null,
      },
    };
  }

  const cookieStore = await cookies();
  const hasDemoSession = cookieStore.get('mock_session')?.value === '1';

  if (isDemoAuthEnabled() && hasDemoSession) {
    return {
      mode: 'demo',
      isAuthenticated: true,
      isDemoEnabled: true,
      isGoogleAuthEnabled: isGoogleAuthEnabled(),
      user: {
        id: 'demo-user',
        displayName: 'Demo kullanıcı',
        email: null,
      },
    };
  }

  return {
    mode: 'anonymous',
    isAuthenticated: false,
    isDemoEnabled: isDemoAuthEnabled(),
    isGoogleAuthEnabled: isGoogleAuthEnabled(),
    user: null,
  };
}
