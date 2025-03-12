# Subdomain Configuration Guide

This document outlines how Project Nano implements and manages subdomain-based multi-tenancy.

## Overview

Project Nano uses subdomains to provide each tenant with a unique URL, enhancing the professional appearance and user experience. For example, if your business is "Salon A", your dashboard would be accessible at `salon-a.projectnano.vercel.app`.

## How It Works

### Tenant Identification

1. **Middleware Detection**: Our Next.js middleware automatically detects the subdomain from the incoming request's hostname.
2. **Tenant Lookup**: The subdomain is used to look up the corresponding tenant ID in the database.
3. **Context Propagation**: The tenant ID is added to request headers and made available throughout the application.

### Implementation Components

- **Middleware (`src/middleware.ts`)**: Handles subdomain detection and tenant resolution
- **TenantContext (`src/contexts/TenantContext.tsx`)**: Provides tenant information to all components
- **Database Schema**: Includes a `subdomain` column in the `tenants` table with unique constraints

## Development vs. Production

### Development Environment

In development, we support two methods:

1. **Query Parameter**: Access tenants via `localhost:3000/app?tenant=uuid`
2. **Local Subdomain Testing**: Configure your hosts file to test with `subdomain.localhost:3000`

### Production Environment

In production, we use true subdomain-based routing:

1. **Wildcard DNS**: Configure `*.projectnano.vercel.app` to point to your application
2. **Vercel Configuration**: Set up Vercel to handle wildcard subdomains
3. **Tenant Resolution**: The middleware resolves the tenant based on the subdomain

## Setting Up Local Subdomain Testing

1. **Edit Hosts File**:
   - Windows: Edit `C:\Windows\System32\drivers\etc\hosts`
   - Mac/Linux: Edit `/etc/hosts`
   - Add entries like:
     ```
     127.0.0.1 salon-a.localhost
     127.0.0.1 salon-b.localhost
     ```

2. **Browser Compatibility**:
   - Firefox works well with localhost subdomains
   - Chrome may require additional flags for cookie support

3. **Testing**:
   - Access your test tenant at `http://salon-a.localhost:3000/app`
   - The middleware will automatically detect and resolve the tenant

## Database Schema

The `tenants` table includes:

```sql
CREATE TABLE public.tenants (
  id UUID PRIMARY KEY,
  business_name TEXT NOT NULL,
  business_type TEXT NOT NULL,
  subdomain TEXT NOT NULL UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Index for faster lookups
CREATE INDEX idx_tenants_subdomain ON public.tenants (subdomain);
```

## Subdomain Generation

During onboarding, we:

1. Generate a suggested subdomain from the business name
2. Allow users to customize their subdomain
3. Validate and ensure uniqueness
4. Store the subdomain with the tenant record

## Deployment Considerations

When deploying to production:

1. **DNS Configuration**:
   - Set up a wildcard DNS record (`*.projectnano.vercel.app`)
   - Point it to your hosting provider

2. **Vercel Configuration**:
   - In your Vercel project settings, enable wildcard domains
   - Add your primary domain and enable wildcard subdomains

3. **SSL Certificates**:
   - Ensure your SSL certificate supports wildcard subdomains
   - Vercel handles this automatically with their certificates

## Troubleshooting

Common issues and solutions:

1. **Subdomain Not Resolving**:
   - Check DNS configuration
   - Verify hosts file entries (for local development)
   - Ensure middleware is correctly configured

2. **Cookie Issues**:
   - Set appropriate cookie domains
   - For local testing, use Firefox which handles localhost subdomains better

3. **Tenant Not Found**:
   - Check that the subdomain exists in the database
   - Verify the middleware is correctly querying the database

## Best Practices

1. **Subdomain Validation**:
   - Restrict characters to lowercase letters, numbers, and hyphens
   - Avoid reserved words or potentially offensive terms
   - Keep subdomains reasonably short

2. **User Experience**:
   - Provide clear instructions during onboarding
   - Show a preview of the subdomain URL
   - Allow users to change their subdomain (with caution)

3. **Security**:
   - Implement proper tenant isolation
   - Use Row-Level Security in the database
   - Validate tenant access on every request 