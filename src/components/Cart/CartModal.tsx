import React, { useState } from 'react';
import { X, ShoppingCart, MapPin } from 'lucide-react';
import { useCart } from '../../contexts/CartContext';
import { useAuth } from '../../contexts/AuthContext';
import { apiService, CreateOrderRequest, Order, Address } from '../../services/api';
import OrderSuccessModal from './OrderSuccessModal';
import AddressSelectionModal from './AddressSelectionModal';

interface CartModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const CartModal: React.FC<CartModalProps> = ({ isOpen, onClose }) => {
  const { state, removeItem, updateQuantity, clearCart } = useCart();
  const { user } = useAuth();
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);
  const [showOrderSuccess, setShowOrderSuccess] = useState(false);
  const [placedOrder, setPlacedOrder] = useState<Order | null>(null);
  const [selectedAddress, setSelectedAddress] = useState<Address | null>(null);
  const [deliveryInstructions, setDeliveryInstructions] = useState('');
  const [showAddressModal, setShowAddressModal] = useState(false);

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

  const handlePlaceOrder = async () => {
    if (!user) {
      alert('Please login to place an order');
      return;
    }

    if (state.items.length === 0) {
      alert('Your cart is empty');
      return;
    }

    if (!selectedAddress) {
      setShowAddressModal(true);
      return;
    }

    setIsPlacingOrder(true);

    try {
      // Get restaurant info from the first item (assuming all items are from same restaurant)
      const firstItem = state.items[0];
      const restaurantId = firstItem.restaurantId || 'unknown';
      const restaurantName = 'Spice Garden'; // This should come from restaurant context

      // Prepare order items
      const orderItems = state.items.map(item => ({
        itemId: item._id,
        name: item.name,
        price: item.price,
        quantity: item.quantity,
        customization: item.customization
      }));

      const orderData: CreateOrderRequest = {
        restaurantId,
        restaurantName,
        items: orderItems,
        subtotal: calculateSubtotal(),
        deliveryFee: calculateDeliveryFee(),
        total: calculateTotal(),
        deliveryAddress: `${selectedAddress.address}, ${selectedAddress.city}, ${selectedAddress.state} - ${selectedAddress.pincode}`,
        deliveryInstructions: deliveryInstructions || selectedAddress.instructions || undefined
      };

      console.log('Placing order:', orderData);

      const response = await apiService.createOrder(orderData);

      if (response.success) {
        setPlacedOrder(response.data.order);
        setShowOrderSuccess(true);
        clearCart(); // Clear the cart after successful order
        onClose(); // Close the cart modal
      } else {
        alert('Failed to place order: ' + response.message);
      }
    } catch (error) {
      console.error('Error placing order:', error);
      alert('Failed to place order. Please try again.');
    } finally {
      setIsPlacingOrder(false);
    }
  };

  const handleOrderSuccessClose = () => {
    setShowOrderSuccess(false);
    setPlacedOrder(null);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4" style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, transform: 'translateZ(0)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="relative bg-dark-800 rounded-xl shadow-2xl max-w-2xl w-full max-h-[85vh] flex flex-col border border-dark-600 transform transition-all duration-300" style={{ position: 'relative', zIndex: 10000, transform: 'translateZ(0)', margin: 'auto' }}>
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
            {/* Delivery Address */}
            <div className="mb-4">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-2">
                  <MapPin className="w-4 h-4 text-gray-400" />
                  <span className="text-white font-semibold text-sm">Delivery Address</span>
                </div>
                <button
                  onClick={() => setShowAddressModal(true)}
                  className="text-sera-orange text-sm hover:text-orange-400 transition-colors"
                >
                  {selectedAddress ? 'Change' : 'Select'}
                </button>
              </div>
              {selectedAddress ? (
                <div className="p-3 bg-dark-700 border border-dark-600 rounded-lg">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-1">
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          {selectedAddress.label}
                        </span>
                        {selectedAddress.isDefault && (
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            Default
                          </span>
                        )}
                      </div>
                      <p className="text-white font-medium text-sm">{selectedAddress.fullName}</p>
                      <p className="text-gray-400 text-sm">{selectedAddress.phone}</p>
                      <p className="text-gray-300 text-sm">
                        {selectedAddress.address}, {selectedAddress.city}, {selectedAddress.state} - {selectedAddress.pincode}
                      </p>
                      {selectedAddress.instructions && (
                        <p className="text-gray-400 text-sm mt-1">
                          <span className="font-medium">Instructions:</span> {selectedAddress.instructions}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              ) : (
                <button
                  onClick={() => setShowAddressModal(true)}
                  className="w-full p-3 border-2 border-dashed border-dark-600 rounded-lg text-gray-400 hover:text-white hover:border-dark-500 transition-colors text-left"
                >
                  <div className="flex items-center space-x-2">
                    <MapPin className="w-4 h-4" />
                    <span>Select delivery address</span>
                  </div>
                </button>
              )}
              <input
                type="text"
                value={deliveryInstructions}
                onChange={(e) => setDeliveryInstructions(e.target.value)}
                placeholder="Additional delivery instructions (optional)"
                className="w-full bg-dark-700 border border-dark-600 rounded-lg px-3 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-sera-blue focus:border-transparent text-sm mt-2"
              />
            </div>

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
                onClick={handlePlaceOrder}
                disabled={isPlacingOrder}
                className="flex-1 bg-gradient-to-r from-sera-blue to-blue-600 text-white px-4 py-3 rounded-lg font-semibold hover:from-blue-600 hover:to-blue-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isPlacingOrder ? 'Placing Order...' : 'Place Order'}
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Order Success Modal */}
      <OrderSuccessModal
        isOpen={showOrderSuccess}
        onClose={handleOrderSuccessClose}
        order={placedOrder}
      />

      {/* Address Selection Modal */}
      <AddressSelectionModal
        isOpen={showAddressModal}
        onClose={() => setShowAddressModal(false)}
        onAddressSelect={setSelectedAddress}
        selectedAddress={selectedAddress}
      />
    </div>
  );
};

export default CartModal;
