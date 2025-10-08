import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { authApi } from '../services/api/index';
import { User, LoginRequest, RegisterRequest, AuthResponse } from '../services/api/types';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (credentials: LoginRequest) => Promise<AuthResponse>;
  register: (userData: RegisterRequest) => Promise<AuthResponse>;
  logout: () => Promise<void>;
  error: string | null;
  clearError: () => void;
  // Modal management
  isLoginModalOpen: boolean;
  isSignupModalOpen: boolean;
  openLoginModal: () => void;
  openSignupModal: () => void;
  closeLoginModal: () => void;
  closeSignupModal: () => void;
  switchToSignup: () => void;
  switchToLogin: () => void;
}

interface AuthProviderProps {
  children: ReactNode;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Modal state
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isSignupModalOpen, setIsSignupModalOpen] = useState(false);

  // Initialize authentication state
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const isAuth = authApi.isAuthenticated();
        const currentUser = authApi.getCurrentUser();

        if (isAuth && currentUser) {
          setUser(currentUser);
        }
      } catch (error) {
        console.error("Auth initialization error:", error);
        // Clear invalid tokens
        authApi.logout();
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();
  }, []);

  const login = async (credentials: LoginRequest): Promise<AuthResponse> => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await authApi.login(credentials);

      if (response.success && response.data.user) {
        // Create user object with role information from response
        const userWithRole = {
          ...response.data.user,
          role: response.data.role,
          availableRoles: response.data.availableRoles,
          appIdentifier: response.data.appIdentifier,
          authMethod: response.data.authMethod
        };
        setUser(userWithRole);
        localStorage.setItem("isLoggedIn", "true");
        // Close login modal on successful login
        setIsLoginModalOpen(false);
      }

      return response;
    } catch (error: any) {
      // Handle different types of errors
      let errorMessage = "Login failed";
      
      if (error?.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error?.message) {
        errorMessage = error.message;
      } else if (typeof error === 'string') {
        errorMessage = error;
      }
      
      setError(errorMessage);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (userData: RegisterRequest): Promise<AuthResponse> => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await authApi.register(userData);

      if (response.success && response.data.user) {
        // Create user object with role information from response
        const userWithRole = {
          ...response.data.user,
          role: response.data.role,
          availableRoles: response.data.availableRoles,
          appIdentifier: response.data.appIdentifier,
          authMethod: response.data.authMethod
        };
        setUser(userWithRole);
        localStorage.setItem("isLoggedIn", "true");
        // Close signup modal on successful registration
        setIsSignupModalOpen(false);
      }

      return response;
    } catch (error: any) {
      // Handle different types of errors
      let errorMessage = "Registration failed";
      
      if (error?.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error?.message) {
        errorMessage = error.message;
      } else if (typeof error === 'string') {
        errorMessage = error;
      }
      
      setError(errorMessage);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async (): Promise<void> => {
    try {
      setIsLoading(true);
      await authApi.logout();
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      handleLogout();
    }
  };

  const handleLogout = (): void => {
    setUser(null);
    localStorage.removeItem("isLoggedIn");
    setIsLoading(false);
  };

  const clearError = (): void => {
    setError(null);
  };


  // Modal management functions
  const openLoginModal = useCallback(() => {
    setIsLoginModalOpen(true);
    setIsSignupModalOpen(false);
  }, []);

  const openSignupModal = useCallback(() => {
    setIsSignupModalOpen(true);
    setIsLoginModalOpen(false);
  }, []);

  const closeLoginModal = useCallback(() => {
    setIsLoginModalOpen(false);
  }, []);

  const closeSignupModal = useCallback(() => {
    setIsSignupModalOpen(false);
  }, []);

  const switchToSignup = useCallback(() => {
    setIsLoginModalOpen(false);
    setIsSignupModalOpen(true);
  }, []);

  const switchToLogin = useCallback(() => {
    setIsSignupModalOpen(false);
    setIsLoginModalOpen(true);
  }, []);

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    register,
    logout,
    error,
    clearError,
    // Modal management
    isLoginModalOpen,
    isSignupModalOpen,
    openLoginModal,
    openSignupModal,
    closeLoginModal,
    closeSignupModal,
    switchToSignup,
    switchToLogin,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
