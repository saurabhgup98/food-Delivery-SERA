import React, { useState, useEffect } from 'react';
import { X, ShoppingCart } from 'lucide-react';
import { MenuItem } from '../../services/api';
import { useCart } from '../../contexts/CartContext';

interface DishCustomizationModalProps {
  isOpen: boolean;
  onClose: () => void;
  dish: MenuItem | null;
}

interface CustomizationState {
  size: string;
  spiceLevel: string;
  specialInstructions: string;
  quantity: number;
  totalPrice: number;
}

const DishCustomizationModal: React.FC<DishCustomizationModalProps> = ({
  isOpen,
  onClose,
  dish
}) => {
  const { addItem } = useCart();
  const [customization, setCustomization] = useState<CustomizationState>({
    size: 'medium',
    spiceLevel: 'mild',
    specialInstructions: '',
    quantity: 1,
    totalPrice: 0
  });

  const sizeOptions = [
    { id: 'small', name: 'Small', price: -50, description: 'Perfect for light meals' },
    { id: 'medium', name: 'Medium', price: 0, description: 'Standard size' },
    { id: 'large', name: 'Large', price: 100, description: 'Extra portions' }
  ];

  const spiceLevels = [
    { id: 'mild', name: 'Mild', icon: '🌶️', description: 'No spice' },
    { id: 'medium', name: 'Medium', icon: '🌶️🌶️', description: 'Light spice' },
    { id: 'hot', name: 'Hot', icon: '🌶️🌶️🌶️', description: 'Spicy' },
    { id: 'extra-hot', name: 'Extra Hot', icon: '🌶️🌶️🌶️🌶️', description: 'Very spicy' }
  ];

  // Calculate total price
  const calculateTotalPrice = () => {
    if (!dish) return 0;
    
    let basePrice = parseInt(dish.price.replace('₹', ''));
    const selectedSize = sizeOptions.find(s => s.id === customization.size);
    
    if (selectedSize) {
      basePrice = basePrice + selectedSize.price;
    }

    return basePrice * customization.quantity;
  };

  // Update total price when customization changes
  useEffect(() => {
    const newTotalPrice = calculateTotalPrice();
    setCustomization(prev => ({
      ...prev,
      totalPrice: newTotalPrice
    }));
  }, [customization.size, customization.quantity]);

  const handleSizeChange = (sizeId: string) => {
    setCustomization(prev => ({ ...prev, size: sizeId }));
  };

  const handleSpiceLevelChange = (spiceId: string) => {
    setCustomization(prev => ({ ...prev, spiceLevel: spiceId }));
  };

  const handleQuantityChange = (newQuantity: number) => {
    if (newQuantity >= 1 && newQuantity <= 10) {
      setCustomization(prev => ({ ...prev, quantity: newQuantity }));
    }
  };

  const handleAddToCart = () => {
    if (!dish) return;
    
    const customizedDish = {
      ...dish,
      customization: {
        size: customization.size,
        spiceLevel: customization.spiceLevel,
        specialInstructions: customization.specialInstructions,
        quantity: customization.quantity,
        totalPrice: customization.totalPrice
      },
      uniqueId: `item-${dish._id}-${Date.now()}`,
      quantity: customization.quantity
    };
    
    addItem(customizedDish);
    onClose();
  };

  if (!isOpen || !dish) return null;

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
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-white hover:bg-dark-700 rounded-lg transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto flex-1">
          {/* Size Selection */}
          <div className="mb-8">
            <h3 className="text-white text-lg font-semibold mb-4">Choose Size</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {sizeOptions.map(size => (
                <button
                  key={size.id}
                  onClick={() => handleSizeChange(size.id)}
                  className={`p-4 rounded-lg border-2 transition-all text-left ${
                    customization.size === size.id
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
          <div className="mb-8">
            <h3 className="text-white text-lg font-semibold mb-4">Spice Level</h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {spiceLevels.map(spice => (
                <button
                  key={spice.id}
                  onClick={() => handleSpiceLevelChange(spice.id)}
                  className={`p-3 rounded-lg border-2 transition-all text-center ${
                    customization.spiceLevel === spice.id
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
          <div className="mb-8">
            <h3 className="text-white text-lg font-semibold mb-4">Special Instructions</h3>
            <textarea
              value={customization.specialInstructions}
              onChange={(e) => setCustomization(prev => ({ ...prev, specialInstructions: e.target.value }))}
              placeholder="Any special requests? (e.g., extra spicy, no onions, less oil, etc.)"
              className="w-full p-4 bg-dark-700 border border-dark-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-sera-blue resize-none"
              rows={3}
            />
          </div>

          {/* Quantity */}
          <div className="mb-8">
            <h3 className="text-white text-lg font-semibold mb-4">Quantity</h3>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => handleQuantityChange(customization.quantity - 1)}
                className="w-12 h-12 bg-dark-700 text-white rounded-lg flex items-center justify-center hover:bg-dark-600 transition-colors text-xl font-bold"
              >
                -
              </button>
              <span className="text-white text-2xl font-bold min-w-[60px] text-center">
                {customization.quantity}
              </span>
              <button
                onClick={() => handleQuantityChange(customization.quantity + 1)}
                className="w-12 h-12 bg-dark-700 text-white rounded-lg flex items-center justify-center hover:bg-dark-600 transition-colors text-xl font-bold"
              >
                +
              </button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-dark-700 bg-dark-800 flex-shrink-0">
          <div className="flex items-center justify-between mb-4">
            <div className="text-white">
              <div className="text-sm text-gray-400">Total Price</div>
              <div className="text-3xl font-bold text-sera-orange">₹{customization.totalPrice}</div>
              <div className="text-xs text-gray-500 mt-1">
                {customization.quantity} {customization.quantity === 1 ? 'item' : 'items'}
              </div>
            </div>
            <button
              onClick={handleAddToCart}
              className="flex items-center space-x-3 bg-gradient-to-r from-sera-blue to-blue-600 text-white px-8 py-4 rounded-lg font-semibold hover:from-blue-600 hover:to-blue-700 transition-all duration-200 hover:scale-105 active:scale-95 text-lg"
            >
              <ShoppingCart className="w-6 h-6" />
              <span>Add to Cart</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DishCustomizationModal;
