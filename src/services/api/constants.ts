// API Constants - Centralized configuration and endpoints
import { API_CONFIG } from '../../config/environment';

export const API_BASE_URL = API_CONFIG.baseURL;

export const API_ENDPOINTS = {
  // Auth endpoints
  register: '/api/register',
  login: '/api/login',
  logout: '/api/logout',
  refresh: '/api/refresh',
  profile: '/api/me',
  changePassword: '/api/change-password',

  // OAuth endpoints
  googleAuth: '/api/oauth/google',
  facebookAuth: '/api/oauth/facebook',
  githubAuth: '/api/oauth/github',
} as const;

export const HTTP_CONFIG = {
  timeout: 10000,
  retryAttempts: 3,
  headers: {
    'Content-Type': 'application/json',
  },
} as const;

export const STORAGE_KEYS = {
  accessToken: 'accessToken',
  refreshToken: 'refreshToken',
  user: 'user',
  isLoggedIn: 'isLoggedIn',
} as const;
