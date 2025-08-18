const API_BASE_URL = process.env.REACT_APP_API_URL || 'https://food-delivery-backend-sera.vercel.app/api';

export interface Restaurant {
  _id: string;
  name: string;
  image: string;
  rating: number;
  reviewCount: number;
  cuisine: string[];
  dietary: 'veg' | 'non-veg' | 'both' | 'jain' | 'vegan';
  deliveryTime: string;
  deliveryFee: string;
  minimumOrder: string;
  distance: string;
  popularDishes: string[];
  offers: string[];
  isOpen: boolean;
  isFavorite: boolean;
  priceRange: 'budget' | 'mid-range' | 'premium';
  features: string[];
  status: 'OPEN' | 'CLOSED' | 'TEMPORARILY_CLOSED' | 'PERMANENTLY_CLOSED';
  subStatus?: 'NORMAL' | 'BUSY' | 'VERY_BUSY';
  statusDetails?: {
    nextOpenTime?: string;
    tempCloseReason?: string;
    tempCloseDuration?: string;
  };
  location?: {
    address?: string;
    city?: string;
    state?: string;
    zipCode?: string;
    coordinates?: {
      latitude: number;
      longitude: number;
    };
  };
}

export interface MenuItem {
  _id: string;
  restaurantId: string;
  name: string;
  description: string;
  price: string;
  image: string;
  category: 'starters' | 'mains' | 'breads' | 'desserts' | 'beverages';
  dietary: 'veg' | 'non-veg' | 'jain' | 'vegan';
  spiceLevel?: 'mild' | 'medium' | 'hot' | 'extra-hot';
  prepTime: string;
  calories?: string;
  rating: number;
  isPopular: boolean;
  isChefSpecial: boolean;
  isQuickOrder: boolean;
  isTrending: boolean;
  isAvailable: boolean;
  customizationOptions?: {
    sizes?: Array<{ name: string; price: string }>;
    spiceLevels?: Array<{ name: string; price: string }>;
    addOns?: Array<{ name: string; price: string }>;
  };
}

export interface RestaurantsResponse {
  success: boolean;
  message: string;
  data: {
    restaurants: Restaurant[];
    pagination: {
      currentPage: number;
      totalPages: number;
      totalCount: number;
      hasNextPage: boolean;
      hasPrevPage: boolean;
    };
  };
}

export interface RestaurantResponse {
  success: boolean;
  message: string;
  data: {
    restaurant: Restaurant;
  };
}

export interface Address {
  _id: string;
  userId: string;
  label: string;
  fullName: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  isDefault: boolean;
  instructions?: string;
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

export interface MenuResponse {
  success: boolean;
  message: string;
  data: {
    menuItems: MenuItem[];
    categoryStats: Record<string, number>;
    pagination: {
      currentPage: number;
      totalPages: number;
      totalCount: number;
      hasNextPage: boolean;
      hasPrevPage: boolean;
    };
  };
}

export interface OrderItem {
  itemId: string;
  name: string;
  price: string;
  quantity: number;
  customization?: {
    size: string;
    spiceLevel: string;
    specialInstructions: string;
    totalPrice: number;
  };
}

export interface Order {
  _id: string;
  userId: string;
  restaurantId: string;
  restaurantName: string;
  items: OrderItem[];
  subtotal: number;
  deliveryFee: number;
  total: number;
  status: 'pending' | 'confirmed' | 'preparing' | 'out_for_delivery' | 'delivered' | 'cancelled';
  deliveryAddress: string;
  deliveryInstructions?: string;
  estimatedDeliveryTime: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateOrderRequest {
  restaurantId: string;
  restaurantName: string;
  items: OrderItem[];
  subtotal: number;
  deliveryFee: number;
  total: number;
  deliveryAddress: string;
  deliveryInstructions?: string;
}

export interface OrderResponse {
  success: boolean;
  message: string;
  data: {
    order: Order;
  };
}

export interface OrdersResponse {
  success: boolean;
  message: string;
  data: {
    orders: Order[];
    pagination: {
      currentPage: number;
      totalPages: number;
      totalCount: number;
      hasNextPage: boolean;
      hasPrevPage: boolean;
    };
  };
}

class ApiService {
  private async makeRequest<T>(endpoint: string, options?: RequestInit): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`;
    console.log('Making API request to:', url);
    
    // Get auth token from localStorage
    const token = localStorage.getItem('authToken');
    
    try {
      const response = await fetch(url, {
        headers: {
          'Content-Type': 'application/json',
          ...(token && { 'Authorization': `Bearer ${token}` }),
          ...options?.headers,
        },
        ...options,
      });

      console.log('Response status:', response.status);
      console.log('Response headers:', response.headers);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Response error text:', errorText);
        throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
      }

      const data = await response.json();
      console.log('Response data:', data);
      return data;
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  // Get all restaurants with optional filters
  async getRestaurants(params?: {
    status?: string;
    cuisine?: string;
    dietary?: string;
    priceRange?: string;
    search?: string;
    limit?: number;
    page?: number;
  }): Promise<RestaurantsResponse> {
    const queryParams = new URLSearchParams();
    
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          queryParams.append(key, value.toString());
        }
      });
    }

    const endpoint = `/restaurants${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
    return this.makeRequest<RestaurantsResponse>(endpoint);
  }

