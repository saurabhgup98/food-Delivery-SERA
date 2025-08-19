import React, { useState, useEffect } from 'react';
import { apiService, Address } from '../../services/api';
import PrimaryDropdown from '../Common/PrimaryDropdown';
import PrimaryInput from '../Common/PrimaryInput';
import LocationDropdown from '../Common/LocationDropdown';
import { addressLabelOptions } from '../../data/dropdownOptions';

const DeliveryAddresses: React.FC = () => {
  const [addresses, setAddresses] = useState<Address[]>([]);

  const [isAddingNew, setIsAddingNew] = useState(false);
  const [editingAddress, setEditingAddress] = useState<Address | null>(null);
  const [formData, setFormData] = useState({
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
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Fetch addresses on component mount
  useEffect(() => {
    fetchAddresses();
  }, []);

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



  const handleSubmit = async () => {
    try {
      setLoading(true);
      setError(null);
      setSuccessMessage(null);

      if (editingAddress) {
        // Update existing address
        console.log('Editing address ID:', editingAddress._id); // Debug log
        console.log('Form data being sent:', formData); // Debug log
        
        const response = await apiService.updateAddress(editingAddress._id, formData);
        console.log('Update address response:', response); // Debug log
        
        if (response.success && response.data && response.data.address) {
          // Update the addresses list with the new data
          setAddresses(prev => prev.map(addr => 
            addr._id === editingAddress._id ? response.data.address : addr
          ));
          setEditingAddress(null);
          // Show success message briefly
          setSuccessMessage('Address updated successfully!');
          setTimeout(() => setSuccessMessage(null), 3000);
        } else {
          throw new Error(response.message || 'Failed to update address');
        }
      } else {
        // Add new address
        const response = await apiService.createAddress(formData);
        console.log('Create address response:', response); // Debug log
        
        if (response.success && response.data && response.data.address) {
          setAddresses(prev => [...prev, response.data.address]);
          setIsAddingNew(false);
          // Show success message briefly
          setSuccessMessage('Address added successfully!');
          setTimeout(() => setSuccessMessage(null), 3000);
        } else {
          throw new Error(response.message || 'Failed to create address');
        }
      }
      
      // Reset form
      setFormData({
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
      });
    } catch (err: any) {
      console.error('Error saving address:', err);
      setError(err.message || 'Failed to save address');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (address: Address) => {
    setEditingAddress(address);
    setFormData({
      label: address.label,
      fullName: address.fullName,
      phone: address.phone,
      address: address.address,
      country: 'IN', // Default to India for existing addresses
      state: address.state,
      city: address.city,
      pincode: address.pincode,
      isDefault: address.isDefault,
      instructions: address.instructions || ''
    });
  };

  const handleDelete = async (id: string) => {
    try {
      setLoading(true);
      const response = await apiService.deleteAddress(id);
      if (response.success) {
        setAddresses(prev => prev.filter(addr => addr._id !== id));
      }
    } catch (err) {
      setError('Failed to delete address');
      console.error('Error deleting address:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSetDefault = async (id: string) => {
    try {
      setLoading(true);
      const response = await apiService.updateAddress(id, { isDefault: true });
      if (response.success) {
        setAddresses(prev => prev.map(addr => ({
          ...addr,
          isDefault: addr._id === id
        })));
      }
    } catch (err) {
      setError('Failed to set default address');
      console.error('Error setting default address:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setEditingAddress(null);
    setIsAddingNew(false);
    setFormData({
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
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-xl font-semibold text-white">Delivery Addresses</h3>
          <p className="text-gray-400 text-sm">Manage your delivery addresses for quick ordering</p>
        </div>
        <button
          onClick={() => setIsAddingNew(true)}
          className="px-4 py-2 bg-sera-orange text-white rounded-lg hover:bg-orange-600 transition-colors duration-200"
        >
          + Add New Address
        </button>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-900/20 border border-red-800 rounded-lg p-4 mb-4">
          <div className="flex items-center space-x-3">
            <div className="text-red-400 text-lg">⚠️</div>
            <div>
              <h4 className="text-red-400 font-medium mb-1">Error</h4>
              <p className="text-red-300 text-sm">{error}</p>
            </div>
          </div>
        </div>
      )}

      {/* Success Message */}
      {successMessage && (
        <div className="bg-green-900/20 border border-green-800 rounded-lg p-4 mb-4">
          <div className="flex items-center space-x-3">
            <div className="text-green-400 text-lg">✅</div>
            <div>
              <h4 className="text-green-400 font-medium mb-1">Success</h4>
              <p className="text-green-300 text-sm">{successMessage}</p>
            </div>
          </div>
        </div>
      )}

      {/* Add/Edit Form - Show first when adding/editing */}
      {(isAddingNew || editingAddress) && (
        <div className="bg-dark-700 rounded-lg p-6 border border-dark-600">
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-white font-medium">
              {editingAddress ? 'Edit Address' : 'Add New Address'}
            </h4>
            <button
              onClick={handleCancel}
              className="text-gray-400 hover:text-white transition-colors duration-200"
            >
              ✕
            </button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Address Label */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Address Label
              </label>
              <PrimaryDropdown
                value={formData.label}
                onChange={(value) => setFormData(prev => ({ ...prev, label: value }))}
                options={addressLabelOptions}
                placeholder="Select label"
              />
            </div>

            {/* Full Name */}
            <PrimaryInput
              type="text"
              value={formData.fullName}
              onChange={(value) => setFormData(prev => ({ ...prev, fullName: value }))}
              placeholder="Enter full name"
              label="Full Name"
            />

            {/* Phone */}
            <PrimaryInput
              type="tel"
              value={formData.phone}
              onChange={(value) => setFormData(prev => ({ ...prev, phone: value }))}
              placeholder="Enter phone number"
              label="Phone Number"
            />

            {/* Address */}
            <PrimaryInput
              type="text"
              value={formData.address}
              onChange={(value) => setFormData(prev => ({ ...prev, address: value }))}
              placeholder="Enter street address"
              label="Street Address"
            />

            {/* Country */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Country
              </label>
              <LocationDropdown
                type="country"
                value={formData.country}
                onChange={(value) => setFormData(prev => ({ ...prev, country: value, state: '', city: '' }))}
                placeholder="Select country"
              />
            </div>

            {/* State */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                State
              </label>
              <LocationDropdown
                type="state"
                value={formData.state}
                onChange={(value) => setFormData(prev => ({ ...prev, state: value, city: '' }))}
                placeholder="Select state"
                countryCode={formData.country}
              />
            </div>

            {/* City */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                City
              </label>
              <LocationDropdown
                type="city"
                value={formData.city}
                onChange={(value) => setFormData(prev => ({ ...prev, city: value }))}
                placeholder="Select city"
                countryCode={formData.country}
                stateCode={formData.state}
              />
            </div>

            {/* Pincode */}
            <PrimaryInput
              type="text"
              value={formData.pincode}
              onChange={(value) => setFormData(prev => ({ ...prev, pincode: value }))}
              placeholder="Enter pincode"
              label="Pincode"
            />

            {/* Instructions */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Delivery Instructions (Optional)
              </label>
              <textarea
                value={formData.instructions}
                onChange={(e) => setFormData(prev => ({ ...prev, instructions: e.target.value }))}
                placeholder="Any special instructions for delivery..."
                rows={3}
                className="w-full px-4 py-3 bg-dark-600 border border-dark-500 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-sera-orange focus:border-transparent resize-none"
              />
            </div>

            {/* Set as Default */}
            <div className="md:col-span-2">
              <div className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  id="isDefault"
                  checked={formData.isDefault}
                  onChange={(e) => setFormData(prev => ({ ...prev, isDefault: e.target.checked }))}
                  className="w-4 h-4 text-sera-orange bg-dark-600 border-dark-500 rounded focus:ring-sera-orange focus:ring-2"
                />
                <label htmlFor="isDefault" className="text-sm text-gray-300">
                  Set as default delivery address
                </label>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end space-x-4 mt-6 pt-6 border-t border-dark-600">
            <button
              onClick={handleCancel}
              className="px-6 py-2 bg-dark-600 text-white rounded-lg hover:bg-dark-500 transition-colors duration-200"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              disabled={loading}
              className="px-6 py-2 bg-sera-orange text-white rounded-lg hover:bg-orange-600 transition-colors duration-200 disabled:opacity-50 flex items-center space-x-2"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Saving...</span>
                </>
              ) : (
                <span>{editingAddress ? 'Update Address' : 'Add Address'}</span>
              )}
            </button>
          </div>
        </div>
      )}

      {/* Address List */}
      <div className="space-y-4">
        {loading ? (
          <div className="bg-dark-700 rounded-lg p-8 border border-dark-600 text-center">
            <div className="text-gray-400 text-4xl mb-4">⏳</div>
            <h4 className="text-white font-medium mb-2">Loading addresses...</h4>
            <p className="text-gray-400 text-sm">Please wait while we fetch your delivery addresses</p>
          </div>
        ) : addresses.length === 0 ? (
          <div className="bg-dark-700 rounded-lg p-8 border border-dark-600 text-center">
            <div className="text-gray-400 text-4xl mb-4">📍</div>
            <h4 className="text-white font-medium mb-2">No delivery addresses</h4>
            <p className="text-gray-400 text-sm mb-4">Add your first delivery address to get started with quick ordering</p>
            <button
              onClick={() => setIsAddingNew(true)}
              className="px-4 py-2 bg-sera-orange text-white rounded-lg hover:bg-orange-600 transition-colors duration-200"
            >
              + Add Your First Address
            </button>
          </div>
        ) : (
          addresses.map((address) => (
            <div key={address._id} className="bg-dark-700 rounded-lg p-6 border border-dark-600">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-3">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      {address.label}
                    </span>
                    {address.isDefault && (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        Default
                      </span>
                    )}
                  </div>
                  
                  <div className="space-y-1">
                    <p className="text-white font-medium">{address.fullName}</p>
                    <p className="text-gray-400">{address.phone}</p>
                    <p className="text-gray-300">
                      {address.address}, {address.city}, {address.state} - {address.pincode}
                    </p>
                    {address.instructions && (
                      <p className="text-gray-400 text-sm">
                        <span className="font-medium">Instructions:</span> {address.instructions}
                      </p>
                    )}
                  </div>
                </div>
                
                <div className="flex items-center space-x-2 ml-4">
                  {!address.isDefault && (
                    <button
                      onClick={() => handleSetDefault(address._id)}
                      className="px-3 py-1 bg-dark-600 text-white text-sm rounded hover:bg-dark-500 transition-colors duration-200"
                    >
                      Set Default
                    </button>
                  )}
                  <button
                    onClick={() => handleEdit(address)}
                    className="px-3 py-1 bg-dark-600 text-white text-sm rounded hover:bg-dark-500 transition-colors duration-200"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(address._id)}
                    className="px-3 py-1 bg-red-600 text-white text-sm rounded hover:bg-red-700 transition-colors duration-200"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>


    </div>
  );
};

export default DeliveryAddresses;
