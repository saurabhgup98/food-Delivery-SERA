import React from 'react';
import { useAuth } from '../../contexts/AuthContext';
import AuthForm from './AuthForm';
import { AUTH_FORM_CONFIG } from './config/formConfig';

const AuthModals: React.FC = () => {
  const {
    isLoginModalOpen,
    isSignupModalOpen,
    closeLoginModal,
    closeSignupModal,
    login,
    register,
    isLoading,
    error,
    clearError,
    switchToSignup,
    switchToLogin
  } = useAuth();

  const handleLoginSubmit = async (data: any) => {
    try {
      await login({
        email: data.email,
        password: data.password,
        appEndpoint: window.location.origin,
      });
    } catch (error) {
      console.error('Login error:', error);
    }
  };

  const handleSignupSubmit = async (data: any) => {
    try {
      await register({
        username: data.name,
        email: data.email,
        password: data.password,
        appEndpoint: window.location.origin,
        role: 'user',
      });
    } catch (error) {
      console.error('Signup error:', error);
    }
  };

  const handleLoginToSignupSwitch = () => {
    clearError();
    switchToSignup();
  };

  const handleSignupToLoginSwitch = () => {
    clearError();
    switchToLogin();
  };

  return (
    <>
      {isLoginModalOpen && (
        <AuthForm
          isOpen={isLoginModalOpen} 
          onClose={closeLoginModal}
          mode="login"
          config={AUTH_FORM_CONFIG.login}
          onSubmit={handleLoginSubmit}
          onModeSwitch={handleLoginToSignupSwitch}
          isLoading={isLoading}
          error={error}
        />
      )}
      {isSignupModalOpen && (
        <AuthForm
          isOpen={isSignupModalOpen}
          onClose={closeSignupModal}
          mode="signup"
          config={AUTH_FORM_CONFIG.signup}
          onSubmit={handleSignupSubmit}
          onModeSwitch={handleSignupToLoginSwitch}
          isLoading={isLoading}
          error={error}
        />
      )}
    </>
  );
};

export default AuthModals;
