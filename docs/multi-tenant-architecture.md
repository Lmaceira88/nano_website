# Multi-Tenant Architecture with Subdomain Support

This document outlines the architecture of our multi-tenant application with subdomain support. The application is built with Next.js and uses Supabase for backend services.

## Architecture Overview

Our application supports multiple tenants, each with their own subdomain. For example, if the main domain is `projectnano.vercel.app`, a tenant with the subdomain `acme` would access the application at `acme.projectnano.vercel.app`.

### Key Components

1. **Next.js App Router**: Used for routing within the application.
2. **Supabase**: Used for database, authentication, and storage.
3. **Vercel**: Used for hosting and subdomain configuration.

## Tenant Identification

Tenants are identified by the subdomain in the URL. The application uses middleware to parse the hostname and extract the tenant information.

```typescript
// src/middleware.ts
import { NextRequest, NextResponse } from 'next/server';

export function middleware(request: NextRequest) {
  const hostname = request.headers.get('host') || '';
  const subdomain = hostname.split('.')[0];
  
  // Add the tenant ID to the request headers
  const headers = new Headers(request.headers);
  headers.set('x-tenant-id', subdomain);
  
  return NextResponse.next({
    request: {
      headers,
    },
  });
}
```

## Database Schema

Each tenant has their own data isolated in the database. This is achieved using Row-Level Security (RLS) policies in Supabase.

```sql
-- Example RLS policy
CREATE POLICY "Tenants can only access their own data"
  ON public.appointments
  FOR ALL
  TO authenticated
  USING (tenant_id = auth.jwt() -> 'app_metadata' ->> 'tenant_id');
```

## Auth Flow

1. Users sign up or log in through the tenant-specific subdomain.
2. The tenant ID is stored in the user's JWT token as part of their `app_metadata`.
3. All database queries are scoped to the tenant ID through RLS policies.

## Environment Configuration

### Local Development

For local development, we use the `.env.local` file with the following format:

```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### Production

In production, we use Vercel's environment variables and GitHub Actions secrets:

```yaml
env:
  NEXT_PUBLIC_SUPABASE_URL: ${{ secrets.NEXT_PUBLIC_SUPABASE_URL }}
  NEXT_PUBLIC_SUPABASE_ANON_KEY: ${{ secrets.NEXT_PUBLIC_SUPABASE_ANON_KEY }}
```

## Deployment

The application is deployed to Vercel using GitHub Actions. The workflow is defined in `.github/workflows/deploy.yml`.

Wildcard subdomains are configured in the Vercel project settings and in the GitHub Actions workflow using the `alias-domains` option:

```yaml
alias-domains: |
  projectnano.vercel.app
  *.projectnano.vercel.app
```

## Access Control

Access control is implemented at multiple levels:

1. **Middleware**: Checks the subdomain and tenant ID.
2. **Auth Hooks**: Validate the user's permissions.
3. **Database RLS**: Enforces data access restrictions.

## Caching Strategy

- Static content is cached using Vercel's Edge Network.
- Dynamic content is cached using SWR (stale-while-revalidate) pattern.
- Tenant-specific data is cached with the tenant ID as part of the cache key.

## Performance Considerations

- Server components are used for tenant-specific data fetching to avoid exposing sensitive information to the client.
- Client components are used for interactive elements and are wrapped in Suspense boundaries to improve loading performance.
- API routes are optimized for multi-tenant usage by including tenant ID in the request headers.

## Data Flow

1. **Request Arrives**: A request comes in to `salon-a.projectnano.vercel.app`
2. **Middleware Processing**: 
   - Extracts subdomain `salon-a`
   - Looks up tenant ID in the database
   - Adds tenant ID to request headers
3. **API Handlers**:
   - Extract tenant ID from headers
   - Use it to filter database queries
4. **Database Queries**:
   - RLS policies ensure data is filtered by tenant_id
   - Only the tenant's data is returned

## Subdomain Implementation

### Registration Process

1. During onboarding, users:
   - Enter their business name
   - Get a suggested subdomain based on their business name
   - Can customize their subdomain
   - Submit the form to create their tenant

2. The system:
   - Validates the subdomain format
   - Checks for subdomain uniqueness
   - Creates the tenant record with the subdomain
   - Generates a UUID for the tenant ID

### Accessing the Application

1. **Production Environment**:
   - Users access their dashboard via `their-subdomain.projectnano.vercel.app`
   - The middleware resolves the tenant from the subdomain
   - The tenant context loads the tenant information

2. **Development Environment**:
   - Users access via `localhost:3000/app?tenant=uuid`
   - For subdomain testing: `subdomain.localhost:3000/app`

## Security Considerations

1. **Data Isolation**:
   - Row-Level Security ensures tenants can only access their own data
   - Middleware validates tenant access on every request

2. **Authentication**:
   - Users are associated with specific tenants
   - Authentication checks include tenant validation

3. **Subdomain Protection**:
   - Subdomains are validated to prevent injection attacks
   - Reserved subdomains are protected

## Deployment Architecture

The application is deployed on Vercel with:

- Wildcard DNS configuration for `*.projectnano.vercel.app`
- Automatic SSL certificate provisioning
- GitHub Actions workflow for continuous deployment

## Database Migration

The migration files include:

1. **Base Tables Creation**: Creates the initial schema
2. **Tenant Columns Addition**: Adds tenant_id to all tables
3. **Row-Level Security**: Implements RLS policies
4. **Subdomain Support**: Adds and configures the subdomain column

## Testing Multi-tenancy

To test the multi-tenant functionality:

1. Create multiple tenants with different subdomains
2. Access each tenant's dashboard via their subdomain
3. Verify data isolation between tenants
4. Test cross-tenant operations to ensure proper isolation

## Future Enhancements

Planned improvements to the multi-tenant architecture:

1. **Custom Domains**: Allow tenants to use their own domains
2. **Tenant-specific Themes**: Enable customized branding per tenant
3. **Tenant Analytics**: Provide usage metrics for each tenant
4. **Tenant Administration**: Create an admin panel for managing tenants 