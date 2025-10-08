export interface DietaryPreferences {
  vegetarian: boolean;
  vegan: boolean;
  glutenFree: boolean;
  dairyFree: boolean;
  nutFree: boolean;
  seafoodFree: boolean;
  eggFree: boolean;
}

export interface CuisinePreferences {
  indian: boolean;
  chinese: boolean;
  italian: boolean;
  mexican: boolean;
  thai: boolean;
  japanese: boolean;
  mediterranean: boolean;
  american: boolean;
}

export interface SpiceLevel {
  value: string;
  label: string;
  emoji: string;
}

export interface CaloriePreference {
  value: string;
  label: string;
  desc: string;
}

export interface FoodPreferencesData {
  dietaryPreferences: DietaryPreferences;
  cuisinePreferences: CuisinePreferences;
  spiceLevel: string;
  caloriePreference: string;
  allergies: string[];
}