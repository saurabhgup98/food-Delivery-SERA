import React from 'react';
import { FormConfig, OAuthProviderConfig } from './authInterfaces';
import { getOAuthIcon } from '../Icon/OAuthIcons';
import { createButtonProps, ButtonConfigItem } from '../common/utils/ButtonConfigUtils';
import { PrimaryActionBtnProps } from '../Button/PrimaryActionBtn';

export const OAUTH_PROVIDERS: OAuthProviderConfig[] = [
  {
    id: 'google',
    name: 'Google',
    label: 'Continue with Google',
    icon: 'google',
    redirectUrl: '/api/oauth/google'
  },
  {
    id: 'facebook',
    name: 'Facebook',
    label: 'Continue with Facebook',
    icon: 'facebook',
    redirectUrl: '/api/oauth/facebook'
  }
];

export const AUTH_FORM_CONFIG: { login: FormConfig; signup: FormConfig } = {
  login: {
    header: {
      title: "Welcome Back",
      description: "Sign in to your SERA account",
      gradientClass: "bg-gradient-to-r from-sera-pink to-sera-orange"
    },
    inputs: [
      {
        type: 'email' as const,
        name: 'email',
        placeholder: 'Enter your email',
        label: 'Email Address',
        required: true,
        autoComplete: 'email',
        className: 'w-full'
      },
      {
        type: 'password' as const,
        name: 'password',
        placeholder: 'Enter your password',
        label: 'Password',
        required: true,
        autoComplete: 'current-password',
        showDataToggle: true,
        className: 'w-full'
      }
    ],
    button: {
      text: "Sign In",
      loading: "Signing in..."
    },
    initialState: {
      email: '',
      password: ''
    }
  },
  signup: {
    header: {
      title: "Join SERA",
      description: "Create your account to get started",
      gradientClass: "bg-gradient-to-r from-sera-blue to-sera-darkBlue"
    },
    inputs: [
      {
        type: 'text' as const,
        name: 'name',
        placeholder: 'Enter your full name',
        label: 'Full Name',
        required: true,
        autoComplete: 'name',
        className: 'w-full'
      },
      {
        type: 'email' as const,
        name: 'email',
        placeholder: 'Enter your email',
        label: 'Email Address',
        required: true,
        autoComplete: 'email',
        className: 'w-full'
      },
      {
        type: 'password' as const,
        name: 'password',
        placeholder: 'Create a password',
        label: 'Password',
        required: true,
        autoComplete: 'new-password',
        showDataToggle: true,
        className: 'w-full'
      },
      {
        type: 'password' as const,
        name: 'confirmPassword',
        placeholder: 'Confirm your password',
        label: 'Confirm Password',
        required: true,
        autoComplete: 'new-password',
        showDataToggle: true,
        className: 'w-full'
      }
    ],
    button: {
      text: "Create Account",
      loading: "Creating account..."
    },
    initialState: {
      name: '',
      email: '',
      password: '',
      confirmPassword: ''
    }
  }
};

export enum AuthButtonType {
  LOGIN_BUTTON = 'login_button',
  SIGNUP_BUTTON = 'signup_button',
  GOOGLE_OAUTH_BUTTON = 'google_oauth_button',
  FACEBOOK_OAUTH_BUTTON = 'facebook_oauth_button',
}

const AUTH_BUTTON_CONFIG: Record<AuthButtonType, ButtonConfigItem> = {
  [AuthButtonType.LOGIN_BUTTON]: {
    text: AUTH_FORM_CONFIG.login.button.text,
    loadingText: AUTH_FORM_CONFIG.login.button.loading,
    variant: 'Primary',
    className: 'w-full py-3',
    isSubmit: true,
  },
  [AuthButtonType.SIGNUP_BUTTON]: {
    text: AUTH_FORM_CONFIG.signup.button.text,
    loadingText: AUTH_FORM_CONFIG.signup.button.loading,
    variant: 'Primary',
    className: 'w-full py-3',
    isSubmit: true,
  },
  [AuthButtonType.GOOGLE_OAUTH_BUTTON]: {
    text: OAUTH_PROVIDERS[0].label,
    loadingText: 'Connecting...',
    variant: 'White',
    className: 'w-full py-3 px-6',
    icon: getOAuthIcon(OAUTH_PROVIDERS[0].icon),
  },
  [AuthButtonType.FACEBOOK_OAUTH_BUTTON]: {
    text: OAUTH_PROVIDERS[1].label,
    loadingText: 'Connecting...',
    variant: 'OAuth',
    className: 'w-full py-3 px-6',
    icon: getOAuthIcon(OAUTH_PROVIDERS[1].icon),
  },
} as const;

export function getAuthButtonProps(
  type: AuthButtonType,
  onClick: () => void,
  options?: {
    isLoading?: boolean;
    customText?: string;
  }
): PrimaryActionBtnProps {
  const config = AUTH_BUTTON_CONFIG[type];
  return createButtonProps(config, onClick, options);
}