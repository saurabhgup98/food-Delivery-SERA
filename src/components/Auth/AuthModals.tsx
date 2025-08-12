import React from 'react';
import { useAuth } from '../../contexts/AuthContext';
import LoginForm from './LoginForm';
import SignupForm from './SignupForm';

const AuthModals: React.FC = () => {
  const {
    isLoginModalOpen,
    isSignupModalOpen,
    closeLoginModal,
    closeSignupModal,
    switchToSignup,
    switchToLogin,
  } = useAuth();

  return (
    <>
      <LoginForm
        isOpen={isLoginModalOpen}
        onClose={closeLoginModal}
        onSwitchToSignup={switchToSignup}
      />
      <SignupForm
        isOpen={isSignupModalOpen}
        onClose={closeSignupModal}
        onSwitchToLogin={switchToLogin}
      />
    </>
  );
};

export default AuthModals;
