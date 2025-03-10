/**
 * useTenant Hook
 * 
 * A React hook for accessing and managing tenant context in components.
 * Provides tenant information, Supabase client with tenant context, and
 * functions for checking access and working with tenant-specific data.
 */

import { useState, useEffect, useCallback } from 'react';
import { SupabaseClient } from '@supabase/supabase-js';
import {
  Tenant,
  detectTenant,
  getTenantContext,
  setupTenantContext,
  initSupabaseWithTenant,
  getTenantBySubdomain
} from '../utils/tenantContext';

interface UseTenantReturn {
  tenant: Tenant | null;
  tenantId: string | null;
  supabase: SupabaseClient | null;
  loading: boolean;
  error: string | null;
  refreshTenant: () => Promise<void>;
}

export function useTenant(): UseTenantReturn {
  const [tenant, setTenant] = useState<Tenant | null>(null);
  const [tenantId, setTenantId] = useState<string | null>(getTenantContext());
  const [supabase, setSupabase] = useState<SupabaseClient | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const loadTenant = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      // Detect tenant from URL or context
      const detectedSubdomain = detectTenant();
      const storedTenantId = getTenantContext();

      if (!detectedSubdomain && !storedTenantId) {
        setError('No tenant detected');
        setLoading(false);
        return;
      }

      let tenantClient: SupabaseClient | null = null;

      if (detectedSubdomain) {
        // Set up context based on subdomain
        tenantClient = await setupTenantContext(detectedSubdomain);
        
        if (!tenantClient) {
          setError(`Failed to set up tenant context for ${detectedSubdomain}`);
          setLoading(false);
          return;
        }

        // Get tenant details
        const tenantDetails = await getTenantBySubdomain(detectedSubdomain);
        setTenant(tenantDetails);
        setTenantId(tenantDetails?.id || null);
      } else if (storedTenantId) {
        // Use stored tenant ID
        tenantClient = initSupabaseWithTenant(storedTenantId);
        setTenantId(storedTenantId);
        
        // Get tenant details
        const { data } = await tenantClient
          .from('tenants')
          .select('*')
          .eq('id', storedTenantId)
          .maybeSingle();
        
        setTenant(data as Tenant);
      }

      setSupabase(tenantClient);
    } catch (err) {
      console.error('Error in useTenant hook:', err);
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
    } finally {
      setLoading(false);
    }
  }, []);

  // Load tenant on mount
  useEffect(() => {
    loadTenant();
  }, [loadTenant]);

  // Function to refresh tenant data
  const refreshTenant = async () => {
    await loadTenant();
  };

  return {
    tenant,
    tenantId,
    supabase,
    loading,
    error,
    refreshTenant
  };
}

// Hook for querying tenant-specific data
export function useTenantQuery<T>(
  tableName: string,
  queryFn: (supabase: SupabaseClient) => Promise<{ data: T | null; error: any }>
) {
  const { supabase, loading: tenantLoading, error: tenantError } = useTenant();
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<any>(null);

  useEffect(() => {
    const fetchData = async () => {
      if (tenantLoading || tenantError || !supabase) {
        return;
      }

      setLoading(true);
      
      try {
        const { data, error } = await queryFn(supabase);
        setData(data);
        setError(error);
      } catch (err) {
        console.error(`Error querying ${tableName}:`, err);
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [supabase, tableName, queryFn, tenantLoading, tenantError]);

  return { data, loading: loading || tenantLoading, error: error || tenantError };
}

// Example usage: 
// const { data: appointments, loading, error } = useTenantQuery('appointments', 
//   (supabase) => supabase.from('appointments').select('*').eq('status', 'confirmed')
// ); 