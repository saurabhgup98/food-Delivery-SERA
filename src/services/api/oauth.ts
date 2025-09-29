// OAuth Methods - OAuth-related API operations

import { API_ENDPOINTS } from './constants';
import { AuthResponse } from './types';

export class OAuthService {
  constructor(private baseURL: string) {}

  /** Get Google OAuth URL */
  getGoogleAuthUrl(): string {
    const appEndpoint = 'https://food-delivery-app-frontend.vercel.app';
    return `${this.baseURL}${API_ENDPOINTS.googleAuth}?appEndpoint=${encodeURIComponent(appEndpoint)}`;
  }

  /** Get Facebook OAuth URL */
  getFacebookAuthUrl(): string {
    const appEndpoint = 'https://food-delivery-app-frontend.vercel.app';
    return `${this.baseURL}${API_ENDPOINTS.facebookAuth}?appEndpoint=${encodeURIComponent(appEndpoint)}`;
  }

  /** Get GitHub OAuth URL */
  getGithubAuthUrl(): string {
    const appEndpoint = 'https://food-delivery-app-frontend.vercel.app';
    return `${this.baseURL}${API_ENDPOINTS.githubAuth}?appEndpoint=${encodeURIComponent(appEndpoint)}`;
  }

  /** Handle OAuth callback (if needed in future) */
  async handleOAuthCallback(provider: string, code: string): Promise<AuthResponse> {
    const endpoint = `/api/oauth/${provider}/callback`;
    const response = await fetch(`${this.baseURL}${endpoint}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ code }),
    });
    return response.json();
  }
}
