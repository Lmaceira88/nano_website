# ProjectNano Database Schema

This document describes the actual database schema in our Supabase instance.

## Multi-Tenant Architecture

Our database uses a multi-tenant architecture with Row-Level Security (RLS) policies to ensure data isolation between tenants.

- Each table has a `tenant_id` column for data isolation
- RLS policies ensure users can only access their tenant's data
- Tenant ID is passed via the `x-tenant-id` request header

## Tables

### clients

| Column | Type | Description |
|--------|------|-------------|
| id | uuid | Primary key |
| name | text | Client's full name |
| email | text | Client's email address |
| phone | text | Client's phone number |
| created_at | timestamp | Creation timestamp |
| tenant_id | uuid | Foreign key to tenants table |

### appointments

Schema details need to be verified.

### services

Schema details need to be verified.

### tenants

Schema details need to be verified.

## Row-Level Security Policies

All tables have RLS policies that filter data based on the `tenant_id` column. The policies ensure that:

1. SELECT queries only return rows where `tenant_id` matches the request header
2. INSERT operations automatically set the `tenant_id` from the request header
3. UPDATE/DELETE operations only affect rows with matching `tenant_id`

## Making Schema Changes

When making schema changes, please:

1. Update this documentation
2. Create new migration files
3. Ensure naming conventions are consistent (we use snake_case)
4. Test changes with multiple tenants

## Connecting From Application

When connecting from your Next.js application, always set the `x-tenant-id` header:

```typescript
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  {
    global: {
      headers: {
        'x-tenant-id': tenantId,
      },
    },
  }
);
``` 