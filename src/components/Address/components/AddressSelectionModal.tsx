import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X, MapPin } from 'lucide-react';
import { apiService, Address } from '../../../services/api';
import { transformFormDataToAddress } from '../../../config/addressConfig';
import { PrimaryForm } from '../../Form';
import { getAddressFormFieldsConfig, getInitialAddressFormData, AddressFormData } from '../AddressConfig';

interface AddressSelectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddressSelect: (address: Address) => void;
  selectedAddress?: Address | null;
}

const AddressSelectionModal: React.FC<AddressSelectionModalProps> = ({
  isOpen,
  onClose,
  onAddressSelect,
  selectedAddress
}) => {
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [formData, setFormData] = useState<AddressFormData>(getInitialAddressFormData());

  useEffect(() => {
    if (isOpen) {
      fetchAddresses();
    }
  }, [isOpen]);

  useEffect(() => {
    if (!isAddingNew) {
      setFormData(getInitialAddressFormData());
    }
  }, [isAddingNew]);

  const fetchAddresses = async () => {
    try {
      setLoading(true);
      const response = await apiService.getAddresses();
      if (response.success) {
        setAddresses(response.data.addresses);
      }
    } catch (err) {
      setError('Failed to fetch addresses');
      console.error('Error fetching addresses:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddAddress = async () => {
    try {
      setLoading(true);
      setError(null);

      const addressData = transformFormDataToAddress(formData);
      const response = await apiService.createAddress(addressData);
      if (response.success) {
        setAddresses(prev => [...prev, response.data.address]);
        setIsAddingNew(false);
        setFormData(getInitialAddressFormData());
      }
    } catch (err) {
      setError('Failed to add address');
      console.error('Error adding address:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddressSelect = (address: Address) => {
    onAddressSelect(address);
    onClose();
  };

  const isFormValid = () => {
    return !!(
      formData.label &&
      formData.fullName &&
      formData.phone &&
      formData.address &&
      formData.city &&
      formData.state &&
      formData.pincode
    );
  };

  if (!isOpen) return null;

  const formFieldsConfig = getAddressFormFieldsConfig(formData, setFormData);

  const modalContent = (
    <div className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-[99999] p-4" style={{ zIndex: 99999 }}>
      <div className="bg-dark-800 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-dark-700">
          <h2 className="text-xl font-semibold text-white">Select Delivery Address</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {error && (
            <div className="mb-4 p-3 bg-red-500/20 border border-red-500/30 rounded-lg text-red-400 text-sm">
              {error}
            </div>
          )}

          {loading && !isAddingNew && (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-sera-orange mx-auto"></div>
              <p className="text-gray-400 mt-2">Loading addresses...</p>
            </div>
          )}

          {!loading && !isAddingNew && (
            <>
              {/* Existing Addresses */}
              <div className="space-y-4 mb-6">
                {addresses.length === 0 ? (
                  <div className="text-center py-8">
                    <MapPin className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-white font-medium mb-2">No saved addresses</h3>
                    <p className="text-gray-400 text-sm mb-4">Add your first delivery address</p>
                    <button
                      onClick={() => setIsAddingNew(true)}
                      className="px-4 py-2 bg-sera-orange text-white rounded-lg hover:bg-orange-600 transition-colors"
                    >
                      + Add New Address
                    </button>
                  </div>
                ) : (
                  addresses.map((address) => (
                    <div
                      key={address._id}
                      className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                        selectedAddress?._id === address._id
                          ? 'border-sera-orange bg-orange-500/10'
                          : 'border-dark-600 hover:border-dark-500'
                      }`}
                      onClick={() => handleAddressSelect(address)}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-2">
                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                              {address.type}
                            </span>
                            {address.isDefault && (
                              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                Default
                              </span>
                            )}
                          </div>
                          <p className="text-white font-medium">{address.name}</p>
                          <p className="text-gray-400 text-sm">{address.phone}</p>
                          <p className="text-gray-300 text-sm">
                            {address.address}, {address.city}, {address.state} - {address.pincode}
                          </p>
                          {address.instructions && (
                            <p className="text-gray-400 text-sm mt-1">
                              <span className="font-medium">Instructions:</span> {address.instructions}
                            </p>
                          )}
                        </div>
                        {selectedAddress?._id === address._id && (
                          <div className="text-sera-orange">
                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                          </div>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* Add New Address Button */}
              {addresses.length > 0 && (
                <button
                  onClick={() => setIsAddingNew(true)}
                  className="w-full flex items-center justify-center space-x-2 py-3 border-2 border-dashed border-dark-600 rounded-lg text-gray-400 hover:text-white hover:border-dark-500 transition-colors"
                >
                  <span className="text-xl font-bold">+</span>
                  <span>Add New Address</span>
                </button>
              )}
            </>
          )}

          {/* Add New Address Form */}
          {isAddingNew && (
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-white">Add New Address</h3>
              
              <PrimaryForm
                columns={2}
                fields={formFieldsConfig}
                className="mb-4"
              />

              {/* Action Buttons */}
              <div className="flex items-center justify-end space-x-4 pt-4 border-t border-dark-700">
                <button
                  onClick={() => setIsAddingNew(false)}
                  className="px-6 py-2 bg-dark-700 text-white rounded-lg hover:bg-dark-600 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddAddress}
                  disabled={loading || !isFormValid()}
                  className="px-6 py-2 bg-sera-orange text-white rounded-lg hover:bg-orange-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? 'Adding...' : 'Add Address'}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
};

export default AddressSelectionModal;

