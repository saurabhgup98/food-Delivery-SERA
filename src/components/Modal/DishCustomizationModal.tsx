import React, { useState, useEffect } from 'react';
import { X, ShoppingCart } from 'lucide-react';
import { useCart } from '../../contexts/CartContext';
import PrimaryCenteredActionBtn from '../Button/PrimaryCenteredActionBtn';
import {
  CustomizationState,
  DEFAULT_CUSTOMIZATION,
  DishCustomizationModalProps,
  SIZE_OPTIONS,
  SPICE_LEVELS,
  calculateTotalPrice,
  createCustomizedDish,
  updateCustomization
} from './config/DishCustomizationModalUtils';

// Close Icon Component
const CloseIcon: React.FC<{ className?: string }> = ({ className }) => (
  <X className={className} />
);

const DishCustomizationModal: React.FC<DishCustomizationModalProps> = ({
  isOpen,
  onClose,
  dish
}) => {
  const { addItem } = useCart();
  const [customization, setCustomization] = useState<CustomizationState>(DEFAULT_CUSTOMIZATION);

  // Update total price when customization changes
  useEffect(() => {
    const newTotalPrice = calculateTotalPrice(dish, customization);
    setCustomization(prev => updateCustomization(prev, { totalPrice: newTotalPrice }));
  }, [customization.size, customization.quantity, dish]);

  const handleSizeChange = (sizeId: string) => {
    setCustomization(prev => updateCustomization(prev, { size: sizeId }));
  };

  const handleSpiceLevelChange = (spiceId: string) => {
    setCustomization(prev => updateCustomization(prev, { spiceLevel: spiceId }));
  };

  const handleQuantityChange = (newQuantity: number) => {
    if (newQuantity >= 1 && newQuantity <= 10) {
      setCustomization(prev => updateCustomization(prev, { quantity: newQuantity }));
    }
  };

  const handleAddToCart = () => {
    if (!dish) return;

    const customizedDish = createCustomizedDish(dish, customization);
    addItem(customizedDish);
    onClose();
  };

  if (!isOpen || !dish) return null;

  // Button props
  const closeButtonProps = {
    onClick: onClose,
    leftIcon: CloseIcon,
    size: 'sm' as const,
    bgColor: 'bg-transparent',
    hoverBgColor: 'hover:bg-dark-700',
    textColor: 'text-gray-400',
    hoverTextColor: 'hover:text-white',
    border: 'border-none',
    className: 'p-2 rounded-lg transition-colors'
  };

  const addToCartButtonProps = {
    onClick: handleAddToCart,
    leftIcon: ShoppingCart,
    text: 'Add to Cart',
    size: 'md' as const,
    bgColor: 'bg-sera-blue',
    hoverBgColor: 'hover:bg-blue-600',
    textColor: 'text-white',
    className: 'px-6 py-3'
  };

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
        <div className="flex items-center justify-between p-4 border-b border-dark-700 flex-shrink-0">
          <div className="flex items-center space-x-4">
            <img
              src={dish.image}
              alt={dish.name}
              className="w-16 h-16 rounded-lg object-cover"
            />
            <div>
              <h2 className="text-white text-xl font-bold">{dish.name}</h2>
              <p className="text-gray-400 text-sm">{dish.description}</p>
              <div className="flex items-center space-x-2 mt-1">
                <span className="text-sera-orange font-semibold">{dish.price}</span>
                <span className="text-gray-500">•</span>
                <span className="text-gray-400 text-sm">{dish.prepTime}</span>
              </div>
            </div>
          </div>
          <PrimaryCenteredActionBtn {...closeButtonProps} />
        </div>

        {/* Content */}
        <div className="p-4 overflow-y-auto flex-1">
          {/* Size Selection */}
          <div className="mb-6">
            <h3 className="text-white text-lg font-semibold mb-3">Choose Size</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {SIZE_OPTIONS.map(size => (
                <button
                  key={size.id}
                  onClick={() => handleSizeChange(size.id)}
                  className={`p-4 rounded-lg border-2 transition-all text-left ${customization.size === size.id
                    ? 'border-sera-blue bg-sera-blue/10 text-sera-blue'
                    : 'border-dark-600 text-gray-300 hover:border-dark-500 hover:text-white'
                    }`}
                >
                  <div className="font-medium">{size.name}</div>
                  <div className="text-sm opacity-75 mt-1">
                    {size.price > 0 ? `+₹${size.price}` : size.price < 0 ? `₹${Math.abs(size.price)} off` : 'Base Price'}
                  </div>
                  <div className="text-xs opacity-60 mt-1">{size.description}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Spice Level Selection */}
          <div className="mb-6">
            <h3 className="text-white text-lg font-semibold mb-3">Spice Level</h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {SPICE_LEVELS.map(spice => (
                <button
                  key={spice.id}
                  onClick={() => handleSpiceLevelChange(spice.id)}
                  className={`p-3 rounded-lg border-2 transition-all text-center ${customization.spiceLevel === spice.id
                    ? 'border-red-500 bg-red-500/10 text-red-500'
                    : 'border-dark-600 text-gray-300 hover:border-dark-500 hover:text-white'
                    }`}
                >
                  <div className="text-lg mb-1">{spice.icon}</div>
                  <div className="font-medium text-sm">{spice.name}</div>
                  <div className="text-xs opacity-75 mt-1">{spice.description}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Special Instructions */}
          <div className="mb-6">
            <h3 className="text-white text-lg font-semibold mb-3">Special Instructions</h3>
            <textarea
              value={customization.specialInstructions}
              onChange={(e) => setCustomization(prev => updateCustomization(prev, { specialInstructions: e.target.value }))}
              placeholder="Any special requests? (e.g., extra spicy, no onions, less oil, etc.)"
              className="w-full p-4 bg-dark-700 border border-dark-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-sera-blue resize-none"
              rows={3}
            />
          </div>

          {/* Quantity */}
          <div className="mb-4">
            <h3 className="text-white text-lg font-semibold mb-3">Quantity</h3>
            <div className="flex items-center space-x-3">
              <button
                onClick={() => handleQuantityChange(customization.quantity - 1)}
                className="w-8 h-8 bg-dark-700 text-white rounded-lg flex items-center justify-center hover:bg-dark-600 transition-colors text-lg font-bold"
              >
                -
              </button>
              <span className="text-white text-lg font-bold min-w-[40px] text-center">
                {customization.quantity}
              </span>
              <button
                onClick={() => handleQuantityChange(customization.quantity + 1)}
                className="w-8 h-8 bg-dark-700 text-white rounded-lg flex items-center justify-center hover:bg-dark-600 transition-colors text-lg font-bold"
              >
                +
              </button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-dark-700 bg-dark-800 flex-shrink-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="text-white">
                <div className="text-xs text-gray-400 mb-1">Total Price</div>
                <div className="text-2xl font-bold text-sera-orange">₹{customization.totalPrice}</div>
              </div>
              <div className="h-8 w-px bg-dark-600"></div>
              <div className="text-white">
                <div className="text-xs text-gray-400 mb-1">Quantity</div>
                <div className="text-lg font-semibold">
                  {customization.quantity} {customization.quantity === 1 ? 'item' : 'items'}
                </div>
              </div>
            </div>
            <PrimaryCenteredActionBtn {...addToCartButtonProps} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default DishCustomizationModal;