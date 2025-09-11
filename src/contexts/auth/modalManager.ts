// Modal state management utilities

import { useState, useCallback } from 'react';

export interface ModalState {
  isLoginModalOpen: boolean;
  isSignupModalOpen: boolean;
}

export interface ModalActions {
  openLoginModal: () => void;
  openSignupModal: () => void;
  closeLoginModal: () => void;
  closeSignupModal: () => void;
  switchToSignup: () => void;
  switchToLogin: () => void;
  closeAllModals: () => void;
}

/**
 * Custom hook for managing authentication modals
 */
export const useModalManager = (): ModalState & ModalActions => {
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isSignupModalOpen, setIsSignupModalOpen] = useState(false);

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

  const closeAllModals = useCallback(() => {
    setIsLoginModalOpen(false);
    setIsSignupModalOpen(false);
  }, []);

  return {
    isLoginModalOpen,
    isSignupModalOpen,
    openLoginModal,
    openSignupModal,
    closeLoginModal,
    closeSignupModal,
    switchToSignup,
    switchToLogin,
    closeAllModals,
  };
};
