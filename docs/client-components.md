# Client vs Server Components in Next.js

## Overview

Next.js 14 uses a hybrid rendering model with two types of components:

1. **Server Components** (default): Render on the server and send HTML to the client
2. **Client Components**: Include client-side interactivity and render in the browser

Understanding the difference between these component types is crucial for building efficient Next.js applications.

## Server Components

Server Components are the default in Next.js. They:

- Render on the server
- Reduce JavaScript sent to the client
- Can fetch data directly
- Cannot use browser APIs
- Cannot use React hooks (useState, useEffect, etc.)
- Cannot use event handlers (onClick, onChange, etc.)

### Benefits of Server Components

- **Improved Performance**: Less JavaScript is sent to the client
- **Direct Data Access**: Can directly access backend resources
- **Automatic Code Splitting**: Only necessary code is sent to the client
- **Search Engine Optimization**: Content is rendered on the server

## Client Components

Client Components are used for interactive parts of your application. They:

- Render on the client (browser)
- Can use React hooks (useState, useEffect, etc.)
- Can use browser APIs
- Can handle user events
- Must be explicitly marked with the `"use client"` directive

### When to Use Client Components

Use Client Components when you need:

- Interactivity (buttons, forms, etc.)
- State management (useState, useContext)
- Browser-only APIs
- Event listeners
- Client-side lifecycle effects (useEffect)

### Marking a Component as a Client Component

To mark a component as a client component, add the `"use client"` directive at the top of the file:

```tsx
"use client";

import React, { useState } from 'react';

const InteractiveComponent = () => {
  const [count, setCount] = useState(0);
  
  return (
    <button onClick={() => setCount(count + 1)}>
      Clicked {count} times
    </button>
  );
};

export default InteractiveComponent;
```

## Project Nano Implementation

In the Project Nano website, all interactive components are marked as client components:

- **Header**: Uses useState for mobile menu toggle
- **FAQ**: Uses useState for accordion functionality
- **Other Components**: Use client-side features like Link navigation

## Best Practices

1. **Start with Server Components**: Use server components by default
2. **Move Client Logic Down**: Push client-side logic to leaf components
3. **Create Component Boundaries**: Separate client and server logic
4. **Minimize Client Components**: Only use client components when necessary
5. **Avoid Prop Drilling**: Use context or state management for complex state

## Common Issues

### "You're importing a component that needs useState"

This error occurs when:
- A component using React hooks is not marked with `"use client"`
- A server component is trying to import a client component that uses hooks

Solution: Add the `"use client"` directive to the component file.

## Further Reading

- [Next.js Documentation: Server and Client Components](https://nextjs.org/docs/getting-started/react-essentials)
- [React Documentation: Hooks](https://reactjs.org/docs/hooks-intro.html) 