# Project Nano Documentation

## Introduction

Welcome to the Project Nano documentation. This documentation provides detailed information about the Project Nano website, a comprehensive barbershop management system inspired by GetSquire.com.

## Table of Contents

1. [Overview](./overview.md) - General overview of the Project Nano website
2. [Components](#components) - Documentation for individual components
3. [Development](#development) - Development guidelines and best practices
4. [Client vs Server Components](./client-components.md) - Understanding Next.js component types
5. [Deployment](./deployment.md) - Deployment instructions for GitHub Pages and Vercel

## Components

The Project Nano website consists of the following components:

- [Header](./header.md) - Main navigation component
- [Hero](./hero.md) - Main banner section
- [Features](./features.md) - Feature showcase section
- [Testimonials](./testimonials.md) - Customer reviews section
- [Pricing](./pricing.md) - Pricing plans section
- [FAQ](./faq.md) - Frequently asked questions section
- [CTA](./cta.md) - Call-to-action section
- [Footer](./footer.md) - Footer navigation and information

### Client Components

All interactive components in the Project Nano website are marked as client components using the `"use client"` directive at the top of their files. This is necessary in Next.js for components that:

- Use React hooks (useState, useEffect, etc.)
- Have interactive elements (buttons, forms, etc.)
- Need access to browser APIs
- Include client-side event handlers

By default, Next.js treats components as server components, which cannot use these client-side features.

For more detailed information, see [Client vs Server Components](./client-components.md).

## Development

### Prerequisites

- Node.js 18.0.0 or later
- npm or yarn

### Installation

1. Clone the repository
```bash
git clone https://github.com/yourusername/project-nano.git
cd project-nano
```

2. Install dependencies
```bash
npm install
# or
yarn install
```

3. Run the development server
```bash
npm run dev
# or
yarn dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser to see the result.

### Project Structure

- `/src/app`: Next.js app router pages
- `/src/components`: Reusable React components
- `/src/styles`: Global styles and Tailwind configuration
- `/public`: Static assets
- `/docs`: Documentation files

### Technology Stack

- **Framework**: Next.js 14.2.24
- **UI Library**: React 18
- **Styling**: Tailwind CSS
- **Animations**: Framer Motion
- **Language**: TypeScript

## Deployment

The Project Nano website can be deployed to various platforms. For detailed instructions, see the [Deployment Guide](./deployment.md).

- **GitHub Pages**: Deploy using GitHub Actions or the gh-pages package
- **Vercel**: Recommended platform for Next.js applications
- **Custom Domain**: Instructions for setting up projectnano.co.uk

## Contributing

Guidelines for contributing to the Project Nano website will be added in the future.

## License

This project is proprietary and confidential. 