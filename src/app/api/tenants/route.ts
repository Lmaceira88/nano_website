import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { getTenantFromRequest, initServerSupabaseWithTenant } from '@/utils/serverTenantContext';

/**
 * GET handler - fetch tenants
 * 
 * For admin users: Get all tenants they have access to
 * For regular users: Get their current tenant info
 */
export async function GET(req: NextRequest) {
  try {
    // Get tenant context from request
    const { tenantId, subdomain } = getTenantFromRequest(req);
    
    // Initialize Supabase with tenant context if available
    const supabase = await initServerSupabaseWithTenant(tenantId, subdomain);
    
    // Get the user from the session (assumes using Supabase Auth)
    const {
      data: { session },
    } = await supabase.auth.getSession();
    
    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }
    
    const userId = session.user.id;
    
    // If we have a specific tenant ID, return info about that tenant
    if (tenantId) {
      // Check if user has access to this tenant
      const { data: userTenant, error: accessError } = await supabase
        .from('user_tenants')
        .select('*')
        .eq('user_id', userId)
        .eq('tenant_id', tenantId)
        .maybeSingle();
      
      if (accessError || !userTenant) {
        return NextResponse.json(
          { error: 'Access denied to this tenant' },
          { status: 403 }
        );
      }
      
      // Get tenant details
      const { data: tenant, error: tenantError } = await supabase
        .from('tenants')
        .select('*')
        .eq('id', tenantId)
        .maybeSingle();
      
      if (tenantError || !tenant) {
        return NextResponse.json(
          { error: 'Tenant not found' },
          { status: 404 }
        );
      }
      
      return NextResponse.json({ tenant, role: userTenant.role });
    }
    
    // If no specific tenant, list all tenants the user has access to
    const { data: userTenants, error: tenantsError } = await supabase
      .from('user_tenants')
      .select(`
        role,
        tenants:tenant_id (
          id,
          name,
          subdomain,
          business_type,
          plan,
          status,
          created_at
        )
      `)
      .eq('user_id', userId);
    
    if (tenantsError) {
      return NextResponse.json(
        { error: 'Failed to fetch tenants' },
        { status: 500 }
      );
    }
    
    // Format the response
    const tenants = userTenants.map(ut => ({
      ...ut.tenants,
      role: ut.role
    }));
    
    return NextResponse.json({ tenants });
  } catch (error) {
    console.error('Error in GET /api/tenants:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * POST handler - create a new tenant
 * 
 * Creates a new tenant and associates the current user as owner
 */
export async function POST(req: NextRequest) {
  try {
    // Initialize Supabase without tenant context (using service role)
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';
    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    
    // Get the current user
    const {
      data: { session },
    } = await supabase.auth.getSession();
    
    if (!session) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }
    
    const userId = session.user.id;
    
    // Get tenant data from request body
    const body = await req.json();
    const { name, subdomain, businessType } = body;
    
    // Validate required fields
    if (!name || !subdomain) {
      return NextResponse.json(
        { error: 'Name and subdomain are required' },
        { status: 400 }
      );
    }
    
    // Check if subdomain is available
    const { data: existingTenant } = await supabase
      .from('tenants')
      .select('id')
      .eq('subdomain', subdomain)
      .maybeSingle();
    
    if (existingTenant) {
      return NextResponse.json(
        { error: 'Subdomain is already taken' },
        { status: 409 }
      );
    }
    
    // MODIFIED: Create tenant directly instead of using RPC function
    try {
      // Insert the tenant record
      const { data: newTenant, error: insertError } = await supabase
        .from('tenants')
        .insert({
          name: name,
          subdomain: subdomain,
          type: businessType || 'Other',
          admin_id: userId,
          status: 'active'
        })
        .select('id')
        .single();
      
      if (insertError || !newTenant) {
        console.error('Error creating tenant:', insertError);
        return NextResponse.json(
          { error: 'Failed to create tenant' },
          { status: 500 }
        );
      }
      
      const newTenantId = newTenant.id;
      
      // Create tenant-user relationship
      const { error: accessError } = await supabase
        .from('tenant_user_access')
        .insert({
          tenant_id: newTenantId,
          user_id: userId,
          role: 'owner'
        });
      
      if (accessError) {
        console.error('Error creating tenant-user access:', accessError);
      }
      
      // Update user with tenant_id
      const { error: updateUserError } = await supabase
        .from('auth.users')
        .update({ tenant_id: newTenantId })
        .eq('id', userId);
        
      if (updateUserError) {
        console.error('Error linking user to tenant:', updateUserError);
        // Continue anyway as this is not critical
      }
      
      // Get the created tenant details
      const { data: tenant, error: getTenantError } = await supabase
        .from('tenants')
        .select('*')
        .eq('id', newTenantId)
        .single();
        
      if (getTenantError) {
        console.error('Error fetching tenant details:', getTenantError);
        // Still return success, but with just the ID
        return NextResponse.json({ id: newTenantId });
      }
      
      // Return the tenant data
      return NextResponse.json(tenant);
      
    } catch (error) {
      console.error('Error in tenant creation:', error);
      return NextResponse.json(
        { error: 'Failed to create tenant: Server error' },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Error in POST /api/tenants:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * PATCH handler - update a tenant
 * 
 * Updates tenant details (admin/owner only)
 */
export async function PATCH(req: NextRequest) {
  try {
    // Get tenant context from request
    const { tenantId } = getTenantFromRequest(req);
    
    if (!tenantId) {
      return NextResponse.json(
        { error: 'Tenant ID is required' },
        { status: 400 }
      );
    }
    
    // Initialize Supabase with tenant context
    const supabase = await initServerSupabaseWithTenant(tenantId);
    
    // Get the current user
    const {
      data: { session },
    } = await supabase.auth.getSession();
    
    if (!session) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }
    
    const userId = session.user.id;
    
    // Check if user is admin/owner of the tenant
    const { data: userTenant } = await supabase
      .from('user_tenants')
      .select('role')
      .eq('user_id', userId)
      .eq('tenant_id', tenantId)
      .maybeSingle();
    
    if (!userTenant || !['owner', 'admin'].includes(userTenant.role)) {
      return NextResponse.json(
        { error: 'Only owners and admins can update tenant details' },
        { status: 403 }
      );
    }
    
    // Get update data from request body
    const body = await req.json();
    const { name, businessType, plan, status } = body;
    
    // Prepare update object - only include fields that are provided
    const updateData: any = {};
    if (name !== undefined) updateData.name = name;
    if (businessType !== undefined) updateData.business_type = businessType;
    if (plan !== undefined && userTenant.role === 'owner') updateData.plan = plan;
    if (status !== undefined && userTenant.role === 'owner') updateData.status = status;
    updateData.updated_at = new Date();
    
    // Update the tenant
    const { data: updatedTenant, error: updateError } = await supabase
      .from('tenants')
      .update(updateData)
      .eq('id', tenantId)
      .select()
      .single();
    
    if (updateError) {
      return NextResponse.json(
        { error: 'Failed to update tenant' },
        { status: 500 }
      );
    }
    
    return NextResponse.json({
      tenant: updatedTenant,
      message: 'Tenant updated successfully'
    });
  } catch (error) {
    console.error('Error in PATCH /api/tenants:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 