'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import supabase from '@/utils/supabaseClient';
import { AUTH_CONFIG, isVerificationRequired } from '@/utils/authConfig';
import Link from 'next/link';

export default function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Check for error parameter in URL
  useEffect(() => {
    const errorParam = searchParams.get('error');
    if (errorParam) {
      setError(decodeURIComponent(errorParam));
    }
    
    // Get redirectTo parameter if present
    const redirectParam = searchParams.get('redirectTo');
    if (redirectParam) {
      console.log("Will redirect to:", redirectParam);
    }
  }, [searchParams]);
  
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    try {
      console.log("Attempting login with:", { email });
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });
      
      if (error) throw error;
      
      console.log("Login successful:", data);
      
      const user = data.user;
      
      // Check if verification is required and email is not confirmed
      const needsVerification = isVerificationRequired() && !user.email_confirmed_at;
      
      if (needsVerification) {
        // Redirect to verification page
        router.push('/auth/verify');
        return;
      }
      
      // Get redirectTo parameter if present
      const redirectTo = searchParams.get('redirectTo') || AUTH_CONFIG.REDIRECT_AFTER_LOGIN;
      
      // All checks passed, redirect to dashboard or onboarding or specific page
      router.push(redirectTo);
    } catch (err: any) {
      console.error("Login error:", err);
      setError(err.message || 'Failed to log in');
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="max-w-md w-full mx-auto p-6 bg-gray-800 rounded-lg shadow-md border border-gray-700">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-white">Log In</h2>
        <Link href="http://localhost:5174/" className="text-sm text-gray-300 hover:text-white">
          Go to ProjectNano →
        </Link>
      </div>
      
      {error && (
        <div className="bg-red-900/40 border border-red-700 text-red-200 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}
      
      <form onSubmit={handleLogin} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1" htmlFor="email">
            Email Address
          </label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-3 py-2 border border-gray-700 rounded-md bg-gray-900 text-white focus:outline-none focus:ring-2 focus:ring-gray-500"
            required
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1" htmlFor="password">
            Password
          </label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-3 py-2 border border-gray-700 rounded-md bg-gray-900 text-white focus:outline-none focus:ring-2 focus:ring-gray-500"
            required
          />
        </div>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <input
              id="remember_me"
              name="remember_me"
              type="checkbox"
              className="h-4 w-4 text-gray-900 border-gray-700 rounded"
            />
            <label htmlFor="remember_me" className="ml-2 block text-sm text-gray-300">
              Remember me
            </label>
          </div>
          
          <Link href="/auth/forgot-password" className="text-sm text-gray-300 hover:text-white">
            Forgot password?
          </Link>
        </div>
        
        <button
          type="submit"
          disabled={loading}
          className="w-full py-2 px-4 bg-gray-100 hover:bg-white text-black font-semibold rounded-md transition-colors"
        >
          {loading ? 'Logging in...' : 'Log In'}
        </button>
      </form>
      
      <div className="mt-6 text-center">
        <p className="text-gray-400 mb-2">Don't have an account?</p>
        <Link href="/auth/register" className="text-gray-300 hover:text-white">
          Create an account
        </Link>
      </div>
      
      <div className="flex space-x-3 justify-center pt-4 mt-4 border-t border-gray-700">
        <Link 
          href="/"
          className="text-gray-300 hover:text-white text-sm flex items-center"
        >
          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to Home
        </Link>
      </div>
      
      {!isVerificationRequired() && (
        <div className="mt-4 p-3 bg-gray-900 border border-gray-700 rounded-md">
          <p className="text-sm text-gray-400">
            <strong>Note:</strong> Email verification is currently disabled for development. 
            In production, users will need to verify their email addresses.
          </p>
        </div>
      )}
    </div>
  );
} 