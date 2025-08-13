export interface SizeOption {
  id: string;
  name: string;
  multiplier: number;
  price: number;
  description?: string;
}

export interface ToppingOption {
  id: string;
  name: string;
  price: number;
  category: string;
  dietary: 'veg' | 'non-veg' | 'vegan' | 'jain';
  popular?: boolean;
  spicy?: boolean;
  description?: string;
}

export interface ExtraOption {
  id: string;
  name: string;
  price: number;
  category: string;
  dietary: 'veg' | 'non-veg' | 'vegan' | 'jain';
  popular?: boolean;
  description?: string;
}

export interface SpiceLevel {
  id: string;
  name: string;
  level: number;
  description: string;
  icon: string;
}

export interface CookingStyle {
  id: string;
  name: string;
  price: number;
  description: string;
}

// Size options for different dish types
export const sizeOptions: Record<string, SizeOption[]> = {
  default: [
    { id: 'small', name: 'Small', multiplier: 0.8, price: -20, description: 'Perfect for light eaters' },
    { id: 'medium', name: 'Medium', multiplier: 1.0, price: 0, description: 'Standard portion' },
    { id: 'large', name: 'Large', multiplier: 1.4, price: 50, description: 'Extra filling' }
  ],
  pizza: [
    { id: 'small', name: 'Small (8")', multiplier: 0.7, price: -50, description: 'Personal size' },
    { id: 'medium', name: 'Medium (12")', multiplier: 1.0, price: 0, description: 'Perfect for 2-3 people' },
    { id: 'large', name: 'Large (16")', multiplier: 1.6, price: 100, description: 'Family size' }
  ],
  burger: [
    { id: 'single', name: 'Single Patty', multiplier: 1.0, price: 0, description: 'Classic burger' },
    { id: 'double', name: 'Double Patty', multiplier: 1.5, price: 80, description: 'Extra meaty' },
    { id: 'triple', name: 'Triple Patty', multiplier: 2.0, price: 150, description: 'Ultimate burger' }
  ],
  beverage: [
    { id: 'small', name: 'Small (250ml)', multiplier: 0.7, price: -10, description: 'Refreshing sip' },
    { id: 'medium', name: 'Medium (500ml)', multiplier: 1.0, price: 0, description: 'Standard size' },
    { id: 'large', name: 'Large (1L)', multiplier: 1.5, price: 30, description: 'Extra thirst quenching' }
  ]
};

