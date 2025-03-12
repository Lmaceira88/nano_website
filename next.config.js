/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    domains: ['localhost'],
  },
  // For GitHub Pages deployment
  basePath: process.env.NEXT_PUBLIC_BASE_PATH || '',
  assetPrefix: process.env.NEXT_PUBLIC_BASE_PATH || '',
  trailingSlash: true,
  
  // Disable static export for pages that use client-side hooks
  output: 'standalone',
  
  // Experimental features
  experimental: {
    serverActions: true,
  },
}

module.exports = nextConfig 