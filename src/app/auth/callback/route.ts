import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse, type NextRequest } from 'next/server';

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get('code');
  
  // Get redirect URL (if provided)
  const redirectTo = requestUrl.searchParams.get('redirectTo') || '/dashboard';
  
  if (code) {
    const cookieStore = cookies();
    const supabase = createRouteHandlerClient({ cookies: () => cookieStore });
    
    try {
      // Exchange the code for a session
      const { error } = await supabase.auth.exchangeCodeForSession(code);
      
      if (error) {
        console.error("Auth callback error:", error.message);
        // Redirect to login with error
        return NextResponse.redirect(new URL(`/auth/login?error=${encodeURIComponent(error.message)}`, request.url));
      }
    } catch (err) {
      console.error("Unexpected auth error:", err);
      return NextResponse.redirect(new URL('/auth/login?error=Authentication%20failed', request.url));
    }
  }
  
  // URL to redirect to after sign in (with any query parameters preserved)
  return NextResponse.redirect(new URL(redirectTo, request.url));
} 