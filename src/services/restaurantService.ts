import { ApiClient } from './base/apiClient';
import { 
  Restaurant, 
  MenuItem, 
  RestaurantsResponse, 
  RestaurantResponse, 
  MenuResponse 
} from '../types/restaurant.types';

export class RestaurantService extends ApiClient {
  // Get all restaurants with optional filters
  async getRestaurants(params?: {
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
        if (value !== undefined && value !== null && value !== '') {
          queryParams.append(key, value.toString());
        }
      });
    }
    
    const endpoint = `/restaurants/${restaurantId}/menu${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
    return this.makeRequest<MenuResponse>(endpoint);
  }

  // Get popular food items for a restaurant (mock data for now)
  async getRestaurantFoodItems(restaurantId: string): Promise<{ success: boolean; data: { foodItems: MenuItem[] } }> {
    
    // Mock food data based on restaurant cuisine
    const mockFoodData: Record<string, MenuItem[]> = {
      'indian': [
        {
          _id: '1',
          restaurantId,
          name: 'Butter Chicken',
          description: 'Creamy tomato-based curry with tender chicken pieces',
          price: '₹320',
          image: 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=400',
          category: 'mains',
          dietary: 'non-veg',
          spiceLevel: 'medium',
          prepTime: '25 min',
          calories: '450 cal',
          rating: 4.5,
          isPopular: true,
          isChefSpecial: false,
          isQuickOrder: true,
          isTrending: true,
          isAvailable: true,
          customizationOptions: {
            sizes: [
              { name: 'Regular', price: '₹320' },
              { name: 'Large', price: '₹450' }
            ],
            spiceLevels: [
              { name: 'Mild', price: '₹0' },
              { name: 'Medium', price: '₹0' },
              { name: 'Hot', price: '₹0' }
            ]
          }
        },
        {
          _id: '2',
          restaurantId,
          name: 'Dal Makhani',
          description: 'Rich and creamy black lentils cooked with butter and cream',
          price: '₹280',
          image: 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=400',
          category: 'mains',
          dietary: 'veg',
          prepTime: '30 min',
          calories: '380 cal',
          rating: 4.3,
          isPopular: true,
          isChefSpecial: true,
          isQuickOrder: false,
          isTrending: false,
          isAvailable: true
        }
      ],
      'italian': [
        {
          _id: '3',
          restaurantId,
          name: 'Margherita Pizza',
          description: 'Classic pizza with tomato sauce, mozzarella, and fresh basil',
          price: '₹450',
          image: 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=400',
          category: 'mains',
          dietary: 'veg',
          prepTime: '20 min',
          calories: '520 cal',
          rating: 4.4,
          isPopular: true,
          isChefSpecial: false,
          isQuickOrder: true,
          isTrending: true,
          isAvailable: true,
          customizationOptions: {
            sizes: [
              { name: 'Small (8")', price: '₹350' },
              { name: 'Medium (10")', price: '₹450' },
              { name: 'Large (12")', price: '₹550' }
            ]
          }
        }
      ],
      'chinese': [
        {
          _id: '4',
          restaurantId,
          name: 'Chicken Manchurian',
          description: 'Crispy chicken balls in tangy Manchurian sauce',
          price: '₹380',
          image: 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=400',
          category: 'mains',
          dietary: 'non-veg',
          spiceLevel: 'medium',
          prepTime: '25 min',
          calories: '420 cal',
          rating: 4.2,
          isPopular: true,
          isChefSpecial: false,
          isQuickOrder: true,
          isTrending: false,
          isAvailable: true
        }
      ]
    };

    // Default to Indian cuisine if not found
    const cuisine = 'indian';
    const foodItems = mockFoodData[cuisine] || mockFoodData['indian'];
    

    return {
      success: true,
      data: { foodItems }
    };
  }
}

export const restaurantService = new RestaurantService();
