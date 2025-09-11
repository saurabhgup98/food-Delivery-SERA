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
  
  const appRegistration = appRegistered.find(app => app.name === appUrl);
  return appRegistration?.role || 'user';
};

/**
 * Create user object from API response data
 */
export const createUserFromApiData = (userData: any): User => {
  const userRole = extractUserRole(userData.appRegistered);
  
  return {
    id: userData.id || userData._id || '',
    _id: userData._id,
    name: userData.name,
    email: userData.email,
    emailVerified: userData.emailVerified || false,
    appRegistered: userData.appRegistered || [],
    oauthProvider: userData.oauthProvider || 'local',
    role: userRole as 'user' | 'business-user' | 'admin' | 'superadmin',
    appEndpoint: userData.appEndpoint || FOOD_DELIVERY_APP_URL,
  };
};

/**
 * Validate user data structure
 */
export const validateUserData = (userData: any): boolean => {
  if (!userData || typeof userData !== 'object') {
    return false;
  }
  
  const requiredFields = ['name', 'email'];
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
  return user.name || user.email || 'Unknown User';
};

/**
 * Get user initials for avatar
 */
export const getUserInitials = (user: User | null): string => {
  if (!user || !user.name) return 'U';
  
  const names = user.name.trim().split(' ');
  if (names.length === 1) {
    return names[0].charAt(0).toUpperCase();
  }
  
  return (names[0].charAt(0) + names[names.length - 1].charAt(0)).toUpperCase();
};
