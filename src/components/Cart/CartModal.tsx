import React from 'react';
import { X, ShoppingCart } from 'lucide-react';
import { useCart } from '../../contexts/CartContext';

interface CartModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const CartModal: React.FC<CartModalProps> = ({ isOpen, onClose }) => {
  const { state, removeItem, updateQuantity, clearCart } = useCart();

  const handleQuantityChange = (uniqueId: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      removeItem(uniqueId);
    } else {
      updateQuantity(uniqueId, newQuantity);
    }
  };

  const calculateSubtotal = () => {
    return state.items.reduce((total, item) => {
      return total + (item.customization?.totalPrice || parseInt(item.price.replace('₹', '')) * item.quantity);
    }, 0);
  };

  const calculateDeliveryFee = () => {
    const subtotal = calculateSubtotal();
    return subtotal > 500 ? 0 : 50; // Free delivery above ₹500
  };

  const calculateTotal = () => {
    return calculateSubtotal() + calculateDeliveryFee();
  };

  const getCustomizationText = (item: any) => {
    if (!item.customization) return '';
    
    const parts: string[] = [];
    if (item.customization.size && item.customization.size !== 'medium') {
      parts.push(item.customization.size);
    }
    if (item.customization.spiceLevel && item.customization.spiceLevel !== 'mild') {
      parts.push(item.customization.spiceLevel);
    }
    
    return parts.length > 0 ? `(${parts.join(', ')})` : '';
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="relative bg-dark-800 rounded-lg shadow-2xl max-w-2xl w-full max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 sm:p-6 border-b border-dark-700 flex-shrink-0">
          <div className="flex items-center space-x-3">
            <ShoppingCart className="w-6 h-6 text-sera-blue" />
            <h2 className="text-white text-xl font-bold">Your Cart</h2>
            <span className="bg-sera-blue text-white text-xs font-bold px-2 py-1 rounded-full">
              {state.items.length}
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-white hover:bg-dark-700 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6">
          {state.items.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <ShoppingCart className="w-16 h-16 text-gray-500 mb-4" />
              <h3 className="text-white text-lg font-semibold mb-2">Your cart is empty</h3>
              <p className="text-gray-400 text-sm mb-6">Add some delicious items to get started!</p>
              <button
                onClick={onClose}
                className="bg-sera-blue text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-600 transition-colors"
              >
                Start Ordering
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {state.items.map((item) => (
                <div key={item.uniqueId} className="bg-dark-700 rounded-lg p-4">
                  <div className="flex items-start space-x-4">
                    <img 
                      src={item.image} 
                      alt={item.name}
                      className="w-16 h-16 rounded-lg object-cover flex-shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h3 className="text-white font-semibold text-sm sm:text-base truncate">
                            {item.name}
                          </h3>
                          {item.customization && (
                            <p className="text-gray-400 text-xs sm:text-sm mt-1">
                              {getCustomizationText(item)}
                            </p>
                          )}
                          {item.customization?.specialInstructions && (
                            <p className="text-gray-500 text-xs mt-1 italic">
                              "{item.customization.specialInstructions}"
                            </p>
                          )}
                        </div>
                        <button
                          onClick={() => removeItem(item.uniqueId)}
                          className="p-1 text-gray-400 hover:text-red-400 hover:bg-red-400/10 rounded transition-colors ml-2"
                        >
                          🗑️
                        </button>
                      </div>
                      
                      <div className="flex items-center justify-between mt-3">
                        <div className="text-sera-orange font-semibold text-sm sm:text-base">
                          ₹{item.customization?.totalPrice || parseInt(item.price.replace('₹', '')) * item.quantity}
                        </div>
                                                 <div className="flex items-center space-x-2">
                           <button
                             onClick={() => handleQuantityChange(item.uniqueId, item.quantity - 1)}
                             className="w-8 h-8 bg-dark-600 text-white rounded-lg flex items-center justify-center hover:bg-dark-500 transition-colors"
                           >
                             -
                           </button>
                           <span className="text-white font-semibold min-w-[20px] text-center">
                             {item.quantity}
                           </span>
                           <button
                             onClick={() => handleQuantityChange(item.uniqueId, item.quantity + 1)}
                             className="w-8 h-8 bg-dark-600 text-white rounded-lg flex items-center justify-center hover:bg-dark-500 transition-colors"
                           >
                             +
                           </button>
                         </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
                 {state.items.length > 0 && (
          <div className="p-4 sm:p-6 border-t border-dark-700 bg-dark-800 flex-shrink-0">
            {/* Price Breakdown */}
            <div className="space-y-2 mb-4">
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Subtotal</span>
                <span className="text-white">₹{calculateSubtotal()}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Delivery Fee</span>
                <span className="text-white">
                  {calculateDeliveryFee() === 0 ? 'Free' : `₹${calculateDeliveryFee()}`}
                </span>
              </div>
              {calculateDeliveryFee() > 0 && (
                <div className="text-xs text-green-400 text-center">
                  Add ₹{500 - calculateSubtotal()} more for free delivery!
                </div>
              )}
              <div className="border-t border-dark-600 pt-2">
                <div className="flex justify-between text-lg font-bold">
                  <span className="text-white">Total</span>
                  <span className="text-sera-orange">₹{calculateTotal()}</span>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex space-x-3">
              <button
                onClick={clearCart}
                className="flex-1 bg-dark-700 text-white px-4 py-3 rounded-lg font-semibold hover:bg-dark-600 transition-colors"
              >
                Clear Cart
              </button>
              <button
                onClick={() => {
                  // TODO: Implement checkout
                  alert('Checkout functionality coming soon!');
                }}
                className="flex-1 bg-gradient-to-r from-sera-blue to-blue-600 text-white px-4 py-3 rounded-lg font-semibold hover:from-blue-600 hover:to-blue-700 transition-all duration-200"
              >
                Checkout
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CartModal;
