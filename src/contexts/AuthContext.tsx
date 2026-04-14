import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { loginUser, registerUser, logoutUser, getUserProfile, checkAuthentication } from './auth/authService';
import { User, LoginCredentials, RegisterCredentials, AuthResponse } from '../components/Auth/authInterfaces';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (credentials: LoginCredentials) => Promise<AuthResponse>;
  register: (userData: RegisterCredentials) => Promise<AuthResponse>;
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
        const response = await checkAuthentication();

        if (response.success && response.data) {
          setUser(response.data);
        }
      } catch (error) {
        console.error("Auth initialization error:", error);
        // Clear invalid tokens
        await logoutUser();
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();
  }, []);

  const login = async (credentials: LoginCredentials): Promise<AuthResponse> => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await loginUser(credentials);

      if (response.success && response.data) {
        setUser(response.data);
        localStorage.setItem("isLoggedIn", "true");
        // Close login modal on successful login
        setIsLoginModalOpen(false);
        
        // Return AuthResponse format for compatibility
        return {
          success: true,
          message: "Login successful",
          data: {
            user: response.data,
            role: response.data.role,
            availableRoles: response.data.availableRoles,
            appIdentifier: response.data.appIdentifier,
            authMethod: response.data.authMethod
          }
        };
      }

      throw new Error(response.error || 'Login failed');
    } catch (error: any) {
      // Handle different types of errors with specific user-friendly messages
      let errorMessage = "Login failed";
      
      // Get the actual error message from the response
      const serverMessage = error?.response?.data?.message || error?.message || error;
      
      // Map server messages to user-friendly messages
      if (serverMessage.includes('Invalid email or password') || serverMessage.includes('Invalid credentials')) {
        errorMessage = "Invalid email or password. Please check your credentials and try again.";
      } else if (serverMessage.includes('Account is deactivated')) {
        errorMessage = "Your account has been deactivated. Please contact support for assistance.";
      } else if (serverMessage.includes('Email and password are required')) {
        errorMessage = "Please enter both email and password.";
      } else if (serverMessage.includes('User not found')) {
        errorMessage = "No account found with this email address. Please check your email or sign up for a new account.";
      } else if (serverMessage.includes('Too many requests') || serverMessage.includes('Too many authentication attempts')) {
        errorMessage = "Too many login attempts. Please wait 15 minutes before trying again.";
      } else if (serverMessage.includes('Token expired')) {
        errorMessage = "Your session has expired. Please log in again.";
      } else if (serverMessage.includes('Invalid token')) {
        errorMessage = "Invalid session. Please log in again.";
      } else if (serverMessage.includes('Network error') || serverMessage.includes('Failed to fetch')) {
        errorMessage = "Network connection error. Please check your internet connection and try again.";
      } else if (serverMessage.includes('Server error') || serverMessage.includes('Internal server error')) {
        errorMessage = "Server error. Please try again later or contact support if the problem persists.";
      } else if (typeof serverMessage === 'string' && serverMessage.trim()) {
        // Use the server message if it's a meaningful string
        errorMessage = serverMessage;
      } else {
        errorMessage = "Login failed. Please check your credentials and try again.";
      }
      
      setError(errorMessage);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (userData: RegisterCredentials): Promise<AuthResponse> => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await registerUser(userData);

      if (response.success && response.data) {
        setUser(response.data);
        localStorage.setItem("isLoggedIn", "true");
        // Close signup modal on successful registration
        setIsSignupModalOpen(false);
        
        // Return AuthResponse format for compatibility
        return {
          success: true,
          message: "Registration successful",
          data: {
            user: response.data,
            role: response.data.role,
            availableRoles: response.data.availableRoles,
            appIdentifier: response.data.appIdentifier,
            authMethod: response.data.authMethod
          }
        };
      }

      throw new Error(response.error || 'Registration failed');
    } catch (error: any) {
      // Handle different types of errors with specific user-friendly messages
      let errorMessage = "Registration failed";
      
      // Get the actual error message from the response
      const serverMessage = error?.response?.data?.message || error?.message || error;
      
      // Map server messages to user-friendly messages
      if (serverMessage.includes('Email already exists') || serverMessage.includes('email already exists')) {
        errorMessage = "An account with this email already exists. Please use a different email or try logging in.";
      } else if (serverMessage.includes('Password too weak') || serverMessage.includes('Password does not meet requirements')) {
        errorMessage = "Password is too weak. Please use at least 8 characters with a mix of letters, numbers, and symbols.";
      } else if (serverMessage.includes('Invalid email format') || serverMessage.includes('Invalid email')) {
        errorMessage = "Please enter a valid email address.";
      } else if (serverMessage.includes('Name is required') || serverMessage.includes('Name required')) {
        errorMessage = "Please enter your full name.";
      } else if (serverMessage.includes('Phone number already exists') || serverMessage.includes('phone already exists')) {
        errorMessage = "An account with this phone number already exists. Please use a different phone number.";
      } else if (serverMessage.includes('Validation failed') || serverMessage.includes('validation error')) {
        errorMessage = "Please fill in all required fields correctly.";
      } else if (serverMessage.includes('Network error') || serverMessage.includes('Failed to fetch')) {
        errorMessage = "Network connection error. Please check your internet connection and try again.";
      } else if (serverMessage.includes('Server error') || serverMessage.includes('Internal server error')) {
        errorMessage = "Server error. Please try again later or contact support if the problem persists.";
      } else if (typeof serverMessage === 'string' && serverMessage.trim()) {
        // Use the server message if it's a meaningful string
        errorMessage = serverMessage;
      } else {
        errorMessage = "Registration failed. Please check your information and try again.";
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
      await logoutUser();
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
