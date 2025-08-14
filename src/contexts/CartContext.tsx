import React, { createContext, useContext, useReducer, ReactNode } from 'react';
import { MenuItem } from '../services/api';

interface Customization {
  size: string;
  spiceLevel: string;
  specialInstructions: string;
  quantity: number;
  totalPrice: number;
}

interface CartItem extends MenuItem {
  customization?: Customization;
  uniqueId: string;
  quantity: number;
  id: string; // Add this for compatibility with existing cart logic
}

interface CartState {
  items: CartItem[];
  totalItems: number;
  totalAmount: number;
}

type CartAction =
  | { type: 'ADD_ITEM'; payload: CartItem }
  | { type: 'REMOVE_ITEM'; payload: string }
  | { type: 'UPDATE_QUANTITY'; payload: { uniqueId: string; quantity: number } }
  | { type: 'CLEAR_CART' };

const CartContext = createContext<{
  state: CartState;
  addItem: (item: MenuItem | CartItem) => void;
  removeItem: (uniqueId: string) => void;
  updateQuantity: (uniqueId: string, quantity: number) => void;
  clearCart: () => void;
  getItemQuantity: (itemId: string, customization?: Customization) => number;
  getCustomizedItemQuantity: (uniqueId: string) => number;
} | undefined>(undefined);

// Generate unique ID for customized items
const generateUniqueId = (item: MenuItem, customization?: Customization): string => {
  if (!customization) {
    return `item-${item._id}`;
  }
  
  // Create a hash of the customization
  const customizationHash = JSON.stringify({
    size: customization.size,
    spiceLevel: customization.spiceLevel,
    specialInstructions: customization.specialInstructions
  });
  
  return `item-${item._id}-${btoa(customizationHash).slice(0, 8)}`;
};

// Calculate total price for customized item
const calculateItemPrice = (item: MenuItem, customization?: Customization): number => {
  if (!customization) {
    return parseInt(item.price.replace('₹', ''));
  }
  return customization.totalPrice;
};

const cartReducer = (state: CartState, action: CartAction): CartState => {
  switch (action.type) {
    case 'ADD_ITEM': {
      const newItem = action.payload;
      const existingItemIndex = state.items.findIndex(item => item.uniqueId === newItem.uniqueId);
      
      if (existingItemIndex >= 0) {
        // Item already exists, update quantity
        const updatedItems = [...state.items];
        updatedItems[existingItemIndex].quantity += newItem.quantity;
        
        return {
          ...state,
          items: updatedItems,
          totalItems: state.totalItems + newItem.quantity,
          totalAmount: state.totalAmount + (calculateItemPrice(newItem, newItem.customization) * newItem.quantity)
        };
      } else {
        // New item
        return {
          ...state,
          items: [...state.items, newItem],
          totalItems: state.totalItems + newItem.quantity,
          totalAmount: state.totalAmount + (calculateItemPrice(newItem, newItem.customization) * newItem.quantity)
        };
      }
    }
    
    case 'REMOVE_ITEM': {
      const itemToRemove = state.items.find(item => item.uniqueId === action.payload);
      if (!itemToRemove) return state;
      
      return {
        ...state,
        items: state.items.filter(item => item.uniqueId !== action.payload),
        totalItems: state.totalItems - itemToRemove.quantity,
        totalAmount: state.totalAmount - (calculateItemPrice(itemToRemove, itemToRemove.customization) * itemToRemove.quantity)
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
        return {
          ...state,
          items: state.items.filter(item => item.uniqueId !== uniqueId),
          totalItems: state.totalItems - item.quantity,
          totalAmount: state.totalAmount - (calculateItemPrice(item, item.customization) * item.quantity)
        };
      }
      
      const updatedItems = [...state.items];
      updatedItems[itemIndex] = { ...item, quantity };
      
      return {
        ...state,
        items: updatedItems,
        totalItems: state.totalItems + quantityDifference,
        totalAmount: state.totalAmount + (calculateItemPrice(item, item.customization) * quantityDifference)
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

export const CartProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(cartReducer, {
    items: [],
    totalItems: 0,
    totalAmount: 0
  });

  const addItem = (item: MenuItem | CartItem) => {
    let cartItem: CartItem;
    
    if ('uniqueId' in item) {
      // Already a cart item
      cartItem = item;
    } else {
      // Regular menu item, create cart item
      cartItem = {
        ...item,
        id: item._id, // Set id for compatibility
        uniqueId: generateUniqueId(item),
        quantity: 1
      };
    }
    
    dispatch({ type: 'ADD_ITEM', payload: cartItem });
  };

  const removeItem = (uniqueId: string) => {
    dispatch({ type: 'REMOVE_ITEM', payload: uniqueId });
  };

  const updateQuantity = (uniqueId: string, quantity: number) => {
    dispatch({ type: 'UPDATE_QUANTITY', payload: { uniqueId, quantity } });
  };

  const clearCart = () => {
    dispatch({ type: 'CLEAR_CART' });
  };

  const getItemQuantity = (itemId: string, customization?: Customization): number => {
    const uniqueId = generateUniqueId({ _id: itemId } as MenuItem, customization);
    const item = state.items.find(item => item.uniqueId === uniqueId);
    return item ? item.quantity : 0;
  };

  const getCustomizedItemQuantity = (uniqueId: string): number => {
    const item = state.items.find(item => item.uniqueId === uniqueId);
    return item ? item.quantity : 0;
  };

  return (
    <CartContext.Provider value={{
      state,
      addItem,
      removeItem,
      updateQuantity,
      clearCart,
      getItemQuantity,
      getCustomizedItemQuantity
    }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
