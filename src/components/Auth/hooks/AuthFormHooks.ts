import { useCallback, useState } from 'react';
import { useAuth } from '../../../contexts/AuthContext';
import { LoginRequest, RegisterRequest } from '../../../services/api/types';
import { API_BASE_URL } from '../../../services/api/constants';

/**
 * Custom hook for OAuth authentication
 */
export const useOAuthAuth = () => {
  const handleOAuthLogin = useCallback((provider: 'google' | 'facebook' | 'github', role?: string) => {
    const appEndpoint = window.location.origin;
    
    // Add appEndpoint and role as query parameters
    const params = new URLSearchParams({
      appEndpoint: appEndpoint
    });
    
    if (role) {
      params.append('role', role);
    }
    
    const authUrl = provider === 'google' 
      ? `${API_BASE_URL}/api/oauth/google?${params.toString()}`
      : provider === 'facebook'
      ? `${API_BASE_URL}/api/oauth/facebook?${params.toString()}`
      : `${API_BASE_URL}/api/oauth/github?${params.toString()}`;
    
    window.location.href = authUrl;
  }, []);

  return {
    handleOAuthLogin,
  };
};

/**
 * Custom hook for authentication form submission
 */
export const useAuthFormSubmission = (mode: 'login' | 'register') => {
  const { login, register, isLoading, error, clearError } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const submitForm = useCallback(async (formData: any, onSuccess?: () => void) => {
    setIsSubmitting(true);
    clearError();

    try {
      if (mode === 'login') {
        const loginData: LoginRequest = {
          email: formData.email,
          password: formData.password,
          appEndpoint: window.location.origin,
        };
        await login(loginData);
      } else {
        const registerData: RegisterRequest = {
          email: formData.email,
          password: formData.password,
          appEndpoint: window.location.origin,
          role: 'user',
        };
        await register(registerData);
      }

      // Success callback
      if (onSuccess) {
        onSuccess();
      }
    } catch (error: any) {
      console.error('Form submission error:', error);
      throw error;
    } finally {
      setIsSubmitting(false);
    }
  }, [mode, login, register, clearError]);

  return {
    submitForm,
    isSubmitting: isSubmitting || isLoading,
    error,
    clearError,
  };
};
