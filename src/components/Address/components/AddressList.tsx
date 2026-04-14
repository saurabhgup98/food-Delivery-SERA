import React from 'react';
import { Address } from '../../../services/api';
import { MapPin } from 'lucide-react';
import { PrimaryActionBtn } from '../../buttons';
import { SecondaryContentContainer } from '../../Container';

interface AddressListProps {
  addresses: Address[];
  onEdit: (address: Address) => void;
  onDelete: (id: string) => void;
  onSetDefault: (id: string) => void;
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
        <div
          key={address._id}
          className={`p-4 border rounded-lg transition-colors ${
            address.isDefault
              ? 'border-sera-orange bg-orange-500/10'
              : 'border-dark-600 hover:border-dark-500'
          }`}
        >
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center space-x-2 mb-2">
                <MapPin className="w-4 h-4 text-gray-400" />
                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                  {address.type}
                </span>
                {address.isDefault && (
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                    Default
                  </span>
                )}
              </div>
              <p className="text-white font-medium mb-1">{address.name}</p>
              <p className="text-gray-400 text-sm mb-1">{address.phone}</p>
              <p className="text-gray-300 text-sm">
                {address.address}, {address.city}, {address.state} - {address.pincode}
              </p>
              {address.instructions && (
                <p className="text-gray-400 text-sm mt-2">
                  <span className="font-medium">Instructions:</span> {address.instructions}
                </p>
              )}
            </div>
            <div className="flex items-center space-x-2 ml-4">
              {!address.isDefault && (
                <PrimaryActionBtn
                  content={
                    <SecondaryContentContainer
                      rows={[
                        {
                          components: [
                            { content: <span className="text-yellow-400 text-lg">★</span> }
                          ],
                          gap: '0'
                        }
                      ]}
                    />
                  }
                  onClick={() => onSetDefault(address._id)}
                  width="w-10"
                  height="h-10"
                  bgColor="bg-dark-600"
                  bgHoverColor="hover:bg-yellow-500/20"
                  radius="rounded-lg"
                />
              )}
              <PrimaryActionBtn
                content={
                  <SecondaryContentContainer
                    rows={[
                      {
                        components: [
                          { content: <span className="text-white text-sm font-semibold">✎</span> }
                        ],
                        gap: '0'
                      }
                    ]}
                  />
                }
                onClick={() => onEdit(address)}
                width="w-10"
                height="h-10"
                bgColor="bg-dark-600"
                bgHoverColor="hover:bg-dark-500"
                radius="rounded-lg"
              />
              <PrimaryActionBtn
                content={
                  <SecondaryContentContainer
                    rows={[
                      {
                        components: [
                          { content: <span className="text-red-400 text-sm font-semibold">🗑</span> }
                        ],
                        gap: '0'
                      }
                    ]}
                  />
                }
                onClick={() => onDelete(address._id)}
                width="w-10"
                height="h-10"
                bgColor="bg-dark-600"
                bgHoverColor="hover:bg-red-500/20"
                radius="rounded-lg"
              />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default AddressList;