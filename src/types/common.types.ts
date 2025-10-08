// Common types used across multiple domains

export interface PaginationInfo {
  currentPage: number;
  totalPages: number;
  totalCount: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

export interface Coordinates {
  latitude: number;
  longitude: number;
}

export interface LocationInfo {
  address?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  coordinates?: Coordinates;
}

export interface ContactFormData {
  name: string;
  email: string;
  subject: string;
  message: string;
  phone?: string;
}

export interface ContactSubmission {
  _id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  phone?: string;
  status: 'new' | 'in_progress' | 'resolved';
  createdAt: string;
  updatedAt: string;
}

export interface ContactSubmissionsResponse {
  success: boolean;
  message: string;
  data: {
    submissions: ContactSubmission[];
    pagination: PaginationInfo;
  };
}

export interface Country {
  code: string;
  name: string;
  phoneCode: string;
}

export interface State {
  code: string;
  name: string;
  countryCode: string;
}

export interface City {
  code: string;
  name: string;
  stateCode: string;
  countryCode: string;
}

export interface CountryCodesResponse {
  success: boolean;
  message: string;
  data: {
    countries: Country[];
  };
}

export interface StatesResponse {
  success: boolean;
  message: string;
  data: {
    states: State[];
  };
}

export interface CitiesResponse {
  success: boolean;
  message: string;
  data: {
    cities: City[];
  };
}

export interface ChatMessage {
  _id: string;
  userId: string;
  message: string;
  response: string;
  timestamp: string;
}

export interface ChatResponse {
  success: boolean;
  message: string;
  data: {
    chatMessage: ChatMessage;
  };
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

export interface NotificationsResponse {
  success: boolean;
  message: string;
  data: {
    notifications: Notification[];
    pagination: PaginationInfo;
  };
}

export interface CreateNotificationRequest {
  userId: string;
  title: string;
  message: string;
  type: 'order' | 'promotion' | 'system' | 'delivery';
}

export interface PromoCode {
  _id: string;
  code: string;
  description: string;
  discountType: 'percentage' | 'fixed';
  discountValue: number;
  minOrderAmount?: number;
  maxDiscountAmount?: number;
  validFrom: string;
  validUntil: string;
  usageLimit?: number;
  usedCount: number;
  isActive: boolean;
  isUsed: boolean;
  expiresAt: string;
  createdAt: string;
}

export interface CreatePromoCodeRequest {
  code: string;
  description: string;
  discountType: 'percentage' | 'fixed';
  discountValue: number;
  minOrderAmount?: number;
  maxDiscountAmount?: number;
  validFrom: string;
  validUntil: string;
  usageLimit?: number;
}

export interface PromoCodesResponse {
  success: boolean;
  message: string;
  data: {
    promoCodes: PromoCode[];
  };
}

// User and Authentication types
export interface User {
  _id: string;
  id?: string; // For backward compatibility
  username?: string; // For backward compatibility
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
  dateOfBirth?: string;
  gender?: 'male' | 'female' | 'other';
  preferences?: {
    dietary?: string[];
    allergies?: string[];
    favoriteCuisines?: string[];
    spiceLevel?: 'mild' | 'medium' | 'hot';
  };
  createdAt: string;
  updatedAt: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phone?: string;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  data: {
    user: User;
    token?: string;
  };
}
