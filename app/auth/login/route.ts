import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';

export async function GET(request: NextRequest) {
  const next = request.nextUrl.searchParams.get('next') ?? '/dashboard';
  const redirectTo = new URL('/auth/callback', request.url);
  redirectTo.searchParams.set('next', next);

  const supabase = await createClient();
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: redirectTo.toString(),
    },
  });

  if (error || !data.url) {
    return NextResponse.redirect(new URL('/login?error=oauth_start_failed', request.url));
  }

  return NextResponse.redirect(data.url);
}
