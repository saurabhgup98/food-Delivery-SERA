// Authentication service functions

import { makeApiCall } from '../shared/apiService';
import { tokenStorage, userStorage } from '../shared/localStorage';
import { setTokens, getRefreshToken } from './tokenManager';
import { createUserFromApiData } from './userUtils';
import { AuthResponse, User, FOOD_DELIVERY_APP_URL } from '../types';

/**
 * Login user with email and password
 */
export const loginUser = async (
  email: string, 
  password: string
): Promise<{ success: boolean; user?: User; error?: string }> => {
  try {
    const data: AuthResponse = await makeApiCall('/auth/login', {
      method: 'POST',
      baseURL: 'https://simple-auth-service.vercel.app/api',
      body: JSON.stringify({ 
        email, 
        password, 
        appEndpoint: FOOD_DELIVERY_APP_URL 
      }),
    });

    if (data.success && data.data.tokens) {
      // Store tokens and user data
      setTokens(data.data.tokens);
      userStorage.setUser(data.data.user);
      
      // Create user object with proper role extraction
      const user = createUserFromApiData(data.data.user);
      
      return { success: true, user };
    }
    
    return { success: false, error: 'Login failed' };
  } catch (error) {
    console.error('Login failed:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Login failed' 
    };
  }
};

/**
 * Register new user
 */
export const registerUser = async (
  name: string, 
  email: string, 
  password: string
): Promise<{ success: boolean; user?: User; error?: string }> => {
  try {
    const data: AuthResponse = await makeApiCall('/auth/register', {
      method: 'POST',
      baseURL: 'https://simple-auth-service.vercel.app/api',
      body: JSON.stringify({ 
        name, 
        email, 
        password, 
        appName: FOOD_DELIVERY_APP_URL,
        role: 'user'
      }),
    });

    if (data.success && data.data.tokens) {
      // Store tokens and user data
      setTokens(data.data.tokens);
      userStorage.setUser(data.data.user);
      
      // Create user object with proper role extraction
      const user = createUserFromApiData(data.data.user);
      
      return { success: true, user };
    }
    
    return { success: false, error: 'Registration failed' };
  } catch (error) {
    console.error('Registration failed:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Registration failed' 
    };
  }
};

/**
 * Logout user
 */
export const logoutUser = async (): Promise<{ success: boolean; error?: string }> => {
  try {
    const refreshToken = getRefreshToken();
    if (refreshToken) {
      await makeApiCall('/auth/logout', {
        method: 'POST',
        baseURL: 'https://simple-auth-service.vercel.app/api',
        body: JSON.stringify({ refreshToken }),
      });
    }
    
    // Clear local storage regardless of API call success
    tokenStorage.clearAll();
    userStorage.clearUser();
    
    return { success: true };
  } catch (error) {
    console.error('Logout API call failed:', error);
    
    // Still clear local storage even if API call fails
    tokenStorage.clearAll();
    userStorage.clearUser();
    
    return { success: true }; // Consider logout successful even if API fails
  }
};

/**
 * Get user profile from server
 */
export const getUserProfile = async (): Promise<{ success: boolean; user?: User; error?: string }> => {
  try {
    const data = await makeApiCall('/user/profile', {
      baseURL: 'https://simple-auth-service.vercel.app/api'
    });
    
    if (data.success && data.data.user) {
      const user = createUserFromApiData(data.data.user);
      return { success: true, user };
    }
    
    return { success: false, error: 'Failed to get user profile' };
  } catch (error) {
    console.error('Get user profile failed:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Failed to get user profile' 
    };
  }
};

/**
 * Check if user is authenticated
 */
export const checkAuthentication = async (): Promise<{ success: boolean; user?: User; error?: string }> => {
  try {
    // First try to get user from localStorage
    const storedUser = userStorage.getUser();
    if (storedUser) {
      const user = createUserFromApiData(storedUser);
      return { success: true, user };
    }
    
    // If no stored user, try to get from server
    return await getUserProfile();
  } catch (error) {
    console.error('Authentication check failed:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Authentication check failed' 
    };
  }
};
