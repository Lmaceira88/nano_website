# ProjectNano.co.uk Integration Documentation

## Overview

This document outlines the integration between the Project Nano marketing website and the projectnano.co.uk multi-tenant SaaS application. The integration occurs during the onboarding flow, when user data is sent to the central API for account creation and tenant provisioning.

## Multi-Tenant Architecture

ProjectNano.co.uk follows a multi-tenant architecture where:

1. The central marketing website (projectnano.co.uk) handles:
   - Marketing pages and content
   - User onboarding
   - Tenant provisioning
   - Billing management
   - Central authentication

2. Each tenant gets their own isolated instance:
   - In production: `{tenant-subdomain}.projectnano.co.uk`
   - In development: `localhost:3000/app?tenant={tenant-id}`

This architecture provides better isolation, security, and scalability compared to a shared architecture.

## Database Schema

Based on the ProjectNano.co.uk database documentation, the system uses the following main tables:

### Tenants Table

This table stores information about each tenant (barbershop business):

| Column Name | Data Type | Description |
|-------------|-----------|-------------|
| id | UUID | Primary key |
| subdomain | TEXT | Unique subdomain |
| business_name | TEXT | Business name |
| business_type | TEXT | Type of business |
| created_at | TIMESTAMP | Creation timestamp |
| status | TEXT | Tenant status |
| admin_id | UUID | Reference to admin user |

### Users Table

This table stores information about users across all tenants:

| Column Name | Data Type | Description |
|-------------|-----------|-------------|
| id | UUID | Primary key |
| email | TEXT | Email address (unique) |
| first_name | TEXT | First name |
| last_name | TEXT | Last name |
| phone | TEXT | Phone number |
| created_at | TIMESTAMP | Creation timestamp |

### User_Tenants Table

This join table manages user membership in tenants:

| Column Name | Data Type | Description |
|-------------|-----------|-------------|
| user_id | UUID | Reference to users table |
| tenant_id | UUID | Reference to tenants table |
| role | TEXT | User role in this tenant |
| created_at | TIMESTAMP | Creation timestamp |

### Professionals Table (Tenant-Specific)

This table stores information about the service providers (barbers) for a specific tenant:

| Column Name | Data Type | Description |
|-------------|-----------|-------------|
| id | UUID | Primary key |
| tenant_id | UUID | Reference to tenants table |
| name | TEXT | Full name |
| first_name | TEXT | First name |
| last_name | TEXT | Last name |
| email | TEXT | Email address |
| phone | TEXT | Phone number |
| created_at | TIMESTAMP | Creation timestamp |

### Services Table (Tenant-Specific)

This table stores information about the services offered by a specific tenant:

| Column Name | Data Type | Description |
|-------------|-----------|-------------|
| id | UUID | Primary key |
| tenant_id | UUID | Reference to tenants table |
| name | TEXT | Service name |
| description | TEXT | Service description |
| duration | INTEGER | Duration in minutes |
| price | DECIMAL | Service price |
| created_at | TIMESTAMP | Creation timestamp |

### Appointments Table (Tenant-Specific)

This table stores appointment information for a specific tenant:

| Column Name | Data Type | Description |
|-------------|-----------|-------------|
| id | UUID | Primary key |
| tenant_id | UUID | Reference to tenants table |
| date | DATE | Appointment date |
| start_time | TIME | Start time |
| end_time | TIME | End time |
| client_first_name | TEXT | Client's first name |
| client_last_name | TEXT | Client's last name |
| client_email | TEXT | Client's email |
| client_phone | TEXT | Client's phone |
| status | TEXT | Appointment status |
| service_id | UUID | Reference to services |
| professional_id | UUID | Reference to professionals |
| service_name | TEXT | Service name |
| location_id | TEXT | Location identifier |
| created_at | TIMESTAMP | Creation timestamp |

## Onboarding Flow Integration

### Data Collection

The onboarding flow collects the following information:

1. **Admin Account Details (Step 1)**
   - First Name
   - Last Name
   - Email
   - Phone Number

2. **Business Information (Step 2)**
   - Business Name
   - Business Type

3. **Billing Information (Step 3)**
   - Payment details for post-trial billing

