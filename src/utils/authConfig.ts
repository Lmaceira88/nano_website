/**
 * Authentication Configuration
 * 
 * This file contains configuration settings for authentication features.
 * Toggle these flags to enable/disable specific auth features during development.
 */

export const AUTH_CONFIG = {
  // When false, email verification will be bypassed during development
  REQUIRE_EMAIL_VERIFICATION: false,
  
  // When false, tenant creation won't require verification
  REQUIRE_VERIFICATION_FOR_TENANT_CREATION: false,
  
  // Other auth settings
  PASSWORD_MIN_LENGTH: 8,
  MAX_LOGIN_ATTEMPTS: 5,
  
  // Redirect paths
  REDIRECT_AFTER_LOGIN: '/dashboard',
  REDIRECT_AFTER_VERIFICATION: '/onboarding',
  REDIRECT_AFTER_SIGNUP: '/auth/verify',
};

/**
 * Determines if verification is needed based on config and environment
 */
export function isVerificationRequired(): boolean {
  // In production, always require verification regardless of config
  if (process.env.NODE_ENV === 'production') {
    return true;
  }
  
  return AUTH_CONFIG.REQUIRE_EMAIL_VERIFICATION;
} 