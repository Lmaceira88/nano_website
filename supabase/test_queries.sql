-- Test queries for the multi-tenant Supabase setup

-- 1. First check the tables and columns that exist in the database
SELECT tablename 
FROM pg_tables 
WHERE schemaname = 'public';

-- Check the structure of the clients table
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_schema = 'public' AND table_name = 'clients'
ORDER BY ordinal_position;

/*-- 2. Create test tenants
INSERT INTO tenants (id, name, type, subdomain, status) 
VALUES 
  ('11111111-1111-4111-8111-111111111111', 'Test Salon A', 'salon', 'salon-a', 'active'),
  ('22222222-2222-4222-8222-222222222222', 'Test Clinic B', 'clinic', 'clinic-b', 'active');
*/
-- 3. Test inserting client data with tenant context for Tenant A
SET LOCAL "request.headers" = '{"x-tenant-id": "11111111-1111-4111-8111-111111111111"}';

-- Insert using the actual column structure
INSERT INTO clients (name, email, phone)
VALUES ('John Smith', 'john@tenanta.com', '555-1111');

-- 4. Test inserting client data with tenant context for Tenant B
SET LOCAL "request.headers" = '{"x-tenant-id": "22222222-2222-4222-8222-222222222222"}';

-- Insert using the actual column structure
INSERT INTO clients (name, email, phone)
VALUES ('Jane Doe', 'jane@tenantb.com', '555-2222');

-- 5. Test RLS isolation for no tenant context
-- Should return no rows due to RLS
SELECT * FROM clients;

-- 6. Test RLS isolation for Tenant A
SET LOCAL "request.headers" = '{"x-tenant-id": "11111111-1111-4111-8111-111111111111"}';
-- Should only show John Smith
SELECT * FROM clients;

-- 7. Test RLS isolation for Tenant B
SET LOCAL "request.headers" = '{"x-tenant-id": "22222222-2222-4222-8222-222222222222"}';
-- Should only show Jane Doe
SELECT * FROM clients;

-- 8. Verify tenant_id was set correctly by the trigger
-- Direct query bypassing RLS (Admin only)
SELECT id, name, email, phone, tenant_id FROM clients;

-- 9. Test update isolation
SET LOCAL "request.headers" = '{"x-tenant-id": "11111111-1111-4111-8111-111111111111"}';
-- Try to update Tenant B's data - should fail or update 0 rows
UPDATE clients SET phone = '999-9999' WHERE email = 'jane@tenantb.com';

-- 10. Test delete isolation
SET LOCAL "request.headers" = '{"x-tenant-id": "11111111-1111-4111-8111-111111111111"}';
-- Try to delete Tenant B's data - should fail or delete 0 rows
DELETE FROM clients WHERE email = 'jane@tenantb.com';

-- 11. Verify RLS policies are set up correctly
SELECT tablename, policyname, cmd, qual
FROM pg_policies
WHERE schemaname = 'public';

-- 12. Clean up test data if needed
-- DELETE FROM clients WHERE tenant_id IN ('11111111-1111-4111-8111-111111111111', '22222222-2222-4222-8222-222222222222');
-- DELETE FROM tenants WHERE id IN ('11111111-1111-4111-8111-111111111111', '22222222-2222-4222-8222-222222222222'); 