// Toppings categorized by dish type
export const toppingOptions: Record<string, ToppingOption[]> = {
  pizza: [
    { id: 'cheese', name: 'Extra Cheese', price: 40, category: 'dairy', dietary: 'veg', popular: true },
    { id: 'mushrooms', name: 'Mushrooms', price: 30, category: 'vegetables', dietary: 'veg' },
    { id: 'pepperoni', name: 'Pepperoni', price: 60, category: 'meat', dietary: 'non-veg', popular: true },
    { id: 'bell-peppers', name: 'Bell Peppers', price: 25, category: 'vegetables', dietary: 'veg' },
    { id: 'onions', name: 'Onions', price: 20, category: 'vegetables', dietary: 'veg' },
    { id: 'olives', name: 'Black Olives', price: 35, category: 'vegetables', dietary: 'veg' },
    { id: 'sausage', name: 'Italian Sausage', price: 70, category: 'meat', dietary: 'non-veg' },
    { id: 'bacon', name: 'Bacon', price: 80, category: 'meat', dietary: 'non-veg', popular: true },
    { id: 'pineapple', name: 'Pineapple', price: 30, category: 'fruits', dietary: 'veg' },
    { id: 'jalapenos', name: 'Jalapeños', price: 25, category: 'vegetables', dietary: 'veg', spicy: true },
    { id: 'spinach', name: 'Spinach', price: 20, category: 'vegetables', dietary: 'veg' },
    { id: 'tomatoes', name: 'Fresh Tomatoes', price: 15, category: 'vegetables', dietary: 'veg' }
  ],
  burger: [
    { id: 'cheese', name: 'Cheese Slice', price: 25, category: 'dairy', dietary: 'veg', popular: true },
    { id: 'bacon', name: 'Bacon Strips', price: 60, category: 'meat', dietary: 'non-veg', popular: true },
    { id: 'lettuce', name: 'Fresh Lettuce', price: 15, category: 'vegetables', dietary: 'veg' },
    { id: 'tomato', name: 'Tomato Slice', price: 10, category: 'vegetables', dietary: 'veg' },
    { id: 'onion', name: 'Onion Rings', price: 20, category: 'vegetables', dietary: 'veg' },
    { id: 'pickles', name: 'Pickles', price: 15, category: 'vegetables', dietary: 'veg' },
    { id: 'jalapenos', name: 'Jalapeños', price: 20, category: 'vegetables', dietary: 'veg', spicy: true },
    { id: 'mushrooms', name: 'Sautéed Mushrooms', price: 35, category: 'vegetables', dietary: 'veg' },
    { id: 'egg', name: 'Fried Egg', price: 30, category: 'dairy', dietary: 'non-veg' },
    { id: 'avocado', name: 'Avocado', price: 40, category: 'vegetables', dietary: 'veg' }
  ],
  pasta: [
    { id: 'cheese', name: 'Parmesan Cheese', price: 30, category: 'dairy', dietary: 'veg', popular: true },
    { id: 'mushrooms', name: 'Mushrooms', price: 25, category: 'vegetables', dietary: 'veg' },
    { id: 'chicken', name: 'Grilled Chicken', price: 80, category: 'meat', dietary: 'non-veg', popular: true },
    { id: 'shrimp', name: 'Shrimp', price: 120, category: 'seafood', dietary: 'non-veg' },
    { id: 'bell-peppers', name: 'Bell Peppers', price: 20, category: 'vegetables', dietary: 'veg' },
    { id: 'olives', name: 'Olives', price: 30, category: 'vegetables', dietary: 'veg' },
    { id: 'bacon', name: 'Bacon Bits', price: 50, category: 'meat', dietary: 'non-veg' },
    { id: 'spinach', name: 'Spinach', price: 15, category: 'vegetables', dietary: 'veg' },
    { id: 'sun-dried-tomatoes', name: 'Sun-dried Tomatoes', price: 35, category: 'vegetables', dietary: 'veg' }
  ],
  salad: [
    { id: 'chicken', name: 'Grilled Chicken', price: 100, category: 'meat', dietary: 'non-veg', popular: true },
    { id: 'avocado', name: 'Avocado', price: 60, category: 'vegetables', dietary: 'veg' },
    { id: 'nuts', name: 'Mixed Nuts', price: 40, category: 'nuts', dietary: 'veg' },
    { id: 'cheese', name: 'Feta Cheese', price: 35, category: 'dairy', dietary: 'veg' },
    { id: 'croutons', name: 'Croutons', price: 20, category: 'bread', dietary: 'veg' },
    { id: 'bacon', name: 'Bacon Bits', price: 50, category: 'meat', dietary: 'non-veg' },
    { id: 'eggs', name: 'Boiled Eggs', price: 30, category: 'dairy', dietary: 'non-veg' },
    { id: 'olives', name: 'Olives', price: 25, category: 'vegetables', dietary: 'veg' }
  ]
};

