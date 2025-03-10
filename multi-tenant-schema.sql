-- Multi-Tenant Database Schema for ProjectNano
-- This script converts the existing schema to support multi-tenancy

-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create a tenants table to manage all customers
CREATE TABLE IF NOT EXISTS tenants (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  subdomain TEXT NOT NULL UNIQUE,
  business_type TEXT,
  plan TEXT DEFAULT 'starter',
  status TEXT DEFAULT 'active',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create an index on subdomain for faster lookups
CREATE INDEX IF NOT EXISTS idx_tenants_subdomain ON tenants(subdomain);

-- Create a users table to manage all users across tenants
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT NOT NULL UNIQUE,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  phone TEXT,
  password_hash TEXT, -- Will be managed by Supabase Auth in production
  last_login TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create a join table for users and tenants
CREATE TABLE IF NOT EXISTS user_tenants (
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  tenant_id UUID REFERENCES tenants(id) ON DELETE CASCADE,
  role TEXT NOT NULL, -- 'owner', 'admin', 'staff', etc.
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  PRIMARY KEY (user_id, tenant_id)
);

-- Add tenant_id to existing tables
-- For each table, we'll add the tenant_id column and create an index
-- We'll also create a Row Level Security (RLS) policy

-- 1. Professionals Table
ALTER TABLE professionals 
ADD COLUMN IF NOT EXISTS tenant_id UUID REFERENCES tenants(id);

CREATE INDEX IF NOT EXISTS idx_professionals_tenant_id 
ON professionals(tenant_id);

-- 2. Services Table
ALTER TABLE services 
ADD COLUMN IF NOT EXISTS tenant_id UUID REFERENCES tenants(id);

CREATE INDEX IF NOT EXISTS idx_services_tenant_id 
ON services(tenant_id);

-- 3. Appointments Table
ALTER TABLE appointments 
ADD COLUMN IF NOT EXISTS tenant_id UUID REFERENCES tenants(id);

CREATE INDEX IF NOT EXISTS idx_appointments_tenant_id 
ON appointments(tenant_id);

-- 4. Clients Table
ALTER TABLE clients 
ADD COLUMN IF NOT EXISTS tenant_id UUID REFERENCES tenants(id);

CREATE INDEX IF NOT EXISTS idx_clients_tenant_id 
ON clients(tenant_id);

-- 5. Locations Table
ALTER TABLE locations 
ADD COLUMN IF NOT EXISTS tenant_id UUID REFERENCES tenants(id);

CREATE INDEX IF NOT EXISTS idx_locations_tenant_id 
ON locations(tenant_id);

-- 6. Professional Availability
ALTER TABLE professional_availability 
ADD COLUMN IF NOT EXISTS tenant_id UUID REFERENCES tenants(id);

CREATE INDEX IF NOT EXISTS idx_professional_availability_tenant_id 
ON professional_availability(tenant_id);

-- 7. Settings
ALTER TABLE settings 
ADD COLUMN IF NOT EXISTS tenant_id UUID REFERENCES tenants(id);

CREATE INDEX IF NOT EXISTS idx_settings_tenant_id 
ON settings(tenant_id);

-- Create composite indexes for common queries to improve performance
CREATE INDEX IF NOT EXISTS idx_appointments_tenant_date 
ON appointments(tenant_id, date);

CREATE INDEX IF NOT EXISTS idx_appointments_tenant_professional 
ON appointments(tenant_id, professional_id);

CREATE INDEX IF NOT EXISTS idx_services_tenant_active 
ON services(tenant_id, is_active);

CREATE INDEX IF NOT EXISTS idx_professionals_tenant_active 
ON professionals(tenant_id, is_active);

-- Create a function to set the tenant context
CREATE OR REPLACE FUNCTION set_tenant_context(tenant_id UUID)
RETURNS VOID AS $$
BEGIN
  -- Store the tenant ID in a session variable
  PERFORM set_config('app.current_tenant_id', tenant_id::text, false);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create a function to get the current tenant
CREATE OR REPLACE FUNCTION get_current_tenant_id()
RETURNS UUID AS $$
DECLARE
  tenant_id UUID;
BEGIN
  -- Get tenant from session variable or JWT claim
  tenant_id := current_setting('app.current_tenant_id', true)::UUID;
  
  -- If not found in session, try to get from JWT claims
  IF tenant_id IS NULL THEN
    tenant_id := (current_setting('request.jwt.claims', true)::json->>'tenant_id')::UUID;
  END IF;
  
  RETURN tenant_id;
EXCEPTION
  WHEN OTHERS THEN
    RETURN NULL;
END;
$$ LANGUAGE plpgsql STABLE;

-- Create Row Level Security (RLS) policies for tenant isolation

-- Drop existing policies
DROP POLICY IF EXISTS "Allow all operations on professionals" ON professionals;
DROP POLICY IF EXISTS "Allow all operations on services" ON services;
DROP POLICY IF EXISTS "Allow all operations on appointments" ON appointments;
DROP POLICY IF EXISTS "Allow all operations on clients" ON clients;
DROP POLICY IF EXISTS "Allow all operations on locations" ON locations;
DROP POLICY IF EXISTS "Allow all operations on professional_availability" ON professional_availability;
DROP POLICY IF EXISTS "Allow all operations on settings" ON settings;

-- Create new policies for tenant isolation
CREATE POLICY "Tenant isolation for professionals" 
ON professionals FOR ALL 
USING (tenant_id = get_current_tenant_id());

CREATE POLICY "Tenant isolation for services" 
ON services FOR ALL 
USING (tenant_id = get_current_tenant_id());

CREATE POLICY "Tenant isolation for appointments" 
ON appointments FOR ALL 
USING (tenant_id = get_current_tenant_id());

CREATE POLICY "Tenant isolation for clients" 
ON clients FOR ALL 
USING (tenant_id = get_current_tenant_id());

CREATE POLICY "Tenant isolation for locations" 
ON locations FOR ALL 
USING (tenant_id = get_current_tenant_id());

CREATE POLICY "Tenant isolation for professional_availability" 
ON professional_availability FOR ALL 
USING (tenant_id = get_current_tenant_id());

CREATE POLICY "Tenant isolation for settings" 
ON settings FOR ALL 
USING (tenant_id = get_current_tenant_id());

-- Create policies for tenants and users tables
ALTER TABLE tenants ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_tenants ENABLE ROW LEVEL SECURITY;

-- Allow users to access only their own user record
CREATE POLICY "Users can view their own record" 
ON users FOR SELECT 
USING (id = auth.uid());

CREATE POLICY "Users can update their own record" 
ON users FOR UPDATE 
USING (id = auth.uid());

-- Allow tenant access based on user_tenants relationship
CREATE POLICY "Users can view tenants they belong to" 
ON tenants FOR SELECT 
USING (
  id IN (
    SELECT tenant_id 
    FROM user_tenants 
    WHERE user_id = auth.uid()
  )
);

CREATE POLICY "Users can view their tenant relationships" 
ON user_tenants FOR SELECT 
USING (user_id = auth.uid());

-- Create a trigger to automatically set the tenant_id on new records
CREATE OR REPLACE FUNCTION set_tenant_id()
RETURNS TRIGGER AS $$
DECLARE
  tenant_id UUID;
BEGIN
  -- Try to get tenant_id from context
  tenant_id := get_current_tenant_id();
  
  -- If tenant_id is not set and we're not in the tenants table
  IF tenant_id IS NULL AND TG_TABLE_NAME != 'tenants' THEN
    RAISE EXCEPTION 'No tenant context set';
  END IF;
  
  -- Set the tenant_id if the column exists and not already set
  IF tenant_id IS NOT NULL AND NEW.tenant_id IS NULL THEN
    NEW.tenant_id := tenant_id;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply the trigger to all tenant-aware tables
CREATE TRIGGER set_tenant_id_on_professionals
BEFORE INSERT ON professionals
FOR EACH ROW EXECUTE FUNCTION set_tenant_id();

CREATE TRIGGER set_tenant_id_on_services
BEFORE INSERT ON services
FOR EACH ROW EXECUTE FUNCTION set_tenant_id();

CREATE TRIGGER set_tenant_id_on_appointments
BEFORE INSERT ON appointments
FOR EACH ROW EXECUTE FUNCTION set_tenant_id();

CREATE TRIGGER set_tenant_id_on_clients
BEFORE INSERT ON clients
FOR EACH ROW EXECUTE FUNCTION set_tenant_id();

CREATE TRIGGER set_tenant_id_on_locations
BEFORE INSERT ON locations
FOR EACH ROW EXECUTE FUNCTION set_tenant_id();

CREATE TRIGGER set_tenant_id_on_professional_availability
BEFORE INSERT ON professional_availability
FOR EACH ROW EXECUTE FUNCTION set_tenant_id();

CREATE TRIGGER set_tenant_id_on_settings
BEFORE INSERT ON settings
FOR EACH ROW EXECUTE FUNCTION set_tenant_id();

-- Create a function to provision a new tenant with initial data
CREATE OR REPLACE FUNCTION provision_tenant(
  tenant_name TEXT,
  subdomain TEXT,
  business_type TEXT,
  admin_email TEXT,
  admin_first_name TEXT,
  admin_last_name TEXT,
  admin_phone TEXT
)
RETURNS UUID AS $$
DECLARE
  new_tenant_id UUID;
  admin_user_id UUID;
BEGIN
  -- Start transaction
  BEGIN
    -- Create the tenant
    INSERT INTO tenants (name, subdomain, business_type)
    VALUES (tenant_name, subdomain, business_type)
    RETURNING id INTO new_tenant_id;
    
    -- Check if user exists
    SELECT id INTO admin_user_id 
    FROM users 
    WHERE email = admin_email;
    
    -- Create user if doesn't exist
    IF admin_user_id IS NULL THEN
      INSERT INTO users (email, first_name, last_name, phone)
      VALUES (admin_email, admin_first_name, admin_last_name, admin_phone)
      RETURNING id INTO admin_user_id;
    END IF;
    
    -- Link user to tenant as owner
    INSERT INTO user_tenants (user_id, tenant_id, role)
    VALUES (admin_user_id, new_tenant_id, 'owner');
    
    -- Set tenant context for further operations
    PERFORM set_tenant_context(new_tenant_id);
    
    -- Create default settings for the tenant
    INSERT INTO settings (tenant_id, key, value, description)
    VALUES 
      (new_tenant_id, 'business_hours', '{"monday":{"start":"09:00","end":"17:00"},"tuesday":{"start":"09:00","end":"17:00"},"wednesday":{"start":"09:00","end":"17:00"},"thursday":{"start":"09:00","end":"17:00"},"friday":{"start":"09:00","end":"17:00"},"saturday":{"start":"10:00","end":"15:00"},"sunday":{"start":null,"end":null}}', 'Default business hours'),
      (new_tenant_id, 'notification_email', admin_email, 'Email for receiving notifications'),
      (new_tenant_id, 'appointment_buffer', '15', 'Minutes between appointments');
      
    -- Commit transaction
    RETURN new_tenant_id;
  EXCEPTION
    WHEN OTHERS THEN
      -- Rollback on error
      RAISE;
  END;
END;
$$ LANGUAGE plpgsql;

-- Create helper function to get tenant ID from subdomain
CREATE OR REPLACE FUNCTION get_tenant_id_from_subdomain(subdomain TEXT)
RETURNS UUID AS $$
DECLARE
  tenant_id UUID;
BEGIN
  SELECT id INTO tenant_id FROM tenants WHERE tenants.subdomain = subdomain;
  RETURN tenant_id;
END;
$$ LANGUAGE plpgsql STABLE;

-- Update the metadata function to support tenant schema
CREATE OR REPLACE FUNCTION get_table_columns(table_name text)
RETURNS TABLE (
  column_name text,
  data_type text,
  is_nullable boolean,
  column_default text
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    c.column_name::text,
    c.data_type::text,
    (c.is_nullable = 'YES')::boolean,
    c.column_default::text
  FROM
    information_schema.columns c
  WHERE
    c.table_schema = 'public'
    AND c.table_name = table_name
  ORDER BY
    c.ordinal_position;
END;
$$ LANGUAGE plpgsql STABLE;

-- Sample data for testing
-- Uncomment and modify as needed
/*
-- Create a test tenant
SELECT provision_tenant(
  'Demo Barbershop', 
  'demo-barbershop', 
  'Barber Shop',
  'admin@example.com',
  'Admin',
  'User',
  '123-456-7890'
);
*/

-- All done!
SELECT 'Multi-tenant schema setup complete!' as result; 