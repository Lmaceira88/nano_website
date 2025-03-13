'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

export default function TenantDebugPage() {
  const [tenantId, setTenantId] = useState('');
  const [diagnosticResults, setDiagnosticResults] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [fixLoading, setFixLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  
  const searchParams = useSearchParams();
  const supabase = createClientComponentClient();
  
  // Check if tenant ID is in URL
  useEffect(() => {
    const id = searchParams.get('tenantId');
    if (id) {
      setTenantId(id);
      runDiagnostics(id);
    }
  }, [searchParams]);
  
  // Manually check tenant status
  const runDiagnostics = async (id: string) => {
    if (!id) return;
    
    setLoading(true);
    setError('');
    setDiagnosticResults(null);
    
    try {
      const response = await fetch(`/api/admin/tenant-check?tenantId=${id}`);
      const data = await response.json();
      
      setDiagnosticResults(data);
    } catch (err) {
      console.error('Error running tenant diagnostics:', err);
      setError('Failed to run diagnostics. See console for details.');
    } finally {
      setLoading(false);
    }
  };
  
  // Fix common issues
  const fixTenantIssues = async () => {
    if (!tenantId) return;
    
    setFixLoading(true);
    setError('');
    setSuccessMessage('');
    
    try {
      // Check if user is authenticated
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        setError('You must be logged in to fix tenant issues');
        return;
      }
      
      const userId = session.user.id;
      
      // Create tenant if it doesn't exist
      if (!diagnosticResults?.tenant_exists) {
        const tenantInfo = JSON.parse(localStorage.getItem('tenantInfo') || '{}');
        
        const response = await fetch('/api/tenants', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            id: tenantId, // Explicitly set the ID
            name: tenantInfo.name || 'Default Business',
            subdomain: tenantInfo.subdomain || `tenant-${tenantId.substring(0, 8)}`,
            businessType: tenantInfo.type || 'Other'
          }),
        });
        
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Failed to create tenant');
        }
      }
      
      // Create user-tenant relationship if missing
      if (diagnosticResults?.user_relationships?.count === 0) {
        const { error: accessError } = await supabase
          .from('tenant_user_access')
          .insert({
            tenant_id: tenantId,
            user_id: userId,
            role: 'owner'
          });
        
        if (accessError) {
          throw new Error(`Failed to create user-tenant access: ${accessError.message}`);
        }
      }
      
      // Update user's tenant_id if missing
      const { error: userError } = await supabase.auth.updateUser({
        data: { tenant_id: tenantId }
      });
      
      if (userError) {
        console.error('Error updating user with tenant_id:', userError);
      }
      
      setSuccessMessage('Fixed tenant issues successfully! Refreshing diagnostics...');
      
      // Re-run diagnostics after fixes
      setTimeout(() => {
        runDiagnostics(tenantId);
      }, 1500);
    } catch (err: any) {
      console.error('Error fixing tenant issues:', err);
      setError(err.message || 'Failed to fix tenant issues. See console for details.');
    } finally {
      setFixLoading(false);
    }
  };
  
  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Tenant Diagnostics</h1>
        
        {/* Tenant ID Input */}
        <div className="bg-white p-6 rounded-lg shadow-md mb-8">
          <h2 className="text-xl font-semibold mb-4">Check Tenant Status</h2>
          <div className="flex gap-4">
            <input
              type="text"
              value={tenantId}
              onChange={(e) => setTenantId(e.target.value)}
              placeholder="Enter tenant ID"
              className="flex-1 p-2 border rounded"
            />
            <button
              onClick={() => runDiagnostics(tenantId)}
              disabled={loading || !tenantId}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-gray-400"
            >
              {loading ? 'Checking...' : 'Check Status'}
            </button>
          </div>
          
          <div className="mt-4 text-sm text-gray-500">
            <p>To get the tenant ID from localStorage, run this in your browser console:</p>
            <pre className="bg-gray-100 p-2 rounded mt-1">
              console.log(localStorage.getItem('currentTenantId'))
            </pre>
          </div>
        </div>
        
        {/* Error Display */}
        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-8 rounded">
            <p className="text-red-700">{error}</p>
          </div>
        )}
        
        {/* Success Message */}
        {successMessage && (
          <div className="bg-green-50 border-l-4 border-green-500 p-4 mb-8 rounded">
            <p className="text-green-700">{successMessage}</p>
          </div>
        )}
        
        {/* Diagnostic Results */}
        {diagnosticResults && (
          <div className="bg-white p-6 rounded-lg shadow-md mb-8">
            <h2 className="text-xl font-semibold mb-4">Diagnostic Results</h2>
            
            {/* Status Overview */}
            <div className="flex gap-4 mb-6">
              <div className={`p-4 rounded-lg flex-1 text-center ${diagnosticResults.tenant_exists ? 'bg-green-50' : 'bg-red-50'}`}>
                <h3 className="font-medium">Tenant Status</h3>
                <p className={diagnosticResults.tenant_exists ? 'text-green-600' : 'text-red-600'}>
                  {diagnosticResults.tenant_exists ? 'Exists' : 'Missing'}
                </p>
              </div>
              
              <div className={`p-4 rounded-lg flex-1 text-center ${diagnosticResults.user_relationships.count > 0 ? 'bg-green-50' : 'bg-red-50'}`}>
                <h3 className="font-medium">User Access</h3>
                <p className={diagnosticResults.user_relationships.count > 0 ? 'text-green-600' : 'text-red-600'}>
                  {diagnosticResults.user_relationships.count} user(s) linked
                </p>
              </div>
              
              <div className={`p-4 rounded-lg flex-1 text-center ${
                diagnosticResults.diagnostic_tips.length === 1 && 
                diagnosticResults.diagnostic_tips[0].includes('correctly set up') ? 
                'bg-green-50' : 'bg-yellow-50'
              }`}>
                <h3 className="font-medium">Issues Found</h3>
                <p className={
                  diagnosticResults.diagnostic_tips.length === 1 && 
                  diagnosticResults.diagnostic_tips[0].includes('correctly set up') ?
                  'text-green-600' : 'text-yellow-600'
                }>
                  {diagnosticResults.diagnostic_tips.filter(tip => !tip.includes('correctly set up')).length} issues
                </p>
              </div>
            </div>
            
            {/* Fix Issues Button */}
            {(
              !diagnosticResults.tenant_exists || 
              diagnosticResults.user_relationships.count === 0 ||
              (diagnosticResults.user_details.length > 0 && diagnosticResults.user_details.some((u: { has_tenant_id: boolean }) => !u.has_tenant_id))
            ) && (
              <div className="mb-6">
                <button
                  onClick={fixTenantIssues}
                  disabled={fixLoading}
                  className="w-full px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:bg-gray-400"
                >
                  {fixLoading ? 'Fixing Issues...' : 'Fix Common Issues Automatically'}
                </button>
              </div>
            )}
            
            {/* Detailed Results Tabs */}
            <div className="border-t pt-4">
              <h3 className="font-medium mb-2">Diagnostic Tips:</h3>
              <ul className="list-disc pl-5 space-y-1">
                {diagnosticResults.diagnostic_tips.map((tip: string, index: number) => (
                  <li 
                    key={index} 
                    className={`
                      ${tip.includes('CRITICAL') ? 'text-red-600 font-medium' : ''}
                      ${tip.includes('WARNING') ? 'text-yellow-600' : ''}
                      ${tip.includes('correctly set up') ? 'text-green-600' : ''}
                    `}
                  >
                    {tip}
                  </li>
                ))}
              </ul>
            </div>
            
            {/* Tenant Details */}
            {diagnosticResults.tenant_details && (
              <div className="mt-6 border-t pt-4">
                <h3 className="font-medium mb-2">Tenant Details:</h3>
                <pre className="bg-gray-100 p-3 rounded text-sm overflow-auto">
                  {JSON.stringify(diagnosticResults.tenant_details, null, 2)}
                </pre>
              </div>
            )}
            
            {/* User Details */}
            {diagnosticResults.user_details && diagnosticResults.user_details.length > 0 && (
              <div className="mt-6 border-t pt-4">
                <h3 className="font-medium mb-2">User Details:</h3>
                <pre className="bg-gray-100 p-3 rounded text-sm overflow-auto">
                  {JSON.stringify(diagnosticResults.user_details, null, 2)}
                </pre>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
} 