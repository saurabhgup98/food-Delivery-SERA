// Import API configuration
import { API_CONFIG } from '../../config/environment';

// Use backend URL from environment config
const API_BASE_URL = API_CONFIG.backendURL;
const AUTH_API_URL = API_CONFIG.baseURL;

export class ApiClient {
  protected async makeRequest<T>(endpoint: string, options?: RequestInit): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`;
    
    // No token management needed in new authentication system
    try {
      const response = await fetch(url, {
        method: options?.method || 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Origin': window.location.origin,
          ...options?.headers,
        },
        mode: 'cors',
        credentials: 'omit',
        ...options,
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Response error text:', errorText);
        throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  protected getApiBaseUrl(): string {
    return API_BASE_URL;
  }

  protected getAuthApiUrl(): string {
    return AUTH_API_URL;
  }
}
