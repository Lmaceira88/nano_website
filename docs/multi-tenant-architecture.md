# Multi-tenant Architecture

This document outlines the multi-tenant architecture implemented in Project Nano, focusing on the subdomain-based approach.

## Overview

Project Nano uses a multi-tenant architecture where each business (tenant) has its own isolated data while sharing the same application infrastructure. This approach provides:

- **Data Isolation**: Each tenant's data is securely separated
- **Shared Infrastructure**: All tenants use the same application code and infrastructure
- **Customization**: Each tenant can have customized settings and configurations
- **Subdomain Access**: Each tenant has a unique subdomain for accessing their dashboard

## Implementation Components

### 1. Tenant Identification

Tenants are identified through:

- **Subdomain-based Access (Production)**: `salon-a.projectnano.vercel.app`
- **Query Parameter-based Access (Development)**: `localhost:3000/app?tenant=uuid`

### 2. Middleware Layer

The Next.js middleware (`src/middleware.ts`) handles:

- Extracting the tenant identifier (subdomain or query parameter)
- Looking up the tenant in the database
- Adding the tenant ID to request headers
- Redirecting unauthenticated users to login

### 3. Tenant Context

The React context (`src/contexts/TenantContext.tsx`) provides:

- Tenant information to all components
- User information associated with the tenant
- Methods for setting and retrieving tenant data

### 4. Database Structure

The database uses:

- **Tenant Table**: Stores tenant information including subdomain
- **Row-Level Security (RLS)**: Enforces data isolation at the database level
- **Tenant ID Column**: All tables have a tenant_id column for data segregation

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