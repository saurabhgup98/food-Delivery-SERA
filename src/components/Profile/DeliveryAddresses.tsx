import React, { useState } from 'react';

interface Address {
  id: string;
  label: string;
  fullName: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  isDefault: boolean;
  instructions?: string;
}

const DeliveryAddresses: React.FC = () => {
  const [addresses, setAddresses] = useState<Address[]>([
    {
      id: '1',
      label: 'Home',
      fullName: 'John Doe',
      phone: '+91 98765 43210',
      address: '123 Main Street, Apartment 4B',
      city: 'Mumbai',
      state: 'Maharashtra',
      pincode: '400001',
      isDefault: true,
      instructions: 'Ring doorbell twice'
    },
    {
      id: '2',
      label: 'Office',
      fullName: 'John Doe',
      phone: '+91 98765 43210',
      address: '456 Business Park, Floor 8',
      city: 'Mumbai',
      state: 'Maharashtra',
      pincode: '400002',
      isDefault: false,
      instructions: 'Leave at reception'
    }
  ]);

  const [isAddingNew, setIsAddingNew] = useState(false);
  const [editingAddress, setEditingAddress] = useState<Address | null>(null);
  const [formData, setFormData] = useState<Omit<Address, 'id'>>({
    label: '',
    fullName: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    pincode: '',
    isDefault: false,
    instructions: ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }));
  };

  const handleSubmit = () => {
    if (editingAddress) {
      // Update existing address
      setAddresses(prev => prev.map(addr => 
        addr.id === editingAddress.id ? { ...formData, id: addr.id } : addr
      ));
      setEditingAddress(null);
    } else {
      // Add new address
      const newAddress: Address = {
        ...formData,
        id: Date.now().toString()
      };
      setAddresses(prev => [...prev, newAddress]);
    }
    
    // Reset form
    setFormData({
      label: '',
      fullName: '',
      phone: '',
      address: '',
      city: '',
      state: '',
      pincode: '',
      isDefault: false,
      instructions: ''
    });
    setIsAddingNew(false);
  };

  const handleEdit = (address: Address) => {
    setEditingAddress(address);
    setFormData({
      label: address.label,
      fullName: address.fullName,
      phone: address.phone,
      address: address.address,
      city: address.city,
      state: address.state,
      pincode: address.pincode,
      isDefault: address.isDefault,
      instructions: address.instructions || ''
    });
  };

  const handleDelete = (id: string) => {
    setAddresses(prev => prev.filter(addr => addr.id !== id));
  };

  const handleSetDefault = (id: string) => {
    setAddresses(prev => prev.map(addr => ({
      ...addr,
      isDefault: addr.id === id
    })));
  };

  const handleCancel = () => {
    setEditingAddress(null);
    setIsAddingNew(false);
    setFormData({
      label: '',
      fullName: '',
      phone: '',
      address: '',
      city: '',
      state: '',
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

      {/* Address List */}
      <div className="space-y-4">
        {addresses.map((address) => (
          <div key={address.id} className="bg-dark-700 rounded-lg p-6 border border-dark-600">
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
                    onClick={() => handleSetDefault(address.id)}
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
                  onClick={() => handleDelete(address.id)}
                  className="px-3 py-1 bg-red-600 text-white text-sm rounded hover:bg-red-700 transition-colors duration-200"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add/Edit Form */}
      {(isAddingNew || editingAddress) && (
        <div className="bg-dark-700 rounded-lg p-6 border border-dark-600">
          <h4 className="text-white font-medium mb-4">
            {editingAddress ? 'Edit Address' : 'Add New Address'}
          </h4>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Address Label */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Address Label
              </label>
              <select
                name="label"
                value={formData.label}
                onChange={handleInputChange}
                className="w-full px-4 py-3 bg-dark-600 border border-dark-500 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-sera-orange focus:border-transparent"
              >
                <option value="">Select a label</option>
                <option value="Home">Home</option>
                <option value="Office">Office</option>
                <option value="Other">Other</option>
              </select>
            </div>

            {/* Full Name */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Full Name
              </label>
              <input
                type="text"
                name="fullName"
                value={formData.fullName}
                onChange={handleInputChange}
                className="w-full px-4 py-3 bg-dark-600 border border-dark-500 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-sera-orange focus:border-transparent"
                placeholder="Enter full name"
              />
            </div>

            {/* Phone */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Phone Number
              </label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                className="w-full px-4 py-3 bg-dark-600 border border-dark-500 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-sera-orange focus:border-transparent"
                placeholder="Enter phone number"
              />
            </div>

            {/* Address */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Address
              </label>
              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleInputChange}
                className="w-full px-4 py-3 bg-dark-600 border border-dark-500 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-sera-orange focus:border-transparent"
                placeholder="Enter street address"
              />
            </div>

            {/* City */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                City
              </label>
              <input
                type="text"
                name="city"
                value={formData.city}
                onChange={handleInputChange}
                className="w-full px-4 py-3 bg-dark-600 border border-dark-500 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-sera-orange focus:border-transparent"
                placeholder="Enter city"
              />
            </div>

            {/* State */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                State
              </label>
              <input
                type="text"
                name="state"
                value={formData.state}
                onChange={handleInputChange}
                className="w-full px-4 py-3 bg-dark-600 border border-dark-500 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-sera-orange focus:border-transparent"
                placeholder="Enter state"
              />
            </div>

            {/* Pincode */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Pincode
              </label>
              <input
                type="text"
                name="pincode"
                value={formData.pincode}
                onChange={handleInputChange}
                className="w-full px-4 py-3 bg-dark-600 border border-dark-500 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-sera-orange focus:border-transparent"
                placeholder="Enter pincode"
              />
            </div>

            {/* Default Address */}
            <div className="flex items-center">
              <input
                type="checkbox"
                name="isDefault"
                checked={formData.isDefault}
                onChange={handleInputChange}
                className="w-4 h-4 text-sera-orange bg-dark-600 border-dark-500 rounded focus:ring-sera-orange focus:ring-2"
              />
              <label className="ml-2 text-sm text-gray-300">
                Set as default address
              </label>
            </div>

            {/* Delivery Instructions */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Delivery Instructions (Optional)
              </label>
              <textarea
                name="instructions"
                value={formData.instructions}
                onChange={handleInputChange}
                rows={3}
                className="w-full px-4 py-3 bg-dark-600 border border-dark-500 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-sera-orange focus:border-transparent"
                placeholder="Any special instructions for delivery"
              />
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
              className="px-6 py-2 bg-sera-orange text-white rounded-lg hover:bg-orange-600 transition-colors duration-200"
            >
              {editingAddress ? 'Update Address' : 'Add Address'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default DeliveryAddresses;
