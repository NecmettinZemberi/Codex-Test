import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';

const DEFAULT_REDIRECT_PATH = '/dashboard';

function getSafeRedirectPath(nextParam: string | null): string {
  if (!nextParam) {
    return DEFAULT_REDIRECT_PATH;
  }

  try {
    const parsed = new URL(nextParam, 'http://localhost');

    if (parsed.origin !== 'http://localhost' || !parsed.pathname.startsWith('/')) {
      return DEFAULT_REDIRECT_PATH;
    }

    return `${parsed.pathname}${parsed.search}${parsed.hash}`;
  } catch {
    return DEFAULT_REDIRECT_PATH;
  }
}

export async function GET(request: NextRequest) {
  const code = request.nextUrl.searchParams.get('code');
  const next = request.nextUrl.searchParams.get('next');
  const safeRedirectPath = getSafeRedirectPath(next);

  if (code) {
    const supabase = await createClient();
    await supabase.auth.exchangeCodeForSession(code);
  }

  return NextResponse.redirect(new URL(safeRedirectPath, request.url));
}
