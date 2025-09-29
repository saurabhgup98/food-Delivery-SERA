// User data processing utilities

import { User, AppRegistration, FOOD_DELIVERY_APP_URL } from '../types';

/**
 * Extract user role from appRegistered array for specific app
 */
export const extractUserRole = (
  appRegistered: AppRegistration[] | undefined,
  appUrl: string = FOOD_DELIVERY_APP_URL
): string => {
  if (!appRegistered || !Array.isArray(appRegistered)) {
    return 'user';
  }
  
  const appRegistration = appRegistered.find(app => app.appIdentifier === appUrl);
  return appRegistration?.role || 'user';
};

/**
 * Create user object from API response data
 */
export const createUserFromApiData = (userData: any): User => {
  return {
    id: userData.id || userData._id || '',
    _id: userData._id,
    username: userData.username || userData.name || '',
    name: userData.username || userData.name || '', // For backward compatibility
    email: userData.email,
    role: userData.role || 'user',
    appEndpoint: FOOD_DELIVERY_APP_URL,
    appIdentifier: userData.appIdentifier || 'sera-food-customer-app',
  };
};

/**
 * Validate user data structure
 */
export const validateUserData = (userData: any): boolean => {
  if (!userData || typeof userData !== 'object') {
    return false;
  }
  
  const requiredFields = ['username', 'email'];
  return requiredFields.every(field => userData[field] !== undefined && userData[field] !== null);
};

/**
 * Check if user has specific role
 */
export const hasRole = (user: User | null, role: string): boolean => {
  if (!user) return false;
  return user.role === role;
};

/**
 * Check if user has any of the specified roles
 */
export const hasAnyRole = (user: User | null, roles: string[]): boolean => {
  if (!user) return false;
  return roles.includes(user.role);
};

/**
 * Check if user is admin
 */
export const isAdmin = (user: User | null): boolean => {
  return hasAnyRole(user, ['admin', 'superadmin']);
};

/**
 * Check if user is business user
 */
export const isBusinessUser = (user: User | null): boolean => {
  return hasAnyRole(user, ['business-user', 'admin', 'superadmin']);
};

/**
 * Get user display name
 */
export const getUserDisplayName = (user: User | null): string => {
  if (!user) return 'Guest';
  return user.username || user.name || user.email || 'Unknown User';
};

/**
 * Get user initials for avatar
 */
export const getUserInitials = (user: User | null): string => {
  if (!user) return 'U';
  
  const name = user.username || user.name;
  if (!name) return 'U';
  
  const names = name.trim().split(' ');
  if (names.length === 1) {
    return names[0].charAt(0).toUpperCase();
  }
  
  return (names[0].charAt(0) + names[names.length - 1].charAt(0)).toUpperCase();
};
