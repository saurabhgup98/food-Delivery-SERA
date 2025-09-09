import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';

import { User, AuthTokens, AuthResponse } from '../types';

// Simple Authentication Service URL
const AUTH_API_BASE_URL = 'https://simple-auth-service.vercel.app/api';
const FOOD_DELIVERY_APP_URL = 'https://food-delivery-app-frontend.vercel.app';

interface AuthContextType {
  user: User | null;
  isLoginModalOpen: boolean;
  isSignupModalOpen: boolean;
  isLoading: boolean;
  openLoginModal: () => void;
  openSignupModal: () => void;
  closeLoginModal: () => void;
  closeSignupModal: () => void;
  switchToSignup: () => void;
  switchToLogin: () => void;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  register: (name: string, email: string, password: string) => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

// Helper function to make API calls to simple-auth service
const authApiCall = async (endpoint: string, options: RequestInit = {}) => {
  const accessToken = localStorage.getItem('accessToken');
  
  const config: RequestInit = {
    headers: {
      'Content-Type': 'application/json',
      ...(accessToken && { Authorization: `Bearer ${accessToken}` }),
      ...options.headers,
    },
    ...options,
  };

  try {
    const response = await fetch(`${AUTH_API_BASE_URL}${endpoint}`, config);
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.error || data.message || 'API request failed');
    }
    
    return data;
  } catch (error) {
    console.error('Auth API Error:', error);
    throw error;
  }
};

// Token management functions
const setTokens = (tokens: AuthTokens): void => {
  localStorage.setItem('accessToken', tokens.accessToken);
  localStorage.setItem('refreshToken', tokens.refreshToken);
};

const clearTokens = (): void => {
  localStorage.removeItem('accessToken');
  localStorage.removeItem('refreshToken');
  localStorage.removeItem('user');
};

const getAccessToken = (): string | null => {
  return localStorage.getItem('accessToken');
};

const getRefreshToken = (): string | null => {
  return localStorage.getItem('refreshToken');
};

