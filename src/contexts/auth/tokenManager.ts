// Token management utilities for authentication

import { tokenStorage } from '../shared/localStorage';
import { makeApiCall } from '../shared/apiService';
import { AuthTokens } from '../types';

/**
 * Set authentication tokens in localStorage
 */
export const setTokens = (tokens: AuthTokens): boolean => {
  return tokenStorage.setTokens(tokens.accessToken, tokens.refreshToken);
};

/**
 * Clear all authentication tokens
 */
export const clearTokens = (): boolean => {
  return tokenStorage.clearAll();
};

/**
 * Get access token from localStorage
 */
export const getAccessToken = (): string | null => {
  return tokenStorage.getAccessToken();
};

/**
 * Get refresh token from localStorage
 */
export const getRefreshToken = (): string | null => {
  return tokenStorage.getRefreshToken();
};

/**
 * Check if user has valid access token
 */
export const hasValidToken = (): boolean => {
  const token = getAccessToken();
  if (!token) return false;
  
  try {
    // Basic JWT token validation (check if it's not expired)
    const payload = JSON.parse(atob(token.split('.')[1]));
    const currentTime = Date.now() / 1000;
    return payload.exp > currentTime;
  } catch {
    return false;
  }
};

/**
 * Refresh access token using refresh token
 */
export const refreshAccessToken = async (): Promise<boolean> => {
  const refreshToken = getRefreshToken();
  
  if (!refreshToken) {
    return false;
  }

  try {
    const response = await makeApiCall('/auth/refresh', {
      method: 'POST',
      body: JSON.stringify({ refreshToken }),
    });

    if (response.success && response.data.tokens) {
      setTokens(response.data.tokens);
      return true;
    }
    return false;
  } catch (error) {
    console.error('Token refresh failed:', error);
    clearTokens();
    return false;
  }
};

/**
 * Auto-refresh token with retry logic
 */
export const autoRefreshToken = async (maxRetries: number = 3): Promise<boolean> => {
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      const success = await refreshAccessToken();
      if (success) return true;
    } catch (error) {
      console.error(`Token refresh attempt ${attempt} failed:`, error);
      
      if (attempt === maxRetries) {
        clearTokens();
        return false;
      }
      
      // Wait before retry
      await new Promise(resolve => setTimeout(resolve, 1000 * attempt));
    }
  }
  
  return false;
};
