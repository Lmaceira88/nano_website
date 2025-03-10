'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function Home() {
  const router = useRouter();

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 bg-gray-900">
      <div className="max-w-4xl w-full mx-auto">
        {/* Website Navigation */}
        <div className="flex justify-between items-center mb-8 border-b border-gray-700 pb-4">
          <div className="flex items-center">
            <img 
              src="/logo.svg" 
              alt="ProjectNano Logo" 
              className="h-10 w-auto mr-3" 
            />
            <span className="text-xl font-bold text-white">ProjectNano</span>
          </div>
          <div className="space-x-4">
            <Link 
              href="/auth/login" 
              className="px-4 py-2 bg-gray-800 hover:bg-gray-700 text-gray-300 font-medium rounded-md"
            >
              Sign In
            </Link>
            <Link 
              href="/auth/register" 
              className="px-4 py-2 bg-gray-100 hover:bg-white text-black font-medium rounded-md"
            >
              Sign Up
            </Link>
          </div>
        </div>
      
        {/* Hero Section */}
        <div className="bg-gray-800 p-8 rounded-lg shadow-md border border-gray-700 mb-8">
          <div className="flex items-center justify-center mb-6">
            <img 
              src="/logo.svg" 
              alt="ProjectNano Logo" 
              className="h-16 w-auto mr-4" 
            />
            <h1 className="text-4xl font-bold text-white">ProjectNano</h1>
          </div>
          
          <p className="text-gray-300 mb-8 text-center text-xl">
            Professional appointment management system with secure authentication
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              href="/auth/login" 
              className="py-3 px-6 bg-gray-100 hover:bg-white text-black font-semibold rounded-md text-center transition-colors"
            >
              Sign In
            </Link>
            
            <Link 
              href="/auth/register" 
              className="py-3 px-6 bg-gray-700 hover:bg-gray-600 text-white font-semibold rounded-md text-center transition-colors"
            >
              Create Account
            </Link>
            
            <a 
              href="http://localhost:5174/"
              className="py-3 px-6 border border-gray-600 text-gray-300 font-semibold rounded-md text-center hover:bg-gray-700 transition-colors"
              target="_blank"
              rel="noopener noreferrer"
            >
              Visit Dashboard
            </a>
          </div>
        </div>
        
        {/* Features Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-gray-800 p-6 rounded-lg shadow-md border border-gray-700">
            <h2 className="text-xl font-bold text-white mb-3">Secure Authentication</h2>
            <p className="text-gray-300 mb-4">
              Email verification and secure account management with Supabase Auth.
            </p>
            <Link 
              href="/auth/register"
              className="text-gray-300 hover:text-white flex items-center"
            >
              Learn more
              <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
          
          <div className="bg-gray-800 p-6 rounded-lg shadow-md border border-gray-700">
            <h2 className="text-xl font-bold text-white mb-3">Appointment Management</h2>
            <p className="text-gray-300 mb-4">
              Easily manage appointments and client bookings in one place.
            </p>
            <a 
              href="http://localhost:5174/" 
              className="text-gray-300 hover:text-white flex items-center"
              target="_blank"
              rel="noopener noreferrer"
            >
              Go to dashboard
              <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </a>
          </div>
          
          <div className="bg-gray-800 p-6 rounded-lg shadow-md border border-gray-700">
            <h2 className="text-xl font-bold text-white mb-3">Multi-Tenant Support</h2>
            <p className="text-gray-300 mb-4">
              Customized solutions for different business types and requirements.
            </p>
            <Link 
              href="/auth/register"
              className="text-gray-300 hover:text-white flex items-center"
            >
              Get started
              <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
        </div>
        
        <div className="text-center text-gray-400 text-sm">
          <p>© 2025 ProjectNano. All rights reserved.</p>
          <p className="mt-2">
            <a 
              href="AUTHENTICATION_DOCS.md" 
              className="text-gray-300 hover:text-white"
              target="_blank"
              rel="noopener noreferrer"
            >
              View Authentication Documentation
            </a>
          </p>
        </div>
      </div>
    </main>
  );
} 