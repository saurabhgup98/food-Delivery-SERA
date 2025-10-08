// API Service - Main API client and service exports

import { HttpClient } from './httpClient';
import { AuthService } from './auth';
import { OAuthService } from './oauth';
import { API_BASE_URL, HTTP_CONFIG } from './constants';

// Create HTTP client
const httpClient = new HttpClient(API_BASE_URL);

// Create service instances
const authService = new AuthService(httpClient);
const oauthService = new OAuthService(httpClient, API_BASE_URL);

// Create API client
class ApiClient {
  public auth: AuthService;
  public oauth: OAuthService;
  private httpClient: HttpClient;

  constructor() {
    this.httpClient = httpClient;
    this.auth = authService;
    this.oauth = oauthService;
  }

  getHttpClient(): HttpClient {
    return this.httpClient;
  }
}

// Create singleton instance
const apiClient = new ApiClient();

// Export API services
export const authApi = {
  register: (userData: any) => apiClient.auth.register(userData),
  login: (credentials: any) => apiClient.auth.login(credentials),
  logout: () => apiClient.auth.logout(),
  isAuthenticated: () => apiClient.auth.isAuthenticated(),
  getCurrentUser: () => apiClient.auth.getCurrentUser(),
  handleUnauthorized: () => apiClient.auth.handleUnauthorized(),
};

export const oauthApi = {
  getGoogleAuthUrl: () => apiClient.oauth.getGoogleAuthUrl(),
  getFacebookAuthUrl: () => apiClient.oauth.getFacebookAuthUrl(),
  getGithubAuthUrl: () => apiClient.oauth.getGithubAuthUrl(),
  handleOAuthCallback: (provider: string, code: string) => 
    apiClient.oauth.handleOAuthCallback(provider, code),
};

// Export types and utilities
export * from './types';
export * from './constants';
