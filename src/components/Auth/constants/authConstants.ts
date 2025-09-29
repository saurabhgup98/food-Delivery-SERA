// Auth Constants - Configuration for authentication components

export interface OAuthProviderConfig {
  id: string;
  name: string;
  label: string;
  icon: string;
  className: string;
  hoverClassName: string;
  redirectUrl: string;
}

// OAuth Providers
export const OAUTH_PROVIDERS: OAuthProviderConfig[] = [
  {
    id: 'google',
    name: 'google',
    label: 'Continue with Google',
    icon: 'google',
    className: 'bg-white/5 border border-white/10 text-white',
    hoverClassName: 'hover:bg-white/10 hover:border-white/20',
    redirectUrl: '/api/oauth/google'
  },
  {
    id: 'facebook',
    name: 'facebook',
    label: 'Continue with Facebook',
    icon: 'facebook',
    className: 'bg-blue-600/10 border border-blue-600/20 text-blue-400',
    hoverClassName: 'hover:bg-blue-600/20 hover:border-blue-600/30 hover:text-blue-300',
    redirectUrl: '/api/oauth/facebook'
  }
];

// Form Constants
export const FORM_CONSTANTS = {
  VALIDATION_MESSAGES: {
    REQUIRED: 'This field is required',
    EMAIL_INVALID: 'Please enter a valid email address',
    PASSWORD_MIN_LENGTH: 'Password must be at least 8 characters',
    PASSWORD_MISMATCH: 'Passwords do not match',
    USERNAME_MIN_LENGTH: 'Username must be at least 3 characters',
    USERNAME_INVALID: 'Username can only contain letters, numbers, and underscores',
  },
  PASSWORD_REQUIREMENTS: {
    MIN_LENGTH: 8,
    REQUIRE_UPPERCASE: true,
    REQUIRE_LOWERCASE: true,
    REQUIRE_NUMBER: true,
    REQUIRE_SPECIAL: false,
  },
} as const;
