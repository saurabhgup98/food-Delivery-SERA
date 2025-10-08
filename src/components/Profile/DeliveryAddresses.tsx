import React from 'react';
import MessageDisplay from '../Common/MessageDisplay';
import DeliveryAddressForm from './DeliveryAddressForm';
import AddressList from './AddressList';
import { useAddressManagement } from '../../hooks/useAddressManagement';

const DeliveryAddresses: React.FC = () => {
  const {
    addresses,
    isAddingNew,
    editingAddress,
    formData,
    loading,
    error,
    successMessage,
    setFormData,
    handleSubmit,
    handleEdit,
    handleDelete,
    handleSetDefault,
    handleCancel,
    handleAddNew,
    clearMessages
  } = useAddressManagement();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-xl font-semibold text-white">Delivery Addresses</h3>
          <p className="text-gray-400 text-sm">Manage your delivery addresses for quick ordering</p>
        </div>
        {!(isAddingNew || editingAddress) && (
          <button
            onClick={handleAddNew}
            className="px-4 py-2 bg-sera-orange text-white rounded-lg hover:bg-orange-600 transition-colors duration-200"
          >
            + Add New Address
          </button>
        )}
      </div>

      {/* Error Message */}
      <MessageDisplay type="error" message={error || ''} onClose={clearMessages} />

      {/* Success Message */}
      <MessageDisplay type="success" message={successMessage || ''} onClose={clearMessages} />

      {/* Conditional Rendering: Form or Address List */}
      {(isAddingNew || editingAddress) ? (
        <DeliveryAddressForm
          formData={formData}
          setFormData={setFormData}
          loading={loading}
          editingAddress={editingAddress}
          onSubmit={handleSubmit}
          onCancel={handleCancel}
        />
      ) : (
        <>
          {/* Loading State */}
          {loading ? (
            <div className="bg-dark-700 rounded-lg p-8 border border-dark-600 text-center">
              <div className="text-gray-400 text-4xl mb-4">⏳</div>
              <h4 className="text-white font-medium mb-2">Loading addresses...</h4>
              <p className="text-gray-400 text-sm">Please wait while we fetch your delivery addresses</p>
            </div>
          ) : addresses.length === 0 ? (
            /* Empty State */
            <div className="bg-dark-700 rounded-lg p-8 border border-dark-600 text-center">
              <div className="text-gray-400 text-4xl mb-4">📍</div>
              <h4 className="text-white font-medium mb-2">No delivery addresses</h4>
              <p className="text-gray-400 text-sm mb-4">Add your first delivery address to get started with quick ordering</p>
              <button
                onClick={handleAddNew}
                className="px-4 py-2 bg-sera-orange text-white rounded-lg hover:bg-orange-600 transition-colors duration-200"
              >
                + Add Your First Address
              </button>
            </div>
          ) : (
            /* Address List */
            <AddressList
              addresses={addresses}
              onEdit={handleEdit}
              onDelete={handleDelete}
              onSetDefault={handleSetDefault}
            />
          )}
        </>
      )}
    </div>
  );
};

export default DeliveryAddresses;