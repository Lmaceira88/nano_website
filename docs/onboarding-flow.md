# Unified Onboarding Flow Documentation

## Overview

Project Nano's onboarding flow has been redesigned to provide a seamless experience that combines account creation and business setup in a single, progressive journey. This approach reduces friction, improves conversion rates, and provides clear context for users at each step.

## Flow Architecture

The unified onboarding process consists of four sequential steps:

1. **Account Creation** - User creates their admin account credentials
2. **Personal Details** - User provides/confirms personal information
3. **Business Information** - User enters business details and type
4. **Service Selection** - User chooses service package and completes setup

## Technical Implementation

### Components Structure

The onboarding components are organized in a modular structure:

```
src/
├── components/
│   └── onboarding/
│       ├── AccountCreationScreen.tsx  - Step 1: Create account
│       ├── WelcomeScreen.tsx          - Step 2: Personal details
│       ├── BusinessInfoScreen.tsx     - Step 3: Business information
│       └── ServiceSelectionScreen.tsx - Step 4: Service selection
└── app/
    └── onboarding/
        └── page.tsx                   - Main onboarding container
```

### State Management

The onboarding flow manages state through:

1. Form data is stored in a central state object in the parent component
2. Each step component receives relevant data and update functions via props
3. Authentication state is handled by the AuthContext
4. Step navigation uses a simple state machine pattern

### Data Flow

1. User enters account credentials and creates an account
2. Authentication state is established via Supabase/Auth provider
3. User progresses through business setup steps
4. On completion, a tenant is created and the user is redirected to their dashboard

## User Experience Details

### Existing Users vs. New Users

- **New Users**: Progress through all four steps in sequence
- **Existing Users**: Skip the account creation step and start at personal details 

### Field Validation

Each step includes comprehensive field validation:
- Email format validation
- Password strength requirements
- Required field checks
- Business name validation
- Service selection validation

### Error Handling

The flow implements centralized error handling:
- Authentication errors (duplicate accounts, invalid credentials)
- Validation errors (missing fields, format issues)
- API errors (connection issues, server errors)

## Integration Points

### Auth Integration

The onboarding flow integrates with the authentication system via:
- `useAuth()` hook for authentication state and methods
- Direct calls to auth methods for account creation

### API Integration

The onboarding process connects to:
- Authentication API for account creation
- Tenant creation API for business setup
- Service configuration API for package selection

## Future Enhancements

Planned improvements for this flow:

1. Progress saving (allow users to continue later)
2. Social login integration
3. Enhanced business type options with customized flows
4. Dynamic field validation with real-time feedback
5. A/B testing infrastructure for optimization

## Technical Considerations

- Most validation happens client-side for immediate feedback
- Critical validation is duplicated server-side for security
- Authentication tokens are stored securely
- Form data is never persisted to localStorage for security
- Tenants are provisioned asynchronously to prevent blocking 