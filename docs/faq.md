# FAQ Component

## Overview

The FAQ (Frequently Asked Questions) component addresses common questions potential customers might have about Project Nano. It uses an accordion-style interface to present questions and answers in an organized, space-efficient manner.

## Features

- **Section heading**: Introduction to the FAQ section
- **Accordion interface**: Expandable/collapsible question panels
- **Question list**: Common questions about the product
- **Detailed answers**: Comprehensive responses to each question
- **Support link**: Option to contact support for additional questions

## Implementation Details

### Component Structure

The FAQ component is implemented as a functional React component with the following structure:

```tsx
"use client"; // Mark as a client component since it uses React hooks

const faqs = [
  {
    id: 1,
    question: 'How does the online booking system work?',
    answer: '...'
  },
  // Additional FAQ objects...
];

const FAQ = () => {
  const [openItem, setOpenItem] = useState<number | null>(null);

  const toggleItem = (id: number) => {
    setOpenItem(openItem === id ? null : id);
  };

  return (
    <section id="faq" className="section bg-secondary-50">
      <div className="container-custom">
        {/* Section heading */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2>...</h2>
          <p>...</p>
        </div>
        
        {/* FAQ accordion */}
        <div className="max-w-3xl mx-auto">
          <div className="space-y-4">
            {faqs.map((faq) => (
              <div key={faq.id} className="...">
                {/* Question button (toggles answer) */}
                <button onClick={() => toggleItem(faq.id)}>
                  <span>{faq.question}</span>
                  {/* Chevron icon (rotates when open) */}
                </button>
                
                {/* Answer (conditionally rendered) */}
                {openItem === faq.id && (
                  <div>
                    <p>{faq.answer}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
        
        {/* Support link */}
        <div className="text-center mt-12">
          <p>...</p>
        </div>
      </div>
    </section>
  );
};
```

### Client Component

The FAQ component is marked as a client component using the `"use client"` directive at the top of the file. This is necessary because:

1. It uses React hooks (`useState`)
2. It has interactive elements (accordion functionality)
3. In Next.js, components that use client-side features must be explicitly marked as client components

### FAQ Data Structure

Each FAQ item is represented as an object with the following properties:

```tsx
{
  id: number,       // Unique identifier
  question: string, // The question text
  answer: string    // The answer text
}
```

### State Management

The component uses React's `useState` hook to track which FAQ item is currently open:

```tsx
const [openItem, setOpenItem] = useState<number | null>(null);
```

The `toggleItem` function handles opening and closing FAQ items:

```tsx
const toggleItem = (id: number) => {
  setOpenItem(openItem === id ? null : id);
};
```

### Included Questions

The component includes the following questions:

1. How does the online booking system work?
2. Can I integrate Project Nano with my existing website?
3. How do the automated reminders work?
4. What payment methods are supported?
5. Is there a contract or can I cancel anytime?
6. Do you offer a free trial?

### Styling

The FAQ component uses Tailwind CSS for styling with the following key classes:

- `section bg-secondary-50`: Light background for the section
- `max-w-3xl mx-auto`: Centered content with maximum width
- `space-y-4`: Vertical spacing between FAQ items
- `bg-white rounded-lg shadow-sm`: Card styling for each FAQ item
- `transform transition-transform`: Animation for the chevron icon

## Mobile Responsiveness

The FAQ component is fully responsive:
- Maximum width container ensures readability on all devices
- Touch-friendly accordion buttons
- Proper spacing and padding for mobile screens

## Usage

The FAQ component is imported and used in the main page:

```tsx
import FAQ from '@/components/FAQ';

export default function Home() {
  return (
    <main>
      <Header />
      <Hero />
      <Features />
      <Testimonials />
      <Pricing />
      <FAQ />
      {/* Other components */}
    </main>
  );
}
```

## Best Practices

The FAQ section follows these best practices:
- Clear, concise questions
- Comprehensive, helpful answers
- Accordion interface to save space
- Visual feedback when opening/closing items
- Support link for additional questions
- Focused on addressing common objections and concerns
- Properly marked as a client component for interactive features

## Future Enhancements

Potential future enhancements for the FAQ component:
- Search functionality for finding specific questions
- Category filtering for different types of questions
- Rich text formatting in answers
- Animated transitions for smoother UX
- FAQ analytics to track most viewed questions
- User-submitted question form 