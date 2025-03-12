# Project Nano - Multi-tenant SaaS Platform

Project Nano is a comprehensive SaaS platform designed for service-based businesses. It provides a multi-tenant architecture that supports various business types with a unified dashboard experience.

## Key Features

- **Multi-tenant Architecture**: Each client gets a dedicated tenant with isolated data
- **Unified Onboarding Experience**: Seamless flow from account creation to business setup
- **Customizable Service Packages**: Support for various service-based business types
- **Responsive Dashboard**: Mobile-friendly interface for managing your business on the go
- **Client Management**: Track and manage client information, history, and preferences
- **Appointment Scheduling**: Powerful scheduling system with availability management

## Unified Onboarding Flow

Our platform features a streamlined onboarding process that combines account creation and business setup into a single, cohesive experience:

1. **Account Creation**: Users create their account credentials
2. **Personal Details**: Users provide their personal information
3. **Business Information**: Users enter details about their business
4. **Service Selection**: Users select the service package that fits their needs

This unified approach improves conversion rates and provides a seamless user experience. For technical details, see the [Onboarding Flow Documentation](docs/onboarding-flow.md).

## Technical Stack

- **Frontend**: Next.js, React, Tailwind CSS
- **Authentication**: Supabase Auth
- **Database**: PostgreSQL with Row-Level Security
- **Tenant Management**: Custom tenant provisioning system
- **Styling**: TailwindCSS with custom theme

## Getting Started

1. Clone the repository
2. Install dependencies with `npm install`
3. Set up environment variables (see `.env.example`)
4. Run the development server with `npm run dev`
5. Visit `http://localhost:3000` in your browser

## Documentation

- [Onboarding Flow](docs/onboarding-flow.md) - Documentation for the unified onboarding process
- [Multi-tenant Architecture](docs/multi-tenant-architecture.md) - Details on the multi-tenant system
- [Tenant Context](docs/tenant-context.md) - How the tenant context works throughout the application

## License

This project is proprietary and confidential.

## Contact

For more information, please contact support@projectnano.co.uk 