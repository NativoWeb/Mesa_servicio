import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const PROTECTED_PREFIXES = ['/admin', '/lider', '/tecnico', '/usuario', '/inventario', '/cuentadante'];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const isProtected = PROTECTED_PREFIXES.some(prefix => pathname.startsWith(prefix));

  if (isProtected) {
    const authToken = request.cookies.get('auth-token');
    if (!authToken) {
      return NextResponse.redirect(new URL('/login', request.url));
    }
  }

  // Redirect / to /login if not authenticated
  if (pathname === '/') {
    const authToken = request.cookies.get('auth-token');
    if (!authToken) {
      return NextResponse.redirect(new URL('/login', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/', '/admin/:path*', '/lider/:path*', '/tecnico/:path*', '/usuario/:path*', '/inventario/:path*', '/cuentadante/:path*'],
};
