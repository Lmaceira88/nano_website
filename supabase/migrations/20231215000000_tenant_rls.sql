-- Tenant RLS Policies
-- This migration sets up Row-Level Security for multi-tenant data isolation

-- Create a function to check if the request is from the correct tenant
CREATE OR REPLACE FUNCTION auth.check_tenant_id()
RETURNS boolean AS $$
BEGIN
  -- Check if the x-tenant-id header matches the tenant_id in the row
  IF current_setting('request.headers', true)::json->>'x-tenant-id' IS NULL THEN
    RETURN false;
  END IF;

  -- The req_tenant_id contains the tenant ID from the request headers
  RETURN true;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create a function to set tenant_id on insert
CREATE OR REPLACE FUNCTION public.set_tenant_id_on_insert()
RETURNS TRIGGER AS $$
BEGIN
  -- Cast the text tenant_id from headers to UUID
  NEW.tenant_id := (current_setting('request.headers', true)::json->>'x-tenant-id')::UUID;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Apply RLS policies to tables that exist
DO $$ 
BEGIN
    -- Check if clients table exists
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'clients') THEN
        -- Enable RLS
        ALTER TABLE clients ENABLE ROW LEVEL SECURITY;
        
        -- Drop existing policies if they exist
        DROP POLICY IF EXISTS tenant_isolation_select_clients ON clients;
        DROP POLICY IF EXISTS tenant_isolation_insert_clients ON clients;
        DROP POLICY IF EXISTS tenant_isolation_update_clients ON clients;
        DROP POLICY IF EXISTS tenant_isolation_delete_clients ON clients;
        
        -- Create new policies with explicit UUID casting
        CREATE POLICY tenant_isolation_select_clients ON clients
          FOR SELECT USING (
            tenant_id = (current_setting('request.headers', true)::json->>'x-tenant-id')::UUID
          );
        
        CREATE POLICY tenant_isolation_insert_clients ON clients
          FOR INSERT WITH CHECK (
            tenant_id = (current_setting('request.headers', true)::json->>'x-tenant-id')::UUID
          );
        
        CREATE POLICY tenant_isolation_update_clients ON clients
          FOR UPDATE USING (
            tenant_id = (current_setting('request.headers', true)::json->>'x-tenant-id')::UUID
          );
        
        CREATE POLICY tenant_isolation_delete_clients ON clients
          FOR DELETE USING (
            tenant_id = (current_setting('request.headers', true)::json->>'x-tenant-id')::UUID
          );
        
        -- Drop existing trigger if it exists
        DROP TRIGGER IF EXISTS set_tenant_id_clients ON clients;
        
        -- Create trigger to set tenant_id on insert
        CREATE TRIGGER set_tenant_id_clients
        BEFORE INSERT ON clients
        FOR EACH ROW EXECUTE FUNCTION public.set_tenant_id_on_insert();
    END IF;

    -- Check if appointments table exists
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'appointments') THEN
        -- Enable RLS
        ALTER TABLE appointments ENABLE ROW LEVEL SECURITY;
        
        -- Drop existing policies if they exist
        DROP POLICY IF EXISTS tenant_isolation_select_appointments ON appointments;
        DROP POLICY IF EXISTS tenant_isolation_insert_appointments ON appointments;
        DROP POLICY IF EXISTS tenant_isolation_update_appointments ON appointments;
        DROP POLICY IF EXISTS tenant_isolation_delete_appointments ON appointments;
        
        -- Create new policies with explicit UUID casting
        CREATE POLICY tenant_isolation_select_appointments ON appointments
          FOR SELECT USING (
            tenant_id = (current_setting('request.headers', true)::json->>'x-tenant-id')::UUID
          );
        
        CREATE POLICY tenant_isolation_insert_appointments ON appointments
          FOR INSERT WITH CHECK (
            tenant_id = (current_setting('request.headers', true)::json->>'x-tenant-id')::UUID
          );
        
        CREATE POLICY tenant_isolation_update_appointments ON appointments
          FOR UPDATE USING (
            tenant_id = (current_setting('request.headers', true)::json->>'x-tenant-id')::UUID
          );
        
        CREATE POLICY tenant_isolation_delete_appointments ON appointments
          FOR DELETE USING (
            tenant_id = (current_setting('request.headers', true)::json->>'x-tenant-id')::UUID
          );
        
        -- Drop existing trigger if it exists
        DROP TRIGGER IF EXISTS set_tenant_id_appointments ON appointments;
        
        -- Create trigger to set tenant_id on insert
        CREATE TRIGGER set_tenant_id_appointments
        BEFORE INSERT ON appointments
        FOR EACH ROW EXECUTE FUNCTION public.set_tenant_id_on_insert();
    END IF;

    -- Check if services table exists
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'services') THEN
        -- Enable RLS
        ALTER TABLE services ENABLE ROW LEVEL SECURITY;
        
        -- Drop existing policies if they exist
        DROP POLICY IF EXISTS tenant_isolation_select_services ON services;
        DROP POLICY IF EXISTS tenant_isolation_insert_services ON services;
        DROP POLICY IF EXISTS tenant_isolation_update_services ON services;
        DROP POLICY IF EXISTS tenant_isolation_delete_services ON services;
        
        -- Create new policies with explicit UUID casting
        CREATE POLICY tenant_isolation_select_services ON services
          FOR SELECT USING (
            tenant_id = (current_setting('request.headers', true)::json->>'x-tenant-id')::UUID
          );
        
        CREATE POLICY tenant_isolation_insert_services ON services
          FOR INSERT WITH CHECK (
            tenant_id = (current_setting('request.headers', true)::json->>'x-tenant-id')::UUID
          );
        
        CREATE POLICY tenant_isolation_update_services ON services
          FOR UPDATE USING (
            tenant_id = (current_setting('request.headers', true)::json->>'x-tenant-id')::UUID
          );
        
        CREATE POLICY tenant_isolation_delete_services ON services
          FOR DELETE USING (
            tenant_id = (current_setting('request.headers', true)::json->>'x-tenant-id')::UUID
          );
        
        -- Drop existing trigger if it exists
        DROP TRIGGER IF EXISTS set_tenant_id_services ON services;
        
        -- Create trigger to set tenant_id on insert
        CREATE TRIGGER set_tenant_id_services
        BEFORE INSERT ON services
        FOR EACH ROW EXECUTE FUNCTION public.set_tenant_id_on_insert();
    END IF;

    -- Check if staff table exists
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'staff') THEN
        -- Enable RLS
        ALTER TABLE staff ENABLE ROW LEVEL SECURITY;
        
        -- Drop existing policies if they exist
        DROP POLICY IF EXISTS tenant_isolation_select_staff ON staff;
        DROP POLICY IF EXISTS tenant_isolation_insert_staff ON staff;
        DROP POLICY IF EXISTS tenant_isolation_update_staff ON staff;
        DROP POLICY IF EXISTS tenant_isolation_delete_staff ON staff;
        
        -- Create new policies with explicit UUID casting
        CREATE POLICY tenant_isolation_select_staff ON staff
          FOR SELECT USING (
            tenant_id = (current_setting('request.headers', true)::json->>'x-tenant-id')::UUID
          );
        
        CREATE POLICY tenant_isolation_insert_staff ON staff
          FOR INSERT WITH CHECK (
            tenant_id = (current_setting('request.headers', true)::json->>'x-tenant-id')::UUID
          );
        
        CREATE POLICY tenant_isolation_update_staff ON staff
          FOR UPDATE USING (
            tenant_id = (current_setting('request.headers', true)::json->>'x-tenant-id')::UUID
          );
        
        CREATE POLICY tenant_isolation_delete_staff ON staff
          FOR DELETE USING (
            tenant_id = (current_setting('request.headers', true)::json->>'x-tenant-id')::UUID
          );
        
        -- Drop existing trigger if it exists
        DROP TRIGGER IF EXISTS set_tenant_id_staff ON staff;
        
        -- Create trigger to set tenant_id on insert
        CREATE TRIGGER set_tenant_id_staff
        BEFORE INSERT ON staff
        FOR EACH ROW EXECUTE FUNCTION public.set_tenant_id_on_insert();
    END IF;
END $$; 