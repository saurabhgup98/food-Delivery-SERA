export interface User {
  id: string;
  _id?: string; // MongoDB ObjectId format (for compatibility)
  name: string;
  email: string;
  emailVerified: boolean;
  appRegistered: { name: string; role: string; }[];
  oauthProvider?: 'google' | 'facebook' | 'github' | 'local';
  role?: string; // App-specific role
  appEndpoint?: string; // App-specific endpoint
  phone?: string;
  avatar?: string;
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

export interface Restaurant {
  id: string;
  name: string;
  ownerId: string;
  status: 'pending' | 'approved' | 'rejected';
  cuisine: string;
  address: string;
  phone: string;
  description: string;
  image: string;
  rating: number;
  deliveryTime: string;
  minimumOrder: number;
  dishes: Dish[];
  isOpen: boolean;
}

export interface Dish {
  id: string;
  name: string;
  price: number;
  description: string;
  category: string;
  image: string;
  available: boolean;
  isVegetarian: boolean;
  isSpicy: boolean;
  preparationTime: number;
}

export interface CartItem {
  id: string;
  dish: Dish;
  quantity: number;
  restaurantId: string;
  restaurantName: string;
}

export interface Order {
  id: string;
  userId: string;
  restaurantId: string;
  items: CartItem[];
  total: number;
  status: 'pending' | 'confirmed' | 'preparing' | 'out_for_delivery' | 'delivered' | 'cancelled';
  deliveryAddress: string;
  deliveryTime: string;
  createdAt: string;
  updatedAt: string;
}

export interface Notification {
  _id: string;
  userId: string;
  title: string;
  message: string;
  type: 'security' | 'registration' | 'review' | 'promo' | 'birthday';
  isRead: boolean;
  action: 'none' | 'rate' | 'use_code' | 'view_order';
  orderId?: string;
  promoCode?: string;
  expiresAt?: string;
  sentEmail: boolean;
  createdAt: string;
  updatedAt: string;
}
