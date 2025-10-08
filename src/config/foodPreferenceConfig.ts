import { DietaryPreferences, CuisinePreferences, SpiceLevel, CaloriePreference } from '../components/Profile/interfaces/foodPreferenceInterfaces';

export const INITIAL_DIETARY_PREFERENCES: DietaryPreferences = {
  vegetarian: false,
  vegan: false,
  glutenFree: false,
  dairyFree: false,
  nutFree: false,
  seafoodFree: false,
  eggFree: false,
};

export const INITIAL_CUISINE_PREFERENCES: CuisinePreferences = {
  indian: false,
  chinese: false,
  italian: false,
  mexican: false,
  thai: false,
  japanese: false,
  mediterranean: false,
  american: false,
};

// Spice level options
export const SPICE_LEVEL_OPTIONS: SpiceLevel[] = [
  { value: 'mild', label: 'Mild', emoji: '🌶️' },
  { value: 'medium', label: 'Medium', emoji: '🌶️🌶️' },
  { value: 'hot', label: 'Hot', emoji: '🌶️🌶️🌶️' },
  { value: 'extra-hot', label: 'Extra Hot', emoji: '🌶️🌶️🌶️🌶️' }
];

// Calorie preference options
export const CALORIE_PREFERENCE_OPTIONS: CaloriePreference[] = [
  { value: 'low', label: 'Low Calorie', desc: 'Under 500 cal' },
  { value: 'moderate', label: 'Moderate', desc: '500-800 cal' },
  { value: 'high', label: 'High Calorie', desc: '800+ cal' }
];

// Common allergies
export const COMMON_ALLERGIES: string[] = [
  'Peanuts',
  'Tree Nuts',
  'Milk',
  'Eggs',
  'Soy',
  'Wheat',
  'Fish',
  'Shellfish'
];

// Default values
export const DEFAULT_SPICE_LEVEL = 'medium';
export const DEFAULT_CALORIE_PREFERENCE = 'moderate';

// Validation messages
export const VALIDATION_MESSAGES = {
  DIETARY_REQUIRED: 'At least one dietary preference',
  CUISINE_REQUIRED: 'At least one cuisine preference'
};

// Local storage key
export const FOOD_PREFERENCES_STORAGE_KEY = 'foodPreferences';