// Auto-refresh token function
const refreshAccessToken = async (): Promise<boolean> => {
  const refreshToken = getRefreshToken();
  
  if (!refreshToken) {
    return false;
  }

  try {
    const response = await authApiCall('/auth/refresh', {
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

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isSignupModalOpen, setIsSignupModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Check for existing token on app load
  useEffect(() => {
    const checkAuth = async () => {
      const accessToken = getAccessToken();
      const userStr = localStorage.getItem('user');
      
      console.log('Checking auth on page load, token exists:', !!accessToken);
      
      if (accessToken && userStr) {
        try {
          // Try to get user profile to verify token
          console.log('Calling /user/profile to verify token...');
          const data = await authApiCall('/user/profile');
          console.log('Auth check response:', data);
          
          if (data.success && data.data.user) {
            const userData = data.data.user;
            
            // Extract role from appRegistered array for this app
            const appRegistration = userData.appRegistered?.find(app => 
              app.name === FOOD_DELIVERY_APP_URL
            );
            const userRole = appRegistration?.role || 'user';
            
            setUser({
              id: userData.id || userData._id || '',
              name: userData.name,
              email: userData.email,
              emailVerified: userData.emailVerified || false,
              appRegistered: userData.appRegistered || [],
              oauthProvider: userData.oauthProvider || 'local',
              role: userRole,
              appEndpoint: userData.appEndpoint || FOOD_DELIVERY_APP_URL,
            });
            console.log('User session restored successfully');
          }
        } catch (error) {
          console.error('Auth check failed:', error);
          // Try to refresh token
          const refreshed = await refreshAccessToken();
          if (!refreshed) {
            clearTokens();
            console.log('Tokens cleared due to auth failure');
          }
        }
      } else {
        console.log('No token or user found in localStorage');
        clearTokens();
      }
      setIsLoading(false);
    };

    checkAuth();
  }, []);

  // Auto-refresh token every 14 minutes
  useEffect(() => {
    const tokenRefreshInterval = setInterval(async () => {
      const accessToken = getAccessToken();
      if (accessToken) {
        try {
          await refreshAccessToken();
        } catch (error) {
          console.error('Auto token refresh failed:', error);
        }
      }
    }, 14 * 60 * 1000); // 14 minutes

    return () => clearInterval(tokenRefreshInterval);
  }, []);

  const openLoginModal = () => {
    setIsLoginModalOpen(true);
    setIsSignupModalOpen(false);
  };

  const openSignupModal = () => {
    setIsSignupModalOpen(true);
    setIsLoginModalOpen(false);
  };

  const closeLoginModal = () => {
    setIsLoginModalOpen(false);
  };

  const closeSignupModal = () => {
    setIsSignupModalOpen(false);
  };

  const switchToSignup = () => {
    setIsLoginModalOpen(false);
    setIsSignupModalOpen(true);
  };

  const switchToLogin = () => {
    setIsSignupModalOpen(false);
    setIsLoginModalOpen(true);
  };

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const data: AuthResponse = await authApiCall('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ 
          email, 
          password, 
          appEndpoint: FOOD_DELIVERY_APP_URL 
        }),
      });

      if (data.success && data.data.tokens) {
        // Store tokens
        setTokens(data.data.tokens);
        localStorage.setItem('user', JSON.stringify(data.data.user));
        
        // Extract role from appRegistered array for this app
        const appRegistration = data.data.user.appRegistered?.find(app => 
          app.name === FOOD_DELIVERY_APP_URL
        );
        const userRole = appRegistration?.role || 'user';
        
        // Set user
        setUser({
          id: data.data.user.id || data.data.user._id || '',
          name: data.data.user.name,
          email: data.data.user.email,
          emailVerified: data.data.user.emailVerified || false,
          appRegistered: data.data.user.appRegistered || [],
          oauthProvider: data.data.user.oauthProvider || 'local',
          role: userRole,
          appEndpoint: data.data.user.appEndpoint || FOOD_DELIVERY_APP_URL,
        });
        
        closeLoginModal();
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
      const refreshToken = getRefreshToken();
      if (refreshToken) {
        await authApiCall('/auth/logout', {
          method: 'POST',
          body: JSON.stringify({ refreshToken }),
        });
      }
    } catch (error) {
      console.error('Logout API call failed:', error);
    } finally {
      setUser(null);
      clearTokens();
    }
  };

  const register = async (name: string, email: string, password: string): Promise<boolean> => {
    try {
      const data: AuthResponse = await authApiCall('/auth/register', {
        method: 'POST',
        body: JSON.stringify({ 
          name, 
          email, 
          password, 
          appName: FOOD_DELIVERY_APP_URL,
          role: 'user'
        }),
      });

      if (data.success && data.data.tokens) {
        // Store tokens
        setTokens(data.data.tokens);
        localStorage.setItem('user', JSON.stringify(data.data.user));
        
        // Extract role from appRegistered array for this app
        const appRegistration = data.data.user.appRegistered?.find(app => 
          app.name === FOOD_DELIVERY_APP_URL
        );
        const userRole = appRegistration?.role || 'user';
        
        // Set user
        setUser({
          id: data.data.user.id || data.data.user._id || '',
          name: data.data.user.name,
          email: data.data.user.email,
          emailVerified: data.data.user.emailVerified || false,
          appRegistered: data.data.user.appRegistered || [],
          oauthProvider: data.data.user.oauthProvider || 'local',
          role: userRole,
          appEndpoint: data.data.user.appEndpoint || FOOD_DELIVERY_APP_URL,
        });
        
        closeSignupModal();
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
    isLoginModalOpen,
    isSignupModalOpen,
    openLoginModal,
    openSignupModal,
    closeLoginModal,
    closeSignupModal,
    switchToSignup,
    switchToLogin,
    login,
    logout,
    register,
    isLoading,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
