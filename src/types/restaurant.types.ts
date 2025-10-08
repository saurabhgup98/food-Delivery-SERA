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
    menu: MenuItem[];
    pagination: {
      currentPage: number;
      totalPages: number;
      totalCount: number;
      hasNextPage: boolean;
      hasPrevPage: boolean;
    };
  };
}
