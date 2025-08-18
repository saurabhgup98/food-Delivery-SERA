import React, { useState } from 'react';
import PrimaryDropdown from '../Common/PrimaryDropdown';
import PrimaryInput from '../Common/PrimaryInput';
import { paymentTypeOptions, walletTypeOptions } from '../../data/dropdownOptions';

interface PaymentMethod {
  id: string;
  type: 'card' | 'upi' | 'wallet';
  name: string;
  details: string;
  isDefault: boolean;
  isVerified: boolean;
  lastUsed?: string;
}

const PaymentMethods: React.FC = () => {
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);

  const [isAddingNew, setIsAddingNew] = useState(false);
  const [editingMethod, setEditingMethod] = useState<PaymentMethod | null>(null);
  const [formData, setFormData] = useState({
    type: 'card',
    name: '',
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    upiId: '',
    walletType: 'paytm'
  });



  const handleSubmit = () => {
    let newMethod: PaymentMethod;
    
    if (editingMethod) {
      // Update existing method
      newMethod = {
        ...editingMethod,
        name: formData.name,
        details: formData.type === 'card' ? `**** **** **** ${formData.cardNumber.slice(-4)}` :
                formData.type === 'upi' ? formData.upiId :
                `${formData.walletType} wallet`,
      };
      
      setPaymentMethods(prev => prev.map(method => 
        method.id === editingMethod.id ? newMethod : method
      ));
      setEditingMethod(null);
    } else {
      // Add new method
      newMethod = {
        id: Date.now().toString(),
        type: formData.type as 'card' | 'upi' | 'wallet',
        name: formData.name,
        details: formData.type === 'card' ? `**** **** **** ${formData.cardNumber.slice(-4)}` :
                formData.type === 'upi' ? formData.upiId :
                `${formData.walletType} wallet`,
        isDefault: false,
        isVerified: true,
      };
      
      setPaymentMethods(prev => [...prev, newMethod]);
    }
    
    // Reset form
    setFormData({
      type: 'card',
      name: '',
      cardNumber: '',
      expiryDate: '',
      cvv: '',
      upiId: '',
      walletType: 'paytm'
    });
    setIsAddingNew(false);
  };

  const handleEdit = (method: PaymentMethod) => {
    setEditingMethod(method);
    setFormData({
      type: method.type,
      name: method.name,
      cardNumber: '',
      expiryDate: '',
      cvv: '',
      upiId: method.type === 'upi' ? method.details : '',
      walletType: method.type === 'wallet' ? method.details.split(' ')[0].toLowerCase() : 'paytm'
    });
  };

  const handleDelete = (id: string) => {
    setPaymentMethods(prev => prev.filter(method => method.id !== id));
  };

  const handleSetDefault = (id: string) => {
    setPaymentMethods(prev => prev.map(method => ({
      ...method,
      isDefault: method.id === id
    })));
  };

  const handleCancel = () => {
    setEditingMethod(null);
    setIsAddingNew(false);
    setFormData({
      type: 'card',
      name: '',
      cardNumber: '',
      expiryDate: '',
      cvv: '',
      upiId: '',
      walletType: 'paytm'
    });
  };

  const getPaymentIcon = (type: string) => {
    switch (type) {
      case 'card':
        return '💳';
      case 'upi':
        return '📱';
      case 'wallet':
        return '👛';
      default:
        return '💰';
    }
  };

  const getPaymentTypeColor = (type: string) => {
    switch (type) {
      case 'card':
        return 'bg-blue-100 text-blue-800';
      case 'upi':
        return 'bg-purple-100 text-purple-800';
      case 'wallet':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-xl font-semibold text-white">Payment Methods</h3>
          <p className="text-gray-400 text-sm">Manage your saved payment options for quick checkout</p>
        </div>
        <button
          onClick={() => setIsAddingNew(true)}
          className="px-4 py-2 bg-sera-orange text-white rounded-lg hover:bg-orange-600 transition-colors duration-200"
        >
          + Add Payment Method
        </button>
      </div>

      {/* Payment Methods List */}
      <div className="space-y-4">
        {paymentMethods.length === 0 ? (
          <div className="bg-dark-700 rounded-lg p-8 border border-dark-600 text-center">
            <div className="text-gray-400 text-4xl mb-4">💳</div>
            <h4 className="text-white font-medium mb-2">No payment methods</h4>
            <p className="text-gray-400 text-sm mb-4">Add your first payment method for quick and secure checkout</p>
            <button
              onClick={() => setIsAddingNew(true)}
              className="px-4 py-2 bg-sera-orange text-white rounded-lg hover:bg-orange-600 transition-colors duration-200"
            >
              + Add Your First Payment Method
            </button>
          </div>
        ) : (
          paymentMethods.map((method) => (
            <div key={method.id} className="bg-dark-700 rounded-lg p-6 border border-dark-600">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="text-2xl">{getPaymentIcon(method.type)}</div>
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h4 className="text-white font-medium">{method.name}</h4>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getPaymentTypeColor(method.type)}`}>
                        {method.type.toUpperCase()}
                      </span>
                      {method.isDefault && (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          Default
                        </span>
                      )}
                      {method.isVerified && (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          ✓ Verified
                        </span>
                      )}
                    </div>
                    
                    <div className="space-y-1">
                      <p className="text-gray-300">{method.details}</p>
                      {method.lastUsed && (
                        <p className="text-gray-400 text-sm">
                          Last used: {new Date(method.lastUsed).toLocaleDateString()}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2 ml-4">
                  {!method.isDefault && (
                    <button
                      onClick={() => handleSetDefault(method.id)}
                      className="px-3 py-1 bg-dark-600 text-white text-sm rounded hover:bg-dark-500 transition-colors duration-200"
                    >
                      Set Default
                    </button>
                  )}
                  <button
                    onClick={() => handleEdit(method)}
                    className="px-3 py-1 bg-dark-600 text-white text-sm rounded hover:bg-dark-500 transition-colors duration-200"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(method.id)}
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

      {/* Add/Edit Form */}
      {(isAddingNew || editingMethod) && (
        <div className="bg-dark-700 rounded-lg p-6 border border-dark-600">
          <h4 className="text-white font-medium mb-4">
            {editingMethod ? 'Edit Payment Method' : 'Add New Payment Method'}
          </h4>
          
          <div className="space-y-4">
            {/* Payment Type */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Payment Type
              </label>
              <PrimaryDropdown
                value={formData.type}
                onChange={(value) => setFormData(prev => ({ ...prev, type: value as 'card' | 'upi' | 'wallet' }))}
                options={paymentTypeOptions}
                placeholder="Select payment type"
              />
            </div>

            {/* Name */}
            <PrimaryInput
              type="text"
              value={formData.name}
              onChange={(value) => setFormData(prev => ({ ...prev, name: value }))}
              placeholder={formData.type === 'card' ? 'Enter card name' : formData.type === 'upi' ? 'Enter UPI name' : 'Enter wallet name'}
              label={formData.type === 'card' ? 'Card Name' : formData.type === 'upi' ? 'UPI Name' : 'Wallet Name'}
            />

            {/* Card Details */}
            {formData.type === 'card' && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <PrimaryInput
                  type="text"
                  value={formData.cardNumber}
                  onChange={(value) => setFormData(prev => ({ ...prev, cardNumber: value }))}
                  placeholder="1234 5678 9012 3456"
                  label="Card Number"
                  maxLength={19}
                />
                <PrimaryInput
                  type="text"
                  value={formData.expiryDate}
                  onChange={(value) => setFormData(prev => ({ ...prev, expiryDate: value }))}
                  placeholder="MM/YY"
                  label="Expiry Date"
                  maxLength={5}
                />
                <PrimaryInput
                  type="text"
                  value={formData.cvv}
                  onChange={(value) => setFormData(prev => ({ ...prev, cvv: value }))}
                  placeholder="123"
                  label="CVV"
                  maxLength={4}
                />
              </div>
            )}

            {/* UPI Details */}
            {formData.type === 'upi' && (
              <PrimaryInput
                type="text"
                value={formData.upiId}
                onChange={(value) => setFormData(prev => ({ ...prev, upiId: value }))}
                placeholder="username@upi"
                label="UPI ID"
              />
            )}

            {/* Wallet Details */}
            {formData.type === 'wallet' && (
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Wallet Type
                </label>
                <PrimaryDropdown
                  value={formData.walletType}
                  onChange={(value) => setFormData(prev => ({ ...prev, walletType: value }))}
                  options={walletTypeOptions}
                  placeholder="Select wallet type"
                />
              </div>
            )}
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
              {editingMethod ? 'Update Method' : 'Add Method'}
            </button>
          </div>
        </div>
      )}

      {/* Security Notice */}
      <div className="bg-blue-900/20 border border-blue-800 rounded-lg p-4">
        <div className="flex items-start space-x-3">
          <div className="text-blue-400 text-lg">🔒</div>
          <div>
            <h4 className="text-blue-400 font-medium mb-1">Secure Payment</h4>
            <p className="text-blue-300 text-sm">
              All payment information is encrypted and stored securely. We never store your CVV or full card details.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentMethods;
