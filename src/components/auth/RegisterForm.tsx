'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import supabase from '@/utils/supabaseClient';
import { AUTH_CONFIG } from '@/utils/authConfig';

export default function RegisterForm() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const validateForm = () => {
    if (!formData.firstName || !formData.lastName || !formData.email || !formData.password) {
      setError('Please fill in all required fields');
      return false;
    }
    
    if (formData.password.length < AUTH_CONFIG.PASSWORD_MIN_LENGTH) {
      setError(`Password must be at least ${AUTH_CONFIG.PASSWORD_MIN_LENGTH} characters`);
      return false;
    }
    
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return false;
    }
    
    return true;
  };
  
  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setLoading(true);
    setError(null);
    
    try {
      console.log("Registering with data:", formData);
      
      // Register with Supabase
      const { data, error } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            first_name: formData.firstName,
            last_name: formData.lastName,
            // Ensure phone is always passed, even if empty string
            phone: formData.phone || '',
            phone_number: formData.phone || '', // Add alternative field name for compatibility
            created_at: new Date().toISOString(),
          },
          emailRedirectTo: `${window.location.origin}/auth/callback`
        }
      });
      
      if (error) throw error;
      
      console.log("Registration successful:", data);
      
      // Redirect to verification page
      router.push(AUTH_CONFIG.REDIRECT_AFTER_SIGNUP);
    } catch (err: any) {
      console.error("Registration error:", err);
      setError(err.message || 'An error occurred during registration');
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="max-w-md w-full mx-auto p-6 bg-gray-800 rounded-lg shadow-md border border-gray-700">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-white">Create Admin Account</h2>
        <Link href="http://localhost:5174/" className="text-sm text-gray-300 hover:text-white">
          Go to ProjectNano →
        </Link>
      </div>
      
      {error && (
        <div className="bg-red-900/40 border border-red-700 text-red-200 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}
      
      <form onSubmit={handleRegister} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1" htmlFor="firstName">
              First Name <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              id="firstName"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-700 rounded-md bg-gray-900 text-white focus:outline-none focus:ring-2 focus:ring-gray-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1" htmlFor="lastName">
              Last Name <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              id="lastName"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-700 rounded-md bg-gray-900 text-white focus:outline-none focus:ring-2 focus:ring-gray-500"
              required
            />
          </div>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1" htmlFor="email">
            Email Address <span className="text-red-400">*</span>
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-700 rounded-md bg-gray-900 text-white focus:outline-none focus:ring-2 focus:ring-gray-500"
            required
          />
          <p className="text-xs text-gray-400 mt-1">
            This email will be used for account verification.
          </p>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1" htmlFor="phone">
            Phone Number
          </label>
          <input
            type="tel"
            id="phone"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-700 rounded-md bg-gray-900 text-white focus:outline-none focus:ring-2 focus:ring-gray-500"
            placeholder="Optional"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1" htmlFor="password">
            Password <span className="text-red-400">*</span>
          </label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-700 rounded-md bg-gray-900 text-white focus:outline-none focus:ring-2 focus:ring-gray-500"
            required
            minLength={AUTH_CONFIG.PASSWORD_MIN_LENGTH}
          />
          <p className="text-xs text-gray-400 mt-1">
            Must be at least {AUTH_CONFIG.PASSWORD_MIN_LENGTH} characters long.
          </p>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1" htmlFor="confirmPassword">
            Confirm Password <span className="text-red-400">*</span>
          </label>
          <input
            type="password"
            id="confirmPassword"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-700 rounded-md bg-gray-900 text-white focus:outline-none focus:ring-2 focus:ring-gray-500"
            required
          />
        </div>
        
        <div className="pt-2">
          <button
            type="submit"
            disabled={loading}
            className="w-full py-2 px-4 bg-gray-100 hover:bg-white text-black font-semibold rounded-md transition-colors"
          >
            {loading ? 'Creating Account...' : 'Create Account'}
          </button>
        </div>
        
        <div className="text-center text-sm text-gray-400">
          During development, email verification is disabled for testing purposes.
        </div>
        
        <div className="flex space-x-3 justify-center pt-4">
          <Link 
            href="/"
            className="text-gray-300 hover:text-white text-sm flex items-center"
          >
            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Home
          </Link>
          
          <span className="text-gray-600">|</span>
          
          <Link 
            href="/auth/login" 
            className="text-gray-300 hover:text-white text-sm"
          >
            Sign in to your account
          </Link>
        </div>
      </form>
    </div>
  );
} 