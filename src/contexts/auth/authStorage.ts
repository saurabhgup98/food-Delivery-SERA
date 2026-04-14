// Auth Storage Service - Authentication storage operations

import { 
  User, 
  AuthTokens, 
  StorageKeys,
  UserStorage,
  TokenStorage 
} from '../../components/Auth/authInterfaces';

// Storage keys configuration
const STORAGE_KEYS: StorageKeys = {
  accessToken: 'authToken',
  refreshToken: 'refreshToken',
  user: 'user',
  isLoggedIn: 'isLoggedIn'
};

// User storage implementation
export const userStorage: UserStorage = {
  /**
   * Set user data in localStorage
   */
  setUser: (user: User): void => {
    try {
      localStorage.setItem(STORAGE_KEYS.user, JSON.stringify(user));
      localStorage.setItem(STORAGE_KEYS.isLoggedIn, 'true');
    } catch (error) {
      console.error('Failed to store user data:', error);
    }
  },

  /**
   * Get user data from localStorage
   */
  getUser: (): User | null => {
    try {
      const userStr = localStorage.getItem(STORAGE_KEYS.user);
      return userStr ? JSON.parse(userStr) : null;
    } catch (error) {
      console.error('Failed to retrieve user data:', error);
      return null;
    }
  },

  /**
   * Clear user data from localStorage
   */
  clearUser: (): void => {
    try {
      localStorage.removeItem(STORAGE_KEYS.user);
      localStorage.removeItem(STORAGE_KEYS.isLoggedIn);
    } catch (error) {
      console.error('Failed to clear user data:', error);
    }
  }
};

// Token storage implementation
export const tokenStorage: TokenStorage = {
  /**
   * Set authentication tokens in localStorage
   */
  setTokens: (accessToken: string, refreshToken: string): boolean => {
    try {
      localStorage.setItem(STORAGE_KEYS.accessToken, accessToken);
      localStorage.setItem(STORAGE_KEYS.refreshToken, refreshToken);
      return true;
    } catch (error) {
      console.error('Failed to store tokens:', error);
      return false;
    }
  },

  /**
   * Get access token from localStorage
   */
  getAccessToken: (): string | null => {
    try {
      return localStorage.getItem(STORAGE_KEYS.accessToken);
    } catch (error) {
      console.error('Failed to retrieve access token:', error);
      return null;
    }
  },

  /**
   * Get refresh token from localStorage
   */
  getRefreshToken: (): string | null => {
    try {
      return localStorage.getItem(STORAGE_KEYS.refreshToken);
    } catch (error) {
      console.error('Failed to retrieve refresh token:', error);
      return null;
    }
  },

  /**
   * Clear all tokens from localStorage
   */
  clearAll: (): boolean => {
    try {
      localStorage.removeItem(STORAGE_KEYS.accessToken);
      localStorage.removeItem(STORAGE_KEYS.refreshToken);
      localStorage.removeItem(STORAGE_KEYS.user);
      localStorage.removeItem(STORAGE_KEYS.isLoggedIn);
      return true;
    } catch (error) {
      console.error('Failed to clear tokens:', error);
      return false;
    }
  }
};

// Storage utility functions
export const storageUtils = {
  /**
   * Check if user is authenticated
   */
  isAuthenticated: (): boolean => {
    try {
      const isLoggedIn = localStorage.getItem(STORAGE_KEYS.isLoggedIn);
      const user = localStorage.getItem(STORAGE_KEYS.user);
      return !!(isLoggedIn === 'true' && user);
    } catch (error) {
      console.error('Failed to check authentication status:', error);
      return false;
    }
  },

  /**
   * Get all stored auth data
   */
  getAllAuthData: (): {
    user: User | null;
    isLoggedIn: boolean;
    accessToken: string | null;
    refreshToken: string | null;
  } => {
    return {
      user: userStorage.getUser(),
      isLoggedIn: storageUtils.isAuthenticated(),
      accessToken: tokenStorage.getAccessToken(),
      refreshToken: tokenStorage.getRefreshToken()
    };
  },

  /**
   * Clear all authentication data
   */
  clearAllAuthData: (): void => {
    userStorage.clearUser();
    tokenStorage.clearAll();
  },

  /**
   * Check if tokens are valid
   */
  hasValidTokens: (): boolean => {
    const accessToken = tokenStorage.getAccessToken();
    const refreshToken = tokenStorage.getRefreshToken();
    
    if (!accessToken || !refreshToken) {
      return false;
    }

    try {
      // Basic JWT token validation (check if it's not expired)
      const payload = JSON.parse(atob(accessToken.split('.')[1]));
      const currentTime = Date.now() / 1000;
      return payload.exp > currentTime;
    } catch {
      return false;
    }
  },

  /**
   * Get storage keys for debugging
   */
  getStorageKeys: (): StorageKeys => {
    return { ...STORAGE_KEYS };
  }
};
