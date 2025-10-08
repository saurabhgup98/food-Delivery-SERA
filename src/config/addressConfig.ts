import { Address } from '../services/api';
import { addressLabelOptions } from '../data/dropdownOptions';

export const INITIAL_FORM_DATA = {
  label: '',
  fullName: '',
  phone: '',
  address: '',
  country: 'IN',
  state: '',
  city: '',
  pincode: '',
  isDefault: false,
  instructions: ''
};

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
export const transformFormDataToAddress = (formData: typeof INITIAL_FORM_DATA) => ({
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
export const resetFormData = () => ({ ...INITIAL_FORM_DATA });

// Enhanced form field configurations with component types
export const FORM_FIELD_CONFIGS: Record<string, any> = {
  label: {
    component: 'PrimaryDropdown',
    label: 'Address Label',
    placeholder: 'Select label',
    required: true,
    options: addressLabelOptions,
    fieldName: 'label'
  },
  fullName: {
    component: 'PrimaryInput',
    label: 'Full Name',
    placeholder: 'Enter full name',
    required: true,
    type: 'text',
    fieldName: 'fullName'
  },
  phone: {
    component: 'PrimaryInput',
    label: 'Phone Number',
    placeholder: 'Enter phone number',
    required: true,
    type: 'tel',
    fieldName: 'phone'
  },
  address: {
    component: 'PrimaryInput',
    label: 'Street Address',
    placeholder: 'Enter street address',
    required: true,
    type: 'text',
    fieldName: 'address'
  },
  country: {
    component: 'LocationDropdown',
    label: 'Country',
    placeholder: 'Select country',
    required: true,
    locationType: 'country',
    fieldName: 'country',
    resetFields: ['state', 'city'] // Fields to reset when this changes
  },
  state: {
    component: 'LocationDropdown',
    label: 'State',
    placeholder: 'Select state',
    required: true,
    locationType: 'state',
    fieldName: 'state',
    dependsOn: 'country', // This field depends on country
    resetFields: ['city'] // Fields to reset when this changes
  },
  city: {
    component: 'LocationDropdown',
    label: 'City',
    placeholder: 'Select city',
    required: true,
    locationType: 'city',
    fieldName: 'city',
    dependsOn: ['country', 'state'] // This field depends on both country and state
  },
  pincode: {
    component: 'PrimaryInput',
    label: 'Pincode',
    placeholder: 'Enter pincode',
    required: true,
    type: 'text',
    fieldName: 'pincode'
  },
  instructions: {
    component: 'textarea',
    label: 'Delivery Instructions (Optional)',
    placeholder: 'Any special instructions for delivery...',
    required: false,
    rows: 3,
    fieldName: 'instructions'
  }
};

// Field rendering order
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