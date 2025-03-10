/**
 * Server Tenant Context Utility
 * 
 * Provides utilities for handling tenant context in API routes and server components.
 * This includes tenant detection, Supabase client initialization, and tenant access control.
 */

import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { cookies, headers } from 'next/headers';
import { NextRequest } from 'next/server';

// Types
export interface Tenant {
  id: string;
  name: string;
  subdomain: string;
  business_type: string;
  status: string;
}

// Get tenant context from request
export function getTenantFromRequest(req: NextRequest): { tenantId?: string; subdomain?: string } {
  // Check headers first
  const tenantId = req.headers.get('x-tenant-id');
  const subdomain = req.headers.get('x-tenant-subdomain');
  
  // Then check query parameters
  const url = new URL(req.url);
  const tenantParam = url.searchParams.get('tenant');
  
  return {
    tenantId: tenantId || tenantParam || undefined,
    subdomain: subdomain || undefined
  };
}

// Get tenant from Next.js headers/cookies
export function getTenantFromNextContext(): { tenantId?: string; subdomain?: string } {
  const headersList = headers();
  const cookiesList = cookies();
  
  // Check headers
  const tenantId = headersList.get('x-tenant-id');
  const subdomain = headersList.get('x-tenant-subdomain');
  
  // Check cookies
  const tenantIdCookie = cookiesList.get('tenant-id')?.value;
  const subdomainCookie = cookiesList.get('tenant-subdomain')?.value;
  
  return {
    tenantId: tenantId || tenantIdCookie || undefined,
    subdomain: subdomain || subdomainCookie || undefined
  };
}

// Initialize Supabase client with tenant context for server
export async function initServerSupabaseWithTenant(
  tenantId?: string,
  subdomain?: string
): Promise<SupabaseClient> {
  // Create a basic Supabase client
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';
  
  const supabase = createClient(supabaseUrl, supabaseServiceKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  });
  
  // If we have a subdomain but no tenantId, fetch the tenantId
  if (!tenantId && subdomain) {
    const { data } = await supabase
      .from('tenants')
      .select('id')
      .eq('subdomain', subdomain)
      .maybeSingle();
    
    tenantId = data?.id;
  }
  
  // If we have a tenantId, set it in the headers for all future requests
  if (tenantId) {
    // Initialize a new client with the tenant headers
    return createClient(supabaseUrl, supabaseServiceKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      },
      global: {
        headers: {
          'x-tenant-id': tenantId
        }
      }
    });
  }
  
  // Return the original client if no tenant context could be determined
  return supabase;
}

// Get tenant details by ID
export async function getTenantById(tenantId: string): Promise<Tenant | null> {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';
  const supabase = createClient(supabaseUrl, supabaseServiceKey);
  
  const { data, error } = await supabase
    .from('tenants')
    .select('*')
    .eq('id', tenantId)
    .maybeSingle();
  
  if (error || !data) {
    console.error('Error fetching tenant by ID:', error);
    return null;
  }
  
  return data as Tenant;
}

// Get tenant details by subdomain
export async function getTenantBySubdomain(subdomain: string): Promise<Tenant | null> {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';
  const supabase = createClient(supabaseUrl, supabaseServiceKey);
  
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

// Check if a user has access to a tenant
export async function checkUserTenantAccess(
  userId: string,
  tenantId: string
): Promise<boolean> {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';
  const supabase = createClient(supabaseUrl, supabaseServiceKey);
  
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

// Set up tenant context for database operations
export async function executeTenantQuery<T>(
  tenantId: string,
  queryFn: (supabase: SupabaseClient) => Promise<T>
): Promise<T> {
  const supabase = await initServerSupabaseWithTenant(tenantId);
  
  // Execute the function that makes database queries
  return await queryFn(supabase);
}

// Create an RLS-ready Supabase client for a specific tenant and user
export async function getTenantUserSupabase(
  tenantId: string,
  userId: string
): Promise<SupabaseClient> {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';
  
  // First check if user has access to this tenant
  const hasAccess = await checkUserTenantAccess(userId, tenantId);
  
  if (!hasAccess) {
    throw new Error('User does not have access to this tenant');
  }
  
  // Create client with tenant context
  return createClient(supabaseUrl, supabaseServiceKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    },
    global: {
      headers: {
        'x-tenant-id': tenantId,
        'x-user-id': userId
      }
    }
  });
} 