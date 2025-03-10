# Deployment Guide

This document provides instructions for deploying the Project Nano website to different platforms.

## GitHub Pages Deployment

### Prerequisites

- A GitHub account
- Git installed on your local machine
- Node.js and npm installed

### Steps for GitHub Pages Deployment

1. **Create a GitHub Repository**

   Create a new repository on GitHub or use an existing one.

2. **Push Your Code to GitHub**

   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/yourusername/project-nano.git
   git push -u origin main
   ```

3. **Install the gh-pages Package**

   ```bash
   npm install --save-dev gh-pages
   ```

   This package is already included in the project's devDependencies.

4. **Deploy Using the Script**

   You can deploy the site using the provided script:

   ```bash
   # Make the script executable (Unix/Mac)
   chmod +x deploy.sh
   
   # Run the script
   ./deploy.sh
   ```

   Or manually with npm:

   ```bash
   npm run deploy
   ```

5. **Configure GitHub Pages**

   - Go to your repository on GitHub
   - Navigate to Settings > Pages
   - Under "Source", select the "gh-pages" branch
   - Click Save

   Your site will be published at `https://yourusername.github.io/project-nano/`

### Troubleshooting

- If images or styles are not loading, check that the `basePath` and `assetPrefix` in `next.config.js` are set correctly.
- Make sure the `.nojekyll` file exists in the `out` directory to prevent GitHub from processing the files with Jekyll.

## Vercel Deployment (Recommended)

Vercel is the platform created by the makers of Next.js and offers the best experience for deploying Next.js applications.

### Steps for Vercel Deployment

1. **Push Your Code to GitHub**

   Make sure your code is in a GitHub repository.

2. **Sign Up for Vercel**

   Go to [vercel.com](https://vercel.com) and sign up using your GitHub account.

3. **Import Your Repository**

   - Click "New Project"
   - Select your repository
   - Vercel will automatically detect that it's a Next.js project
   - Click "Deploy"

4. **Configure Custom Domain (Optional)**

   - Go to your project settings in Vercel
   - Navigate to "Domains"
   - Add your custom domain (e.g., projectnano.co.uk)
   - Follow the instructions to configure DNS settings

### Advantages of Vercel

- Automatic deployments when you push to GitHub
- Preview deployments for pull requests
- Serverless functions support
- Edge caching
- Analytics and monitoring
- Easy custom domain setup

## Custom Domain Setup

To use a custom domain like projectnano.co.uk:

1. Purchase the domain from a domain registrar
2. Configure DNS settings to point to your hosting provider
3. Set up the custom domain in your hosting platform (GitHub Pages or Vercel)
4. Wait for DNS propagation (can take up to 48 hours)

For detailed instructions, refer to:
- [GitHub Pages Custom Domain Guide](https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site)
- [Vercel Custom Domain Guide](https://vercel.com/docs/concepts/projects/domains) 