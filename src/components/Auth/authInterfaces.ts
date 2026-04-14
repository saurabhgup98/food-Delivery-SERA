import React from 'react';
import { PrimaryInputProps } from '../Input/PrimaryInput';

// ============================================================================
// AUTH FORM INTERFACES
// ============================================================================

export interface FormInput extends Omit<PrimaryInputProps, 'value' | 'onChange'> {
  name: string;
}

export interface FormButton {
  text: string;
  loading: string;
}

export interface FormConfig {
  header: {
    title: string;
    description: string;
    gradientClass: string;
  };
  inputs: FormInput[];
  button: FormButton;
  initialState: Record<string, string>;
}

export interface AuthFormProps {
  isOpen: boolean;
  onClose: () => void;
  mode: 'login' | 'signup';
  config: FormConfig;
  onSubmit: (data: any) => void;
  onModeSwitch: () => void;
  isLoading: boolean;
  error: string | null;
}

// ============================================================================
// OAUTH INTERFACES
// ============================================================================

export interface OAuthProviderProps {
  provider: OAuthProviderConfig;
  disabled?: boolean;
  className?: string;
}

export interface OAuthProviderConfig {
  id: string;
  name: string;
  label: string;
  icon: string;
  redirectUrl: string;
  className?: string;
  hoverClassName?: string;
}

export interface OAuthCallbackParams {
  provider: string;
  code: string;
  state?: string;
}

export interface OAuthUrlParams {
  appEndpoint: string;
  state?: string;
}

// ============================================================================
// AUTH SERVICE INTERFACES
// ============================================================================

export interface AuthServiceResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
  appEndpoint: string;
  selectedRole?: string;
}

export interface RegisterCredentials {
  username?: string;
  email: string;
  password: string;
  appEndpoint: string;
  role?: 'user' | 'business-user' | 'admin' | 'superadmin';
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

export interface User {
  id: string;
  _id?: string;
  username: string;
  name?: string;
  email: string;
  role?: string;
  appEndpoint: string;
  appIdentifier: string;
  availableRoles?: string[];
  authMethod?: string;
  appRegistered?: AppRegistration[];
}

export interface AppRegistration {
  appIdentifier: string;
  roles: string[];
  authMethod: string;
  isActive: boolean;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  data: {
    user: User;
    role?: string;
    availableRoles?: string[];
    appIdentifier?: string;
    authMethod?: string;
  };
}

// ============================================================================
// STORAGE INTERFACES
// ============================================================================

export interface StorageKeys {
  accessToken: string;
  refreshToken: string;
  user: string;
  isLoggedIn: string;
}

export interface UserStorage {
  setUser: (user: User) => void;
  getUser: () => User | null;
  clearUser: () => void;
}

export interface TokenStorage {
  setTokens: (accessToken: string, refreshToken: string) => boolean;
  getAccessToken: () => string | null;
  getRefreshToken: () => string | null;
  clearAll: () => boolean;
}

// ============================================================================
// FORM UTILITY INTERFACES
// ============================================================================

export interface FormValidationResult {
  isValid: boolean;
  errors: Record<string, string>;
}

export interface FormSubmissionResult {
  success: boolean;
  error?: string;
  data?: any;
}

export interface OAuthRedirectResult {
  success: boolean;
  url: string;
  error?: string;
}