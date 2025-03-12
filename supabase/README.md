# ProjectNano Multi-Tenant Database Setup

This directory contains the necessary SQL scripts and documentation to set up and test the multi-tenant database for ProjectNano.

## Overview

ProjectNano uses a multi-tenant architecture with Row-Level Security (RLS) policies in Supabase to ensure data isolation between tenants. Each tenant's data is kept separate through tenant-specific database rows and RLS policies.

## Database Schema

The key tables in our schema include:

- **tenants**: Stores information about each tenant
- **clients**: Stores client information for each tenant
- **appointments**: Stores appointment information for each tenant
- **services**: Stores service offerings for each tenant

## Migration Files

The migration files should be run in order:

1. `20231213000000_create_base_tables.sql` - Creates the base tables
2. `20231214000000_add_tenant_columns.sql` - Adds tenant_id columns to existing tables
3. `20231215000000_tenant_rls.sql` - Sets up Row-Level Security policies

## Tenant Isolation

Each tenant's data is isolated through:

1. A `tenant_id` column (UUID type) on each table
2. RLS policies that filter data based on the tenant ID
3. Request headers that specify the current tenant context

## Testing Multi-Tenancy

To test that the multi-tenant setup is working correctly:

1. Run the SQL queries in `test_queries.sql` to:
   - Create test tenants
   - Insert test data for different tenants
   - Verify data isolation between tenants

2. Test in the application:
   - Create multiple tenants through the onboarding process
   - Ensure each tenant only sees their own data
   - Verify tenant ID is correctly passed in request headers

## Connecting from the Application

When connecting to Supabase from the application:

```typescript
// Initialize Supabase client with tenant context
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  {
    global: {
      headers: {
        'x-tenant-id': tenantId, // UUID format required
      },
    },
  }
);

// Now all queries will be tenant-specific
const { data, error } = await supabase.from('clients').select('*');
```

## Table Schemas

### clients
```
id: UUID (primary key)
name: TEXT
email: TEXT
phone: TEXT
created_at: TIMESTAMP
tenant_id: UUID (references tenants.id)
```

See `database-schema.md` for full documentation of the database schema.

## Troubleshooting

If you encounter issues with the multi-tenant setup:

1. Verify RLS is enabled on all tables: 
   ```sql
   SELECT tablename, rowsecurity FROM pg_tables WHERE schemaname = 'public';
   ```

2. Check RLS policies are correctly configured:
   ```sql
   SELECT tablename, policyname FROM pg_policies WHERE schemaname = 'public';
   ```

3. Ensure tenant IDs are valid UUIDs and are correctly passed in the `x-tenant-id` header

4. If using direct SQL, make sure to set the tenant context:
   ```sql
   SET LOCAL "request.headers" = '{"x-tenant-id": "your-tenant-uuid"}';
   ``` 