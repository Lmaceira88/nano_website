import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

/**
 * GET handler - diagnose tenant setup issues
 * 
 * This endpoint is for debugging tenant setup issues.
 * Accepts a tenant ID and returns details about the tenant's status in the database.
 */
export async function GET(req: NextRequest) {
  try {
    // Initialize Supabase with service role for admin access
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';
    
    // Check if we have both required env vars
    if (!supabaseUrl || !supabaseServiceKey) {
      return NextResponse.json(
        { error: 'Server configuration error - missing Supabase credentials' },
        { status: 500 }
      );
    }
    
    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    
    // Get tenant ID from query parameter
    const url = new URL(req.url);
    const tenantId = url.searchParams.get('tenantId');
    
    if (!tenantId) {
      return NextResponse.json(
        { error: 'tenant_id parameter is required' },
        { status: 400 }
      );
    }
    
    // First, check if the tenant exists
    const { data: tenant, error: tenantError } = await supabase
      .from('tenants')
      .select('*')
      .eq('id', tenantId)
      .maybeSingle();
    
    if (tenantError) {
      return NextResponse.json(
        { error: `Error checking tenant: ${tenantError.message}` },
        { status: 500 }
      );
    }
    
    // Check for tenant-user relationships
    const { data: tenantUsers, error: userError } = await supabase
      .from('tenant_user_access')
      .select('user_id, role')
      .eq('tenant_id', tenantId);
    
    if (userError) {
      return NextResponse.json(
        { error: `Error checking tenant users: ${userError.message}` },
        { status: 500 }
      );
    }
    
    // If we have user IDs, get their emails
    let userDetails: Array<{
      id: string;
      email: string;
      role: string;
      has_tenant_id: boolean;
    }> = [];
    if (tenantUsers && tenantUsers.length > 0) {
      // Extract user IDs
      const userIds = tenantUsers.map(tu => tu.user_id);
      
      // Get user details from auth.users
      const { data: users, error: authError } = await supabase
        .from('auth.users')
        .select('id, email, tenant_id')
        .in('id', userIds);
      
      if (authError) {
        console.error('Error fetching user details:', authError);
      } else if (users) {
        // Combine user info with their roles
        userDetails = users.map(user => {
          const userAccess = tenantUsers.find(tu => tu.user_id === user.id);
          return {
            id: user.id,
            email: user.email,
            role: userAccess?.role || 'unknown',
            has_tenant_id: user.tenant_id === tenantId
          };
        });
      }
    }
    
    // Return diagnostic information
    return NextResponse.json({
      tenant_exists: !!tenant,
      tenant_details: tenant || null,
      user_relationships: {
        count: tenantUsers?.length || 0,
        users: tenantUsers || []
      },
      user_details: userDetails,
      diagnostic_tips: generateTips(tenant, tenantUsers)
    });
    
  } catch (error) {
    console.error('Error in tenant check endpoint:', error);
    return NextResponse.json(
      { error: 'Internal server error during tenant check' },
      { status: 500 }
    );
  }
}

// Helper to generate diagnostic tips based on results
function generateTips(tenant: any, tenantUsers: any[] | null) {
  const tips = [];
  
  if (!tenant) {
    tips.push('CRITICAL: Tenant does not exist in the database. Create it using the /api/tenants POST endpoint.');
  } else {
    // Check tenant data
    if (!tenant.name) tips.push('WARNING: Tenant has no name set.');
    if (!tenant.subdomain) tips.push('WARNING: Tenant has no subdomain set.');
    if (tenant.status !== 'active') tips.push(`WARNING: Tenant status is "${tenant.status}" instead of "active".`);
  }
  
  // Check user relationships
  if (!tenantUsers || tenantUsers.length === 0) {
    tips.push('CRITICAL: No users are associated with this tenant. Add a record to tenant_user_access table.');
  } else if (!tenantUsers.some(tu => tu.role === 'owner')) {
    tips.push('WARNING: No user has the "owner" role for this tenant.');
  }
  
  // If no issues found
  if (tips.length === 0) {
    tips.push('Tenant appears to be correctly set up.');
  }
  
  return tips;
} 