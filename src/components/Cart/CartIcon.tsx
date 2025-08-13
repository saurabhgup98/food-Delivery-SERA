import React, { useState } from 'react';
import { ShoppingCart } from 'lucide-react';
import { useCart } from '../../contexts/CartContext';
import CartModal from './CartModal';

const CartIcon: React.FC = () => {
  const { state } = useCart();
  const [isCartOpen, setIsCartOpen] = useState(false);

  const totalItems = state.items.reduce((total, item) => total + item.quantity, 0);

  return (
    <>
      <button
        onClick={() => setIsCartOpen(true)}
        className="relative p-2 text-white hover:bg-white/10 rounded-lg transition-colors"
      >
        <ShoppingCart className="w-5 h-5" />
        {totalItems > 0 && (
          <span className="absolute -top-1 -right-1 w-5 h-5 bg-sera-yellow rounded-full text-xs flex items-center justify-center text-dark-900 font-bold animate-bounce-gentle">
            {totalItems > 99 ? '99+' : totalItems}
          </span>
        )}
      </button>

      <CartModal 
        isOpen={isCartOpen} 
        onClose={() => setIsCartOpen(false)} 
      />
    </>
  );
};

export default CartIcon;
