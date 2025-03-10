# ProjectNano Authentication System Documentation

## Overview
This document outlines the authentication system for ProjectNano, including how it integrates with the main ProjectNano.co.uk application.

## System Architecture
The authentication system is a separate Next.js application that handles user registration, login, password reset, and email verification. It connects to the same Supabase backend as the main ProjectNano.co.uk application.

### Key Components

#### 1. Authentication Pages
- **Registration** (`/auth/register`): Collects user details and creates accounts
- **Login** (`/auth/login`): Authenticates existing users
- **Verification** (`/auth/verify`): Handles email verification
- **Password Reset** (`/auth/forgot-password`, `/auth/reset-password`): Manages password recovery flow

#### 2. Authentication Services
- **Supabase Auth**: Backend authentication service
- **Email Verification**: Configurable for development/production
- **User Metadata**: Stores additional user details (name, phone, etc.)

#### 3. Integration with ProjectNano.co.uk
- Authentication data is shared via localStorage
- Redirect mechanisms connect the two applications
- Both applications use the same Supabase project
- Connection status monitoring ensures both apps are running

## User Registration Process

### Data Collected
- First Name (required)
- Last Name (required)
- Email Address (required)
- Phone Number (optional)
- Password (required, min 8 characters)

### User Metadata Stored
All user metadata is stored in the Supabase `auth.users` table under the `raw_user_meta_data` column:
- `first_name`: User's first name
- `last_name`: User's last name
- `phone`: User's phone number
- `phone_number`: Alternative field for phone (for compatibility)
- `created_at`: Timestamp of account creation

### Email Verification
Email verification is configurable via the `authConfig.ts` file:
- Development: Can be disabled for testing (`REQUIRE_EMAIL_VERIFICATION: false`)
- Production: Should be enabled (`REQUIRE_EMAIL_VERIFICATION: true`)

## Login Process

### Authentication Flow
1. User enters email and password
2. Credentials are verified against Supabase auth
3. If verification is required, unverified accounts are redirected to verify
4. After successful authentication, user is redirected to dashboard

### Session Management
- Sessions are managed by Supabase Auth
- JWT tokens are stored in localStorage
- Session expiration is handled automatically by Supabase

## Integration with ProjectNano.co.uk

### Authentication Data Sharing
The authentication service shares data with the main application via:
- localStorage tokens (`supabase.auth.token` and `supabase.auth.user`)
- URL parameters as fallback (`user_id` and `access_token`)
- Flag indicating authentication source (`auth_source`)

### Cross-Application Navigation
- Login redirects to the main application dashboard
- Connection status is checked before redirection
- Auth system ensures ProjectNano.co.uk is running before redirecting

### Connection Utilities
The auth system includes utilities to manage connections with ProjectNano.co.uk:
- `useAppConnection` hook monitors connection status
- Connection verification ensures ProjectNano is running
- Environment variables configure connection settings

## Environment Variables for Integration
```
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key

# ProjectNano Application URL
NEXT_PUBLIC_PROJECTNANO_URL=http://localhost:5174

# Cross-Application Communication
NEXT_PUBLIC_AUTH_SHARING_ENABLED=true
NEXT_PUBLIC_SESSION_STORAGE_KEY=supabase.auth.token
NEXT_PUBLIC_USER_STORAGE_KEY=supabase.auth.user
```

## Security Considerations

### JWT Token Security
- Tokens are stored in localStorage (client-side only)
- Proper HTTPS should be used in production
- Token expiration is enforced by Supabase

### Password Requirements
- Minimum 8 characters
- Frontend and backend validation
- Secure password reset flow

## Development vs. Production

### Development Mode
- Email verification can be disabled
- Direct navigation to protected routes is possible
- Debugging information in console logs

### Production Mode
- Email verification enforced
- Strict route protection
- No sensitive debugging information

## Recent Updates

### Latest Changes (March 2025)
1. Added phone number metadata persistence with dual field names
2. Improved connection mechanism between auth system and ProjectNano
3. Added connection status monitoring and verification
4. Enhanced cross-application authentication sharing
5. Updated environment variable configuration for better flexibility

## Starting Both Applications

### Start ProjectNano.co.uk App
```bash
cd C:\Users\lmace\Desktop\ProjectNano.co.uk
npm run dev
```

### Start Auth System App
```bash
cd C:\Users\lmace\Desktop\website
npm run dev
```

### Troubleshooting Starting Servers
If you encounter port conflicts when starting servers:
1. Stop any running Node.js processes with `taskkill /F /IM node.exe`
2. Close any terminal windows with running servers
3. Restart servers one at a time

## Troubleshooting

### Common Issues

#### Authentication Fails
- Check Supabase credentials in `.env.local`
- Verify user exists in Supabase dashboard
- Check for browser console errors

#### Redirect Issues
- Ensure both applications are running (auth app and ProjectNano.co.uk)
- Check connection status in dashboard page
- Verify that localStorage is available and not blocked

#### Email Verification Problems
- Check Supabase email template configuration
- Verify email provider settings
- For testing, disable verification in development mode

## Contributing to the Auth System
When making changes to the authentication system:
1. Update tests if applicable
2. Document changes in this file
3. Ensure backward compatibility
4. Test in both development and production modes 