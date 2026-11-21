import { NextResponse, type NextRequest } from 'next/server';
import createMiddleware from 'next-intl/middleware';
import { routing } from './src/i18n/routing';
import { SESSION_COOKIE_NAME, verifySessionToken } from './src/lib/auth/adminSession';

const intlMiddleware = createMiddleware(routing);

export default async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // 1. Handle Admin API Protection (Return 401 JSON for unauthorized API calls)
  if (pathname.startsWith('/api/admin/')) {
    // Whitelist login route so credentials can be posted
    if (pathname.startsWith('/api/admin/auth/login')) {
      return NextResponse.next();
    }

    const sessionCookie = request.cookies.get(SESSION_COOKIE_NAME)?.value;
    const { valid } = sessionCookie ? await verifySessionToken(sessionCookie) : { valid: false };

    if (!valid) {
      return NextResponse.json(
        { error: 'Unauthorized: Valid admin session token required' },
        { status: 401 }
      );
    }

    return NextResponse.next();
  }

  // 2. Handle Admin Frontend Page Protection (Redirect to /admin/login)
  if (pathname === '/admin' || pathname.startsWith('/admin/')) {
    const sessionCookie = request.cookies.get(SESSION_COOKIE_NAME)?.value;
    const { valid } = sessionCookie ? await verifySessionToken(sessionCookie) : { valid: false };

    // If accessing /admin/login while already authenticated -> redirect to /admin
    if (pathname === '/admin/login') {
      if (valid) {
        return NextResponse.redirect(new URL('/admin', request.url));
      }
      return NextResponse.next();
    }

    // If accessing any protected admin route without a valid session -> redirect to /admin/login
    if (!valid) {
      const loginUrl = new URL('/admin/login', request.url);
      if (pathname !== '/admin') {
        loginUrl.searchParams.set('from', pathname);
      }
      return NextResponse.redirect(loginUrl);
    }

    return NextResponse.next();
  }

  // 3. Delegate public pages to next-intl localization middleware
  return intlMiddleware(request);
}

export const config = {
  matcher: [
    '/',
    '/(en|hi|mr)/:path*',
    '/admin',
    '/admin/:path*',
    '/api/admin/:path*',
    '/((?!api|_next|.*\\..*).*)',
  ],
};
