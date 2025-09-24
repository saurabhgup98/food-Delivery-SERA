// Authentication service functions

import { makeApiCall } from '../shared/apiService';
import { userStorage } from '../shared/localStorage';
import { createUserFromApiData } from './userUtils';
import { AuthResponse, User, FOOD_DELIVERY_APP_URL } from '../types';

/**
 * Retry auth API call with exponential backoff
 */
const retryAuthCall = async <T>(
  apiCall: () => Promise<T>,
  maxRetries: number = 2
): Promise<T> => {
  let lastError: Error | undefined;
  
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await apiCall();
    } catch (error) {
      lastError = error as Error;
      console.log(`Auth API attempt ${attempt} failed:`, error);
      
      if (attempt === maxRetries) {
        break;
      }
      
      // Wait before retry (exponential backoff)
      const delay = Math.pow(2, attempt) * 1000;
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
  
  throw new Error(lastError?.message || 'Auth API call failed after retries');
};

/**
 * Login user with email and password
 */
export const loginUser = async (
  email: string, 
  password: string
): Promise<{ success: boolean; user?: User; error?: string }> => {
  try {
    const data: AuthResponse = await retryAuthCall(() => 
      makeApiCall('/auth/login', {
        method: 'POST',
        baseURL: 'https://simple-authentication-service.vercel.app/api',
        timeout: 15000, // Increased timeout for auth operations
        body: JSON.stringify({ 
          email, 
          password, 
          appEndpoint: FOOD_DELIVERY_APP_URL 
        }),
      })
    );

    if (data.success && data.data.user) {
      // Store user data (no tokens in new system)
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
    const data: AuthResponse = await retryAuthCall(() => 
      makeApiCall('/auth/register', {
        method: 'POST',
        baseURL: 'https://simple-authentication-service.vercel.app/api',
        timeout: 15000, // Increased timeout for auth operations
        body: JSON.stringify({ 
          username: name, 
          email, 
          password, 
          appEndpoint: FOOD_DELIVERY_APP_URL,
          role: 'user'
        }),
      })
    );

    if (data.success && data.data.user) {
      // Store user data (no tokens in new system)
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
    // Clear local storage (no API call needed in new system)
    userStorage.clearUser();
    
    return { success: true };
  } catch (error) {
    console.error('Logout failed:', error);
    
    // Still clear local storage even if there's an error
    userStorage.clearUser();
    
    return { success: true }; // Consider logout successful even if there's an error
  }
};

/**
 * Get user profile from server
 */
export const getUserProfile = async (): Promise<{ success: boolean; user?: User; error?: string }> => {
  try {
    // In the new system, we get user data from localStorage
    const storedUser = userStorage.getUser();
    if (storedUser) {
      const user = createUserFromApiData(storedUser);
      return { success: true, user };
    }
    
    return { success: false, error: 'No user data found' };
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
    // Get user from localStorage
    const storedUser = userStorage.getUser();
    if (storedUser) {
      const user = createUserFromApiData(storedUser);
      return { success: true, user };
    }
    
    return { success: false, error: 'No user data found' };
  } catch (error) {
    console.error('Authentication check failed:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Authentication check failed' 
    };
  }
};
