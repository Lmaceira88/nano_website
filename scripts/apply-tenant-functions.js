const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');
const fetch = require('node-fetch');

// Load environment variables
require('dotenv').config({ path: '.env.local' });

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
  console.error('Missing Supabase URL or service role key in environment variables.');
  process.exit(1);
}

// Initialize Supabase client with service role key for admin privileges
const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

// Read the SQL file
const sqlPath = path.resolve(__dirname, '../supabase/migrations/20231218000000_add_tenant_helper_functions_only.sql');
const sql = fs.readFileSync(sqlPath, 'utf8');

async function applyMigration() {
  try {
    console.log('Applying tenant helper functions...');
    
    // Create the associate_user_with_tenant function
    const associateUserFunction = `
      CREATE OR REPLACE FUNCTION associate_user_with_tenant(
        user_id UUID,
        tenant_id UUID
      )
      RETURNS BOOLEAN AS $$
      DECLARE
        success BOOLEAN := FALSE;
      BEGIN
        -- Update the user's tenant_id in auth.users
        UPDATE auth.users
        SET tenant_id = tenant_id
        WHERE id = user_id;
        
        -- Create a record in tenant_user_access if it doesn't exist
        INSERT INTO tenant_user_access (tenant_id, user_id, role)
        VALUES (tenant_id, user_id, 'owner')
        ON CONFLICT (tenant_id, user_id) DO NOTHING;
        
        -- Check if the association was successful
        IF EXISTS (
          SELECT 1 FROM auth.users 
          WHERE id = user_id AND tenant_id = tenant_id
        ) THEN
          success := TRUE;
        END IF;
        
        RETURN success;
      END;
      $$ LANGUAGE plpgsql SECURITY DEFINER;
    `;
    
    // Create the verify_tenant_setup function
    const verifyTenantFunction = `
      CREATE OR REPLACE FUNCTION verify_tenant_setup(tenant_id UUID)
      RETURNS JSONB AS $$
      DECLARE
        result JSONB;
        tenant_exists BOOLEAN;
        tenant_name TEXT;
        has_users BOOLEAN;
        user_count INT;
      BEGIN
        -- Check if tenant exists
        SELECT EXISTS (
          SELECT 1 FROM tenants WHERE id = tenant_id
        ) INTO tenant_exists;
        
        -- Get tenant name
        SELECT name INTO tenant_name FROM tenants WHERE id = tenant_id;
        
        -- Check if tenant has associated users
        SELECT EXISTS (
          SELECT 1 FROM tenant_user_access WHERE tenant_id = tenant_id
        ) INTO has_users;
        
        -- Get count of users
        SELECT COUNT(*) INTO user_count
        FROM tenant_user_access
        WHERE tenant_id = tenant_id;
        
        -- Build result object
        result := jsonb_build_object(
          'tenant_exists', tenant_exists,
          'tenant_name', tenant_name,
          'has_users', has_users,
          'user_count', user_count
        );
        
        RETURN result;
      END;
      $$ LANGUAGE plpgsql SECURITY DEFINER;
    `;
    
    // Execute each function definition separately
    const { error: error1 } = await supabase.rpc('supabase_functions', { 
      query: associateUserFunction 
    });
    
    if (error1) {
      console.error('Error creating associate_user_with_tenant function:', error1);
    } else {
      console.log('Successfully created associate_user_with_tenant function');
    }
    
    const { error: error2 } = await supabase.rpc('supabase_functions', { 
      query: verifyTenantFunction 
    });
    
    if (error2) {
      console.error('Error creating verify_tenant_setup function:', error2);
    } else {
      console.log('Successfully created verify_tenant_setup function');
    }
    
    // Alternative method: Use the REST API directly to execute raw SQL
    console.log('\nAttempting alternative method using REST API...');
    
    const headers = {
      'apikey': SUPABASE_SERVICE_ROLE_KEY,
      'Authorization': `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,
      'Content-Type': 'application/json',
      'Prefer': 'return=minimal'
    };
    
    // Execute the associate_user_with_tenant function
    try {
      const response1 = await fetch(`${SUPABASE_URL}/rest/v1/sql`, {
        method: 'POST',
        headers,
        body: JSON.stringify({ query: associateUserFunction })
      });
      
      if (!response1.ok) {
        const errorText = await response1.text();
        console.error('Error creating associate_user_with_tenant function:', errorText);
      } else {
        console.log('Successfully created associate_user_with_tenant function via REST API');
      }
    } catch (error) {
      console.error('Error making REST call for associate_user_with_tenant:', error);
    }
    
    // Execute the verify_tenant_setup function
    try {
      const response2 = await fetch(`${SUPABASE_URL}/rest/v1/sql`, {
        method: 'POST',
        headers,
        body: JSON.stringify({ query: verifyTenantFunction })
      });
      
      if (!response2.ok) {
        const errorText = await response2.text();
        console.error('Error creating verify_tenant_setup function:', errorText);
      } else {
        console.log('Successfully created verify_tenant_setup function via REST API');
      }
    } catch (error) {
      console.error('Error making REST call for verify_tenant_setup:', error);
    }
    
    console.log('Completed applying tenant helper functions.');
  } catch (error) {
    console.error('Error in applyMigration:', error);
  }
}

applyMigration(); 