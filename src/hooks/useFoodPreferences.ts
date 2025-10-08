import { useState, useEffect } from 'react';
import { DietaryPreferences, CuisinePreferences } from '../components/Profile/interfaces/foodPreferenceInterfaces';
import {
  INITIAL_DIETARY_PREFERENCES,
  INITIAL_CUISINE_PREFERENCES,
  DEFAULT_SPICE_LEVEL,
  DEFAULT_CALORIE_PREFERENCE,
  VALIDATION_MESSAGES,
  FOOD_PREFERENCES_STORAGE_KEY
} from '../config/foodPreferenceConfig';

export const useFoodPreferences = () => {
  // State management
  const [dietaryPreferences, setDietaryPreferences] = useState<DietaryPreferences>(INITIAL_DIETARY_PREFERENCES);
  const [cuisinePreferences, setCuisinePreferences] = useState<CuisinePreferences>(INITIAL_CUISINE_PREFERENCES);
  const [spiceLevel, setSpiceLevel] = useState(DEFAULT_SPICE_LEVEL);
  const [caloriePreference, setCaloriePreference] = useState(DEFAULT_CALORIE_PREFERENCE);
  const [allergies, setAllergies] = useState<string[]>([]);
  const [customAllergies, setCustomAllergies] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showValidationModal, setShowValidationModal] = useState(false);
  const [missingFields, setMissingFields] = useState<string[]>([]);

  // Handler functions
  const handleDietaryChange = (key: keyof DietaryPreferences) => {
    setDietaryPreferences(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const handleCuisineChange = (key: keyof CuisinePreferences) => {
    setCuisinePreferences(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const handleAllergyToggle = (allergy: string) => {
    setAllergies(prev =>
      prev.includes(allergy)
        ? prev.filter(a => a !== allergy)
        : [...prev, allergy]
    );
  };

  const addCustomAllergy = () => {
    if (customAllergies.trim() && !allergies.includes(customAllergies.trim())) {
      setAllergies(prev => [...prev, customAllergies.trim()]);
      setCustomAllergies('');
    }
  };

  const removeAllergy = (allergy: string) => {
    setAllergies(prev => prev.filter(a => a !== allergy));
  };

  const loadPreferences = async () => {
    try {
      // For now, we'll use localStorage to persist preferences
      const savedPreferences = localStorage.getItem(FOOD_PREFERENCES_STORAGE_KEY);
      if (savedPreferences) {
        const parsed = JSON.parse(savedPreferences);
        setDietaryPreferences(parsed.dietaryPreferences || INITIAL_DIETARY_PREFERENCES);
        setCuisinePreferences(parsed.cuisinePreferences || INITIAL_CUISINE_PREFERENCES);
        setSpiceLevel(parsed.spiceLevel || DEFAULT_SPICE_LEVEL);
        setCaloriePreference(parsed.caloriePreference || DEFAULT_CALORIE_PREFERENCE);
        setAllergies(parsed.allergies || []);
      }
    } catch (error) {
      console.error('Error loading preferences:', error);
    }
  };

  const handleSave = async () => {
    try {
      setIsLoading(true);

      // Validate required fields
      const requiredFields: string[] = [];
      if (Object.values(dietaryPreferences).every(v => !v)) {
        requiredFields.push(VALIDATION_MESSAGES.DIETARY_REQUIRED);
      }
      if (Object.values(cuisinePreferences).every(v => !v)) {
        requiredFields.push(VALIDATION_MESSAGES.CUISINE_REQUIRED);
      }

      if (requiredFields.length > 0) {
        setMissingFields(requiredFields);
        setShowValidationModal(true);
        return;
      }

      const preferencesData = {
        dietaryPreferences,
        cuisinePreferences,
        spiceLevel,
        caloriePreference,
        allergies
      };

      // Save to localStorage for now (can be replaced with API call later)
      localStorage.setItem(FOOD_PREFERENCES_STORAGE_KEY, JSON.stringify(preferencesData));

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      alert('Food preferences saved successfully!');
    } catch (error) {
      console.error('Error saving preferences:', error);
      alert('Failed to save preferences. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const closeValidationModal = () => {
    setShowValidationModal(false);
  };

  // Load preferences on mount
  useEffect(() => {
    loadPreferences();
  }, []);

  return {
    // State
    dietaryPreferences,
    cuisinePreferences,
    spiceLevel,
    caloriePreference,
    allergies,
    customAllergies,
    isLoading,
    showValidationModal,
    missingFields,
    
    // Setters
    setSpiceLevel,
    setCaloriePreference,
    setCustomAllergies,
    
    // Handlers
    handleDietaryChange,
    handleCuisineChange,
    handleAllergyToggle,
    addCustomAllergy,
    removeAllergy,
    handleSave,
    closeValidationModal
  };
};