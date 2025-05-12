// src/middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // Get the path of the request
  const path = request.nextUrl.pathname;
  
  // Check if the path is for a protected route
  const isProtectedRoute = 
    path.startsWith('/dashboard') || 
    path.startsWith('/api/protected');
  
  // Get the token from the cookies
  const token = request.cookies.get('accessToken')?.value;
  
  // Redirect to login if trying to access protected route without token
  if (isProtectedRoute && !token) {
    // Create URL for the login page with redirect parameter
    const loginUrl = new URL('/auth/login', request.url);
    loginUrl.searchParams.set('redirect', path);
    
    return NextResponse.redirect(loginUrl);
  }
  
  // Redirect to dashboard if already logged in and trying to access login page
  if (path === '/auth/login' && token) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }
  
  return NextResponse.next();
}

// Specify which routes the middleware should run on
export const config = {
  matcher: [
    // Match all paths starting with dashboard
    '/dashboard/:path*',
    // Match login page
    '/auth/login',
    // Match protected API routes
    '/api/protected/:path*'
  ],
};