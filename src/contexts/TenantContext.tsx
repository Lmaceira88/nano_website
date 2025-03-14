"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useSearchParams } from 'next/navigation';
import { getTenantById, getTenantBySubdomain } from '@/utils/tenantManager';
import type { Tenant } from '@/utils/tenantManager';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import SearchParamsProvider from '@/components/common/SearchParamsProvider';

interface TenantContextType {
  tenantId: string | null;
  tenantInfo: TenantInfo | null;
  user: UserInfo | null;
  isLoading: boolean;
  error: string | null;
  setCurrentTenant: (tenantId: string) => void;
}

interface TenantInfo {
  id: string;
  name: string;
  type: string;
  subdomain: string;
  [key: string]: any; // For additional properties
}

interface UserInfo {
  id: string;
  email: string;
  name?: string;
  avatar?: string;
}

interface TenantProviderProps {
  children: ReactNode;
}

// Create the context with default values
const TenantContext = createContext<TenantContextType>({
  tenantId: null,
  tenantInfo: null,
  user: null,
  isLoading: true,
  error: null,
  setCurrentTenant: () => {},
});

// Hook to use the tenant context
export const useTenant = () => useContext(TenantContext);

// Helper to validate UUID format
const isValidUUID = (uuid: string): boolean => {
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  return uuidRegex.test(uuid);
};

