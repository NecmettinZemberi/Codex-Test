import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';
import { isDemoAuthEnabled } from '@/utils/auth/server';

export async function POST(request: NextRequest) {
  const response = NextResponse.redirect(new URL('/login', request.url), { status: 303 });

  if (isDemoAuthEnabled() && request.cookies.get('mock_session')?.value === '1') {
    response.cookies.set('mock_session', '0', { httpOnly: true, path: '/', maxAge: 0 });
    return response;
  }

  const supabase = await createClient();
  await supabase.auth.signOut();

  return response;
}
