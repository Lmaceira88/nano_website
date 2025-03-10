# Project Nano - Barbershop Management System

Project Nano is a comprehensive barbershop management system inspired by GetSquire.com. This platform helps barbershops streamline their operations, increase bookings, and enhance client satisfaction.

## Features

- **Online Booking System**: Allow clients to book appointments 24/7
- **Client Management**: Keep track of client preferences and history
- **Payment Processing**: Accept payments online and in-person
- **Staff Management**: Manage staff schedules and performance
- **Automated Reminders**: Reduce no-shows with SMS and email reminders
- **Reporting & Analytics**: Gain insights into your business performance

## Tech Stack

- Next.js 14.2.24
- React 18
- TypeScript
- Tailwind CSS
- Framer Motion

## Getting Started

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

## Deployment

### Deploy to Vercel (Recommended)

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com) from the creators of Next.js.

1. Push your code to a GitHub repository
2. Import your project to Vercel:
   - Go to [vercel.com](https://vercel.com)
   - Sign up or log in with GitHub
   - Click "New Project" and import your repository
   - Vercel will automatically detect Next.js and set up the build configuration
   - Click "Deploy"

Your site will be deployed to a URL like `https://project-nano.vercel.app` and will automatically update when you push changes to your GitHub repository.

### Deploy to GitHub Pages

To deploy to GitHub Pages, you'll need to make some adjustments for Next.js:

1. Install the required package:
```bash
npm install --save-dev gh-pages
```

2. Add the following scripts to your package.json:
```json
"scripts": {
  "build": "next build && next export",
  "export": "next export",
  "deploy": "next build && next export && touch out/.nojekyll && gh-pages -d out -t true"
}
```

3. Create a `.github/workflows/deploy.yml` file for GitHub Actions:
```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [ main ]

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v2

      - name: Setup Node.js
        uses: actions/setup-node@v2
        with:
          node-version: '18'

      - name: Install dependencies
        run: npm ci

      - name: Build and Export
        run: npm run build && npm run export

      - name: Deploy to GitHub Pages
        uses: JamesIves/github-pages-deploy-action@4.1.4
        with:
          branch: gh-pages
          folder: out
```

4. Push your code to GitHub and enable GitHub Pages in your repository settings.

## Project Structure

- `/src/app`: Next.js app router pages
- `/src/components`: Reusable React components
- `/src/styles`: Global styles and Tailwind configuration
- `/public`: Static assets
- `/docs`: Documentation files

## Future Enhancements

The site will be connected to projectnano.co.uk in the future.

## License

This project is proprietary and confidential.

## Contact

For any inquiries, please reach out to [your-email@example.com](mailto:your-email@example.com). 