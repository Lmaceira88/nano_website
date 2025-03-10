# Project Nano Website

A Next.js website for Project Nano, a multi-tenant SaaS barbershop management platform.

## Overview

This website serves as both the marketing site and onboarding platform for Project Nano. It collects necessary information to create accounts, provision tenants, and redirect users to their dedicated tenant instances.

## Multi-Tenant Architecture

Project Nano follows a multi-tenant SaaS architecture:

1. **Marketing Website & Central API** (This Repository):
   - Landing pages and marketing content
   - 4-step onboarding process
   - Account creation and billing setup
   - Tenant provisioning
   - Central user management

2. **Tenant Applications** (Served from ProjectNano.co.uk):
   - Isolated tenant instances
   - Tenant-specific data
   - Each tenant gets a unique subdomain
   - In production: `{tenant-subdomain}.projectnano.co.uk`
   - In development: `/app?tenant={tenant-id}`

## Features

- Responsive, modern UI built with Next.js and Tailwind CSS
- Multi-step onboarding process with form validation
- Tenant provisioning system
- Multi-tenant architecture with subdomain isolation
- JWT-based authentication with tenant context

## Installation

```bash
# Clone the repository
git clone <repository-url>

# Navigate to the project directory
cd project-nano-website

# Install dependencies
npm install

# Run the development server
npm run dev
```

## Onboarding Flow

The onboarding process consists of four steps:

1. **Personal Details**: Collects admin account information (first name, last name, email, phone)
2. **Business Information**: Collects business details (name, type)
3. **Billing Setup**: Collects payment information for post-trial billing
4. **Service Selection**: Allows selecting an initial service offering

After completing these steps, the system:
1. Creates a user account
2. Provisions a new tenant with a unique subdomain
3. Sets up initial data for the tenant
4. Redirects the user to their tenant application

## API Integration

The website includes a central API for account creation and tenant provisioning. In development mode, it uses simulated endpoints at `/api/onboarding`.

### API Request Structure

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

### API Response Structure

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

## Tenant Application

After successful onboarding, users are redirected to their tenant application:
- `https://{tenant-subdomain}.projectnano.co.uk?token={JWT_TOKEN}` in production
- `/app?tenant={tenant-id}&token={JWT_TOKEN}` in development

The tenant application validates the token, verifies tenant access, and displays the appropriate user interface.

## Environment Setup

Create a `.env.local` file in the root directory with the following variables:

```
# Set to 'development' or 'production'
NODE_ENV=development

# URLs
NEXT_PUBLIC_WEBSITE_URL=http://localhost:3000
NEXT_PUBLIC_API_URL=http://localhost:3000/api
```

## Documentation

For more detailed information about the multi-tenant architecture and integration, see:
- [ProjectNano Integration Documentation](docs/projectnano-integration.md)

## Deployment

In production, this application would be deployed to a central domain (projectnano.co.uk), while tenant applications would be deployed to subdomains using a wildcard DNS setup:

- Marketing site: `projectnano.co.uk`
- API: `api.projectnano.co.uk`
- Tenant applications: `*.projectnano.co.uk`

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details. 