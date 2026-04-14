import { MenuItemI } from "../../Restaurant/Config/RestaurantInterfaces";

// Interfaces
export interface CustomizationState {
  size: string;
  spiceLevel: string;
  specialInstructions: string;
  quantity: number;
  totalPrice: number;
}

export interface DishCustomizationModalProps {
    isOpen: boolean;
    onClose: () => void;
    dish: MenuItemI | null;
  }

// Constants
export const SIZE_OPTIONS = [
  { id: 'small', name: 'Small', price: -50, description: 'Perfect for light meals' },
  { id: 'medium', name: 'Medium', price: 0, description: 'Standard size' },
  { id: 'large', name: 'Large', price: 100, description: 'Extra portions' }
];

export const SPICE_LEVELS = [
  { id: 'mild', name: 'Mild', icon: '🌶️', description: 'No spice' },
  { id: 'medium', name: 'Medium', icon: '🌶️🌶️', description: 'Light spice' },
  { id: 'hot', name: 'Hot', icon: '🌶️🌶️🌶️', description: 'Spicy' },
  { id: 'extra-hot', name: 'Extra Hot', icon: '🌶️🌶️🌶️🌶️', description: 'Very spicy' }
];

// Default customization state
export const DEFAULT_CUSTOMIZATION: CustomizationState = {
  size: 'medium',
  spiceLevel: 'mild',
  specialInstructions: '',
  quantity: 1,
  totalPrice: 0
};

// Utility Functions
export const calculateTotalPrice = (dish: MenuItemI | null, customization: CustomizationState): number => {
  if (!dish) return 0;
  
  let basePrice = parseInt(dish.price.replace('₹', ''));
  const selectedSize = SIZE_OPTIONS.find(s => s.id === customization.size);
  
  if (selectedSize) {
    basePrice = basePrice + selectedSize.price;
  }

  return basePrice * customization.quantity;
};

export const createCustomizedDish = (dish: MenuItemI, customization: CustomizationState) => {
  return {
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
};

export const updateCustomization = (
  currentCustomization: CustomizationState,
  updates: Partial<CustomizationState>
): CustomizationState => {
  return {
    ...currentCustomization,
    ...updates
  };
};
