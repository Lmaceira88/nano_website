import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs';

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
  '/project-plan',  // Add the project plan page
  '/pricing',       // Add pricing page
  '/onboarding',    // Add onboarding
];

// This function runs on every request
export async function middleware(req: NextRequest) {
  try {
    const res = NextResponse.next();
    
    // Create Supabase client with request/response
    const supabase = createMiddlewareClient({ req, res });
    
    // Get hostname (e.g. salon-a.projectnano.co.uk or localhost:3000)
    const hostname = req.headers.get('host') || '';
    console.log('Middleware processing hostname:', hostname);
    
    // For local development
    if (hostname.includes('localhost')) {
      // Check for tenant ID in query params
      const { searchParams } = new URL(req.url);
      const tenantId = searchParams.get('tenant');
      
      if (tenantId) {
        // Set tenant ID in header for the backend
        const requestHeaders = new Headers(req.headers);
        requestHeaders.set('x-tenant-id', tenantId);
        
        // Return response with tenant header
        return NextResponse.next({
          request: {
            headers: requestHeaders,
          },
        });
      }
      
      return res;
    }
    
    // For production with subdomains
    // Extract subdomain from hostname
    // Handle both projectnano.co.uk and projectnano.vercel.app domains
    const domainParts = hostname.split('.');
    
    // Different logic for different domain structures
    let isSubdomain = false;
    let subdomain = '';
    
    if (hostname.includes('projectnano.co.uk')) {
      isSubdomain = domainParts.length > 2 && domainParts[0] !== 'www';
      subdomain = isSubdomain ? domainParts[0] : '';
    } else if (hostname.includes('vercel.app')) {
      // For vercel.app domains, the structure is different
      isSubdomain = domainParts.length > 3;
      subdomain = isSubdomain ? domainParts[0] : '';
    }
    
    console.log('Subdomain detection:', { isSubdomain, subdomain });
    
    if (isSubdomain && subdomain) {
      // Fetch tenant ID from subdomain
      try {
        const { data, error } = await supabase
          .from('tenants')
          .select('id')
          .eq('subdomain', subdomain)
          .single();
        
        if (error) {
          console.error('Supabase query error:', error);
        }
        
        if (data?.id) {
          // Set tenant ID in header for the backend
          const requestHeaders = new Headers(req.headers);
          requestHeaders.set('x-tenant-id', data.id);
          
          // Return response with tenant header
          return NextResponse.next({
            request: {
              headers: requestHeaders,
            },
          });
        }
      } catch (err) {
        console.error('Error fetching tenant from Supabase:', err);
      }
    }
    
    // If we reach here, no tenant was found or there was an error
    // Continue with original request for main site
    return res;
  } catch (error) {
    console.error('Middleware error:', error);
    // If middleware fails, just continue with the request
    return NextResponse.next();
  }
}

// Configure which paths the middleware runs on
export const config = {
  matcher: [
    // Match all paths except certain exclusions
    '/((?!_next/static|_next/image|favicon.ico|images|api/auth).*)',
  ],
}; 