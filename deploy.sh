#!/bin/bash

# Install dependencies if needed
npm install

# Build the site (includes export with the new method)
npm run build

# Create .nojekyll file to bypass Jekyll processing
touch out/.nojekyll

# Deploy to GitHub Pages
npx gh-pages -d out -t true

echo "Deployment complete! Your site should be live shortly." 