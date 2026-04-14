import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { X, ShoppingCart, MapPin } from 'lucide-react';
import { useCart } from '../../contexts/CartContext';
import { useAuth } from '../../contexts/AuthContext';
import { apiService, CreateOrderRequest, Order, Address } from '../../services/api';
import OrderSuccessModal from './OrderSuccessModal';
import AddressSelectionModal from '../Address/components/AddressSelectionModal';
import PrimaryCenteredActionBtn from '../Button/PrimaryCenteredActionBtn';
import StateDisplay from '../common/StateDisplay';
import { CART_CONFIG } from './CartConfig';
import PrimaryInput from '../Input/PrimaryInput';

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

  const subtotal = CART_CONFIG.calculations.calculateSubtotal(state.items);
  const deliveryFee = CART_CONFIG.calculations.calculateDeliveryFee(subtotal);
  const total = CART_CONFIG.calculations.calculateTotal(subtotal, deliveryFee);

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
        customization: item.customization,
        totalPrice: (parseFloat(item.price.replace('₹', '')) * item.quantity).toFixed(2)
      }));

      const orderData: CreateOrderRequest = {
        restaurantId,
        restaurantName,
        items: orderItems,
        subtotal: subtotal,
        deliveryFee: deliveryFee,
        total: total,
        deliveryAddress: `${selectedAddress.address}, ${selectedAddress.city}, ${selectedAddress.state} - ${selectedAddress.pincode}`,
        deliveryInstructions: deliveryInstructions || selectedAddress.instructions || undefined
      };


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

  // Prevent body scroll when modal is open
  React.useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const modalContent = (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 overflow-hidden" onClick={onClose}>
      <div 
        className="bg-dark-800 rounded-lg shadow-xl max-w-2xl w-full h-[90vh] mx-4 flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 sm:p-6 border-b border-dark-700 flex-shrink-0">
          <div className="flex items-center space-x-3">
            <ShoppingCart className="w-6 h-6 text-sera-blue" />
            <h2 className="text-white text-xl font-bold">Your Cart</h2>
            <span className="bg-sera-blue text-white text-xs font-bold px-2 py-1 rounded-full">
              {state.items.length}
            </span>
          </div>
          <PrimaryCenteredActionBtn
            onClick={onClose}
            text=""
            size="sm"
            className="p-2"
            leftIconNode={<X className="w-5 h-5" />}
            bgColor="bg-transparent"
            hoverBgColor="hover:bg-dark-700"
            textColor="text-gray-400"
            textHoverColor="hover:text-white"
          />
        </div>

        {/* Content - Scrollable Area */}
        {/* If no item is selected, show start ordering btn and message */}
        <div className="flex-1 overflow-y-auto min-h-0">
          {state.items.length === 0 ? (
            <div className="flex items-center justify-center h-full">
              <StateDisplay
                status="empty"
                config={{
                  icon: <ShoppingCart className="w-16 h-16 text-gray-500" />,
                  text: "Your cart is empty",
                  subtext: "Add some delicious items to get started!",
                  button: React.createElement(PrimaryCenteredActionBtn, {
                    onClick: onClose,
                    text: "Start Ordering",
                    size: "md"
                  })
                }}
                size="lg"
                containerClassName="bg-transparent border-none"
              />
            </div>
            /* If items are selected, show the items list */
          ) : (
            <div className="p-4 sm:p-6 space-y-6">
              {/* Dishes List */}
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
                            ₹{parseInt(item.price.replace('₹', '')) * item.quantity}
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

              {/* Delivery Address Section */}
              <div className="border-t border-dark-700 pt-6">
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
                              {selectedAddress.type}
                            </span>
                            {selectedAddress.isDefault && (
                              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                Default
                              </span>
                            )}
                          </div>
                          <p className="text-white font-medium text-sm">{selectedAddress.name}</p>
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

                  <PrimaryInput
                    {...CART_CONFIG.deliveryInstructions(deliveryInstructions, setDeliveryInstructions)}
                  />
                </div>

                {/* Price Breakdown */}
                <div className="space-y-2 mb-4">
                  <div className="flex justify-between text-sm">
                    <span className={CART_CONFIG.priceBreakdown.subtotal.labelColor}>
                      {CART_CONFIG.priceBreakdown.subtotal.label}
                    </span>
                    <span className={CART_CONFIG.priceBreakdown.subtotal.valueColor}>
                      ₹{subtotal}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className={CART_CONFIG.priceBreakdown.deliveryFee.labelColor}>
                      {CART_CONFIG.priceBreakdown.deliveryFee.label}
                    </span>
                    <span className={CART_CONFIG.priceBreakdown.deliveryFee.valueColor}>
                      {deliveryFee === 0 ? CART_CONFIG.priceBreakdown.deliveryFee.freeMessage : `₹${deliveryFee}`}
                    </span>
                  </div>
                  {deliveryFee > 0 && (
                    <div className={`${CART_CONFIG.priceBreakdown.freeDeliveryMessage.textSize} ${CART_CONFIG.priceBreakdown.freeDeliveryMessage.color} text-center`}>
                      {CART_CONFIG.priceBreakdown.freeDeliveryMessage.text.replace('{amount}', (500 - subtotal).toString())}
                    </div>
                  )}
                  <div className="border-t border-dark-600 pt-2">
                    <div className="flex justify-between text-lg font-bold">
                      <span className={CART_CONFIG.priceBreakdown.total.labelColor}>
                        {CART_CONFIG.priceBreakdown.total.label}
                      </span>
                      <span className={CART_CONFIG.priceBreakdown.total.valueColor}>
                        ₹{total}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer - Fixed at bottom */}
        {state.items.length > 0 && (
          <div className="p-4 sm:p-6 border-t border-dark-700 bg-dark-800 flex-shrink-0">
            {/* Action Buttons */}
            <div className="flex space-x-3">
              {CART_CONFIG.footerButtons(clearCart, handlePlaceOrder, isPlacingOrder).map((btnConfig, index) => (
                <PrimaryCenteredActionBtn
                  key={index}
                  {...btnConfig}
                  leftIconNode={index === 0 ? <X className="w-4 h-4" /> : undefined}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <>
      {createPortal(modalContent, document.body)}
      
      {/* Order Success Modal */}
      <OrderSuccessModal
        isOpen={showOrderSuccess}
        onClose={handleOrderSuccessClose}
        order={placedOrder}
      />

      {/* Address Selection Modal - Also rendered in portal */}
      {showAddressModal && createPortal(
        <AddressSelectionModal
          isOpen={showAddressModal}
          onClose={() => setShowAddressModal(false)}
          onAddressSelect={setSelectedAddress}
          selectedAddress={selectedAddress}
        />,
        document.body
      )}
    </>
  );
};

export default CartModal;
