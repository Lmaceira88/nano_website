import { NextRequest, NextResponse } from 'next/server';
import { initServerSupabaseWithTenant } from '@/utils/serverTenantContext';

/**
 * GET handler - fetch appointments for a specific tenant
 */
export async function GET(
  req: NextRequest,
  { params }: { params: { tenant: string } }
) {
  try {
    // Get tenant subdomain from URL parameter
    const tenantSubdomain = params.tenant;
    
    if (!tenantSubdomain) {
      return NextResponse.json(
        { error: 'Tenant subdomain is required' },
        { status: 400 }
      );
    }
    
    // Initialize Supabase with tenant context from subdomain
    const supabase = await initServerSupabaseWithTenant(undefined, tenantSubdomain);
    
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
    
    // Get query parameters
    const { searchParams } = new URL(req.url);
    const date = searchParams.get('date');
    const professionalId = searchParams.get('professional');
    const status = searchParams.get('status');
    
    // Start building the query
    let query = supabase.from('appointments').select(`
      id,
      date,
      start_time,
      end_time,
      client_first_name,
      client_last_name,
      client_email,
      client_phone,
      status,
      services:service_id (
        id,
        name,
        duration,
        price
      ),
      professionals:professional_id (
        id,
        name
      ),
      created_at
    `);
    
    // Apply filters
    if (date) {
      query = query.eq('date', date);
    }
    
    if (professionalId) {
      query = query.eq('professional_id', professionalId);
    }
    
    if (status) {
      query = query.eq('status', status);
    }
    
    // Execute the query
    const { data: appointments, error } = await query;
    
    if (error) {
      console.error('Error fetching appointments:', error);
      return NextResponse.json(
        { error: 'Failed to fetch appointments' },
        { status: 500 }
      );
    }
    
    return NextResponse.json({ appointments });
  } catch (error) {
    console.error('Error in GET /api/[tenant]/appointments:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * POST handler - create a new appointment for a specific tenant
 */
export async function POST(
  req: NextRequest,
  { params }: { params: { tenant: string } }
) {
  try {
    // Get tenant subdomain from URL parameter
    const tenantSubdomain = params.tenant;
    
    if (!tenantSubdomain) {
      return NextResponse.json(
        { error: 'Tenant subdomain is required' },
        { status: 400 }
      );
    }
    
    // Initialize Supabase with tenant context from subdomain
    const supabase = await initServerSupabaseWithTenant(undefined, tenantSubdomain);
    
    // Get the current user (optional - could be a public booking)
    const {
      data: { session },
    } = await supabase.auth.getSession();
    
    // Get appointment data from request body
    const body = await req.json();
    const {
      date,
      start_time,
      end_time,
      client_first_name,
      client_last_name,
      client_email,
      client_phone,
      service_id,
      professional_id,
      notes
    } = body;
    
    // Validate required fields
    if (!date || !start_time || !end_time || !client_first_name || !service_id || !professional_id) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }
    
    // Insert the appointment
    const { data: appointment, error } = await supabase
      .from('appointments')
      .insert({
        date,
        start_time,
        end_time,
        client_first_name,
        client_last_name,
        client_email,
        client_phone,
        service_id,
        professional_id,
        notes,
        status: 'confirmed',
        // The tenant_id will be set automatically by the database trigger
      })
      .select()
      .single();
    
    if (error) {
      console.error('Error creating appointment:', error);
      return NextResponse.json(
        { error: 'Failed to create appointment' },
        { status: 500 }
      );
    }
    
    return NextResponse.json(
      { appointment, message: 'Appointment created successfully' },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error in POST /api/[tenant]/appointments:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 