// API Constants - Centralized configuration and endpoints

export const API_BASE_URL = 'https://simple-authentication-service.vercel.app';

export const API_ENDPOINTS = {
  // Auth endpoints
  register: '/api/auth/register',
  login: '/api/auth/login',
  logout: '/api/auth/logout',
  refresh: '/api/auth/refresh',
  profile: '/api/user/profile',

  // OAuth endpoints
  googleAuth: '/api/oauth/google',
  facebookAuth: '/api/oauth/facebook',
  githubAuth: '/api/oauth/github',
} as const;

export const API_CONFIG = {
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
