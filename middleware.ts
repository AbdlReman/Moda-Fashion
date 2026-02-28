import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { verifyAuthToken } from '@/lib/auth';

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Protected admin routes: /dashboard, /users, /dashboard/vendors
  const isProtectedRoute =
    pathname.startsWith('/dashboard') ||
    pathname.startsWith('/users');

  if (!isProtectedRoute) {
    return NextResponse.next();
  }

  const token = request.cookies.get('auth_token')?.value;
  if (!token) {
    const url = new URL('/login', request.url);
    return NextResponse.redirect(url);
  }

  try {
    const payload = await verifyAuthToken(token);
    if (payload?.role !== 'admin') {
      const url = new URL('/find-match', request.url);
      return NextResponse.redirect(url);
    }
    return NextResponse.next();
  } catch {
    const url = new URL('/login', request.url);
    return NextResponse.redirect(url);
  }
}

export const config = {
  matcher: ['/dashboard/:path*', '/users/:path*'],
};


