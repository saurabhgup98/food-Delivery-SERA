import React from 'react';
import { Address } from '../../services/api';

interface AddressListProps {
  addresses: Address[];
  onEdit: (address: Address) => void;
  onDelete: (addressId: string) => void;
  onSetDefault: (addressId: string) => void;
}

const AddressList: React.FC<AddressListProps> = ({
  addresses,
  onEdit,
  onDelete,
  onSetDefault
}) => {
  return (
    <div className="space-y-4">
      {addresses.map((address) => (
        <div key={address._id} className="bg-dark-700 rounded-lg p-6 border border-dark-600">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center space-x-3 mb-3">
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                  {address.type}
                </span>
                {address.isDefault && (
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    Default
                  </span>
                )}
              </div>

              <div className="space-y-1">
                <p className="text-white font-medium">{address.name}</p>
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
                  onClick={() => onSetDefault(address._id)}
                  className="px-3 py-1 bg-dark-600 text-white text-sm rounded hover:bg-dark-500 transition-colors duration-200"
                >
                  Set Default
                </button>
              )}
              <button
                onClick={() => onEdit(address)}
                className="px-3 py-1 bg-dark-600 text-white text-sm rounded hover:bg-dark-500 transition-colors duration-200"
              >
                Edit
              </button>
              <button
                onClick={() => onDelete(address._id)}
                className="px-3 py-1 bg-red-600 text-white text-sm rounded hover:bg-red-700 transition-colors duration-200"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default AddressList;