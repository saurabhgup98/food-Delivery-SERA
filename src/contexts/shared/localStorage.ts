// Shared localStorage utilities

/**
 * Safe localStorage operations with error handling
 */
export const storage = {
  /**
   * Set item in localStorage with error handling
   */
  set: (key: string, value: any): boolean => {
    try {
      const serializedValue = typeof value === 'string' ? value : JSON.stringify(value);
      localStorage.setItem(key, serializedValue);
      return true;
    } catch (error) {
      console.error(`Error setting localStorage item ${key}:`, error);
      return false;
    }
  },

  /**
   * Get item from localStorage with error handling
   */
  get: <T = any>(key: string, defaultValue: T | null = null): T | null => {
    try {
      const item = localStorage.getItem(key);
      if (item === null) return defaultValue;
      
      // Try to parse as JSON, fallback to string
      try {
        return JSON.parse(item);
      } catch {
        return item as T;
      }
    } catch (error) {
      console.error(`Error getting localStorage item ${key}:`, error);
      return defaultValue;
    }
  },

  /**
   * Remove item from localStorage
   */
  remove: (key: string): boolean => {
    try {
      localStorage.removeItem(key);
      return true;
    } catch (error) {
      console.error(`Error removing localStorage item ${key}:`, error);
      return false;
    }
  },

  /**
   * Clear all localStorage items
   */
  clear: (): boolean => {
    try {
      localStorage.clear();
      return true;
    } catch (error) {
      console.error('Error clearing localStorage:', error);
      return false;
    }
  },

  /**
   * Check if localStorage is available
   */
  isAvailable: (): boolean => {
    try {
      const testKey = '__localStorage_test__';
      localStorage.setItem(testKey, 'test');
      localStorage.removeItem(testKey);
      return true;
    } catch {
      return false;
    }
  }
};

/**
 * Token-specific localStorage operations
 */
export const tokenStorage = {
  setTokens: (accessToken: string, refreshToken: string): boolean => {
    return storage.set('accessToken', accessToken) && storage.set('refreshToken', refreshToken);
  },

  getAccessToken: (): string | null => {
    return storage.get<string>('accessToken');
  },

  getRefreshToken: (): string | null => {
    return storage.get<string>('refreshToken');
  },

  clearTokens: (): boolean => {
    return storage.remove('accessToken') && storage.remove('refreshToken');
  },

  clearAll: (): boolean => {
    return storage.remove('accessToken') && 
           storage.remove('refreshToken') && 
           storage.remove('user');
  }
};

/**
 * User-specific localStorage operations
 */
export const userStorage = {
  setUser: (user: any): boolean => {
    return storage.set('user', user);
  },

  getUser: <T = any>(): T | null => {
    return storage.get<T>('user');
  },

  clearUser: (): boolean => {
    return storage.remove('user');
  }
};
