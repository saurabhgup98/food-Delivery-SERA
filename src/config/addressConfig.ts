import { INITIAL_ADDRESS_FORM_DATA, INITIAL_FORM_DATA } from '../components/Address/AddressConstant';
import { DropdownOptionI } from '../components/Dropdown/PrimaryDropdown';
import { Address } from '../services/api';

// Export INITIAL_FORM_DATA for backward compatibility
export { INITIAL_FORM_DATA };

export const createFormDataFromAddress = (address: Address) => ({
  label: address.type, // Map type to label for form
  fullName: address.name, // Map name to fullName for form
  phone: address.phone || '', // Map phone field
  address: address.address,
  country: address.country,
  state: address.state,
  city: address.city,
  pincode: address.pincode,
  isDefault: address.isDefault,
  instructions: address.instructions || ''
});

// Transform form data to Address type for API calls
export const transformFormDataToAddress = (formData: typeof INITIAL_ADDRESS_FORM_DATA) => ({
  type: formData.label as 'home' | 'work' | 'other',
  name: formData.fullName,
  phone: formData.phone,
  address: formData.address,
  city: formData.city,
  state: formData.state,
  pincode: formData.pincode,
  country: formData.country,
  isDefault: formData.isDefault,
  instructions: formData.instructions
});

// Function to reset form data to initial state
export const resetFormData = () => ({ ...INITIAL_ADDRESS_FORM_DATA });

export const FORM_FIELD_ORDER = [
  'label',
  'fullName',
  'phone',
  'address',
  'country',
  'state',
  'city',
  'pincode',
  'instructions'
];

// Success messages
export const SUCCESS_MESSAGES = {
  ADDRESS_ADDED: 'Address added successfully!',
  ADDRESS_UPDATED: 'Address updated successfully!',
  ADDRESS_DELETED: 'Address deleted successfully!',
  DEFAULT_SET: 'Default address updated successfully!'
};

// Error messages
export const ERROR_MESSAGES = {
  FETCH_FAILED: 'Failed to fetch addresses',
  CREATE_FAILED: 'Failed to create address',
  UPDATE_FAILED: 'Failed to update address',
  DELETE_FAILED: 'Failed to delete address',
  SET_DEFAULT_FAILED: 'Failed to set default address'
};