4. **Service Selection (Step 4)**
   - Initial service offering

### Tenant Provisioning Process

When a user completes the onboarding flow:

1. A new user record is created in the Users table
2. A new tenant record is created in the Tenants table
3. The user is assigned as an admin in the User_Tenants table
4. The initial service is created in the tenant's Services table
5. The user (as a professional) is added to the tenant's Professionals table
6. A subdomain is generated based on the business name
7. Tenant-specific resources are provisioned

### API Endpoint

The onboarding flow sends the collected data to the central API using the following endpoint:

```
POST https://projectnano.co.uk/api/onboarding
```

With the following payload structure:

```json
{
  "admin": {
    "firstName": "John",
    "lastName": "Doe",
    "email": "john@example.com",
    "phone": "+44 7700 900000"
  },
  "business": {
    "name": "Classic Cuts Barbershop",
    "type": "Barber Shop"
  },
  "billing": {
    "cardNumber": "4242424242424242",
    "expirationDate": "12/25",
    "cvc": "123",
    "billingZip": "SW1A 1AA"
  },
  "service": {
    "id": "silent-helmut",
    "name": "Silent Helmut",
    "description": "Haircut and Beard Trim with Scissors.",
    "duration": "30 mins",
    "price": "£29"
  }
}
```

### Authentication & Response

After successful account and tenant creation, the API returns a JWT token for authentication:

```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "uuid-goes-here",
    "email": "john@example.com",
    "firstName": "John",
    "lastName": "Doe"
  },
  "tenant": {
    "id": "tenant-uuid-here",
    "name": "Classic Cuts Barbershop",
    "subdomain": "classic-cuts-barbershop-123",
    "url": "https://classic-cuts-barbershop-123.projectnano.co.uk"
  }
}
```

The token payload includes both user and tenant information:

```json
{
  "sub": "user-uuid",
  "email": "john@example.com",
  "name": "John Doe",
  "tenantId": "tenant-uuid-here",
  "iat": 1625097600,
  "exp": 1625101200
}
```

This token is used for all subsequent API calls to the tenant's application.

## Tenant Application Integration

After completing the onboarding flow, users are redirected to their tenant's application:

```
https://{tenant-subdomain}.projectnano.co.uk?token={JWT_TOKEN}
```

The tenant application will:
1. Extract the token from the URL
2. Validate the token
3. Check that the token's tenantId matches the requested tenant
4. Load tenant-specific configuration and data
5. Display the appropriate user interface based on the user's role and permissions

## Error Handling

The integration includes error handling for the following scenarios:

1. **Network Errors**: If the connection to the API fails, users are shown an error message and given the option to retry.

2. **Validation Errors**: If the API returns validation errors (e.g., email already in use), these are displayed to the user with guidance on how to fix them.

3. **Server Errors**: If the API returns a server error, users are shown a generic error message and encouraged to contact support.

4. **Tenant Access Errors**: If a user tries to access a tenant they don't have permission for, they are redirected to an error page.

## Development vs. Production

- **Development Environment**:
  - API: `http://localhost:3000/api/onboarding`
  - Tenant URL: `http://localhost:3000/app?tenant={tenant-id}`
  
- **Production Environment**:
  - API: `https://projectnano.co.uk/api/onboarding`
  - Tenant URL: `https://{tenant-subdomain}.projectnano.co.uk`

## Monitoring & Logging

All API calls include the following headers for tracking and debugging:

```
X-Source: project-nano-website
X-Version: 1.0.0
X-Tenant-ID: {tenant-id} (for tenant-specific API calls)
```

Failed API calls are logged with the following information:
- Timestamp
- Endpoint
- Request payload (sensitive data redacted)
- Error message
- HTTP status code
- Tenant ID (if applicable)

## Future Enhancements

1. **SSO Integration**: Allow users to sign in once and access all their tenants
2. **Tenant Management Dashboard**: Create an admin interface for users to manage multiple tenants
3. **Cross-Tenant Analytics**: Provide aggregate data across all tenants for super-admins
4. **Tenant Templates**: Allow tenants to be created from predefined templates
5. **Custom Domains**: Support custom domains for each tenant (e.g., booking.mybarbershop.com) 