// OAuth Methods - OAuth-related API operations

import { HttpClient } from './httpClient';
import { API_ENDPOINTS } from './constants';
import { AuthResponse } from './types';

export class OAuthService {
  constructor(private httpClient: HttpClient, private baseURL: string) { }

  /** Get Google OAuth URL */
  getGoogleAuthUrl(): string {
    const appEndpoint = 'http://127.0.0.1:3001';
    return `${this.baseURL}${API_ENDPOINTS.googleAuth}?appEndpoint=${encodeURIComponent(appEndpoint)}`;
  }

  /** Get Facebook OAuth URL */
  getFacebookAuthUrl(): string {
    const appEndpoint = 'http://127.0.0.1:3001';
    return `${this.baseURL}${API_ENDPOINTS.facebookAuth}?appEndpoint=${encodeURIComponent(appEndpoint)}`;
  }

  /** Get GitHub OAuth URL */
  getGithubAuthUrl(): string {
    const appEndpoint = 'http://127.0.0.1:3001';
    return `${this.baseURL}${API_ENDPOINTS.githubAuth}?appEndpoint=${encodeURIComponent(appEndpoint)}`;
  }

  /** Handle OAuth callback (if needed in future) */
  async handleOAuthCallback(provider: string, code: string): Promise<AuthResponse> {
    const endpoint = `/api/oauth/${provider}/callback`;
    const response = await this.httpClient.post<any>(endpoint, { code });
    return response as AuthResponse;
  }
}
