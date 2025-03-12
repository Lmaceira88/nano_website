-- Add tenant_id column to all relevant tables
-- This ensures proper multi-tenant data isolation

-- Create the tenants table if it doesn't exist
CREATE TABLE IF NOT EXISTS public.tenants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  type TEXT NOT NULL,
  subdomain TEXT UNIQUE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  status TEXT DEFAULT 'active' NOT NULL,
  admin_id UUID REFERENCES auth.users(id)
);

-- Check if each table exists before altering it
DO $$ 
BEGIN
    -- Check if clients table exists
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'clients') THEN
        -- Add tenant_id if it doesn't exist
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                       WHERE table_schema = 'public' AND table_name = 'clients' AND column_name = 'tenant_id') 
        THEN
            ALTER TABLE clients ADD COLUMN tenant_id UUID REFERENCES tenants(id);
            CREATE INDEX clients_tenant_id_idx ON clients(tenant_id);
        END IF;
    END IF;

    -- Check if appointments table exists
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'appointments') THEN
        -- Add tenant_id if it doesn't exist
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                       WHERE table_schema = 'public' AND table_name = 'appointments' AND column_name = 'tenant_id') 
        THEN
            ALTER TABLE appointments ADD COLUMN tenant_id UUID REFERENCES tenants(id);
            CREATE INDEX appointments_tenant_id_idx ON appointments(tenant_id);
        END IF;
    END IF;

    -- Check if services table exists
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'services') THEN
        -- Add tenant_id if it doesn't exist
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                       WHERE table_schema = 'public' AND table_name = 'services' AND column_name = 'tenant_id') 
        THEN
            ALTER TABLE services ADD COLUMN tenant_id UUID REFERENCES tenants(id);
            CREATE INDEX services_tenant_id_idx ON services(tenant_id);
        END IF;
    END IF;

    -- Check if staff table exists
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'staff') THEN
        -- Add tenant_id if it doesn't exist
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                       WHERE table_schema = 'public' AND table_name = 'staff' AND column_name = 'tenant_id') 
        THEN
            ALTER TABLE staff ADD COLUMN tenant_id UUID REFERENCES tenants(id);
            CREATE INDEX staff_tenant_id_idx ON staff(tenant_id);
        END IF;
    END IF;
END $$;

-- Create tenant_user_access table to manage which users can access which tenants
CREATE TABLE IF NOT EXISTS public.tenant_user_access (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID REFERENCES tenants(id) NOT NULL,
  user_id UUID REFERENCES auth.users(id) NOT NULL,
  role TEXT DEFAULT 'member' NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  UNIQUE(tenant_id, user_id)
);

-- Add index for faster lookups
CREATE INDEX IF NOT EXISTS tenant_user_access_user_id_idx ON tenant_user_access(user_id);
CREATE INDEX IF NOT EXISTS tenant_user_access_tenant_id_idx ON tenant_user_access(tenant_id); 