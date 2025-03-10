# Hero Component

## Overview

The Hero component is the main banner section at the top of the Project Nano website. It provides a compelling introduction to the product, highlights key value propositions, and includes primary call-to-action buttons to drive user conversion.

## Features

- **Eye-catching headline**: Clear value proposition
- **Supportive subheading**: Additional context and benefits
- **Primary CTA buttons**: "Get Started Free" and "Watch Demo"
- **Social proof**: User count and testimonial preview
- **Visual elements**: Illustration/screenshot with floating stat cards

## Implementation Details

### Component Structure

The Hero component is implemented as a functional React component with the following structure:

```tsx
const Hero = () => {
  return (
    <section className="bg-gradient-to-b from-white to-primary-50 py-20 md:py-32">
      <div className="container-custom">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left column: Text content */}
          <div>
            <h1>...</h1>
            <p>...</p>
            <div className="flex flex-col sm:flex-row gap-4">
              {/* CTA buttons */}
            </div>
            <div className="mt-8 flex items-center">
              {/* Social proof */}
            </div>
          </div>
          
          {/* Right column: Visual elements */}
          <div className="relative">
            {/* Main image/illustration */}
            {/* Floating stat cards */}
          </div>
        </div>
      </div>
    </section>
  );
};
```

### Styling

The Hero uses Tailwind CSS for styling with the following key classes:

- `bg-gradient-to-b from-white to-primary-50`: Subtle gradient background
- `grid grid-cols-1 lg:grid-cols-2`: Responsive two-column layout
- `text-4xl md:text-5xl lg:text-6xl`: Responsive typography
- `flex flex-col sm:flex-row`: Responsive button layout

### Content Elements

1. **Headline**: "Barbershop Management Made Simple"
2. **Subheading**: Description of Project Nano's purpose
3. **CTA Buttons**:
   - Primary: "Get Started Free"
   - Secondary: "Watch Demo"
4. **Social Proof**: "500+ barbershops trust Project Nano"
5. **Visual Elements**:
   - Main illustration/screenshot
   - Floating stat card: "Bookings Up 32%"
   - Floating stat card: "No-shows -24%"

## Mobile Responsiveness

On mobile devices:
- Single column layout (content stacked vertically)
- Reduced padding and spacing
- Vertically stacked CTA buttons
- Adjusted typography sizes

## Usage

The Hero component is imported and used in the main page:

```tsx
import Hero from '@/components/Hero';

export default function Home() {
  return (
    <main>
      <Header />
      <Hero />
      {/* Other components */}
    </main>
  );
}
```

## Best Practices

The Hero section follows these best practices:
- Clear, benefit-focused headline
- Concise supporting text
- Prominent call-to-action
- Social proof elements
- Visual representation of the product
- Responsive design for all devices

## Future Enhancements

Potential future enhancements for the Hero component:
- Animated elements using Framer Motion
- A/B testing different headlines and CTAs
- Video background or demo option
- Interactive product preview
- Personalized content based on user segments 