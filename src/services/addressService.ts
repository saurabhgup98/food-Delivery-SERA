import { ApiClient } from './base/apiClient';
import { 
  Address, 
  AddressesResponse, 
  AddressResponse 
} from '../types/address.types';

export class AddressService extends ApiClient {
  // Address management methods
  async getAddresses(): Promise<AddressesResponse> {
    return this.makeRequest<AddressesResponse>('/user/addresses');
  }

  async createAddress(addressData: {
    type: 'home' | 'work' | 'other';
    name: string;
    address: string;
    city: string;
    state: string;
    pincode: string;
    country: string;
    isDefault?: boolean;
    instructions?: string;
  }): Promise<AddressResponse> {
    return this.makeRequest<AddressResponse>('/user/addresses', {
      method: 'POST',
      body: JSON.stringify(addressData)
    });
  }

  async updateAddress(addressId: string, addressData: {
    type?: 'home' | 'work' | 'other';
    name?: string;
    address?: string;
    city?: string;
    state?: string;
    pincode?: string;
    country?: string;
    isDefault?: boolean;
    instructions?: string;
  }): Promise<AddressResponse> {
    return this.makeRequest<AddressResponse>('/user?action=update-address', {
      method: 'PUT',
      body: JSON.stringify({ id: addressId, ...addressData })
    });
  }

  async deleteAddress(addressId: string): Promise<{ success: boolean; message: string }> {
    return this.makeRequest(`/user/addresses/${addressId}`, {
      method: 'DELETE'
    });
  }
}

export const addressService = new AddressService();
