// Cart reducer logic

import { CartState, CartAction } from '../types';
import { calculateCartItemPrice } from './cartUtils';

/**
 * Cart reducer for managing cart state
 */
export const cartReducer = (state: CartState, action: CartAction): CartState => {
  switch (action.type) {
    case 'ADD_ITEM': {
      const newItem = action.payload;
      const existingItemIndex = state.items.findIndex(item => item.uniqueId === newItem.uniqueId);
      
      if (existingItemIndex >= 0) {
        // Item already exists, update quantity
        const updatedItems = [...state.items];
        updatedItems[existingItemIndex].quantity += newItem.quantity;
        
        const itemPrice = calculateCartItemPrice(newItem, newItem.customization);
        
        return {
          ...state,
          items: updatedItems,
          totalItems: state.totalItems + newItem.quantity,
          totalAmount: state.totalAmount + (itemPrice * newItem.quantity)
        };
      } else {
        // New item
        const itemPrice = calculateCartItemPrice(newItem, newItem.customization);
        
        return {
          ...state,
          items: [...state.items, newItem],
          totalItems: state.totalItems + newItem.quantity,
          totalAmount: state.totalAmount + (itemPrice * newItem.quantity)
        };
      }
    }
    
    case 'REMOVE_ITEM': {
      const itemToRemove = state.items.find(item => item.uniqueId === action.payload);
      if (!itemToRemove) return state;
      
      const itemPrice = calculateCartItemPrice(itemToRemove, itemToRemove.customization);
      
      return {
        ...state,
        items: state.items.filter(item => item.uniqueId !== action.payload),
        totalItems: state.totalItems - itemToRemove.quantity,
        totalAmount: state.totalAmount - (itemPrice * itemToRemove.quantity)
      };
    }
    
    case 'UPDATE_QUANTITY': {
      const { uniqueId, quantity } = action.payload;
      const itemIndex = state.items.findIndex(item => item.uniqueId === uniqueId);
      
      if (itemIndex === -1) return state;
      
      const item = state.items[itemIndex];
      const quantityDifference = quantity - item.quantity;
      
      if (quantity <= 0) {
        // Remove item if quantity is 0 or negative
        const itemPrice = calculateCartItemPrice(item, item.customization);
        
        return {
          ...state,
          items: state.items.filter(item => item.uniqueId !== uniqueId),
          totalItems: state.totalItems - item.quantity,
          totalAmount: state.totalAmount - (itemPrice * item.quantity)
        };
      }
      
      const updatedItems = [...state.items];
      updatedItems[itemIndex] = { ...item, quantity };
      
      const itemPrice = calculateCartItemPrice(item, item.customization);
      
      return {
        ...state,
        items: updatedItems,
        totalItems: state.totalItems + quantityDifference,
        totalAmount: state.totalAmount + (itemPrice * quantityDifference)
      };
    }
    
    case 'CLEAR_CART':
      return {
        items: [],
        totalItems: 0,
        totalAmount: 0
      };
    
    default:
      return state;
  }
};
