// Restaurant Configuration - Centralized config for restaurant components
// Contains dietary options, star rating config, and utility functions

export interface DietaryOption {
  value: string;
  label: string;
  icon: string;
  bgColor: string;
  textColor: string;
}

export const DIETARY_CONFIG: Record<string, DietaryOption> = {
  'veg': {
    value: 'veg',
    label: 'Vegetarian',
    icon: '🌿',
    bgColor: 'bg-green-600',
    textColor: 'text-white'
  },
  'non-veg': {
    value: 'non-veg',
    label: 'Non-Vegetarian',
    icon: '🍖',
    bgColor: 'bg-red-600',
    textColor: 'text-white'
  },
  'jain': {
    value: 'jain',
    label: 'Jain',
    icon: '🕉️',
    bgColor: 'bg-orange-600',
    textColor: 'text-white'
  },
  'vegan': {
    value: 'vegan',
    label: 'Vegan',
    icon: '🌱',
    bgColor: 'bg-emerald-600',
    textColor: 'text-white'
  },
  'both': {
    value: 'both',
    label: 'Both',
    icon: '🍽️',
    bgColor: 'bg-purple-600',
    textColor: 'text-white'
  }
};

export const STAR_CONFIG = {
  fullStarColor: 'text-yellow-400',
  emptyStarColor: 'text-gray-400',
  size: 'w-4 h-4'
};

export const FAVORITE_ICON_CONFIG = {
  size: 'w-5 h-5',
  strokeWidth: 2
};

// Function to get dietary icon from config
export const getDietaryIcon = (dietary: string) => {
  const config = DIETARY_CONFIG[dietary] || DIETARY_CONFIG['both'];
  
  return {
    icon: config.icon,
    bgColor: config.bgColor,
    textColor: config.textColor,
    label: config.label
  };
};

// Function to get star configuration for rendering
export const getStarConfig = (rating: number) => {
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 !== 0;
  const emptyStars = 5 - Math.ceil(rating);
  
  return {
    fullStars,
    hasHalfStar,
    emptyStars,
    rating
  };
};
