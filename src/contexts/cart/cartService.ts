// Cart service functions

import { MenuItem as ApiMenuItem } from '../../services/api';
import { CartItem, Customization } from '../types';
import { convertToCartItem, validateCartItem } from './cartUtils';

/**
 * Add item to cart
 */
export const addItemToCart = (
  currentItems: CartItem[],
  item: ApiMenuItem | CartItem,
  customization?: Customization
): CartItem => {
  let cartItem: CartItem;
  
  if ('uniqueId' in item) {
    // Already a cart item
    cartItem = item;
  } else {
    // Regular menu item, create cart item
    cartItem = convertToCartItem(item, customization);
  }
  
  // Validate the cart item
  if (!validateCartItem(cartItem)) {
    throw new Error('Invalid cart item');
  }
  
  return cartItem;
};

/**
 * Remove item from cart
 */
export const removeItemFromCart = (
  currentItems: CartItem[],
  uniqueId: string
): CartItem[] => {
  return currentItems.filter(item => item.uniqueId !== uniqueId);
};

/**
 * Update item quantity in cart
 */
export const updateItemQuantity = (
  currentItems: CartItem[],
  uniqueId: string,
  quantity: number
): CartItem[] => {
  if (quantity <= 0) {
    return removeItemFromCart(currentItems, uniqueId);
  }
  
  return currentItems.map(item => 
    item.uniqueId === uniqueId 
      ? { ...item, quantity }
      : item
  );
};

/**
 * Clear all items from cart
 */
export const clearCart = (): CartItem[] => {
  return [];
};

/**
 * Get cart summary
 */
export const getCartSummary = (items: CartItem[]) => {
  const totalItems = items.reduce((total, item) => total + item.quantity, 0);
  const totalAmount = items.reduce((total, item) => {
    const price = parseInt(item.price.replace('₹', '')) || 0;
    return total + (price * item.quantity);
  }, 0);
  
  return {
    totalItems,
    totalAmount,
    itemCount: items.length
  };
};

/**
 * Check if cart is empty
 */
export const isCartEmpty = (items: CartItem[]): boolean => {
  return items.length === 0;
};

/**
 * Get cart item by unique ID
 */
export const getCartItemById = (items: CartItem[], uniqueId: string): CartItem | undefined => {
  return items.find(item => item.uniqueId === uniqueId);
};

/**
 * Check if item exists in cart
 */
export const isItemInCart = (items: CartItem[], uniqueId: string): boolean => {
  return items.some(item => item.uniqueId === uniqueId);
};

/**
 * Get cart items by restaurant
 */
export const getCartItemsByRestaurant = (items: CartItem[], restaurantId: string): CartItem[] => {
  return items.filter(item => item.restaurantId === restaurantId);
};

/**
 * Validate cart before checkout
 */
export const validateCartForCheckout = (items: CartItem[]): { isValid: boolean; errors: string[] } => {
  const errors: string[] = [];
  
  if (items.length === 0) {
    errors.push('Cart is empty');
  }
  
  items.forEach((item, index) => {
    if (!validateCartItem(item)) {
      errors.push(`Invalid item at position ${index + 1}: ${item.name}`);
    }
    
    if (!item.isAvailable) {
      errors.push(`Item "${item.name}" is not available`);
    }
  });
  
  return {
    isValid: errors.length === 0,
    errors
  };
};
