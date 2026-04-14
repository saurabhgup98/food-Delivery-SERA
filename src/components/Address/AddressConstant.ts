/**
 * Initial form data structure for address forms
 */
export const INITIAL_ADDRESS_FORM_DATA = {
  label: '',
  fullName: '',
  phone: '',
  address: '',
  city: '',
  state: '',
  pincode: '',
  country: 'IN', // Default to India
  isDefault: false,
  instructions: ''
};

// Alias for backward compatibility with useAddressManagement hook
export const INITIAL_FORM_DATA = INITIAL_ADDRESS_FORM_DATA;
