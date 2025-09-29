// Auth Service - Authentication-related API operations

import { HttpClient } from './httpClient';
import { API_ENDPOINTS } from './constants';
import { AuthResponse, LoginRequest, RegisterRequest } from './types';

// User data storage utilities
const setUserData = (user: any): void => {
  localStorage.setItem('user', JSON.stringify(user));
};

const getUserData = (): any => {
  const user = localStorage.getItem('user');
  return user ? JSON.parse(user) : null;
};

const clearUserData = (): void => {
  localStorage.removeItem('user');
  localStorage.removeItem('isLoggedIn');
};

export class AuthService {
  constructor(private httpClient: HttpClient) {}

  /** Register user */
  async register(userData: RegisterRequest): Promise<AuthResponse> {
    const response = await this.httpClient.post<any>(
      API_ENDPOINTS.register,
      userData
    );

    if (response.success && response.data?.user) {
      setUserData(response.data.user);
    }

    return response as AuthResponse;
  }

  /** Login user */
  async login(credentials: LoginRequest): Promise<AuthResponse> {
    const response = await this.httpClient.post<any>(
      API_ENDPOINTS.login,
      credentials
    );

    if (response.success && response.data?.user) {
      setUserData(response.data.user);
    }

    return response as AuthResponse;
  }

  /** Logout user */
  async logout(): Promise<{ success: boolean; message: string }> {
    try {
      clearUserData();
      return { success: true, message: 'Logged out successfully' };
    } catch (error) {
      console.error('Logout error:', error);
      return { success: false, message: 'Logout failed' };
    }
  }

  /** Check if user is authenticated */
  isAuthenticated(): boolean {
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    const user = getUserData();
    return !!(isLoggedIn === 'true' && user);
  }

  /** Get current user */
  getCurrentUser(): any {
    return getUserData();
  }

  /** Handle unauthorized access */
  handleUnauthorized(): void {
    clearUserData();
    window.location.href = '/';
  }
}
