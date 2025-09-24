import React, { createContext, useContext, useState, useEffect } from 'react';
import { AuthContextType, AuthProviderProps, User } from './types';
import { useModalManager } from './auth/modalManager';
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

  // Check for existing user on app load
  useEffect(() => {
    const checkAuth = async () => {
      console.log('Checking auth on page load...');
      
      try {
        const result = await checkAuthentication();
        if (result.success && result.user) {
          setUser(result.user);
          console.log('User session restored successfully');
        } else {
          console.log('No user session found');
        }
      } catch (error) {
        console.error('Auth check failed:', error);
      }
      
      setIsLoading(false);
    };

    checkAuth();
  }, []);

  // No token refresh needed in new system

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
