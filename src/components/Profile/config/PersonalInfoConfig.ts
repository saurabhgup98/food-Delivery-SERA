import { BtnConfig } from '../../../Style';
import { FormField } from '../../Form';
import {  AccountSecuritySectionI, PersonalInfoButtonI, PersonalInfoFormDataI, PersonalInfoSectionI, ProfilePicturePropsI } from '../ProfilePageInterfaces';

export const GENDER_OPTIONS = [
  { value: 'male', label: 'Male' },
  { value: 'female', label: 'Female' },
  { value: 'other', label: 'Other' },
  { value: 'prefer-not-to-say', label: 'Prefer not to say' }
];

export const COUNTRY_CODES = [
  { value: 'IN', label: 'India (+91)', flag: '🇮🇳' },
  { value: 'US', label: 'United States (+1)', flag: '🇺🇸' },
  { value: 'UK', label: 'United Kingdom (+44)', flag: '🇬🇧' },
  { value: 'CA', label: 'Canada (+1)', flag: '🇨🇦' },
  { value: 'AU', label: 'Australia (+61)', flag: '🇦🇺' },
  { value: 'DE', label: 'Germany (+49)', flag: '🇩🇪' },
  { value: 'FR', label: 'France (+33)', flag: '🇫🇷' },
  { value: 'JP', label: 'Japan (+81)', flag: '🇯🇵' }
];

export const getEditPersonalInfoBtn = (
  handleClickSave: () => void,
  handleClickCancel: () => void
): PersonalInfoButtonI[] => [
  {
    text: 'Save Changes',
    onClick: handleClickSave,
    variant: 'primary',
    size: 'md',
    className: 'w-full sm:w-auto px-3 sm:px-6 py-2'
  },
  {
    text: 'Cancel',
    onClick: handleClickCancel,
    variant: 'secondary',
    size: 'md',
    className: 'w-full sm:w-auto px-3 sm:px-6 py-2'
  }
];

export const getAccountSecuritySectionProps = (
  onPasswordChange: () => void,
  onTwoFactorToggle: () => void
): AccountSecuritySectionI => ({
  title: 'Account Security',
  description: 'Manage your account security settings',
  items: [
    {
      title: 'Password',
      description: 'Last changed 30 days ago',
      status: 'enabled',
      button: {
        text: 'Change',
        onClick: onPasswordChange,
        variant: 'secondary',
        size: 'sm',
        className: 'w-full sm:w-auto px-2 sm:px-4 py-1.5 sm:py-2'
      }
    },
    {
      title: 'Two-Factor Authentication',
      description: 'Add an extra layer of security',
      status: 'disabled',
      button: {
        text: 'Enable',
        onClick: onTwoFactorToggle,
        variant: 'secondary',
        size: 'sm',
        className: 'w-full sm:w-auto px-2 sm:px-4 py-1.5 sm:py-2'
      }
    }
  ]
});

export const getProfilePictureProps = (
  userInitial: string,
  isEditing: boolean,
  onPictureChange: () => void
): ProfilePicturePropsI => ({
  userInitial,
  isEditing,
  onPictureChange
});

export const getFormValidationErrors = (formData: PersonalInfoFormDataI): Record<string, string> => {
  const errors: Record<string, string> = {};
  
  if (!formData.name.trim()) {
    errors.name = 'Name is required';
  }
  
  if (!formData.email.trim()) {
    errors.email = 'Email is required';
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
    errors.email = 'Please enter a valid email address';
  }
  
  if (!formData.phone.trim()) {
    errors.phone = 'Phone number is required';
  } else if (!/^\d{10}$/.test(formData.phone.replace(/\D/g, ''))) {
    errors.phone = 'Please enter a valid 10-digit phone number';
  }
  
  if (!formData.dateOfBirth) {
    errors.dateOfBirth = 'Date of birth is required';
  } else {
    const birthDate = new Date(formData.dateOfBirth);
    const today = new Date();
    const age = today.getFullYear() - birthDate.getFullYear();
    
    if (age < 13) {
      errors.dateOfBirth = 'You must be at least 13 years old';
    } else if (age > 120) {
      errors.dateOfBirth = 'Please enter a valid date of birth';
    }
  }
  
  return errors;
};

export const getInitialFormData = (user: any): PersonalInfoFormDataI => ({
  name: user?.username || '',
  email: user?.email || '',
  phone: '',
  countryCode: 'IN',
  dateOfBirth: '',
  gender: ''
});

export const savePersonalInfoToLocalStorage = (formData: PersonalInfoFormDataI): void => {
  try {
    localStorage.setItem('personalInfo', JSON.stringify(formData));
  } catch (error) {
    console.error('Error saving personal info:', error);
  }
};

export const loadPersonalInfoFromLocalStorage = (user: any): PersonalInfoFormDataI => {
  try {
    const saved = localStorage.getItem('personalInfo');
    if (saved) {
      const parsed = JSON.parse(saved);
      return {
        ...parsed,
        name: parsed.name || user?.username || '',
        email: parsed.email || user?.email || ''
      };
    }
  } catch (error) {
    console.error('Error loading personal info:', error);
  }
  
  return getInitialFormData(user);
};

export const getFormFieldsConfig = (
  formData: PersonalInfoFormDataI,
  setFormData: React.Dispatch<React.SetStateAction<PersonalInfoFormDataI>>,
  isEditing: boolean
): FormField[] => [
  {
    id: 'name',
    type: 'text',
    label: 'Full Name',
    placeholder: 'Enter your full name',
    value: formData.name,
    onChange: (value) => setFormData(prev => ({ ...prev, name: value as string })),
    disabled: !isEditing
  },
  {
    id: 'email',
    type: 'email',
    label: 'Email Address',
    placeholder: 'Enter your email',
    value: formData.email,
    onChange: (value) => setFormData(prev => ({ ...prev, email: value as string })),
    disabled: !isEditing
  },
  {
    id: 'phone',
    type: 'phone',
    label: 'Phone Number',
    placeholder: 'Enter your phone number',
    value: formData.phone,
    onChange: (value) => setFormData(prev => ({ ...prev, phone: value as string })),
    disabled: !isEditing,
    countryCode: formData.countryCode,
    onCountryCodeChange: (value) => setFormData(prev => ({ ...prev, countryCode: value }))
  },
  {
    id: 'dateOfBirth',
    type: 'date',
    label: 'Date of Birth',
    placeholder: 'Select your date of birth',
    value: formData.dateOfBirth,
    onChange: (value) => setFormData(prev => ({ ...prev, dateOfBirth: value as string })),
    disabled: !isEditing
  },
  {
    id: 'gender',
    type: 'dropdown',
    label: 'Gender',
    placeholder: 'Select gender',
    value: formData.gender,
    onChange: (value) => setFormData(prev => ({ ...prev, gender: value as string })),
    disabled: !isEditing,
    options: GENDER_OPTIONS
  }
];

export const getButtonProps = (button: PersonalInfoButtonI) => {
  const baseProps = {
    onClick: button.onClick,
    text: button.text,
    size: button.size,
    disabled: button.disabled,
    loading: button.loading,
    className: button.className
  };

  switch (button.variant) {
    case 'primary':
      return { ...baseProps, ...BtnConfig.Primary };
    case 'secondary':
      return { ...baseProps, ...BtnConfig.Secondary };
    case 'outline':
      return { ...baseProps, ...BtnConfig.Transparent };
    default:
      return baseProps;
  }
};