import { 
  ALLERGY_PREFERENCES, 
  CUISINE_PREFERENCES, 
  DIETARY_PREFERENCES, 
  SPICE_LEVELS 
} from "../ProfilePageConstants";
import 
{ FoodPreferenceCategoryI, 
  FoodPreferenceFormDataI,  
  FoodPreferenceSectionI 
} from "../ProfilePageInterfaces";

export const getFoodPreferenceCategories = (): FoodPreferenceCategoryI[] => [
  {
    id: 'dietary',
    name: 'Dietary Preferences',
    icon: '🥗',
    preferences: DIETARY_PREFERENCES
  },
  {
    id: 'cuisine',
    name: 'Cuisine Preferences',
    icon: '🍽️',
    preferences: CUISINE_PREFERENCES
  },
  {
    id: 'allergy',
    name: 'Allergies',
    icon: '⚠️',
    preferences: ALLERGY_PREFERENCES
  },
  {
    id: 'spice',
    name: 'Spice Level',
    icon: '🌶️',
    preferences: SPICE_LEVELS
  }
];

export const getFoodPreferenceSectionProps = (): FoodPreferenceSectionI => ({
  title: 'Food Preferences',
  description: 'Tell us about your dietary preferences, favorite cuisines, and any allergies',
  categories: getFoodPreferenceCategories()
});

export const getPreferenceButtonClasses = (isSelected: boolean, category: string): string => {
  const baseClasses = "flex items-center space-x-2 px-3 py-2 rounded-lg border transition-all duration-200 text-sm font-medium";
  
  if (isSelected) {
    switch (category) {
      case 'dietary':
        return `${baseClasses} bg-green-500/20 border-green-500/50 text-green-400`;
      case 'cuisine':
        return `${baseClasses} bg-blue-500/20 border-blue-500/50 text-blue-400`;
      case 'allergy':
        return `${baseClasses} bg-red-500/20 border-red-500/50 text-red-400`;
      case 'spice':
        return `${baseClasses} bg-orange-500/20 border-orange-500/50 text-orange-400`;
      default:
        return `${baseClasses} bg-sera-blue/20 border-sera-blue/50 text-sera-blue`;
    }
  }
  
  return `${baseClasses} bg-dark-700 border-dark-600 text-gray-300 hover:bg-dark-600 hover:border-dark-500`;
};
export const getFormValidationErrors = (formData: FoodPreferenceFormDataI): Record<string, string> => {
  const errors: Record<string, string> = {};
  
  if (formData.dietary.length === 0) {
    errors.dietary = 'Please select at least one dietary preference';
  }
  
  if (formData.cuisines.length === 0) {
    errors.cuisines = 'Please select at least one cuisine preference';
  }
  
  if (formData.spiceLevel === '') {
    errors.spiceLevel = 'Please select a spice level';
  }
  
  return errors;
};

export const getInitialFormData = (): FoodPreferenceFormDataI => ({
  dietary: [],
  cuisines: [],
  allergies: [],
  spiceLevel: '',
  specialInstructions: ''
});

export const saveFoodPreferencesToLocalStorage = (formData: FoodPreferenceFormDataI): void => {
  try {
    localStorage.setItem('foodPreferences', JSON.stringify(formData));
  } catch (error) {
    console.error('Error saving food preferences:', error);
  }
};

export const loadFoodPreferencesFromLocalStorage = (): FoodPreferenceFormDataI => {
  try {
    const saved = localStorage.getItem('foodPreferences');
    return saved ? JSON.parse(saved) : getInitialFormData();
  } catch (error) {
    console.error('Error loading food preferences:', error);
    return getInitialFormData();
  }
};

// Legacy constants for backward compatibility
export const SPICE_LEVEL_OPTIONS = [
  { value: 'mild', label: 'Mild', emoji: '🌶️' },
  { value: 'medium', label: 'Medium', emoji: '🌶️🌶️' },
  { value: 'hot', label: 'Hot', emoji: '🌶️🌶️🌶️' },
  { value: 'extra-hot', label: 'Extra Hot', emoji: '🌶️🌶️🌶️🌶️' }
];

export const CALORIE_PREFERENCE_OPTIONS = [
  { value: 'low', label: 'Low Calorie', desc: 'Under 500 cal' },
  { value: 'moderate', label: 'Moderate', desc: '500-800 cal' },
  { value: 'high', label: 'High Calorie', desc: '800+ cal' }
];

export const COMMON_ALLERGIES = [
  'Peanuts',
  'Tree Nuts',
  'Milk',
  'Eggs',
  'Soy',
  'Wheat',
  'Fish',
  'Shellfish'
];

export const INITIAL_DIETARY_PREFERENCES = {
  vegetarian: false,
  vegan: false,
  glutenFree: false,
  dairyFree: false,
  nutFree: false,
  seafoodFree: false,
  eggFree: false,
};

export const INITIAL_CUISINE_PREFERENCES = {
  indian: false,
  chinese: false,
  italian: false,
  mexican: false,
  thai: false,
  japanese: false,
  mediterranean: false,
  american: false,
};

export const DEFAULT_SPICE_LEVEL = 'medium';
export const DEFAULT_CALORIE_PREFERENCE = 'moderate';

export const VALIDATION_MESSAGES = {
  DIETARY_REQUIRED: 'At least one dietary preference',
  CUISINE_REQUIRED: 'At least one cuisine preference'
};

export const FOOD_PREFERENCES_STORAGE_KEY = 'foodPreferences';