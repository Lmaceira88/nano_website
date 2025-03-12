# Subdomain Configuration

This document outlines how subdomains are configured and managed in our multi-tenant application.

## Overview

Our application uses subdomains to identify and route requests to specific tenants. For example, if the main domain is `projectnano.vercel.app`, a tenant with the subdomain `acme` would access the application at `acme.projectnano.vercel.app`.

## Vercel Configuration

### Wildcard Domains

To support subdomains, we configure wildcard domains in Vercel. This is done through:

1. The Vercel project settings in the dashboard
2. The GitHub Actions workflow file:

```yaml
alias-domains: |
  projectnano.vercel.app
  *.projectnano.vercel.app
```

### vercel.json Configuration

The `vercel.json` file contains configuration for how the application is deployed to Vercel:

```json
{
  "version": 2,
  "framework": "nextjs",
  "regions": ["iad1"],
  "cleanUrls": true,
  "trailingSlash": false,
  "github": {
    "silent": true,
    "autoJobCancelation": true
  },
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        {
          "key": "X-Content-Type-Options",
          "value": "nosniff"
        },
        {
          "key": "X-Frame-Options",
          "value": "DENY"
        },
        {
          "key": "X-XSS-Protection",
          "value": "1; mode=block"
        }
      ]
    }
  ]
}
```

## Next.js Middleware

The middleware is responsible for extracting the tenant information from the subdomain and making it available to the application:

```typescript
// src/middleware.ts
import { NextRequest, NextResponse } from 'next/server';

export function middleware(request: NextRequest) {
  const hostname = request.headers.get('host') || '';
  const subdomain = hostname.split('.')[0];
  
  // Skip middleware for non-tenant routes
  if (
    request.nextUrl.pathname.startsWith('/_next') ||
    request.nextUrl.pathname.startsWith('/api/auth') ||
    request.nextUrl.pathname === '/favicon.ico'
  ) {
    return NextResponse.next();
  }
  
  // Add the tenant ID to the request headers
  const headers = new Headers(request.headers);
  headers.set('x-tenant-id', subdomain);
  
  return NextResponse.next({
    request: {
      headers,
    },
  });
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
};
```

## Tenant Context

The tenant context is used to store and provide access to the tenant information throughout the application:

```typescript
// src/contexts/tenantContext.tsx
import { createContext, useContext, useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';

const TenantContext = createContext(null);

export function TenantProvider({ children }) {
  const [tenant, setTenant] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    async function loadTenant() {
      const hostname = window.location.hostname;
      const subdomain = hostname.split('.')[0];
      
      // Skip tenant loading for localhost
      if (hostname === 'localhost') {
        setTenant({ id: 'local', name: 'Local Development' });
        setIsLoading(false);
        return;
      }
      
      // Load tenant data from Supabase
      const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
      );
      
      const { data, error } = await supabase
        .from('tenants')
        .select('*')
        .eq('subdomain', subdomain)
        .single();
      
      if (error) {
        console.error('Error loading tenant', error);
      } else {
        setTenant(data);
      }
      
      setIsLoading(false);
    }
    
    loadTenant();
  }, []);
  
  return (
    <TenantContext.Provider value={{ tenant, isLoading }}>
      {children}
    </TenantContext.Provider>
  );
}

export function useTenant() {
  const context = useContext(TenantContext);
  if (context === null) {
    throw new Error('useTenant must be used within a TenantProvider');
  }
  return context;
}
```

## Local Development

For local development, you can simulate subdomains using:

1. **Host file modifications** to map subdomains to localhost
2. **Query parameters** as a fallback:

```
http://localhost:3000/app?tenant=tenant-id
```

## Subdomain to Tenant Mapping

The mapping of subdomains to tenants is stored in the `tenants` table in the database:

```sql
CREATE TABLE tenants (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  subdomain TEXT NOT NULL UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add index for faster lookups
CREATE INDEX idx_tenants_subdomain ON tenants(subdomain);
```

## Custom Domains (Future Implementation)

In the future, we plan to support custom domains for tenants. This will involve:

1. Adding a `custom_domain` column to the `tenants` table
2. Configuring Vercel to handle custom domains
3. Modifying the middleware to check both subdomains and custom domains

## Testing Subdomains

To test subdomains locally:

1. Modify your hosts file (`/etc/hosts` on macOS/Linux, `C:\Windows\System32\drivers\etc\hosts` on Windows):

```
127.0.0.1 tenant1.localhost
127.0.0.1 tenant2.localhost
```

2. Run the development server:

```
npm run dev
```

3. Access the application at `http://tenant1.localhost:3000` 