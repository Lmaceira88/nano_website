# Pricing Component

## Overview

The Pricing component displays the different subscription plans available for Project Nano. It presents a clear comparison of features and pricing to help potential customers choose the right plan for their barbershop.

## Features

- **Section heading**: Introduction to pricing plans
- **Pricing cards**: Individual cards for each plan
- **Plan details**: Name, price, description, and features
- **Popular plan highlight**: Visual emphasis on recommended plan
- **Call-to-action buttons**: Conversion buttons for each plan
- **Custom plan option**: Link to contact for custom solutions

## Implementation Details

### Component Structure

The Pricing component is implemented as a functional React component with the following structure:

```tsx
const pricingPlans = [
  {
    id: 'basic',
    name: 'Basic',
    price: '29',
    description: '...',
    features: ['...', '...', '...'],
    cta: 'Get Started',
    popular: false
  },
  // Additional plan objects...
];

const Pricing = () => {
  return (
    <section id="pricing" className="section bg-white">
      <div className="container-custom">
        {/* Section heading */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2>...</h2>
          <p>...</p>
        </div>
        
        {/* Pricing grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {pricingPlans.map((plan) => (
            <div 
              key={plan.id} 
              className={`... ${plan.popular ? 'ring-2 ring-primary-500 ...' : '...'}`}
            >
              {/* Popular badge (conditional) */}
              {/* Plan name and description */}
              {/* Price */}
              {/* Feature list */}
              {/* CTA button */}
            </div>
          ))}
        </div>
        
        {/* Custom plan option */}
        <div className="mt-12 text-center">
          <p>...</p>
        </div>
      </div>
    </section>
  );
};
```

### Pricing Plan Data Structure

Each pricing plan is represented as an object with the following properties:

```tsx
{
  id: string,       // Unique identifier
  name: string,     // Plan name
  price: string,    // Monthly price
  description: string, // Plan description
  features: string[], // Array of included features
  cta: string,      // Call-to-action button text
  popular: boolean  // Whether this is the highlighted plan
}
```

### Included Plans

The component includes three pricing plans:

1. **Basic** ($29/month): For small barbershops just getting started
2. **Professional** ($59/month): For growing barbershops with multiple staff members
3. **Enterprise** ($99/month): For established barbershops with multiple locations

### Styling

The Pricing component uses Tailwind CSS for styling with the following key classes:

- `section bg-white`: Section styling
- `grid grid-cols-1 md:grid-cols-3`: Responsive grid layout
- `ring-2 ring-primary-500`: Highlight for popular plan
- `bg-primary-500 text-white`: Popular badge styling
- `space-y-3 mb-8`: Feature list styling
- `btn w-full text-center`: CTA button styling

## Mobile Responsiveness

The pricing grid adapts to different screen sizes:
- **Mobile**: Single column (1 card per row)
- **Desktop**: Three columns (3 cards per row)

## Usage

The Pricing component is imported and used in the main page:

```tsx
import Pricing from '@/components/Pricing';

export default function Home() {
  return (
    <main>
      <Header />
      <Hero />
      <Features />
      <Testimonials />
      <Pricing />
      {/* Other components */}
    </main>
  );
}
```

## Best Practices

The Pricing section follows these best practices:
- Clear, transparent pricing
- Feature comparison across plans
- Visual highlighting of recommended plan
- Consistent card design
- Prominent call-to-action buttons
- Custom plan option for special needs
- Free trial mention to reduce friction

## Future Enhancements

Potential future enhancements for the Pricing component:
- Monthly/annual toggle with discount
- Interactive feature comparison
- Expandable feature details
- Currency selector for international users
- Promotional pricing or limited-time offers
- Calculator for ROI or savings estimation 