export interface Address {
  _id: string;
  userId: string;
  type: 'home' | 'work' | 'other';
  name: string;
  phone?: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  country: string;
  isDefault: boolean;
  instructions?: string;
  coordinates?: {
    latitude: number;
    longitude: number;
  };
  createdAt: string;
  updatedAt: string;
}

export interface AddressesResponse {
  success: boolean;
  message: string;
  data: {
    addresses: Address[];
  };
}

export interface AddressResponse {
  success: boolean;
  message: string;
  data: {
    address: Address;
  };
}
