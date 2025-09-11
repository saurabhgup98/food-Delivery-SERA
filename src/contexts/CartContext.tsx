import React, { createContext, useContext, useReducer, ReactNode } from 'react';
import { MenuItem as ApiMenuItem } from '../services/api';
import { CartContextType, CartItem, Customization } from './types';
import { cartReducer } from './cart/cartReducer';
import * as cartService from './cart/cartService';
import * as cartUtils from './cart/cartUtils';

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(cartReducer, {
    items: [],
    totalItems: 0,
    totalAmount: 0
  });

  const addItem = (item: ApiMenuItem | CartItem) => {
    try {
      const cartItem = cartService.addItemToCart(state.items, item);
      dispatch({ type: 'ADD_ITEM', payload: cartItem });
    } catch (error) {
      console.error('Error adding item to cart:', error);
    }
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
    return cartUtils.getItemQuantity(state.items, itemId, customization);
  };

  const getCustomizedItemQuantity = (uniqueId: string): number => {
    return cartUtils.getItemQuantityById(state.items, uniqueId);
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
