// Centralized types and interfaces for all contexts

// ===== AUTH CONTEXT TYPES =====
export interface AuthContextType {
  user: User | null;
  isLoginModalOpen: boolean;
  isSignupModalOpen: boolean;
  isLoading: boolean;
  openLoginModal: () => void;
  openSignupModal: () => void;
  closeLoginModal: () => void;
  closeSignupModal: () => void;
  switchToSignup: () => void;
  switchToLogin: () => void;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  register: (name: string, email: string, password: string) => Promise<boolean>;
}

export interface AuthProviderProps {
  children: React.ReactNode;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  data: {
    user: User;
    tokens: AuthTokens;
  };
}

// ===== USER TYPES =====
export interface User {
  id: string;
  _id?: string; // Optional for backward compatibility
  name: string;
  email: string;
  emailVerified: boolean;
  appRegistered: AppRegistration[];
  oauthProvider: 'local' | 'google' | 'facebook' | 'github';
  role: 'user' | 'business-user' | 'admin' | 'superadmin';
  appEndpoint: string;
  phone?: string;
  avatar?: string;
}

export interface AppRegistration {
  name: string;
  role: 'user' | 'business-user' | 'admin' | 'superadmin';
}

// ===== CART CONTEXT TYPES =====
export interface CartContextType {
  state: CartState;
  addItem: (item: any) => void; // Using any to avoid circular dependency
  removeItem: (uniqueId: string) => void;
  updateQuantity: (uniqueId: string, quantity: number) => void;
  clearCart: () => void;
  getItemQuantity: (itemId: string, customization?: Customization) => number;
  getCustomizedItemQuantity: (uniqueId: string) => number;
}

export interface CartState {
  items: CartItem[];
  totalItems: number;
  totalAmount: number;
}

export interface CartItem {
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
  id: string; // Add this for compatibility with existing cart logic
  uniqueId: string;
  quantity: number;
  customization?: Customization;
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

export interface Customization {
  size: string;
  spiceLevel: string;
  specialInstructions: string;
  quantity: number;
  totalPrice: number;
}

// ===== CART ACTION TYPES =====
export type CartAction =
  | { type: 'ADD_ITEM'; payload: CartItem }
  | { type: 'REMOVE_ITEM'; payload: string }
  | { type: 'UPDATE_QUANTITY'; payload: { uniqueId: string; quantity: number } }
  | { type: 'CLEAR_CART' };

// ===== API CONFIGURATION =====
export const AUTH_API_BASE_URL = 'https://simple-auth-service.vercel.app/api';
export const FOOD_DELIVERY_APP_URL = 'https://food-delivery-app-frontend.vercel.app';
