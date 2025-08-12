import React, { createContext, useContext, useState, ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { User } from '../types';

interface AuthContextType {
  user: User | null;
  isLoginModalOpen: boolean;
  isSignupModalOpen: boolean;
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

// Test user data
const testUser: User = {
  id: '1',
  name: 'John Doe',
  email: 'john@example.com',
  role: 'customer',
  phone: '+1234567890',
  avatar: undefined
};

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isSignupModalOpen, setIsSignupModalOpen] = useState(false);

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
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Test credentials
    if (email === 'john@example.com' && password === 'password123') {
      setUser(testUser);
      closeLoginModal();
      return true;
    }
    
    // For demo purposes, also allow login with any email/password
    if (email && password) {
      const demoUser: User = {
        id: '2',
        name: email.split('@')[0], // Use email prefix as name
        email: email,
        role: 'customer',
        phone: undefined,
        avatar: undefined
      };
      setUser(demoUser);
      closeLoginModal();
      return true;
    }
    
    return false;
  };

  const logout = () => {
    setUser(null);
    // Note: Navigation will be handled in the Header component
  };

  const register = async (name: string, email: string, password: string): Promise<boolean> => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Create new user
    const newUser: User = {
      id: Date.now().toString(),
      name: name,
      email: email,
      role: 'customer',
      phone: undefined,
      avatar: undefined
    };
    
    setUser(newUser);
    closeSignupModal();
    return true;
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
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
