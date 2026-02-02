import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getCookieFromRequest } from '@/lib/cookies';

export function proxy(request: NextRequest): NextResponse | undefined {
  try {
    const path = request.nextUrl.pathname;

    const isPublicPath = path === '/login' || path === '/signup';

    const token = getCookieFromRequest(request, 'token') || '';

    if (isPublicPath && token) {
      return NextResponse.redirect(new URL('/', request.nextUrl));
    }

    if (!isPublicPath && !token) {
      return NextResponse.redirect(new URL('/login', request.nextUrl));
    }
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error('Proxy error:', error.message);
    }
    return NextResponse.redirect(new URL('/login', request.nextUrl));
  }
}

export const config = {
  matcher: [
    '/login',
    '/signup',
    '/profile',
    '/chat',
    '/settings',
    '/profile/edit'
  ]
};
