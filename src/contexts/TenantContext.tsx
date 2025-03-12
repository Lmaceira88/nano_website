"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useSearchParams } from 'next/navigation';
import { getTenantById } from '@/utils/tenantManager';
import type { Tenant } from '@/utils/tenantManager';

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

export const TenantProvider = ({ children }: TenantProviderProps) => {
  const [tenantId, setTenantId] = useState<string | null>(null);
  const [tenantInfo, setTenantInfo] = useState<TenantInfo | null>(null);
  const [user, setUser] = useState<UserInfo | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  
  const searchParams = useSearchParams();
  
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
  
  // On mount, try to restore tenant from URL or localStorage
  useEffect(() => {
    const initTenant = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        // First, try to get tenant ID from URL
        let id = searchParams.get('tenant');
        
        // If not in URL, try localStorage
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
        
        // Try to load tenant info
        const tenant = await getTenantById(id);
        if (!tenant) {
          setError('Tenant not found');
          setIsLoading(false);
          return;
        }
        
        // Set tenant info - map from the Tenant type to our TenantInfo type
        const tenantData: TenantInfo = {
          id: tenant.id,
          name: tenant.businessName, // Use businessName as it exists in the Tenant interface
          type: tenant.businessType, // Use businessType as it exists in the Tenant interface
          subdomain: tenant.subdomain,
        };
        
        setTenantInfo(tenantData);
        
        // Store in localStorage for reuse across pages
        if (typeof window !== 'undefined') {
          localStorage.setItem('tenantInfo', JSON.stringify(tenantData));
        }
        
        // Try to load user info from localStorage
        if (typeof window !== 'undefined') {
          const storedUser = localStorage.getItem('user');
          if (storedUser) {
            setUser(JSON.parse(storedUser));
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

export default TenantContext; 