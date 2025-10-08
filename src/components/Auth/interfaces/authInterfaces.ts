import React from 'react';
import { PrimaryInputProps } from '../../Common/PrimaryInput';

// Form Input Interface
export interface FormInput extends Omit<PrimaryInputProps, 'value' | 'onChange'> {
  name: string;
}

export interface FormHeader {
  title: string;
  description: string;
  gradientClass: string;
}

export interface FormButton {
  text: string;
  loading: string;
}

export interface FormConfig {
  header: FormHeader;
  inputs: FormInput[];
  button: FormButton;
  initialState: Record<string, string>;
}

export interface AuthFormProps {
  isOpen: boolean;
  onClose: () => void;
  mode: 'login' | 'signup';
  config: FormConfig;
  onSubmit: (data: any) => void;
  onModeSwitch: () => void;
  isLoading: boolean;
  error: string | null;
}

export interface AuthHeaderProps {
  title: string;
  description: string;
  gradientClass: string;
  onClose: () => void;
}

export interface FormModeSwitchProps {
  mode: 'login' | 'signup';
  onSwitch: () => void;
  config: {
    login: {
      question: string;
      actionText: string;
      actionColor: string;
    };
    signup: {
      question: string;
      actionText: string;
      actionColor: string;
    };
  };
}

export interface FormDividerProps {
  text?: string;
  className?: string;
  lineClassName?: string;
  textClassName?: string;
}

export interface OAuthSectionProps {
  disabled?: boolean;
}

export interface OAuthProviderProps {
  provider: OAuthProviderConfig;
  disabled?: boolean;
  className?: string;
}

export interface OAuthProviderConfig {
  id: string;
  name: string;
  label: string;
  icon: string;
  redirectUrl: string;
  className: string;
  hoverClassName: string;
}