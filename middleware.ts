import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  // Protect admin routes (except login)
  if (pathname.startsWith('/admin') && pathname !== '/admin/login') {
    const token = request.cookies.get('admin_token')?.value;
    if (!token) {
      return NextResponse.redirect(new URL('/admin/login', request.url));
    }
  }

  // Redirect from /admin/login if already authenticated
  if (pathname === '/admin/login') {
    const token = request.cookies.get('admin_token')?.value;
    if (token) {
      return NextResponse.redirect(new URL('/admin', request.url));
    }
  }

  // Protect tenant routes (except login and public pages)
  if (pathname.startsWith('/t/') && !pathname.includes('/login') && !pathname.match(/^\/t\/[^/]+$/)) {
    const token = request.cookies.get('tenant_token')?.value;
    if (!token) {
      const slug = pathname.split('/')[2];
      return NextResponse.redirect(new URL(`/t/${slug}/login`, request.url));
    }
  }

  // Redirect from tenant login if already authenticated
  if (pathname.match(/^\/t\/[^/]+\/login$/)) {
    const token = request.cookies.get('tenant_token')?.value;
    if (token) {
      const slug = pathname.split('/')[2];
      return NextResponse.redirect(new URL(`/t/${slug}/dashboard`, request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*', '/t/:path*']
};
