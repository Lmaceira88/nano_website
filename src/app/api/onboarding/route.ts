import { NextResponse } from 'next/server';
import { provisionTenant, getTenantUrl } from '@/utils/tenantManager';

// Simulate a database to check for existing emails
const existingEmails = new Set(['test@example.com']);
// Simulate a database of admin users
const adminUsers = new Map<string, any>();

export async function POST(request: Request) {
  try {
    const data = await request.json();
    
    // Simulate server-side validation
    if (!data.admin || !data.admin.email || !data.admin.firstName || !data.admin.lastName || !data.admin.phone) {
      return NextResponse.json({ 
        error: 'Missing required admin fields' 
      }, { status: 400 });
    }
    
    if (!data.business || !data.business.name || !data.business.type) {
      return NextResponse.json({ 
        error: 'Missing required business fields' 
      }, { status: 400 });
    }
    
    if (!data.billing || !data.billing.cardNumber || !data.billing.expirationDate || !data.billing.cvc || !data.billing.billingZip) {
      return NextResponse.json({ 
        error: 'Missing required billing fields' 
      }, { status: 400 });
    }
    
    if (!data.service || !data.service.id || !data.service.name) {
      return NextResponse.json({ 
        error: 'Missing required service fields' 
      }, { status: 400 });
    }
    
    // Check if email already exists
    if (existingEmails.has(data.admin.email)) {
      return NextResponse.json({ 
        error: 'Email already in use',
        message: 'This email is already registered. Please use a different email address or login to your existing account.'
      }, { status: 409 });
    }
    
    // Log the incoming data (would be saved to database in real implementation)
    console.log('Received onboarding data:', JSON.stringify(data, null, 2));
    
    // Create admin user
    const adminId = generateMockUuid();
    const admin = {
      id: adminId,
      email: data.admin.email,
      firstName: data.admin.firstName,
      lastName: data.admin.lastName,
      phone: data.admin.phone,
      createdAt: new Date()
    };
    
    // Store admin in our mock database
    adminUsers.set(adminId, admin);
    existingEmails.add(data.admin.email);
    
    // Provision a new tenant for this business
    console.log(`Provisioning tenant for business: ${data.business.name}`);
    
    const tenant = await provisionTenant(
      data.business.name,
      data.business.type,
      adminId
    );
    
    console.log(`Tenant provisioned with ID: ${tenant.id}`);
    console.log(`Tenant details: ${JSON.stringify(tenant, null, 2)}`);
    
    // In a real implementation, we would also:
    // 1. Process the billing information
    // 2. Create the initial service in the tenant's database
    // 3. Set up the admin user's permissions for this tenant
    
    // Generate JWT token with admin and tenant information
    const token = generateMockToken(admin, tenant.id);
    
    // Get the tenant URL
    const tenantUrl = getTenantUrl(tenant);
    
    console.log(`Redirecting to: ${tenantUrl}?token=${token.substring(0, 20)}...`);
    
    // Return success response with token and tenant information
    return NextResponse.json({
      token,
      user: {
        id: adminId,
        email: data.admin.email,
        firstName: data.admin.firstName,
        lastName: data.admin.lastName
      },
      tenant: {
        id: tenant.id,
        name: tenant.businessName,
        subdomain: tenant.subdomain,
        url: tenantUrl
      }
    });
    
  } catch (error) {
    console.error('Error processing onboarding request:', error);
    return NextResponse.json({ 
      error: 'Internal Server Error',
      message: 'An unexpected error occurred. Please try again.'
    }, { status: 500 });
  }
}

// Helper function to generate a mock JWT token
function generateMockToken(admin: any, tenantId: string) {
  // In a real implementation, this would use a JWT library with proper signing
  const header = btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
  const payload = btoa(JSON.stringify({
    sub: admin.id,
    email: admin.email,
    name: `${admin.firstName} ${admin.lastName}`,
    tenantId: tenantId,
    iat: Math.floor(Date.now() / 1000),
    exp: Math.floor(Date.now() / 1000) + (60 * 60) // 1 hour
  }));
  const signature = btoa('mock-signature');
  
  return `${header}.${payload}.${signature}`;
}

// Helper function to generate a mock UUID
function generateMockUuid() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0, v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
} 