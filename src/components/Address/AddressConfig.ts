import React from 'react';
import { FormField } from '../Form';
import { INITIAL_ADDRESS_FORM_DATA } from './AddressConstant';
import { AddressFormDataI } from './AddressInterfaces';

// Export type alias for convenience
export type AddressFormData = AddressFormDataI;

export const getAddressFormFieldsConfig = (
  formData: AddressFormDataI,
  setFormData: React.Dispatch<React.SetStateAction<AddressFormDataI>>
): FormField[] => [
  {
    id: 'label',
    type: 'dropdown',
    label: 'Address Label',
    placeholder: 'Select a label',
    value: formData.label,
    onChange: (value) => setFormData(prev => ({ ...prev, label: value as string })),
    disabled: false,
    options: [
      { value: '', label: 'Select a label' },
      { value: 'Home', label: 'Home' },
      { value: 'Office', label: 'Office' },
      { value: 'Other', label: 'Other' }
    ]
  },
  {
    id: 'fullName',
    type: 'text',
    label: 'Full Name',
    placeholder: 'Enter full name',
    value: formData.fullName,
    onChange: (value) => setFormData(prev => ({ ...prev, fullName: value as string })),
    disabled: false
  },
  {
    id: 'phone',
    type: 'phone',
    label: 'Phone Number',
    placeholder: 'Enter phone number',
    value: formData.phone,
    onChange: (value) => setFormData(prev => ({ ...prev, phone: value as string })),
    disabled: false,
    countryCode: 'IN',
    onCountryCodeChange: () => {} // Country code is fixed to IN for now
  },
  {
    id: 'address',
    type: 'text',
    label: 'Address',
    placeholder: 'Enter street address',
    value: formData.address,
    onChange: (value) => setFormData(prev => ({ ...prev, address: value as string })),
    disabled: false
  },
  {
    id: 'city',
    type: 'text',
    label: 'City',
    placeholder: 'Enter city',
    value: formData.city,
    onChange: (value) => setFormData(prev => ({ ...prev, city: value as string })),
    disabled: false
  },
  {
    id: 'state',
    type: 'text',
    label: 'State',
    placeholder: 'Enter state',
    value: formData.state,
    onChange: (value) => setFormData(prev => ({ ...prev, state: value as string })),
    disabled: false
  },
  {
    id: 'pincode',
    type: 'text',
    label: 'Pincode',
    placeholder: 'Enter pincode',
    value: formData.pincode,
    onChange: (value) => setFormData(prev => ({ ...prev, pincode: value as string })),
    disabled: false
  },
  {
    id: 'isDefault',
    type: 'checkbox',
    label: 'Set as default address',
    value: formData.isDefault,
    onChange: (value) => setFormData(prev => ({ ...prev, isDefault: value as boolean })),
    disabled: false,
    shape: 'rectangle',
    checkboxSize: 'md'
  },
  {
    id: 'instructions',
    type: 'textarea',
    label: 'Delivery Instructions (Optional)',
    placeholder: 'Any special instructions for delivery',
    value: formData.instructions,
    onChange: (value) => setFormData(prev => ({ ...prev, instructions: value as string })),
    disabled: false,
    rows: 3
  }
];


export const getInitialAddressFormData = (): AddressFormDataI => ({
  ...INITIAL_ADDRESS_FORM_DATA
});