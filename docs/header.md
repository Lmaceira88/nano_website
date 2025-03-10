# Header Component

## Overview

The Header component serves as the main navigation for the Project Nano website. It provides access to all major sections of the website and includes call-to-action buttons for user conversion.

## Features

- **Responsive Design**: Adapts to different screen sizes
- **Mobile Menu**: Hamburger menu for mobile devices
- **Sticky Positioning**: Stays at the top of the screen while scrolling
- **Navigation Links**: Quick access to main website sections
- **CTA Buttons**: "Log in" and "Get Started" buttons

## Implementation Details

### Component Structure

The Header component is implemented as a functional React component with the following structure:

```tsx
const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  
  // Toggle mobile menu
  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  
  return (
    <header>
      {/* Logo */}
      {/* Desktop Navigation */}
      {/* CTA Buttons */}
      {/* Mobile Menu Button */}
      {/* Mobile Navigation (conditional rendering) */}
    </header>
  );
};
```

### Styling

The Header uses Tailwind CSS for styling with the following key classes:

- `bg-white shadow-sm sticky top-0 z-50`: Creates a sticky header with shadow
- `container-custom`: Custom container width defined in globals.css
- `hidden md:flex`: Responsive display for desktop navigation
- `md:hidden`: Mobile-only elements

### Navigation Links

The Header includes links to the following sections:
- Features
- Testimonials
- Pricing
- FAQ

### Call-to-Action Buttons

Two CTA buttons are included:
1. **Log in**: For existing users
2. **Get Started**: For new user conversion

## Mobile Responsiveness

On mobile devices:
- The main navigation links are hidden
- A hamburger menu icon is displayed
- Clicking the hamburger icon reveals a dropdown menu
- The dropdown menu includes all navigation links and CTA buttons

## Usage

The Header component is imported and used in the main layout:

```tsx
import Header from '@/components/Header';

export default function Home() {
  return (
    <main>
      <Header />
      {/* Other components */}
    </main>
  );
}
```

## Future Enhancements

Potential future enhancements for the Header component:
- User account dropdown for logged-in users
- Language selector
- Dark mode toggle
- Search functionality 