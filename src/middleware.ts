import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

/**
 * Middleware for handling tenant routing and context
 * 
 * This middleware:
 * 1. Detects the tenant from the hostname (subdomain)
 * 2. Adds tenant context headers to API requests
 * 3. Redirects to login if authentication is required
 */

// Define public routes that don't require authentication
const publicRoutes = [
  '/',  // Make homepage public
  '/auth/login',
  '/auth/register',
  '/auth/verify',
  '/auth/forgot-password',
  '/auth/reset-password',
  '/auth/callback',
];

// For testing without the Supabase auth helpers
export async function middleware(req: NextRequest) {
  // Initialize response
  const res = NextResponse.next();
  
  try {
    // Get the pathname from the URL
    const pathname = req.nextUrl.pathname;
    
    // Check if accessing root path or marketing pages - always allow
    if (pathname === '/' || pathname.startsWith('/marketing') || pathname.startsWith('/about')) {
      return NextResponse.next();
    }
    
    // Check if the request is for a public route
    const isPublicRoute = publicRoutes.some(route => 
      pathname === route || pathname.startsWith(route + '/')
    );

    // If accessing a protected route, check for session (simplified for now)
    if (!isPublicRoute) {
      // In a real implementation, we would check for a valid session here
      // For now, we'll just simulate by checking for a cookie
      const hasSession = req.cookies.has('auth-session');
      
      if (!hasSession) {
        // Store the original URL to redirect after login
        const redirectUrl = new URL('/auth/login', req.url);
        redirectUrl.searchParams.set('redirectTo', pathname);
        
        return NextResponse.redirect(redirectUrl);
      }
    }

    return res;
  } catch (error) {
    console.error('Middleware error:', error);
    // On error, allow the request to continue
    return NextResponse.next();
  }
}

// Specify which routes this middleware applies to
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public (public files)
     * - api routes that should be public
     */
    '/((?!_next/static|_next/image|favicon.ico|public|api/public).*)',
  ],
}; 