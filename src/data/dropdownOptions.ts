export interface DropdownOption {
  value: string;
  label: string;
  icon?: string;
}

// Gender options
export const genderOptions: DropdownOption[] = [
  { value: '', label: 'Select gender', icon: '👤' },
  { value: 'male', label: 'Male', icon: '👨' },
  { value: 'female', label: 'Female', icon: '👩' },
  { value: 'other', label: 'Other', icon: '🌈' },
  { value: 'prefer-not-to-say', label: 'Prefer not to say', icon: '🤐' }
];

// Address label options
export const addressLabelOptions: DropdownOption[] = [
  { value: '', label: 'Select label', icon: '🏠' },
  { value: 'home', label: 'Home', icon: '🏠' },
  { value: 'work', label: 'Work', icon: '💼' },
  { value: 'other', label: 'Other', icon: '📍' }
];

// Payment type options
export const paymentTypeOptions: DropdownOption[] = [
  { value: '', label: 'Select payment type', icon: '💳' },
  { value: 'credit-card', label: 'Credit Card', icon: '💳' },
  { value: 'debit-card', label: 'Debit Card', icon: '💳' },
  { value: 'upi', label: 'UPI', icon: '📱' },
  { value: 'net-banking', label: 'Net Banking', icon: '🏦' },
  { value: 'wallet', label: 'Digital Wallet', icon: '👛' }
];

// Wallet type options
export const walletTypeOptions: DropdownOption[] = [
  { value: '', label: 'Select wallet', icon: '👛' },
  { value: 'paytm', label: 'Paytm', icon: '📱' },
  { value: 'phonepe', label: 'PhonePe', icon: '📱' },
  { value: 'google-pay', label: 'Google Pay', icon: '📱' },
  { value: 'amazon-pay', label: 'Amazon Pay', icon: '📦' },
  { value: 'other', label: 'Other', icon: '👛' }
];
