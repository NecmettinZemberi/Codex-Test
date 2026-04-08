import { NextRequest, NextResponse } from 'next/server';
import { isDemoAuthEnabled } from '@/utils/auth/server';

export async function GET(request: NextRequest) {
  if (!isDemoAuthEnabled()) {
    return NextResponse.redirect(new URL('/login?error=demo_auth_disabled', request.url));
  }

  const response = NextResponse.redirect(new URL('/dashboard', request.url), { status: 303 });
  response.cookies.set('mock_session', '1', { httpOnly: true, path: '/' });
  return response;
}