// The actual provider implementation
const TenantProviderImpl = ({ children }: TenantProviderProps) => {
  const [tenantId, setTenantId] = useState<string | null>(null);
  const [tenantInfo, setTenantInfo] = useState<TenantInfo | null>(null);
  const [user, setUser] = useState<UserInfo | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  
  const searchParams = useSearchParams();
  const supabase = createClientComponentClient();
  
  // Function to set the current tenant
  const setCurrentTenant = (id: string) => {
    // Validate UUID format to ensure database compatibility
    if (!isValidUUID(id)) {
      console.error('Invalid tenant ID format. Expected UUID format.');
      return;
    }
    
    setTenantId(id);
    
    // Store in localStorage for persistence
    if (typeof window !== 'undefined') {
      localStorage.setItem('currentTenantId', id);
    }
  };
  
  // Function to extract subdomain from hostname
  const getSubdomainFromHostname = () => {
    if (typeof window === 'undefined') return null;
    
    const hostname = window.location.hostname;
    // Skip for localhost
    if (hostname === 'localhost') return null;
    
    const domainParts = hostname.split('.');
    return domainParts.length > 2 ? domainParts[0] : null;
  };
  
  // On mount, try to restore tenant from URL, subdomain, or localStorage
  useEffect(() => {
    const initTenant = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        // First, try to get tenant ID from URL
        let id = searchParams.get('tenant');
        let tenant = null;
        
        // Next, try to get tenant from subdomain
        if (!id) {
          const subdomain = getSubdomainFromHostname();
          if (subdomain) {
            // Get tenant info by subdomain
            tenant = await getTenantBySubdomain(subdomain);
            if (tenant) {
              id = tenant.id;
            }
          }
        }
        
        // If not in URL or subdomain, try localStorage
        if (!id && typeof window !== 'undefined') {
          id = localStorage.getItem('currentTenantId');
        }
        
        // If no tenant ID found, we're done
        if (!id) {
          setIsLoading(false);
          return;
        }
        
        // Validate tenant ID format
        if (!isValidUUID(id)) {
          console.warn('Invalid tenant ID format in context. Expected UUID format.');
          setError('Invalid tenant ID format');
          setIsLoading(false);
          return;
        }
        
        // Set the tenant ID
        setTenantId(id);
        
        // Try to load tenant info if not already loaded from subdomain
        if (!tenant) {
          tenant = await getTenantById(id);
          if (!tenant) {
            setError('Tenant not found');
            setIsLoading(false);
            return;
          }
        }
        
        // Set tenant info - map from the Tenant type to our TenantInfo type
        const tenantData: TenantInfo = {
          id: tenant.id,
          name: tenant.businessName || '',
          type: tenant.businessType || '',
          subdomain: tenant.subdomain || '',
          // Safely copy any additional properties
          ...(Object.keys(tenant).reduce((acc, key) => {
            if (!['id', 'businessName', 'businessType', 'subdomain'].includes(key)) {
              // Use type assertion for safety
              acc[key] = (tenant as any)[key];
            }
            return acc;
          }, {} as Record<string, any>))
        };
        
        setTenantInfo(tenantData);
        
        // Store in localStorage for reuse across pages
        if (typeof window !== 'undefined') {
          localStorage.setItem('tenantInfo', JSON.stringify(tenantData));
        }
        
        // Try to load user from Supabase auth session
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user) {
          // Check if tenant exists in Supabase and create it if not
          await ensureTenantExists(id, tenantData, session.user.id);
          
          const userData: UserInfo = {
            id: session.user.id,
            email: session.user.email || '',
            name: session.user.user_metadata?.name,
            avatar: session.user.user_metadata?.avatar_url,
          };
          setUser(userData);
          
          // Store in localStorage
          if (typeof window !== 'undefined') {
            localStorage.setItem('user', JSON.stringify(userData));
          }
        } else {
          // If no session, try to load user info from localStorage
          if (typeof window !== 'undefined') {
            const storedUser = localStorage.getItem('user');
            if (storedUser) {
              setUser(JSON.parse(storedUser));
            }
          }
        }
        
        setIsLoading(false);
      } catch (err) {
        console.error('Error initializing tenant:', err);
        setError('Failed to initialize tenant');
        setIsLoading(false);
      }
    };
    
    initTenant();
  }, [searchParams]);
  
  // Function to ensure tenant exists in Supabase database
  const ensureTenantExists = async (tenantId: string, tenantInfo: TenantInfo, userId: string) => {
    try {
      // First check if tenant exists in Supabase
      const { data: existingTenant, error: checkError } = await supabase
        .from('tenants')
        .select('id')
        .eq('id', tenantId)
        .maybeSingle();
      
      if (checkError) {
        console.error('Error checking if tenant exists:', checkError);
        return false;
      }
      
      // If tenant doesn't exist in Supabase, create it
      if (!existingTenant) {
        console.log('Tenant does not exist in Supabase, creating it now...');
        
        // Insert into tenants table
        const { error: insertError } = await supabase.from('tenants').insert({
          id: tenantId,
          name: tenantInfo.name,
          type: tenantInfo.type,
          subdomain: tenantInfo.subdomain,
          admin_id: userId,
          status: 'active'
        });
        
        if (insertError) {
          console.error('Error creating tenant in Supabase:', insertError);
          return false;
        }
        
        // Create tenant-user relationship
        const { error: accessError } = await supabase.from('tenant_user_access').insert({
          tenant_id: tenantId,
          user_id: userId,
          role: 'owner'
        });
        
        if (accessError) {
          console.error('Error creating tenant-user access:', accessError);
          return false;
        }
        
        // Update user with tenant_id
        const { error: userError } = await supabase.auth.updateUser({
          data: { tenant_id: tenantId }
        });
        
        if (userError) {
          console.error('Error updating user with tenant_id:', userError);
        }
        
        console.log('Successfully created tenant in Supabase');
        return true;
      }
      
      return true;
    } catch (err) {
      console.error('Error in ensureTenantExists:', err);
      return false;
    }
  };
  
  // Value that will be provided to consumers
  const value: TenantContextType = {
    tenantId,
    tenantInfo,
    user,
    isLoading,
    error,
    setCurrentTenant,
  };
  
  return (
    <TenantContext.Provider value={value}>
      {children}
    </TenantContext.Provider>
  );
};

// Wrap the provider implementation with SearchParamsProvider
export const TenantProvider = ({ children }: TenantProviderProps) => {
  return (
    <SearchParamsProvider>
      <TenantProviderImpl>{children}</TenantProviderImpl>
    </SearchParamsProvider>
  );
};

export default TenantContext; 