// Extras and sides
export const extraOptions: Record<string, ExtraOption[]> = {
  default: [
    { id: 'fries', name: 'French Fries', price: 80, category: 'sides', dietary: 'veg', popular: true },
    { id: 'drink', name: 'Soft Drink', price: 60, category: 'beverages', dietary: 'veg', popular: true },
    { id: 'salad', name: 'Side Salad', price: 70, category: 'sides', dietary: 'veg' },
    { id: 'bread', name: 'Garlic Bread', price: 50, category: 'sides', dietary: 'veg' },
    { id: 'soup', name: 'Soup of the Day', price: 90, category: 'sides', dietary: 'veg' },
    { id: 'ice-cream', name: 'Ice Cream', price: 80, category: 'desserts', dietary: 'veg' }
  ],
  indian: [
    { id: 'naan', name: 'Butter Naan', price: 30, category: 'bread', dietary: 'veg', popular: true },
    { id: 'rice', name: 'Basmati Rice', price: 40, category: 'sides', dietary: 'veg' },
    { id: 'raita', name: 'Cucumber Raita', price: 25, category: 'sides', dietary: 'veg' },
    { id: 'papad', name: 'Papad', price: 15, category: 'sides', dietary: 'veg' },
    { id: 'lassi', name: 'Sweet Lassi', price: 50, category: 'beverages', dietary: 'veg' },
    { id: 'gulab-jamun', name: 'Gulab Jamun', price: 60, category: 'desserts', dietary: 'veg' }
  ],
  chinese: [
    { id: 'fried-rice', name: 'Fried Rice', price: 70, category: 'sides', dietary: 'veg' },
    { id: 'noodles', name: 'Chow Mein', price: 80, category: 'sides', dietary: 'veg' },
    { id: 'soup', name: 'Hot & Sour Soup', price: 60, category: 'sides', dietary: 'veg' },
    { id: 'spring-rolls', name: 'Spring Rolls', price: 90, category: 'sides', dietary: 'veg' },
    { id: 'tea', name: 'Green Tea', price: 30, category: 'beverages', dietary: 'veg' }
  ]
};

// Spice levels
export const spiceLevels: SpiceLevel[] = [
  { id: 'mild', name: 'Mild', level: 1, description: 'No spice, perfect for everyone', icon: '🌶️' },
  { id: 'medium', name: 'Medium', level: 2, description: 'Balanced heat', icon: '🌶️🌶️' },
  { id: 'hot', name: 'Hot', level: 3, description: 'Spicy kick', icon: '🌶️🌶️🌶️' },
  { id: 'extra-hot', name: 'Extra Hot', level: 4, description: 'Very spicy', icon: '🌶️🌶️🌶️🌶️' },
  { id: 'fire', name: 'Fire', level: 5, description: 'Extreme heat - not for the faint-hearted', icon: '🔥' }
];

// Cooking styles
export const cookingStyles: CookingStyle[] = [
  { id: 'grilled', name: 'Grilled', price: 0, description: 'Healthy grilled preparation' },
  { id: 'fried', name: 'Deep Fried', price: 20, description: 'Crispy fried to perfection' },
  { id: 'baked', name: 'Baked', price: 0, description: 'Oven-baked for health' },
  { id: 'smoked', name: 'Smoked', price: 50, description: 'Wood-smoked flavor' },
  { id: 'steamed', name: 'Steamed', price: 0, description: 'Light and healthy' }
];

// Helper functions
export const getSizeOptions = (dishType: string = 'default'): SizeOption[] => {
  return sizeOptions[dishType] || sizeOptions.default;
};

export const getToppingOptions = (dishType: string = 'default'): ToppingOption[] => {
  return toppingOptions[dishType] || [];
};

export const getExtraOptions = (dishType: string = 'default'): ExtraOption[] => {
  return extraOptions[dishType] || extraOptions.default;
};

export const getDishType = (dishName: string, category: string): string => {
  const name = dishName.toLowerCase();
  const cat = category.toLowerCase();
  
  if (name.includes('pizza') || cat.includes('pizza')) return 'pizza';
  if (name.includes('burger') || cat.includes('burger')) return 'burger';
  if (name.includes('pasta') || cat.includes('pasta')) return 'pasta';
  if (name.includes('salad') || cat.includes('salad')) return 'salad';
  if (cat.includes('indian')) return 'indian';
  if (cat.includes('chinese')) return 'chinese';
  
  return 'default';
};
