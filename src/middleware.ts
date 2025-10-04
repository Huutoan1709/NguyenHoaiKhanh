import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtVerify } from "jose";

export async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;
  console.log('Request path:', path);

  // Skip auth check for public routes
  const publicRoutes = [
    '/api/posts/published',
    '/api/posts/by-slug',
    '/api/categories'
  ];

  // Check if the current path matches any public route
  const isPublicRoute = publicRoutes.some(route => 
    request.nextUrl.pathname.startsWith(route)
  );

  if (isPublicRoute) {
    return NextResponse.next();
  }

  // Skip middleware for login route
  if (path === '/admin/login') {
    return NextResponse.next();
  }

  // Protect admin and upload routes
  if (path.startsWith('/admin') || path.startsWith('/api/posts')) {
    const token = request.cookies.get('admin-token')?.value;
    console.log('Token in middleware:', !!token);

    if (!token) {
      if (path.startsWith('/api/')) {
        return NextResponse.json(
          { error: 'Authentication required' },
          { status: 401 }
        );
      }
      // Redirect to login with callback URL
      const url = new URL('/admin/login', request.url);
      url.searchParams.set('callbackUrl', path);
      return NextResponse.redirect(url);
    }

    try {
      const secret = new TextEncoder().encode(process.env.JWT_SECRET);
      const { payload } = await jwtVerify(token, secret);

      // Add user info to headers
      const requestHeaders = new Headers(request.headers);
      requestHeaders.set('x-user-id', payload.sub as string);
      requestHeaders.set('x-user-role', payload.role as string);

      return NextResponse.next({
        request: {
          headers: requestHeaders,
        },
      });
    } catch (error) {
      console.error('Token verification failed:', error);
      // Clear invalid token
      const response = NextResponse.redirect(new URL('/admin/login', request.url));
      response.cookies.delete('admin-token');
      return response;
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/admin/:path*',
    '/api/posts/:path*',
    // Exclude login page from matching
    '/((?!admin/login$).*)',
    '/api/:path*'
  ]
};