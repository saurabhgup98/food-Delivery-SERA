import React, { createContext, useContext, useState, useEffect } from 'react';
import { AuthContextType, AuthProviderProps, User } from './types';
import { useModalManager } from './auth/modalManager';
import * as tokenManager from './auth/tokenManager';
import { loginUser, registerUser, logoutUser, checkAuthentication } from './auth/authService';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  // Use modal manager hook
  const modalManager = useModalManager();

  // Check for existing token on app load
  useEffect(() => {
    const checkAuth = async () => {
      console.log('Checking auth on page load...');
      
      try {
        const result = await checkAuthentication();
        if (result.success && result.user) {
          setUser(result.user);
          console.log('User session restored successfully');
        } else {
          // Try to refresh token if authentication check failed
          const refreshed = await tokenManager.autoRefreshToken();
          if (!refreshed) {
            tokenManager.clearTokens();
            console.log('Tokens cleared due to auth failure');
          }
        }
      } catch (error) {
        console.error('Auth check failed:', error);
        tokenManager.clearTokens();
      }
      
      setIsLoading(false);
    };

    checkAuth();
  }, []);

  // Auto-refresh token every 14 minutes
  useEffect(() => {
    const tokenRefreshInterval = setInterval(async () => {
      const accessToken = tokenManager.getAccessToken();
      if (accessToken) {
        try {
          await tokenManager.autoRefreshToken();
        } catch (error) {
          console.error('Auto token refresh failed:', error);
        }
      }
    }, 14 * 60 * 1000); // 14 minutes

    return () => clearInterval(tokenRefreshInterval);
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const result = await loginUser(email, password);
      if (result.success && result.user) {
        setUser(result.user);
        modalManager.closeLoginModal();
        return true;
      }
      return false;
    } catch (error) {
      console.error('Login failed:', error);
      return false;
    }
  };

  const logout = async () => {
    try {
      await logoutUser();
      setUser(null);
    } catch (error) {
      console.error('Logout failed:', error);
      // Still clear user state even if logout API fails
      setUser(null);
    }
  };

  const register = async (name: string, email: string, password: string): Promise<boolean> => {
    try {
      const result = await registerUser(name, email, password);
      if (result.success && result.user) {
        setUser(result.user);
        modalManager.closeSignupModal();
        return true;
      }
      return false;
    } catch (error) {
      console.error('Registration failed:', error);
      return false;
    }
  };

  const value = {
    user,
    isLoading,
    ...modalManager,
    login,
    logout,
    register,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
