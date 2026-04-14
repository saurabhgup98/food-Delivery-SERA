export interface MenuItemI {
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
    restaurants: RestaurantI[];
    pagination: {
      currentPage: number;
      totalPages: number;
      totalCount: number;
      hasNextPage: boolean;
      hasPrevPage: boolean;
    };
  };
}
export interface RestaurantItemCardPropsI {
  item: MenuItemI;
  onAddToCart: (item: MenuItemI) => void;
  onCustomize: (item: MenuItemI) => void;
  getItemQuantity: (itemId: string) => number;
  updateQuantity: (itemId: string, quantity: number) => void;
  restaurantStatus?: 'OPEN' | 'CLOSED' | 'TEMPORARILY_CLOSED' | 'PERMANENTLY_CLOSED';
  isHovered?: boolean;
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
}

export interface RestaurantI {
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
  dishes?: MenuItemI[]; // Embedded dishes array
}

export interface RestaurantDisplayPropsI {
  restaurants: RestaurantI[];
  viewMode: 'grid' | 'list';
  onFavoriteToggle: (restaurantId: string) => void;
  onViewMenu: (restaurant: RestaurantI) => void;
  onClearFilters?: () => void;
  className?: string;
}

export interface RestaurantDetailsHeroSectionPropsI {
  restaurant: RestaurantI;
  isFavorite: boolean;
  onFavoriteToggle: () => void;
  onShare?: () => void;
}

export interface RestaurantResponseI {
  success: boolean;
  message: string;
  data: {
    restaurant: RestaurantI;
  };
}

export interface MenuResponseI {
  success: boolean;
  message: string;
  data: {
    menu: MenuItemI[];
    pagination: {
      currentPage: number;
      totalPages: number;
      totalCount: number;
      hasNextPage: boolean;
      hasPrevPage: boolean;
    };
  };
}

// Type aliases for backward compatibility with services
export type Restaurant = RestaurantI;
export type MenuItem = MenuItemI;
export type RestaurantResponse = RestaurantResponseI;
export type MenuResponse = MenuResponseI;