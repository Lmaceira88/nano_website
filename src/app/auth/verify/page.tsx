'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import supabase from '@/utils/supabaseClient';
import { AUTH_CONFIG, isVerificationRequired } from '@/utils/authConfig';
import Link from 'next/link';

export default function VerifyPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [emailSent, setEmailSent] = useState(false);
  const [userEmail, setUserEmail] = useState<string | null>(null);

  useEffect(() => {
    const checkAuthStatus = async () => {
      setLoading(true);
      
      // Get current session/user
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        // No session - redirect to login
        router.push('/auth/login');
        return;
      }
      
      const { user } = session;
      // Handle email safely
      setUserEmail(user.email || null);
      
      // Check if email is already confirmed
      if (user.email_confirmed_at) {
        // Already verified, redirect to onboarding or dashboard
        router.push(AUTH_CONFIG.REDIRECT_AFTER_VERIFICATION);
        return;
      }
      
      // If verification is not required, redirect to onboarding/dashboard
      if (!isVerificationRequired()) {
        router.push(AUTH_CONFIG.REDIRECT_AFTER_VERIFICATION);
        return;
      }
      
      setLoading(false);
    };
    
    checkAuthStatus();
  }, [router]);
  
  const resendVerificationEmail = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const { error } = await supabase.auth.resend({
        type: 'signup',
        email: userEmail || '',
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`
        }
      });
      
      if (error) throw error;
      
      setEmailSent(true);
    } catch (err: any) {
      setError(err.message || 'Failed to resend verification email');
    } finally {
      setLoading(false);
    }
  };
  
  if (loading) {
    return (
      <div className="max-w-md w-full mx-auto p-6 bg-white rounded-lg shadow-md">
        <div className="flex justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
        <p className="text-center mt-4 text-gray-600">Checking verification status...</p>
      </div>
    );
  }
  
  return (
    <div className="max-w-md w-full mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4 text-center">Verify Your Email</h2>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}
      
      {emailSent ? (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
          Verification email has been resent to {userEmail}
        </div>
      ) : (
        <div className="bg-blue-50 p-4 rounded-md mb-4">
          <p className="text-blue-800">
            We've sent a verification link to <strong>{userEmail}</strong>. 
            Please check your inbox and click the link to verify your account.
          </p>
          <p className="text-blue-800 mt-2">
            <strong>Note:</strong> During development, verification is currently disabled. 
            In production, this step will be required.
          </p>
        </div>
      )}
      
      <div className="space-y-4">
        <button
          onClick={resendVerificationEmail}
          disabled={loading}
          className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-md"
        >
          {loading ? 'Sending...' : 'Resend Verification Email'}
        </button>
        
        <div className="text-center">
          <p className="text-gray-600 mb-2">Want to use a different email?</p>
          <button
            onClick={async () => {
              await supabase.auth.signOut();
              router.push('/auth/register');
            }}
            className="text-blue-600 hover:underline"
          >
            Sign up with a different email
          </button>
        </div>
        
        <div className="border-t border-gray-200 mt-4 pt-4">
          <p className="text-gray-600 text-center mb-2">
            For testing purposes:
          </p>
          <Link 
            href={AUTH_CONFIG.REDIRECT_AFTER_VERIFICATION}
            className="block w-full py-2 px-4 bg-gray-200 hover:bg-gray-300 text-center text-gray-800 font-semibold rounded-md"
          >
            Skip Verification (Development Only)
          </Link>
        </div>
      </div>
    </div>
  );
} 