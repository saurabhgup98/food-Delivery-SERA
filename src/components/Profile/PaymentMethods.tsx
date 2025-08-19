import React, { useState } from 'react';
import PaymentMethodModal from '../Common/PaymentMethodModal';

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
  const [showModal, setShowModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleAddPaymentMethod = async (paymentData: any) => {
    try {
      setIsLoading(true);
      
      // Create new payment method based on type
      let newMethod: PaymentMethod;
      
      if (paymentData.type === 'card') {
        newMethod = {
          id: Date.now().toString(),
          type: 'card',
          name: paymentData.cardholderName,
          details: `**** **** **** ${paymentData.cardNumber.slice(-4)}`,
          isDefault: paymentData.isDefault,
          isVerified: true,
          lastUsed: new Date().toISOString()
        };
      } else if (paymentData.type === 'upi') {
        newMethod = {
          id: Date.now().toString(),
          type: 'upi',
          name: 'UPI Payment',
          details: paymentData.upiId,
          isDefault: paymentData.isDefault,
          isVerified: true,
          lastUsed: new Date().toISOString()
        };
      } else if (paymentData.type === 'wallet') {
        newMethod = {
          id: Date.now().toString(),
          type: 'wallet',
          name: `${paymentData.walletType} Wallet`,
          details: `****${paymentData.walletNumber.slice(-4)}`,
          isDefault: paymentData.isDefault,
          isVerified: true,
          lastUsed: new Date().toISOString()
        };
      } else {
        throw new Error('Invalid payment type');
      }
      
      // If setting as default, unset other defaults
      if (paymentData.isDefault) {
        setPaymentMethods(prev => prev.map(method => ({
          ...method,
          isDefault: false
        })));
      }
      
      setPaymentMethods(prev => [...prev, newMethod]);
      
      // TODO: Call API to save payment method
      console.log('Saving payment method:', paymentData);
      
    } catch (error) {
      console.error('Error adding payment method:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-xl font-semibold text-white">Payment Methods</h3>
          <p className="text-gray-400 text-sm">Manage your saved payment options for quick checkout</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="px-4 py-2 bg-sera-orange text-white rounded-lg hover:bg-orange-600 transition-colors duration-200 flex items-center space-x-2"
        >
          <span>+</span>
          <span>Add Payment Method</span>
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
              onClick={() => setShowModal(true)}
              className="px-4 py-2 bg-sera-orange text-white rounded-lg hover:bg-orange-600 transition-colors duration-200"
            >
              + Add Your First Payment Method
            </button>
          </div>
        ) : (
          paymentMethods.map((method) => (
            <div key={method.id} className="bg-dark-700 rounded-lg p-6 border border-dark-600">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-3">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      {method.type.toUpperCase()}
                    </span>
                    {method.isDefault && (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        Default
                      </span>
                    )}
                    {method.isVerified && (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        ✓ Verified
                      </span>
                    )}
                  </div>
                  
                  <div className="space-y-1">
                    <p className="text-white font-medium">{method.name}</p>
                    <p className="text-gray-400">{method.details}</p>
                    {method.lastUsed && (
                      <p className="text-gray-500 text-sm">
                        Last used: {new Date(method.lastUsed).toLocaleDateString()}
                      </p>
                    )}
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

      {/* Payment Method Modal */}
      <PaymentMethodModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onSave={handleAddPaymentMethod}
      />
    </div>
  );
};

export default PaymentMethods;
