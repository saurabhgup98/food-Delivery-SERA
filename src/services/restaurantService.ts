import { ApiClient } from './base/apiClient';
import { 
  RestaurantsResponse,
  RestaurantResponse, 
  MenuResponse 
} from '../components/Restaurant/Config/RestaurantInterfaces';
import { ExploreFiltersI } from '../pages/interfaces/ExploreInterfaces';

export class RestaurantService extends ApiClient {
  // Fetch restaurants with filters - builds params from ExploreFiltersI and mode
  async fetchRestaurantsWithFilters(
    filters: ExploreFiltersI,
    mode: 'all' | 'favorites' = 'all'
  ): Promise<RestaurantsResponse> {
    const params: any = {};

    // Add mode-specific parameters
    if (mode === 'favorites') {
      params.favorites = true;
    }

    // Add common parameters from filters
    if (filters.search.trim()) {
      params.search = filters.search.trim();
    }
    
    // Backend expects single cuisine value, send first one if multiple selected
    if (filters.cuisine.length > 0) {
      params.cuisine = filters.cuisine[0];
    }
    
    if (filters.status !== 'all') {
      params.status = filters.status;
    }
    
    // Handle dietary: In favorites mode with vegFilter, use 'vegetarian', otherwise use first dietary option
    if (mode === 'favorites' && filters.vegFilter) {
      params.dietary = 'vegetarian';
    } else if (filters.dietary.length > 0) {
      // Backend expects single dietary value, send first one if multiple selected
      params.dietary = filters.dietary[0];
    }
    
    if (filters.priceRange !== 'all') {
      params.priceRange = filters.priceRange;
    }
    
    if (filters.sortBy) {
      params.sortBy = filters.sortBy;
    }

    return this._getRestaurants(params);
  }

  // Private method to make API request with raw params
  private async _getRestaurants(params?: {
    status?: string;
    cuisine?: string;
    dietary?: string;
    priceRange?: string;
    search?: string;
    favorites?: boolean;
    limit?: number;
    page?: number;
    sortBy?: string;
  }): Promise<RestaurantsResponse> {
    const queryParams = new URLSearchParams();
    
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          queryParams.append(key, value.toString());
        }
      });
    }
    
    const endpoint = `/restaurants${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
    return this.makeRequest<RestaurantsResponse>(endpoint);
  }

  // Get a specific restaurant by ID
  async getRestaurant(id: string): Promise<RestaurantResponse> {
    return this.makeRequest<RestaurantResponse>(`/restaurants?id=${id}`);
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
        if (value !== undefined && value !== null && value !== '') {
          queryParams.append(key, value.toString());
        }
      });
    }
    
    const endpoint = `/restaurants/${restaurantId}/menu${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
    return this.makeRequest<MenuResponse>(endpoint);
  }

}

export const restaurantService = new RestaurantService();