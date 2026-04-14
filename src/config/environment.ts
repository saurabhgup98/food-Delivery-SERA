// Environment configuration for development and production
// This file helps manage different API endpoints for different environments

export const ENVIRONMENT = {
  DEVELOPMENT: 'development',
  PRODUCTION: 'production'
} as const;

export type Environment = typeof ENVIRONMENT[keyof typeof ENVIRONMENT];

// Get current environment
export const getCurrentEnvironment = (): Environment => {
  return process.env.NODE_ENV === 'production' ? ENVIRONMENT.PRODUCTION : ENVIRONMENT.DEVELOPMENT;
};

// API Configuration based on environment
export const getApiConfig = () => {
  const environment = getCurrentEnvironment();
  
  switch (environment) {
    case ENVIRONMENT.DEVELOPMENT:
      return {
        baseURL: 'https://centralized-auth-app.vercel.app',
        appEndpoint: 'http://127.0.0.1:3001',
        backendURL: 'https://food-delivery-backend-sera.vercel.app/api', // Always use Vercel endpoint
        timeout: 10000,
        retryAttempts: 3
      };
    
    case ENVIRONMENT.PRODUCTION:
      return {
        baseURL: 'https://centralized-auth-app.vercel.app',
        appEndpoint: 'https://food-delivery-sera.vercel.app',
        backendURL: 'https://food-delivery-backend-sera.vercel.app/api', // Deployed backend for production
        timeout: 10000,
        retryAttempts: 3
      };
    
    default:
      return {
        baseURL: 'https://centralized-auth-app.vercel.app',
        appEndpoint: 'http://127.0.0.1:3001',
        backendURL: 'https://food-delivery-backend-sera.vercel.app/api', // Always use Vercel endpoint
        timeout: 10000,
        retryAttempts: 3
      };
  }
};

// Export current configuration
export const API_CONFIG = getApiConfig();
