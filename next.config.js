/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    domains: ['localhost', 'projectnano.co.uk', 'meidnvrthfbwzudcbgcn.supabase.co'],
  },
  // For GitHub Pages deployment - not needed for Vercel
  // basePath: process.env.NEXT_PUBLIC_BASE_PATH || '',
  // assetPrefix: process.env.NEXT_PUBLIC_BASE_PATH || '',
  
  // Proper trailing slash configuration
  trailingSlash: false,
  
  // Output standalone build for better performance
  output: 'standalone',
  
  // Experimental features
  experimental: {
    // Server Actions are available by default in Next.js 14.2.4+
    // Ensure middleware works correctly
    instrumentationHook: true,
  },
  
  // Environment variables that should be available to the client
  env: {
    NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
    NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL || 'https://projectnano.co.uk',
    NEXT_PUBLIC_PROJECTNANO_URL: process.env.NEXT_PUBLIC_PROJECTNANO_URL || 'https://projectnano.co.uk',
  },
}

module.exports = nextConfig 