import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const PUBLIC_PATHS = ['/login', '/forgot-password'];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const hasAuthToken = request.cookies.has('auth-token');

  const isPublic = PUBLIC_PATHS.some((p) => pathname === p || pathname.startsWith(p + '/'));

  if (!hasAuthToken && !isPublic) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  if (hasAuthToken && (pathname === '/login' || pathname === '/forgot-password')) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|api|favicon.ico).*)'],
};
