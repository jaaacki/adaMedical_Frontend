// src/middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Simple middleware that just logs and passes through all requests
// Client-side components will handle authentication
export function middleware(request: NextRequest) {
  console.log('Middleware: path =', request.nextUrl.pathname);
  return NextResponse.next();
}

// Define which paths the middleware should run on
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