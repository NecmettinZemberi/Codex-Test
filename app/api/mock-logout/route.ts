import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const response = NextResponse.redirect(new URL('/', request.url));
  response.cookies.set('mock_session', '0', { httpOnly: true, path: '/', maxAge: 0 });
  return response;
}