  // Get a specific restaurant by ID
  async getRestaurant(id: string): Promise<RestaurantResponse> {
    return this.makeRequest<RestaurantResponse>(`/restaurants/${id}`);
  }

  // Get menu items for a specific restaurant
  async getRestaurantMenu(
    restaurantId: string,
    params?: {
      category?: string;
      dietary?: string;
      search?: string;
      type?: 'all' | 'popular' | 'chef-special' | 'quick-order' | 'trending';
      limit?: number;
      page?: number;
    }
  ): Promise<MenuResponse> {
    const queryParams = new URLSearchParams();
    
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          queryParams.append(key, value.toString());
        }
      });
    }

    const endpoint = `/restaurants/${restaurantId}/menu${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
    return this.makeRequest<MenuResponse>(endpoint);
  }

  // Get popular food items for a restaurant (mock data for now)
  async getRestaurantFoodItems(restaurantId: string): Promise<{ success: boolean; data: { foodItems: MenuItem[] } }> {
    console.log('Fetching food items for restaurant:', restaurantId);
    
    // Mock food data based on restaurant cuisine
    const mockFoodData: Record<string, MenuItem[]> = {
      'indian': [
        {
          _id: '1',
          restaurantId,
          name: 'Butter Chicken',
          description: 'Creamy tomato-based curry with tender chicken',
          price: '₹350',
          image: 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=400',
          category: 'mains',
          dietary: 'non-veg',
          spiceLevel: 'medium',
          prepTime: '25 min',
          calories: '450 kcal',
          rating: 4.5,
          isPopular: true,
          isChefSpecial: false,
          isQuickOrder: true,
          isTrending: true,
          isAvailable: true
        },
        {
          _id: '2',
          restaurantId,
          name: 'Paneer Tikka',
          description: 'Grilled cottage cheese with Indian spices',
          price: '₹280',
          image: 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=400',
          category: 'starters',
          dietary: 'veg',
          spiceLevel: 'medium',
          prepTime: '20 min',
          calories: '320 kcal',
          rating: 4.3,
          isPopular: true,
          isChefSpecial: false,
          isQuickOrder: true,
          isTrending: false,
          isAvailable: true
        },
        {
          _id: '3',
          restaurantId,
          name: 'Naan Bread',
          description: 'Soft leavened flatbread',
          price: '₹50',
          image: 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=400',
          category: 'breads',
          dietary: 'veg',
          prepTime: '10 min',
          calories: '150 kcal',
          rating: 4.0,
          isPopular: false,
          isChefSpecial: false,
          isQuickOrder: true,
          isTrending: false,
          isAvailable: true
        }
      ],
      'chinese': [
        {
          _id: '4',
          restaurantId,
          name: 'Kung Pao Chicken',
          description: 'Spicy diced chicken with peanuts and vegetables',
          price: '₹420',
          image: 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=400',
          category: 'mains',
          dietary: 'non-veg',
          spiceLevel: 'hot',
          prepTime: '30 min',
          calories: '380 kcal',
          rating: 4.4,
          isPopular: true,
          isChefSpecial: true,
          isQuickOrder: false,
          isTrending: true,
          isAvailable: true
        },
        {
          _id: '5',
          restaurantId,
          name: 'Vegetable Fried Rice',
          description: 'Stir-fried rice with mixed vegetables',
          price: '₹180',
          image: 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=400',
          category: 'mains',
          dietary: 'veg',
          prepTime: '15 min',
          calories: '280 kcal',
          rating: 4.1,
          isPopular: true,
          isChefSpecial: false,
          isQuickOrder: true,
          isTrending: false,
          isAvailable: true
        }
      ],
      'italian': [
        {
          _id: '6',
          restaurantId,
          name: 'Margherita Pizza',
          description: 'Classic pizza with tomato sauce and mozzarella',
          price: '₹450',
          image: 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=400',
          category: 'mains',
          dietary: 'veg',
          prepTime: '20 min',
          calories: '320 kcal',
          rating: 4.6,
          isPopular: true,
          isChefSpecial: false,
          isQuickOrder: true,
          isTrending: true,
          isAvailable: true
        },
        {
          _id: '7',
          restaurantId,
          name: 'Pasta Carbonara',
          description: 'Creamy pasta with bacon and parmesan',
          price: '₹380',
          image: 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=400',
          category: 'mains',
          dietary: 'non-veg',
          prepTime: '25 min',
          calories: '420 kcal',
          rating: 4.3,
          isPopular: true,
          isChefSpecial: true,
          isQuickOrder: false,
          isTrending: false,
          isAvailable: true
        }
      ]
    };

    // Default to Indian cuisine if not found
    const cuisine = 'indian';
    const foodItems = mockFoodData[cuisine] || mockFoodData['indian'];
    
    console.log('Returning food items:', foodItems.length, 'items for cuisine:', cuisine);

    return {
      success: true,
      data: { foodItems }
    };
  }

  // Create a new order
  async createOrder(orderData: CreateOrderRequest): Promise<OrderResponse> {
    return this.makeRequest<OrderResponse>('/orders', {
      method: 'POST',
      body: JSON.stringify(orderData)
    });
  }

  // Get user's orders
  async getUserOrders(params?: {
    status?: string;
    limit?: number;
    page?: number;
  }): Promise<OrdersResponse> {
    const queryParams = new URLSearchParams();
    
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          queryParams.append(key, value.toString());
        }
      });
    }

    const endpoint = `/orders${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
    return this.makeRequest<OrdersResponse>(endpoint);
  }

  // Get a specific order by ID
  async getOrder(orderId: string): Promise<OrderResponse> {
    return this.makeRequest<OrderResponse>(`/orders/${orderId}`);
  }

  // Complete user profile
  async completeProfile(profileData: {
    name: string;
    phone: string;
    dateOfBirth?: string;
    gender?: string;
    addresses?: Array<{
      type: string;
      street: string;
      city: string;
      state: string;
      pincode: string;
      isDefault?: boolean;
    }>;
    preferences?: {
      dietary?: string;
      spiceLevel?: string;
    };
    settings?: {
      notifications?: {
        email?: boolean;
        push?: boolean;
        sms?: boolean;
      };
    };
  }): Promise<{ success: boolean; message: string; data: { user: any } }> {
    return this.makeRequest<{ success: boolean; message: string; data: { user: any } }>('/user?action=complete-profile', {
      method: 'POST',
      body: JSON.stringify(profileData)
    });
  }

  // Address management methods
  async getAddresses(): Promise<AddressesResponse> {
    return this.makeRequest<AddressesResponse>('/addresses');
  }

  async createAddress(addressData: {
    label: string;
    fullName: string;
    phone: string;
    address: string;
    city: string;
    state: string;
    pincode: string;
    isDefault?: boolean;
    instructions?: string;
  }): Promise<AddressResponse> {
    return this.makeRequest<AddressResponse>('/addresses', {
      method: 'POST',
      body: JSON.stringify(addressData)
    });
  }

  async updateAddress(addressId: string, addressData: {
    label?: string;
    fullName?: string;
    phone?: string;
    address?: string;
    city?: string;
    state?: string;
    pincode?: string;
    isDefault?: boolean;
    instructions?: string;
  }): Promise<AddressResponse> {
    return this.makeRequest<AddressResponse>('/addresses', {
      method: 'PUT',
      body: JSON.stringify({ id: addressId, ...addressData })
    });
  }

  async deleteAddress(addressId: string): Promise<{ success: boolean; message: string }> {
    return this.makeRequest<{ success: boolean; message: string }>(`/addresses?addressId=${addressId}`, {
      method: 'DELETE'
    });
  }
}

export const apiService = new ApiService();
