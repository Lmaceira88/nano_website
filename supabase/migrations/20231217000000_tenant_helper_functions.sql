-- Helper functions for tenant management

-- Function to associate an auth user with a tenant
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

-- Function to check if a tenant exists and is set up correctly
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