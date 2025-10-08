// API Utilities - Shared utility functions for API operations

import { STORAGE_KEYS } from './constants';
import { ApiError } from './types';

/** Handle API errors with consistent formatting */
export const handleApiError = (error: any): ApiError => {
  console.error('API Error:', error);
  
  if (error instanceof Error) {
    return {
      error: error.message,
      status: 500,
    };
  }
  
  return {
    error: 'An unexpected error occurred',
    status: 500,
  };
};

/** Get access token from localStorage */
export const getAccessToken = (): string | null => {
  return localStorage.getItem(STORAGE_KEYS.accessToken);
};

/** Get refresh token from localStorage */
export const getRefreshToken = (): string | null => {
  return localStorage.getItem(STORAGE_KEYS.refreshToken);
};

/** Set tokens in localStorage */
export const setTokens = (accessToken: string, refreshToken: string): void => {
  localStorage.setItem(STORAGE_KEYS.accessToken, accessToken);
  localStorage.setItem(STORAGE_KEYS.refreshToken, refreshToken);
};

/** Clear all auth-related data from localStorage */
export const clearAuthData = (): void => {
  localStorage.removeItem(STORAGE_KEYS.accessToken);
  localStorage.removeItem(STORAGE_KEYS.refreshToken);
  localStorage.removeItem(STORAGE_KEYS.user);
  localStorage.removeItem(STORAGE_KEYS.isLoggedIn);
};

/** Set user data in localStorage */
export const setUserData = (user: any): void => {
  localStorage.setItem(STORAGE_KEYS.user, JSON.stringify(user));
  localStorage.setItem(STORAGE_KEYS.isLoggedIn, 'true');
};

/** Get user data from localStorage */
export const getUserData = (): any | null => {
  const userStr = localStorage.getItem(STORAGE_KEYS.user);
  return userStr ? JSON.parse(userStr) : null;
};

/** Check if user is authenticated */
export const isAuthenticated = (): boolean => {
  const isLoggedIn = localStorage.getItem(STORAGE_KEYS.isLoggedIn);
  const user = localStorage.getItem(STORAGE_KEYS.user);
  return !!(isLoggedIn === 'true' && user);
};
