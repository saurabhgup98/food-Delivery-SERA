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
        baseURL: 'https://simple-authentication-service.vercel.app', // Auth always uses deployed
        appEndpoint: 'http://127.0.0.1:3001',
        backendURL: 'http://localhost:5000/api', // Local backend for development
        timeout: 10000,
        retryAttempts: 3
      };
    
    case ENVIRONMENT.PRODUCTION:
      return {
        baseURL: 'https://simple-authentication-service.vercel.app', // Auth always uses deployed
        appEndpoint: 'https://food-delivery-sera.vercel.app',
        backendURL: 'https://food-delivery-backend-sera.vercel.app/api', // Deployed backend for production
        timeout: 10000,
        retryAttempts: 3
      };
    
    default:
      return {
        baseURL: 'https://simple-authentication-service.vercel.app',
        appEndpoint: 'http://127.0.0.1:3001',
        backendURL: 'http://localhost:5000/api',
        timeout: 10000,
        retryAttempts: 3
      };
  }
};

// Export current configuration
export const API_CONFIG = getApiConfig();
