'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { useAppConnection } from '@/utils/useAppConnection';
import LoadingOverlay from '@/components/common/LoadingOverlay';
import SearchParamsProvider from '@/components/common/SearchParamsProvider';

// ProjectNano application URL - update if needed
const PROJECT_NANO_URL = 'http://localhost:5174';

// Page component with SearchParamsProvider
export default function DashboardPage() {
  return (
    <SearchParamsProvider>
      <DashboardContent />
    </SearchParamsProvider>
  );
}

// Actual content implementation
function DashboardContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, session, isLoading: authLoading } = useAuth();
  const { status, checkConnection, connectWithAuth } = useAppConnection();
  const [redirectUrl, setRedirectUrl] = useState<string | null>(null);
  
  const token = searchParams.get('token');
  
  // Check connection status on load
  useEffect(() => {
    if (!status.isAttempting && !status.isConnected) {
      checkConnection();
    }
  }, []);
  
  // Function to launch ProjectNano.co.uk dashboard with auth data
  const launchExternalDashboard = async () => {
    try {
      // Connect with auth data and get the redirect URL
      const url = await connectWithAuth(user, session);
      
      if (url) {
        setRedirectUrl(url);
        
        // If we have a specific token from onboarding, add it too
        if (token) {
          localStorage.setItem('projectnano_token', token);
        }
        
        // Perform the redirect
        window.location.href = url;
      }
    } catch (err) {
      console.error('Error redirecting to ProjectNano:', err);
    }
  };
  
  useEffect(() => {
    // Check if user is authenticated
    if (!authLoading && !user) {
      console.log("No authenticated user, redirecting to login");
      router.push('/auth/login');
      return;
    }
    
    // If we have a user and successful connection check
    if (user && session && status.isConnected && !status.isAttempting && !redirectUrl) {
      console.log("Authenticated user found and connection verified, preparing redirect");
      
      // Small delay to ensure everything is ready
      const timer = setTimeout(() => {
        launchExternalDashboard();
      }, 1000);
      
      return () => clearTimeout(timer);
    }
  }, [user, session, authLoading, status, redirectUrl]);
  
  // If still loading authentication state
  if (authLoading) {
    return <LoadingOverlay message="Loading your dashboard..." />;
  }
  
  return (
    <div className="min-h-screen bg-gray-900 flex flex-col items-center justify-center p-4">
      <div className="max-w-md w-full bg-gray-800 rounded-lg shadow-md p-8 border border-gray-700">
        <h1 className="text-2xl font-bold text-white text-center mb-6">ProjectNano Dashboard</h1>
        
        {status.isAttempting && (
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
            <p className="text-gray-300 mb-4">
              Connecting to ProjectNano dashboard...
            </p>
          </div>
        )}
        
        {status.error && (
          <div className="bg-red-900/40 border border-red-700 text-red-200 px-4 py-3 rounded mb-4">
            <p>{status.error}</p>
            <p className="text-sm mt-2">Make sure the ProjectNano application is running at: {status.targetUrl}</p>
          </div>
        )}
        
        <div className="mt-6 space-y-4">
          <button
            onClick={() => {
              checkConnection().then(connected => {
                if (connected) launchExternalDashboard();
              });
            }}
            disabled={status.isAttempting}
            className="w-full py-2 px-4 bg-gray-100 hover:bg-white text-black font-semibold rounded-md disabled:bg-gray-400"
          >
            {status.isAttempting ? 'Connecting...' : 'Connect to Dashboard'}
          </button>
          
          <a 
            href={status.targetUrl}
            className="block w-full py-2 px-4 bg-gray-700 hover:bg-gray-600 text-white font-semibold rounded-md text-center"
            target="_blank"
            rel="noopener noreferrer"
          >
            Open Dashboard in New Tab
          </a>
          
          <div className="text-center mt-4 mb-2">
            <span className="text-gray-400 text-sm">Connection status:</span>
            <div className="flex justify-center items-center space-x-2 mt-1">
              <span className={`h-3 w-3 rounded-full ${status.isAttempting ? 'bg-yellow-500' : (status.error ? 'bg-red-500' : (status.isConnected ? 'bg-green-500' : 'bg-gray-500'))}`}></span>
              <span className="text-sm text-gray-300">
                {status.isAttempting ? 'Connecting...' : (status.error ? 'Connection error' : (status.isConnected ? 'Connected' : 'Not connected'))}
              </span>
            </div>
          </div>
          
          <button
            onClick={() => router.push('/')}
            className="w-full py-2 px-4 border border-gray-600 text-gray-300 font-semibold rounded-md hover:bg-gray-700"
          >
            Return to Home
          </button>
        </div>
      </div>
    </div>
  );
} 