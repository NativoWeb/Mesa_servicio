import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // Auth protection is handled client-side in (dashboard)/layout.tsx
  // This middleware only handles the root redirect
  if (request.nextUrl.pathname === '/') {
    const authToken = request.cookies.get('auth-token');
    if (!authToken) {
      return NextResponse.redirect(new URL('/login', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/'],
};
