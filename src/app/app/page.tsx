"use client";

import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { getTenantById } from '@/utils/tenantManager';

interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
}

export default function TenantAppShell() {
  const searchParams = useSearchParams();
  const router = useRouter();
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [debugInfo, setDebugInfo] = useState<any>({});
  const [user, setUser] = useState<User | null>(null);
  const [tenantInfo, setTenantInfo] = useState<any>(null);

  useEffect(() => {
    const loadTenantApp = async () => {
      try {
        // Get tenant ID from URL
        const tenantId = searchParams.get('tenant');
        
        // For debugging, collect parameters
        const params: Record<string, string> = {};
        searchParams.forEach((value, key) => {
          // Don't include full token in debug info for security
          if (key === 'token') {
            params[key] = value.substring(0, 20) + '...';
          } else {
            params[key] = value;
          }
        });
        
        setDebugInfo({
          params,
          url: window.location.href,
          time: new Date().toISOString()
        });
        
        if (!tenantId) {
          console.error('No tenant ID in URL');
          setError('No tenant specified');
          setLoading(false);
          return;
        }

        // Get token from URL or localStorage (in a real app)
        const token = searchParams.get('token');
        if (!token) {
          console.error('No token in URL');
          setError('Authentication required');
          setLoading(false);
          return;
        }

        console.log(`Looking up tenant with ID: ${tenantId}`);
        
        // Verify the tenant exists
        const tenant = getTenantById(tenantId);
        if (!tenant) {
          console.error(`Tenant not found: ${tenantId}`);
          setError('Tenant not found');
          setLoading(false);
          
          // After 5 seconds, redirect to the onboarding page
          setTimeout(() => {
            router.push('/onboarding');
          }, 5000);
          
          return;
        }

        console.log(`Tenant found: ${tenant.businessName}`);

        // In a real implementation, we would:
        // 1. Validate the JWT token
        // 2. Check if the user has access to this tenant
        // 3. Load tenant-specific configuration

        // Parse the token (normally you'd verify it on the server)
        let payload;
        try {
          const tokenParts = token.split('.');
          if (tokenParts.length !== 3) {
            setError('Invalid token format');
            setLoading(false);
            return;
          }

          // Decode the payload
          payload = JSON.parse(atob(tokenParts[1]));
          
          // Check if the token is for this tenant
          if (payload.tenantId !== tenantId) {
            console.error(`Token tenant ID (${payload.tenantId}) doesn't match requested tenant ID (${tenantId})`);
            setError('Token is not valid for this tenant');
            setLoading(false);
            return;
          }
        } catch (error) {
          console.error('Error parsing token:', error);
          setError('Invalid token');
          setLoading(false);
          return;
        }

        // Simulate loading tenant data
        await new Promise(resolve => setTimeout(resolve, 1000));

        // Set the user info from the token
        setUser({
          id: payload.sub,
          email: payload.email,
          firstName: payload.name.split(' ')[0],
          lastName: payload.name.split(' ')[1] || ''
        });

        // Set tenant info
        setTenantInfo({
          id: tenant.id,
          name: tenant.businessName,
          type: tenant.businessType,
          subdomain: tenant.subdomain
        });

        setLoading(false);
      } catch (error) {
        console.error('Error loading tenant app:', error);
        setError('Failed to load application');
        setLoading(false);
      }
    };

    loadTenantApp();
  }, [searchParams, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-700 mx-auto mb-4"></div>
          <h2 className="text-2xl font-semibold mb-2">Loading Your Dashboard</h2>
          <p className="text-gray-600">
            Setting up your workspace. This will just take a moment...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full text-center">
          <div className="bg-red-100 text-red-700 p-4 rounded-lg mb-4">
            <h3 className="font-bold">Error</h3>
            <p>{error}</p>
          </div>
          
          {error === 'Tenant not found' && (
            <p className="mb-4 text-orange-600">
              Redirecting to onboarding in a few seconds...
            </p>
          )}
          
          <p className="mb-4">
            Please try again or contact support if the problem persists.
          </p>
          
          <div className="flex space-x-4 justify-center">
            <a 
              href="/"
              className="inline-block bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
            >
              Return to Home
            </a>
            
            <a 
              href="/onboarding"
              className="inline-block bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700"
            >
              Start Onboarding
            </a>
          </div>
          
          {process.env.NODE_ENV === 'development' && (
            <div className="mt-8 text-left p-4 bg-gray-100 rounded-lg">
              <h4 className="font-semibold mb-2 text-gray-700">Debug Information:</h4>
              <pre className="text-xs overflow-auto bg-white p-2 rounded">
                {JSON.stringify(debugInfo, null, 2)}
              </pre>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{tenantInfo?.name}</h1>
            <p className="text-sm text-gray-500">
              {tenantInfo?.type} • {tenantInfo?.subdomain}.projectnano.co.uk
            </p>
          </div>
          <div className="flex items-center space-x-4">
            <div className="text-right">
              <p className="text-sm font-medium text-gray-900">
                {user?.firstName} {user?.lastName}
              </p>
              <p className="text-xs text-gray-500">{user?.email}</p>
            </div>
            <div className="h-10 w-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-semibold">
              {user?.firstName?.[0]}{user?.lastName?.[0]}
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white shadow rounded-lg p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Welcome to Your Tenant Application!</h2>
          <p className="text-gray-600 mb-4">
            This is a sample tenant application shell. In a real implementation, this would be your full application with tenant-specific data.
          </p>
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h3 className="font-semibold text-blue-800 mb-2">Multi-Tenant Architecture</h3>
            <p className="text-blue-700 text-sm">
              Your application is now set up with a multi-tenant architecture. The onboarding process on projectnano.co.uk 
              has successfully provisioned your tenant instance and directed you here with the proper authentication.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white shadow rounded-lg p-6">
            <h3 className="font-semibold mb-3">Next Steps</h3>
            <ul className="space-y-2 text-sm">
              <li className="flex items-start">
                <svg className="h-5 w-5 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span>Customize your business profile</span>
              </li>
              <li className="flex items-start">
                <svg className="h-5 w-5 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span>Add more services to your catalog</span>
              </li>
              <li className="flex items-start">
                <svg className="h-5 w-5 text-gray-400 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                <span>Invite your team members</span>
              </li>
            </ul>
          </div>

          <div className="bg-white shadow rounded-lg p-6">
            <h3 className="font-semibold mb-3">Your Tenant Details</h3>
            <dl className="space-y-2 text-sm">
              <div>
                <dt className="text-gray-500">Tenant ID</dt>
                <dd>{tenantInfo?.id}</dd>
              </div>
              <div>
                <dt className="text-gray-500">Business Name</dt>
                <dd>{tenantInfo?.name}</dd>
              </div>
              <div>
                <dt className="text-gray-500">Business Type</dt>
                <dd>{tenantInfo?.type}</dd>
              </div>
              <div>
                <dt className="text-gray-500">Subdomain</dt>
                <dd>{tenantInfo?.subdomain}.projectnano.co.uk</dd>
              </div>
            </dl>
          </div>

          <div className="bg-white shadow rounded-lg p-6">
            <h3 className="font-semibold mb-3">Resources</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="#" className="text-blue-600 hover:underline">Help Documentation</a>
              </li>
              <li>
                <a href="#" className="text-blue-600 hover:underline">API Documentation</a>
              </li>
              <li>
                <a href="#" className="text-blue-600 hover:underline">Contact Support</a>
              </li>
            </ul>
          </div>
        </div>
      </main>
    </div>
  );
} 