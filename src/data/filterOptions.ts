import { DropdownOption } from './dropdownOptions';

// Status options
export const statusOptions: DropdownOption[] = [
  { value: 'all', label: 'All Status', icon: '🏪' },
  { value: 'open', label: 'Open Now', icon: '🟢' },
  { value: 'closed', label: 'Closed', icon: '🔴' },
  { value: 'busy', label: 'Busy', icon: '🟡' },
  { value: 'temporarily_closed', label: 'Temporarily Closed', icon: '⚠️' }
];

// Distance options
export const distanceOptions: DropdownOption[] = [
  { value: 'any', label: 'Any Distance', icon: '🌍' },
  { value: '0-1', label: '0-1 km', icon: '📍' },
  { value: '1-3', label: '1-3 km', icon: '📍' },
  { value: '3-5', label: '3-5 km', icon: '📍' },
  { value: '5-10', label: '5-10 km', icon: '📍' },
  { value: '10+', label: '10+ km', icon: '📍' }
];

// Cuisine options
export const cuisineOptions: DropdownOption[] = [
  { value: 'all', label: 'All Cuisines', icon: '🍽️' },
  { value: 'Indian', label: 'Indian', icon: '🇮🇳' },
  { value: 'Italian', label: 'Italian', icon: '🇮🇹' },
  { value: 'Chinese', label: 'Chinese', icon: '🇨🇳' },
  { value: 'Japanese', label: 'Japanese', icon: '🇯🇵' },
  { value: 'Thai', label: 'Thai', icon: '🇹🇭' },
  { value: 'Mexican', label: 'Mexican', icon: '🇲🇽' },
  { value: 'Mediterranean', label: 'Mediterranean', icon: '🌊' },
  { value: 'Korean', label: 'Korean', icon: '🇰🇷' },
  { value: 'Vietnamese', label: 'Vietnamese', icon: '🇻🇳' },
  { value: 'French', label: 'French', icon: '🇫🇷' }
];

// Dietary options
export const dietaryOptions: DropdownOption[] = [
  { value: 'all', label: 'All Dietary', icon: '🍽️' },
  { value: 'vegetarian', label: 'Vegetarian', icon: '🌿' },
  { value: 'vegan', label: 'Vegan', icon: '🌱' },
  { value: 'non-vegetarian', label: 'Non-Vegetarian', icon: '🍗' },
  { value: 'jain', label: 'Jain', icon: '🟣' },
  { value: 'gluten-free', label: 'Gluten-Free', icon: '🌾' }
];

// Price range options
export const priceRangeOptions: DropdownOption[] = [
  { value: 'all', label: 'All Prices', icon: '💰' },
  { value: 'budget', label: 'Budget ($)', icon: '💵' },
  { value: 'mid-range', label: 'Mid-Range ($$)', icon: '💵' },
  { value: 'premium', label: 'Premium ($$$)', icon: '💵' }
];
