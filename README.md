# Project Nano - Multi-tenant SaaS Platform

[![Vercel Deployment](https://img.shields.io/badge/vercel-deployed-brightgreen.svg)](https://projectnano.co.uk)

Project Nano is a comprehensive SaaS platform designed for service-based businesses. It provides a multi-tenant architecture that supports various business types with a unified dashboard experience.

## Key Features

- **Multi-tenant Architecture**: Each client gets a dedicated tenant with isolated data
- **Subdomain-based Access**: Each tenant has their own unique subdomain (e.g., salon-a.projectnano.vercel.app)
- **Unified Onboarding Experience**: Seamless flow from account creation to business setup
- **Customizable Service Packages**: Support for various service-based business types
- **Responsive Dashboard**: Mobile-friendly interface for managing your business on the go
- **Client Management**: Track and manage client information, history, and preferences
- **Appointment Scheduling**: Powerful scheduling system with availability management

## Multi-tenant Implementation

Project Nano implements a robust multi-tenant architecture with two access methods:

1. **Subdomain-based Access (Production)**: Each tenant gets a unique subdomain (e.g., `salon-a.projectnano.vercel.app`), providing a professional and branded experience.

2. **Query Parameter-based Access (Development)**: For local development, tenants are accessed via query parameters (e.g., `localhost:3000/app?tenant=uuid`).

The system automatically detects the environment and uses the appropriate method. All tenant data is isolated using Row-Level Security in the database.

## Unified Onboarding Flow

Our platform features a streamlined onboarding process that combines account creation and business setup into a single, cohesive experience:

1. **Account Creation**: Users create their account credentials
2. **Personal Details**: Users provide their personal information
3. **Business Information**: Users enter details about their business and select a subdomain
4. **Service Selection**: Users select the service package that fits their needs

This unified approach improves conversion rates and provides a seamless user experience. For technical details, see the [Onboarding Flow Documentation](docs/onboarding-flow.md).

## Technical Stack

- **Frontend**: Next.js, React, Tailwind CSS
- **Authentication**: Supabase Auth
- **Database**: PostgreSQL with Row-Level Security
- **Tenant Management**: Custom tenant provisioning system with subdomain support
- **Styling**: TailwindCSS with custom theme
- **Middleware**: Next.js middleware for tenant resolution and routing

## Getting Started

1. Clone the repository
2. Install dependencies with `npm install`
3. Set up environment variables (see `.env.example`)
4. Run the development server with `npm run dev`
5. Visit `http://localhost:3000` in your browser

### Setting Up Subdomain Testing

For local testing of subdomains:

1. Edit your hosts file to add entries for test subdomains:
   ```
   127.0.0.1 salon-a.localhost
   127.0.0.1 salon-b.localhost
   ```
2. Use a browser that supports subdomain cookies on localhost (like Firefox)
3. Access your test tenants at `http://salon-a.localhost:3000/app`

## Documentation

- [Onboarding Flow](docs/onboarding-flow.md) - Documentation for the unified onboarding process
- [Multi-tenant Architecture](docs/multi-tenant-architecture.md) - Details on the multi-tenant system
- [Tenant Context](docs/tenant-context.md) - How the tenant context works throughout the application
- [Subdomain Configuration](docs/subdomain-config.md) - How to set up and configure subdomains

## Deployment

For production deployment with subdomain support:

1. Deploy to Vercel or another hosting provider that supports custom domains
2. Configure wildcard DNS records for your domain (e.g., `*.projectnano.co.uk`)
3. Set up the appropriate environment variables for production

### CI/CD with GitHub Actions

This project uses GitHub Actions for continuous integration and deployment:

- Automatic deployment to Vercel when changes are pushed to the main branch
- Environment variables and secrets managed securely through GitHub
- Production builds optimized for performance

## License

This project is proprietary and confidential.

## Contact

For more information, please contact support@projectnano.co.uk 