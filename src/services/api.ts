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

class ApiService {
  private async makeRequest<T>(endpoint: string, options?: RequestInit): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`;
    
    try {
      const response = await fetch(url, {
        headers: {
          'Content-Type': 'application/json',
          ...options?.headers,
        },
        ...options,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
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
}

export const apiService = new ApiService();
