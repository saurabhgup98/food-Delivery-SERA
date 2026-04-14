import React from 'react';
import { StateConfig } from '../../common/StateDisplay';
import { FormField } from '../../Form';
import { BtnConfig } from '../../../Style';
import { DeliveryAddressFormDataI, FetchDeliveryAddressOperationResultPropsI } from '../ProfilePageInterfaces';
import { MapPin } from 'lucide-react';
import PrimaryCenteredActionBtn from '../../Button/PrimaryCenteredActionBtn';

// Re-export for external use
export type { DeliveryAddressFormDataI };

export const getHeaderProps = (
  isAddingNew: boolean,
  editingAddress: any,
  onAddNew: () => void
) => {
  const shouldShowAddButton = !(isAddingNew || editingAddress);
  
  return {
    icon: React.createElement(MapPin, { className: "w-6 h-6" }),
    title: 'Delivery Addresses',
    subtitle: 'Manage your delivery addresses for quick ordering',
    buttons: shouldShowAddButton ? [
      React.createElement(PrimaryCenteredActionBtn, {
        key: 'add-address',
        onClick: onAddNew,
        text: '+ Add New Address',
        size: 'sm',
        className: 'px-3 py-1.5'
      })
    ] : undefined,
    bgIconCont: 'bg-sera-pink',
    bgIconContHover: 'bg-sera-pink/80',
    iconContBorder: 'border-2 border-sera-pink/30',
    borderOnHover: 'border-sera-pink/60'
  };
};

/**
 * Creates operation result props for delivery address loading and empty states
 * @param onAction - Function to handle adding new address
 * @returns Object containing loading and empty state props
 */
export const FetchDeliveryAddressOperationResultProps = (
  onAction: () => void
): FetchDeliveryAddressOperationResultPropsI => {
  return {
    loading: {
      text: 'Loading addresses...',
      subtext: 'Please wait while we fetch your delivery addresses',
      loadingType: 'general'
    },
    empty: {
      icon: '📍',
      text: 'No delivery addresses',
      subtext: 'Add your first delivery address to get started with quick ordering',
      button: React.createElement(PrimaryCenteredActionBtn, {
        onClick: onAction,
        text: '+ Add Your First Address',
        size: 'md'
      })
    }
  };
};

/**
 * Get initial form data for delivery address
 */
export const getInitialDeliveryAddressFormData = (editingAddress?: any): DeliveryAddressFormDataI => ({
  fullName: editingAddress?.fullName || '',
  phone: editingAddress?.phone || '',
  countryCode: editingAddress?.countryCode || 'IN',
  address: editingAddress?.address || '',
  city: editingAddress?.city || '',
  state: editingAddress?.state || '',
  country: editingAddress?.country || 'India',
  postalCode: editingAddress?.postalCode || '',
  landmark: editingAddress?.landmark || '',
  isDefault: editingAddress?.isDefault || false
});

/**
 * Get form fields configuration for delivery address
 */
export const getDeliveryAddressFormFieldsConfig = (
  formData: DeliveryAddressFormDataI,
  setFormData: React.Dispatch<React.SetStateAction<DeliveryAddressFormDataI>>,
  isEditing: boolean
): FormField[] => [
  {
    id: 'fullName',
    type: 'text',
    label: 'Full Name',
    placeholder: 'Enter your full name',
    value: formData.fullName,
    onChange: (value) => setFormData(prev => ({ ...prev, fullName: value as string })),
    disabled: !isEditing
  },
  {
    id: 'phone',
    type: 'phone',
    label: 'Phone Number',
    placeholder: 'Enter your phone number',
    value: formData.phone,
    onChange: (value) => setFormData(prev => ({ ...prev, phone: value as string })),
    countryCode: formData.countryCode,
    onCountryCodeChange: (value) => setFormData(prev => ({ ...prev, countryCode: value })),
    disabled: !isEditing
  },
  {
    id: 'address',
    type: 'textarea',
    label: 'Address',
    placeholder: 'Enter your complete address',
    value: formData.address,
    onChange: (value) => setFormData(prev => ({ ...prev, address: value as string })),
    rows: 3,
    resize: 'vertical',
    disabled: !isEditing
  },
  {
    id: 'city',
    type: 'text',
    label: 'City',
    placeholder: 'Enter your city',
    value: formData.city,
    onChange: (value) => setFormData(prev => ({ ...prev, city: value as string })),
    disabled: !isEditing
  },
  {
    id: 'state',
    type: 'text',
    label: 'State',
    placeholder: 'Enter your state',
    value: formData.state,
    onChange: (value) => setFormData(prev => ({ ...prev, state: value as string })),
    disabled: !isEditing
  },
  {
    id: 'country',
    type: 'text',
    label: 'Country',
    placeholder: 'Enter your country',
    value: formData.country,
    onChange: (value) => setFormData(prev => ({ ...prev, country: value as string })),
    disabled: !isEditing
  },
  {
    id: 'postalCode',
    type: 'text',
    label: 'Postal Code',
    placeholder: 'Enter postal code',
    value: formData.postalCode,
    onChange: (value) => setFormData(prev => ({ ...prev, postalCode: value as string })),
    disabled: !isEditing
  },
  {
    id: 'landmark',
    type: 'text',
    label: 'Landmark (Optional)',
    placeholder: 'Enter nearby landmark',
    value: formData.landmark,
    onChange: (value) => setFormData(prev => ({ ...prev, landmark: value as string })),
    disabled: !isEditing
  },
  {
    id: 'isDefault',
    type: 'checkbox',
    label: 'Set as default delivery address',
    value: formData.isDefault,
    onChange: (value) => setFormData(prev => ({ ...prev, isDefault: value as boolean })),
    disabled: !isEditing,
    shape: 'rectangle',
    checkboxSize: 'md'
  }
];

/**
 * Get action buttons configuration for delivery address form
 */
export const getDeliveryAddressActionButtons = (
  onCancel: () => void,
  onSubmit: () => void,
  loading: boolean,
  editingAddress: any
) => [
  {
    onClick: onCancel,
    text: "Cancel",
    size: "md" as const,
    className: "px-6 py-2",
    ...BtnConfig.Secondary
  },
  {
    onClick: onSubmit,
    disabled: loading,
    text: loading ? 'Saving...' : editingAddress ? 'Update Address' : 'Add Address',
    size: "md" as const,
    className: "px-6 py-2"
  }
];
