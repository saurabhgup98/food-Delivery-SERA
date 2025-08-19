import React, { useState } from 'react';
import PrimaryInput from './PrimaryInput';
import PrimaryDropdown from './PrimaryDropdown';
import ValidationModal from './ValidationModal';

interface PaymentMethodModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (paymentData: any) => void;
}

const PaymentMethodModal: React.FC<PaymentMethodModalProps> = ({ isOpen, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    cardType: '',
    cardNumber: '',
    cardholderName: '',
    expiryMonth: '',
    expiryYear: '',
    cvv: '',
    isDefault: false
  });
  const [isLoading, setIsLoading] = useState(false);
  const [showValidationModal, setShowValidationModal] = useState(false);
  const [missingFields, setMissingFields] = useState<string[]>([]);
  const [error, setError] = useState('');

  const cardTypeOptions = [
    { value: 'visa', label: 'Visa' },
    { value: 'mastercard', label: 'Mastercard' },
    { value: 'amex', label: 'American Express' },
    { value: 'rupay', label: 'RuPay' }
  ];

  const monthOptions = Array.from({ length: 12 }, (_, i) => ({
    value: String(i + 1).padStart(2, '0'),
    label: String(i + 1).padStart(2, '0')
  }));

  const currentYear = new Date().getFullYear();
  const yearOptions = Array.from({ length: 10 }, (_, i) => ({
    value: String(currentYear + i),
    label: String(currentYear + i)
  }));

  const handleSave = async () => {
    try {
      setIsLoading(true);
      setError('');

      // Validate required fields
      const requiredFields: string[] = [];
      if (!formData.cardType) requiredFields.push('Card Type');
      if (!formData.cardNumber) requiredFields.push('Card Number');
      if (!formData.cardholderName) requiredFields.push('Cardholder Name');
      if (!formData.expiryMonth) requiredFields.push('Expiry Month');
      if (!formData.expiryYear) requiredFields.push('Expiry Year');
      if (!formData.cvv) requiredFields.push('CVV');

      if (requiredFields.length > 0) {
        setMissingFields(requiredFields);
        setShowValidationModal(true);
        return;
      }

      // Validate card number (basic validation)
      if (formData.cardNumber.replace(/\s/g, '').length < 13) {
        setError('Please enter a valid card number');
        return;
      }

      // Validate CVV
      if (formData.cvv.length < 3 || formData.cvv.length > 4) {
        setError('Please enter a valid CVV');
        return;
      }

      // Call parent save function
      await onSave(formData);
      
      // Reset form and close modal
      setFormData({
        cardType: '',
        cardNumber: '',
        cardholderName: '',
        expiryMonth: '',
        expiryYear: '',
        cvv: '',
        isDefault: false
      });
      onClose();
    } catch (error) {
      console.error('Error saving payment method:', error);
      setError('Failed to save payment method. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    setFormData({
      cardType: '',
      cardNumber: '',
      cardholderName: '',
      expiryMonth: '',
      expiryYear: '',
      cvv: '',
      isDefault: false
    });
    setError('');
    onClose();
  };

  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = v.match(/\d{4,16}/g);
    const match = matches && matches[0] || '';
    const parts = [];
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }
    if (parts.length) {
      return parts.join(' ');
    } else {
      return v;
    }
  };

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
        {/* Backdrop */}
        <div 
          className="absolute inset-0 bg-black/50 backdrop-blur-sm"
          onClick={handleCancel}
        />
        
        {/* Modal */}
        <div className="relative bg-dark-800 rounded-2xl shadow-2xl border border-dark-700 max-w-md w-full mx-4 animate-fade-in">
          {/* Header */}
          <div className="p-6 border-b border-dark-600">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-sera-orange/20 rounded-full flex items-center justify-center">
                <svg className="w-5 h-5 text-sera-orange" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                </svg>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white">Add Payment Method</h3>
                <p className="text-sm text-gray-400">Add a new card for quick checkout</p>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="p-6 space-y-4">
            {error && (
              <div className="p-3 bg-red-500/20 border border-red-500/30 rounded-lg">
                <p className="text-sm text-red-400">{error}</p>
              </div>
            )}

            {/* Card Type */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Card Type
              </label>
              <PrimaryDropdown
                value={formData.cardType}
                onChange={(value) => setFormData(prev => ({ ...prev, cardType: value }))}
                options={cardTypeOptions}
                placeholder="Select card type"
              />
            </div>

            {/* Card Number */}
            <PrimaryInput
              type="text"
              value={formData.cardNumber}
              onChange={(value) => setFormData(prev => ({ ...prev, cardNumber: formatCardNumber(value) }))}
              placeholder="1234 5678 9012 3456"
              label="Card Number"
              maxLength={19}
            />

            {/* Cardholder Name */}
            <PrimaryInput
              type="text"
              value={formData.cardholderName}
              onChange={(value) => setFormData(prev => ({ ...prev, cardholderName: value }))}
              placeholder="John Doe"
              label="Cardholder Name"
            />

            {/* Expiry Date and CVV */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Expiry Month
                </label>
                <PrimaryDropdown
                  value={formData.expiryMonth}
                  onChange={(value) => setFormData(prev => ({ ...prev, expiryMonth: value }))}
                  options={monthOptions}
                  placeholder="MM"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Expiry Year
                </label>
                <PrimaryDropdown
                  value={formData.expiryYear}
                  onChange={(value) => setFormData(prev => ({ ...prev, expiryYear: value }))}
                  options={yearOptions}
                  placeholder="YYYY"
                />
              </div>
            </div>

            {/* CVV */}
            <PrimaryInput
              type="password"
              value={formData.cvv}
              onChange={(value) => setFormData(prev => ({ ...prev, cvv: value.replace(/\D/g, '') }))}
              placeholder="123"
              label="CVV"
              maxLength={4}
            />

            {/* Set as Default */}
            <div className="flex items-center space-x-3">
              <input
                type="checkbox"
                id="isDefault"
                checked={formData.isDefault}
                onChange={(e) => setFormData(prev => ({ ...prev, isDefault: e.target.checked }))}
                className="w-4 h-4 text-sera-orange bg-dark-600 border-dark-500 rounded focus:ring-sera-orange focus:ring-2"
              />
              <label htmlFor="isDefault" className="text-sm text-gray-300">
                Set as default payment method
              </label>
            </div>
          </div>

          {/* Footer */}
          <div className="p-6 border-t border-dark-600 flex justify-end space-x-3">
            <button
              onClick={handleCancel}
              disabled={isLoading}
              className="px-4 py-2 bg-dark-600 text-white rounded-lg hover:bg-dark-500 transition-colors duration-200 disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={isLoading}
              className="px-4 py-2 bg-sera-orange text-white rounded-lg hover:bg-sera-orange/90 transition-colors duration-200 disabled:opacity-50 flex items-center space-x-2"
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Saving...</span>
                </>
              ) : (
                <span>Add Payment Method</span>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Validation Modal */}
      <ValidationModal
        isOpen={showValidationModal}
        onClose={() => setShowValidationModal(false)}
        missingFields={missingFields}
        title="Required Fields Missing"
      />
    </>
  );
};

export default PaymentMethodModal;
