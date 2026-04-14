// API Service - Main API client and service exports
// Note: Auth services have been moved to contexts/auth/ for better organization

import { HttpClient } from './httpClient';
import { API_BASE_URL, HTTP_CONFIG } from './constants';

// Create HTTP client
const httpClient = new HttpClient(API_BASE_URL);

// Create API client
class ApiClient {
  private httpClient: HttpClient;

  constructor() {
    this.httpClient = httpClient;
  }

  getHttpClient(): HttpClient {
    return this.httpClient;
  }
}

// Create singleton instance
const apiClient = new ApiClient();

// Export API client for other services
export { apiClient };

// Export types and utilities
export * from './types';
export * from './constants';
