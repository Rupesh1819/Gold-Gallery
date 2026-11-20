import { NextResponse } from 'next/server';
import { SESSION_COOKIE_NAME, revokeSessionToken } from '@/lib/auth/adminSession';

export async function POST(request: Request) {
  // Extract session token from incoming request
  let token: string | null = null;
  const cookieHeader = request.headers.get('cookie') || '';
  const match = cookieHeader.match(new RegExp(`(?:^|;\\s*)${SESSION_COOKIE_NAME}=([^;]*)`));
  if (match) {
    token = decodeURIComponent(match[1]);
  } else {
    const authHeader = request.headers.get('authorization');
    if (authHeader && authHeader.startsWith('Bearer ')) {
      token = authHeader.substring(7).trim();
    }
  }

  // Persistently revoke the session in Supabase PostgreSQL
  if (token) {
    await revokeSessionToken(token);
  }

  const response = NextResponse.json({
    success: true,
    message: 'Logged out and session revoked successfully',
  });

  // Clear client cookie
  response.cookies.set({
    name: SESSION_COOKIE_NAME,
    value: '',
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 0,
  });

  return response;
}
