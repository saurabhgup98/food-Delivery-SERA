import React, { useState, useEffect } from 'react';
import { PrimaryForm } from '../../Form';
import { PrimaryActionBtn } from '../../buttons';
import { SecondaryContentContainer } from '../../Container';
import { getAddressFormFieldsConfig, getInitialAddressFormData, AddressFormData } from '../AddressConfig';
import { Address } from '../../../services/api';
import { BtnConfig } from '../../../Style';

interface DeliveryAddressFormProps {
  formData: any;
  setFormData: (updater: (prev: any) => any) => void;
  loading: boolean;
  editingAddress: Address | null;
  onSubmit: () => void;
  onCancel: () => void;
}

const DeliveryAddressForm: React.FC<DeliveryAddressFormProps> = ({
  formData,
  setFormData,
  loading,
  editingAddress,
  onSubmit,
  onCancel
}) => {
  // Initialize form data using config
  const [localFormData, setLocalFormData] = useState<AddressFormData>(
    getInitialAddressFormData()
  );

  // Update local form data when editingAddress changes
  useEffect(() => {
    if (editingAddress) {
      // Map Address to AddressFormData
      setLocalFormData({
        label: editingAddress.type || '',
        fullName: editingAddress.name || '',
        phone: editingAddress.phone || '',
        address: editingAddress.address || '',
        city: editingAddress.city || '',
        state: editingAddress.state || '',
        pincode: editingAddress.pincode || '',
        country: editingAddress.country || 'IN',
        isDefault: editingAddress.isDefault || false,
        instructions: editingAddress.instructions || ''
      });
    } else {
      setLocalFormData(getInitialAddressFormData());
    }
  }, [editingAddress]);

  // Sync with parent form data
  useEffect(() => {
    setFormData(() => localFormData);
  }, [localFormData, setFormData]);

  // Get form fields configuration
  const formFieldsConfig = getAddressFormFieldsConfig(
    localFormData,
    setLocalFormData
  );

  return (
    <div className="bg-dark-700 rounded-lg p-6 border border-dark-600">
      <div className="flex items-center justify-between mb-4">
        <h4 className="text-white font-medium">
          {editingAddress ? 'Edit Address' : 'Add New Address'}
        </h4>
      </div>

      {/* PrimaryForm with configuration */}
      <PrimaryForm
        columns={2}
        fields={formFieldsConfig}
        className="mb-6"
      />

      {/* Action Buttons */}
      <div className="flex items-center justify-end space-x-4 mt-6 pt-6 border-t border-dark-600">
        <PrimaryActionBtn
          content={
            <SecondaryContentContainer
              rows={[
                {
                  components: [
                    { content: <span className="text-white">Cancel</span> }
                  ],
                  gap: '0'
                }
              ]}
            />
          }
          onClick={onCancel}
          width="w-fit"
          height="h-fit"
          className="px-6 py-2"
          {...BtnConfig.Secondary}
        />
        <PrimaryActionBtn
          content={
            <SecondaryContentContainer
              rows={[
                {
                  components: [
                    { content: <span className="text-white">
                      {loading ? 'Saving...' : editingAddress ? 'Update Address' : 'Add Address'}
                    </span> }
                  ],
                  gap: '0'
                }
              ]}
            />
          }
          onClick={onSubmit}
          disabled={loading}
          width="w-fit"
          height="h-fit"
          className="px-6 py-2"
        />
      </div>
    </div>
  );
};

export default DeliveryAddressForm;

