/**
 * Tenant Context Utility
 * 
 * This utility provides functions for managing tenant context in the client application.
 * It handles tenant detection, context storage, and Supabase client initialization with tenant context.
 */

import { createClient, SupabaseClient } from '@supabase/supabase-js';

// Types
export interface Tenant {
  id: string;
  name: string;
  subdomain: string;
  business_type: string;
  status: string;
}

// Tenant detection
export function detectTenant(): string | null {
  // In production, extract from subdomain (e.g., tenant1.projectnano.co.uk)
  if (typeof window !== 'undefined') {
    const hostname = window.location.hostname;
    
    // If we're on a custom domain pattern (tenant.projectnano.co.uk)
    if (hostname.includes('.projectnano.co.uk') && !hostname.startsWith('www.')) {
      const subdomain = hostname.split('.')[0];
      return subdomain;
    }
    
    // Check for subdomain query parameter (for development or testing)
    const urlParams = new URLSearchParams(window.location.search);
    const tenantParam = urlParams.get('tenant');
    if (tenantParam) {
      return tenantParam;
    }
  }
  
  // If no tenant is detected
  return null;
}

// Tenant context storage
export function setTenantContext(tenantId: string): void {
  if (typeof window !== 'undefined') {
    localStorage.setItem('currentTenantId', tenantId);
  }
}

export function getTenantContext(): string | null {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('currentTenantId');
  }
  return null;
}

export function clearTenantContext(): void {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('currentTenantId');
  }
}

// Supabase client with tenant context
let supabaseClientWithTenant: SupabaseClient | null = null;
let currentStoredTenantId: string | null = null;

export function initSupabaseWithTenant(tenantId?: string): SupabaseClient {
  // Use provided tenantId or try to get from context
  const currentTenantId = tenantId || getTenantContext();
  
  if (!currentTenantId) {
    throw new Error('No tenant context available');
  }
  
  // If client already exists with same tenant, return it
  if (supabaseClientWithTenant && currentStoredTenantId === currentTenantId) {
    return supabaseClientWithTenant;
  }
  
  // Create new Supabase client with tenant context
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
  
  const client = createClient(supabaseUrl, supabaseKey, {
    auth: {
      autoRefreshToken: true,
      persistSession: true
    },
    global: {
      headers: {
        'x-tenant-id': currentTenantId
      }
    }
  });
  
  // Store client and tenant ID for reuse
  supabaseClientWithTenant = client;
  currentStoredTenantId = currentTenantId;
  
  return client;
}

// Helper to check if a user has access to a specific tenant
export async function checkTenantAccess(userId: string, tenantId: string): Promise<boolean> {
  const supabase = initSupabaseWithTenant(tenantId);
  
  const { data, error } = await supabase
    .from('user_tenants')
    .select('*')
    .eq('user_id', userId)
    .eq('tenant_id', tenantId)
    .maybeSingle();
  
  if (error) {
    console.error('Error checking tenant access:', error);
    return false;
  }
  
  return !!data;
}

// Get tenant details by subdomain
export async function getTenantBySubdomain(subdomain: string): Promise<Tenant | null> {
  // We need a basic Supabase client without tenant context for this query
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
  const supabase = createClient(supabaseUrl, supabaseKey);
  
  const { data, error } = await supabase
    .from('tenants')
    .select('*')
    .eq('subdomain', subdomain)
    .maybeSingle();
  
  if (error || !data) {
    console.error('Error fetching tenant by subdomain:', error);
    return null;
  }
  
  return data as Tenant;
}

// Function to get tenant ID from subdomain
export async function getTenantIdFromSubdomain(subdomain: string): Promise<string | null> {
  const tenant = await getTenantBySubdomain(subdomain);
  return tenant?.id || null;
}

// Store tenant in context and return initialized Supabase client
export async function setupTenantContext(subdomain: string): Promise<SupabaseClient | null> {
  try {
    // Get tenant by subdomain
    const tenant = await getTenantBySubdomain(subdomain);
    
    if (!tenant) {
      throw new Error(`Tenant not found for subdomain: ${subdomain}`);
    }
    
    // Set tenant context
    setTenantContext(tenant.id);
    
    // Initialize Supabase with tenant context
    return initSupabaseWithTenant(tenant.id);
  } catch (error) {
    console.error('Error setting up tenant context:', error);
    return null;
  }
} 