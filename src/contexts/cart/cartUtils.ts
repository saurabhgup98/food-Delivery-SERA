// Cart utility functions

import { MenuItem as ApiMenuItem } from '../../services/api';
import { CartItem, Customization } from '../types';
import { createHash } from '../shared/utils';

/**
 * Generate unique ID for cart items with customization
 */
export const generateCartItemId = (item: ApiMenuItem, customization?: Customization): string => {
  if (!customization) {
    return `item-${item._id}`;
  }
  
  // Create a hash of the customization
  const customizationHash = createHash({
    size: customization.size,
    spiceLevel: customization.spiceLevel,
    specialInstructions: customization.specialInstructions
  });
  
  return `item-${item._id}-${customizationHash}`;
};

/**
 * Calculate total price for cart item with customization
 */
export const calculateCartItemPrice = (item: ApiMenuItem, customization?: Customization): number => {
  if (!customization) {
    return parseInt(item.price.replace('₹', '')) || 0;
  }
  return customization.totalPrice || 0;
};

/**
 * Convert API MenuItem to CartItem
 */
export const convertToCartItem = (item: ApiMenuItem, customization?: Customization): CartItem => {
  return {
    ...item,
    id: item._id, // Set id for compatibility
    uniqueId: generateCartItemId(item, customization),
    quantity: 1,
    customization
  };
};

/**
 * Find cart item by unique ID
 */
export const findCartItemById = (items: CartItem[], uniqueId: string): CartItem | undefined => {
  return items.find(item => item.uniqueId === uniqueId);
};

/**
 * Find cart item by menu item ID and customization
 */
export const findCartItemByMenuItem = (
  items: CartItem[], 
  itemId: string, 
  customization?: Customization
): CartItem | undefined => {
  const uniqueId = generateCartItemId({ _id: itemId } as ApiMenuItem, customization);
  return findCartItemById(items, uniqueId);
};

/**
 * Calculate total items count
 */
export const calculateTotalItems = (items: CartItem[]): number => {
  return items.reduce((total, item) => total + item.quantity, 0);
};

/**
 * Calculate total amount
 */
export const calculateTotalAmount = (items: CartItem[]): number => {
  return items.reduce((total, item) => {
    const itemPrice = calculateCartItemPrice(item, item.customization);
    return total + (itemPrice * item.quantity);
  }, 0);
};

/**
 * Get item quantity by ID and customization
 */
export const getItemQuantity = (
  items: CartItem[], 
  itemId: string, 
  customization?: Customization
): number => {
  const item = findCartItemByMenuItem(items, itemId, customization);
  return item ? item.quantity : 0;
};

/**
 * Get item quantity by unique ID
 */
export const getItemQuantityById = (items: CartItem[], uniqueId: string): number => {
  const item = findCartItemById(items, uniqueId);
  return item ? item.quantity : 0;
};

/**
 * Validate cart item
 */
export const validateCartItem = (item: CartItem): boolean => {
  if (!item || !item._id || !item.name || !item.price) {
    return false;
  }
  
  if (item.quantity <= 0) {
    return false;
  }
  
  return true;
};

/**
 * Sort cart items by category
 */
export const sortCartItemsByCategory = (items: CartItem[]): CartItem[] => {
  const categoryOrder = ['starters', 'mains', 'breads', 'desserts', 'beverages'];
  
  return [...items].sort((a, b) => {
    const aIndex = categoryOrder.indexOf(a.category);
    const bIndex = categoryOrder.indexOf(b.category);
    
    if (aIndex === -1 && bIndex === -1) return 0;
    if (aIndex === -1) return 1;
    if (bIndex === -1) return -1;
    
    return aIndex - bIndex;
  });
};

/**
 * Group cart items by restaurant
 */
export const groupCartItemsByRestaurant = (items: CartItem[]): Record<string, CartItem[]> => {
  return items.reduce((groups, item) => {
    const restaurantId = item.restaurantId;
    if (!groups[restaurantId]) {
      groups[restaurantId] = [];
    }
    groups[restaurantId].push(item);
    return groups;
  }, {} as Record<string, CartItem[]>);
};
