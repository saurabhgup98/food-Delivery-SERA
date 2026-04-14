import React from 'react';

import { FetchDeliveryAddressOperationResultProps } from '../config/DeliveryAddressConfig';
import { useAddressManagement } from '../../../hooks/useAddressManagement';
import { PrimaryContentContainer } from '../../Container';
import { getHeaderContainerProps } from '../../Header/CommonHeaderConfig';
import { MessageDisplay, StateDisplay } from '../../common';
import DeliveryAddressForm from '../../Address/components/DeliveryAddressForm';
import { AddressList } from '.';

const DeliveryAddresses: React.FC = () => {
  const {
    addresses: hookAddresses,
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

  // Use real addresses from the hook
  const addresses = hookAddresses;

  // Get operation result props
  const operationResultProps = FetchDeliveryAddressOperationResultProps(handleAddNew);

  return (
    <div className="space-y-6">
      {/* Header */}
      <PrimaryContentContainer
        {...getHeaderContainerProps('deliveryAddress', handleAddNew)}
      />

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
            <StateDisplay status="loading" config={operationResultProps.loading} />
          ) : addresses.length === 0 ? (
            /* Empty State */
            <StateDisplay status="empty" config={operationResultProps.empty} />
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