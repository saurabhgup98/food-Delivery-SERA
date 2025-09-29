// API Types - Centralized type definitions for API layer

export interface ApiResponse<T = any> {
  success: boolean;
  data: T;
  message?: string;
}

export interface ApiError {
  error: string;
  status: number;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

export interface User {
  id: string;
  username?: string;
  email: string;
  role?: string;
  availableRoles?: string[];
  appIdentifier?: string;
  authMethod?: string;
  appRegistered: Array<{
    appIdentifier: string;
    roles: string[];
    authMethod: string;
    isActive: boolean;
  }>;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  data: {
    user: User;
    role?: string;
    availableRoles?: string[];
    appIdentifier?: string;
    authMethod?: string;
  };
}

export interface LoginRequest {
  email: string;
  password: string;
  appEndpoint: string;
  selectedRole?: string;
}

export interface RegisterRequest {
  username?: string;
  email: string;
  password: string;
  appEndpoint: string;
  role?: 'user' | 'business-user' | 'admin' | 'superadmin';
}

export interface HttpConfig {
  baseURL: string;
  timeout?: number;
  retryAttempts?: number;
}
