import React from 'react';
import { useModalManager } from '../../contexts/auth/modalManager';
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
  } = useModalManager();

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
