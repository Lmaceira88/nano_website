/**
 * Next.js Static Export Configuration
 * 
 * This file contains configuration for which pages should be statically generated
 * and which should be server-rendered or client-rendered.
 */

export const dynamicRoutes = [
  '/app',
  '/app/appointments',
  '/app/clients',
  '/app/services',
  '/app/staff',
  '/dashboard',
  '/auth/login',
  '/auth/register',
  '/auth/forgot-password',
  '/auth/reset-password',
  '/auth/verify',
  '/onboarding',
  '/demo',
  '/',
  '/project-plan'
];

// Dynamically export all routes that use useSearchParams
export const dynamicParams = true;

// Generate all other pages at build time
export const generateStaticParams = async () => {
  return [];
};

// Add a revalidation period for static pages
export const revalidate = 3600; // 1 hour 