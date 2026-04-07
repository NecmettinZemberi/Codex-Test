import { supabase } from './client';

export async function signInWithGoogle() {
  if (!supabase) {
    throw new Error('Supabase environment variables are missing.');
  }

  await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: `${window.location.origin}/dashboard`,
    },
  });
}

export async function signOut() {
  if (!supabase) {
    return;
  }

  await supabase.auth.signOut();
}
