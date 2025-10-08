import React from 'react';
import PrimaryDropdown from '../Common/PrimaryDropdown';
import PrimaryInput from '../Common/PrimaryInput';
import LocationDropdown from '../Common/LocationDropdown';
import { FORM_FIELD_CONFIGS, FORM_FIELD_ORDER } from '../../config/addressConfig';

interface DeliveryAddressFormProps {
  formData: any;
  setFormData: (updater: (prev: any) => any) => void;
  loading: boolean;
  editingAddress: any;
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
  return (
    <div className="bg-dark-700 rounded-lg p-6 border border-dark-600">
      <div className="flex items-center justify-between mb-4">
        <h4 className="text-white font-medium">
          {editingAddress ? 'Edit Address' : 'Add New Address'}
        </h4>
        <button
          onClick={onCancel}
          className="text-gray-400 hover:text-white transition-colors duration-200"
        >
          ✕
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Configuration-driven form fields */}
        {FORM_FIELD_ORDER.map((fieldName) => {
          const config = FORM_FIELD_CONFIGS[fieldName];
          const value = formData[fieldName as keyof typeof formData];

          // Handler for field changes with dependency handling
          const handleChange = (newValue: string) => {
            setFormData(prev => {
              const updated: any = { ...prev, [fieldName]: newValue };
              // Reset dependent fields if configured
              if (config.resetFields) {
                config.resetFields.forEach((field: string) => {
                  updated[field] = '';
                });
              }
              return updated;
            });
          };

          // Render based on component type
          if (config.component === 'PrimaryInput') {
            return (
              <PrimaryInput
                key={fieldName}
                type={config.type || 'text'}
                value={value as string}
                onChange={handleChange}
                placeholder={config.placeholder}
                label={config.label}
              />
            );
          }

          if (config.component === 'PrimaryDropdown') {
            return (
              <div key={fieldName}>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  {config.label}
                </label>
                <PrimaryDropdown
                  value={value as string}
                  onChange={handleChange}
                  options={config.options}
                  placeholder={config.placeholder}
                />
              </div>
            );
          }

          if (config.component === 'LocationDropdown') {
            return (
              <div key={fieldName}>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  {config.label}
                </label>
                <LocationDropdown
                  type={config.locationType}
                  value={value as string}
                  onChange={handleChange}
                  placeholder={config.placeholder}
                  countryCode={config.locationType !== 'country' ? formData.country : undefined}
                  stateCode={config.locationType === 'city' ? formData.state : undefined}
                />
              </div>
            );
          }

          if (config.component === 'textarea') {
            return (
              <div key={fieldName} className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  {config.label}
                </label>
                <textarea
                  value={value as string}
                  onChange={(e) => handleChange(e.target.value)}
                  placeholder={config.placeholder}
                  rows={config.rows || 3}
                  className="w-full px-4 py-3 bg-dark-600 border border-dark-500 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-sera-orange focus:border-transparent resize-none"
                />
              </div>
            );
          }

          return null;
        })}

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
          onClick={onCancel}
          className="px-6 py-2 bg-dark-600 text-white rounded-lg hover:bg-dark-500 transition-colors duration-200"
        >
          Cancel
        </button>
        <button
          onClick={onSubmit}
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
  );
};

export default DeliveryAddressForm;