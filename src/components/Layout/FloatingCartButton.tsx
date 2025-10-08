import React from 'react';
import { useCart } from '../../contexts/CartContext';
import { useCartModal } from '../../hooks/useCartModal';
import CartModal from '../Cart/CartModal';

const FloatingCartButton: React.FC = () => {
  const { state: cartState } = useCart();
  const { isOpen, open, close } = useCartModal();

  if (cartState.totalItems === 0) return null;

  return (
    <>
      <div className="fixed bottom-6 right-6 z-50">
        <button 
          onClick={open}
          className="relative w-16 h-16 bg-gradient-to-r from-sera-blue to-sera-blue/90 text-white rounded-full shadow-2xl hover:shadow-3xl transition-all duration-300 hover:scale-110 active:scale-95 flex items-center justify-center group border-2 border-white/20"
        >
          <svg className="w-7 h-7 group-hover:scale-110 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 5M7 13l2.5 5m6-5v6a2 2 0 01-2 2H9a2 2 0 01-2-2v-6m8 0V9a2 2 0 00-2-2H9a2 2 0 00-2 2v4.01" />
          </svg>
          <div className="absolute -top-3 -right-3 w-8 h-8 bg-gradient-to-r from-sera-orange to-orange-500 text-white rounded-full text-sm flex items-center justify-center font-bold shadow-lg border-2 border-white animate-pulse">
            {cartState.totalItems}
          </div>
          {/* Cart total amount tooltip */}
          <div className="absolute bottom-full right-0 mb-2 px-3 py-2 bg-dark-800 text-white text-sm rounded-lg shadow-lg border border-dark-600 opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap">
            <div className="flex items-center space-x-2">
              <span>Total:</span>
              <span className="font-bold text-sera-orange">₹{cartState.totalAmount}</span>
            </div>
            <div className="absolute top-full right-4 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-dark-800"></div>
          </div>
        </button>
      </div>

      <CartModal isOpen={isOpen} onClose={close} />
    </>
  );
};

export default FloatingCartButton;
