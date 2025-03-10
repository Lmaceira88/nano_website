/**
 * Tenant Manager Utility
 * Handles the provisioning and management of SaaS tenants
 */

// Define tenant structure
export interface Tenant {
  id: string;
  subdomain: string;
  businessName: string;
  businessType: string;
  createdAt: Date;
  status: 'provisioning' | 'active' | 'suspended' | 'deleted';
  adminId: string;
}

// Instead of a Map, we'll use a function to get tenants from storage
// This prevents the data from being lost during hot reloading

// Helper to initialize tenant storage in browser environments
function initTenantStorage() {
  if (typeof window !== 'undefined' && !sessionStorage.getItem('tenants')) {
    sessionStorage.setItem('tenants', JSON.stringify({}));
  }
}

// Helper to safely parse a date string back to a Date object
function parseDateIfString(date: string | Date): Date {
  if (typeof date === 'string') {
    return new Date(date);
  }
  return date;
}

/**
 * Generate a subdomain from a business name
 */
export function generateSubdomain(businessName: string): string {
  // Remove special characters, replace spaces with hyphens, and convert to lowercase
  let subdomain = businessName
    .toLowerCase()
    .replace(/[^\w\s]/gi, '')
    .replace(/\s+/g, '-');
  
  // Add random suffix to ensure uniqueness (in production this would check for collisions)
  const randomSuffix = Math.floor(Math.random() * 1000);
  subdomain = `${subdomain}-${randomSuffix}`;
  
  return subdomain;
}

/**
 * Provision a new tenant
 */
export async function provisionTenant(
  businessName: string,
  businessType: string,
  adminId: string
): Promise<Tenant> {
  initTenantStorage();
  
  // Generate tenant ID (UUID in production)
  const tenantId = `tenant-${Math.random().toString(36).substr(2, 9)}`;
  
  // Generate subdomain from business name
  const subdomain = generateSubdomain(businessName);
  
  // Create new tenant
  const tenant: Tenant = {
    id: tenantId,
    subdomain,
    businessName,
    businessType,
    createdAt: new Date(),
    status: 'provisioning',
    adminId
  };
  
  // In a real implementation, this would:
  // 1. Create tenant entry in database
  // 2. Set up database schemas/collections for this tenant
  // 3. Configure DNS for the tenant subdomain
  // 4. Provision any required resources (storage, etc.)
  
  // Simulate async provisioning
  await new Promise(resolve => setTimeout(resolve, 300));
  
  // Update tenant status to active
  tenant.status = 'active';
  
  // Store tenant in session storage
  if (typeof window !== 'undefined') {
    const tenantsStr = sessionStorage.getItem('tenants') || '{}';
    const tenants = JSON.parse(tenantsStr);
    tenants[tenantId] = tenant;
    sessionStorage.setItem('tenants', JSON.stringify(tenants));
    
    // Also store it in a global tenants variable for server-side access
    console.log(`Tenant provisioned: ${tenantId} - ${businessName}`);
  } else {
    // For server-side, we'll log but in a real implementation this would go to a database
    console.log('Server-side tenant creation', tenant);
  }
  
  return tenant;
}

/**
 * Get tenant by ID
 */
export function getTenantById(tenantId: string): Tenant | undefined {
  // For debugging, log the requested tenant ID
  console.log(`Looking for tenant: ${tenantId}`);
  
  // Get from storage if we're in the browser
  if (typeof window !== 'undefined') {
    initTenantStorage();
    const tenantsStr = sessionStorage.getItem('tenants') || '{}';
    const tenants = JSON.parse(tenantsStr);
    
    // Log all tenants to help debug
    console.log('Available tenants:', Object.keys(tenants));
    
    if (tenants[tenantId]) {
      const tenant = tenants[tenantId];
      // Convert the string date back to a Date object
      tenant.createdAt = parseDateIfString(tenant.createdAt);
      return tenant;
    }
  }
  
  // If we're here, we didn't find the tenant
  console.log(`Tenant not found: ${tenantId}`);
  
  // For demo purposes, if the tenant wasn't found, create a mock tenant
  // This is just for development to allow testing without completing the onboarding flow
  if (tenantId && tenantId.startsWith('tenant-')) {
    const mockTenant: Tenant = {
      id: tenantId,
      subdomain: `mock-tenant-${tenantId.substring(7)}`,
      businessName: 'Mock Barbershop',
      businessType: 'Barber Shop',
      createdAt: new Date(),
      status: 'active',
      adminId: 'mock-admin-id'
    };
    
    // Store this mock tenant for future reference
    if (typeof window !== 'undefined') {
      const tenantsStr = sessionStorage.getItem('tenants') || '{}';
      const tenants = JSON.parse(tenantsStr);
      tenants[tenantId] = mockTenant;
      sessionStorage.setItem('tenants', JSON.stringify(tenants));
      console.log('Created mock tenant for development:', mockTenant);
    }
    
    return mockTenant;
  }
  
  return undefined;
}

/**
 * Get tenant URL
 */
export function getTenantUrl(tenant: Tenant): string {
  // In development, we'll use localhost with a special query param
  if (process.env.NODE_ENV === 'development') {
    return `http://localhost:3000/app?tenant=${tenant.id}`;
  }
  
  // In production, this would use the tenant's subdomain
  return `https://${tenant.subdomain}.projectnano.co.uk`;
}

/**
 * Get all tenants (for admin purposes)
 */
export function getAllTenants(): Tenant[] {
  if (typeof window !== 'undefined') {
    initTenantStorage();
    const tenantsStr = sessionStorage.getItem('tenants') || '{}';
    const tenantsObj = JSON.parse(tenantsStr);
    
    // Convert the object back to an array
    return Object.values(tenantsObj).map((tenant: any) => {
      // Convert the string date back to a Date object
      tenant.createdAt = parseDateIfString(tenant.createdAt);
      return tenant as Tenant;
    });
  }
  
  return [];
} 