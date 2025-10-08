import React from 'react';
import ValidationModal from '../Common/ValidationModal';
import { DietaryPreferences, CuisinePreferences } from './interfaces/foodPreferenceInterfaces';
import {
  SPICE_LEVEL_OPTIONS,
  CALORIE_PREFERENCE_OPTIONS,
  COMMON_ALLERGIES
} from '../../config/foodPreferenceConfig';
import { useFoodPreferences } from '../../hooks/useFoodPreferences';

const FoodPreferences: React.FC = () => {
  const {
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
  } = useFoodPreferences();

  return (
    <div className="space-y-8">

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-xl font-semibold text-white">Food Preferences</h3>
          <p className="text-gray-400 text-sm">Customize your dining experience with personalized preferences</p>
        </div>
        <button
          onClick={handleSave}
          disabled={isLoading}
          className="px-4 py-2 bg-sera-orange text-white rounded-lg hover:bg-orange-600 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
        >
          {isLoading ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              <span>Saving...</span>
            </>
          ) : (
            <span>Save Preferences</span>
          )}
        </button>
      </div>

      {/* Dietary Restrictions */}
      <div className="bg-dark-700 rounded-lg p-6 border border-dark-600">
        <h4 className="text-white font-medium mb-4">Dietary Restrictions</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {Object.entries(dietaryPreferences).map(([key, value]) => (
            <div key={key} className={`flex items-center p-3 rounded-lg border-2 transition-all duration-200 ${value
                ? 'border-sera-orange bg-orange-600/10'
                : 'border-dark-600 bg-dark-600/50 hover:border-dark-500'
              }`}>
              <input
                type="checkbox"
                id={key}
                checked={value}
                onChange={() => handleDietaryChange(key as keyof DietaryPreferences)}
                className="w-4 h-4 text-sera-orange bg-dark-600 border-dark-500 rounded focus:ring-sera-orange focus:ring-2"
              />
              <label htmlFor={key} className={`ml-2 text-sm capitalize cursor-pointer ${value ? 'text-sera-orange font-medium' : 'text-gray-300'
                }`}>
                {key.replace(/([A-Z])/g, ' $1').toLowerCase()}
              </label>
            </div>
          ))}
        </div>
      </div>

      {/* Allergies */}
      <div className="bg-dark-700 rounded-lg p-6 border border-dark-600">
        <h4 className="text-white font-medium mb-4">Allergies & Intolerances</h4>

        {/* Common Allergies */}
        <div className="mb-4">
          <p className="text-gray-400 text-sm mb-3">Common Allergies:</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {COMMON_ALLERGIES.map(allergy => (
              <button
                key={allergy}
                onClick={() => handleAllergyToggle(allergy)}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors duration-200 ${allergies.includes(allergy)
                    ? 'bg-red-600 text-white'
                    : 'bg-dark-600 text-gray-300 hover:bg-dark-500'
                  }`}
              >
                {allergy}
              </button>
            ))}
          </div>
        </div>

        {/* Custom Allergies */}
        <div className="mb-4">
          <p className="text-gray-400 text-sm mb-3">Add Custom Allergy:</p>
          <div className="flex space-x-2">
            <input
              type="text"
              value={customAllergies}
              onChange={(e) => setCustomAllergies(e.target.value)}
              placeholder="Enter allergy name"
              className="flex-1 px-4 py-2 bg-dark-600 border border-dark-500 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-sera-orange focus:border-transparent"
            />
            <button
              onClick={addCustomAllergy}
              className="px-4 py-2 bg-sera-orange text-white rounded-lg hover:bg-orange-600 transition-colors duration-200"
            >
              Add
            </button>
          </div>
        </div>

        {/* Selected Allergies */}
        {allergies.length > 0 && (
          <div>
            <p className="text-gray-400 text-sm mb-3">Selected Allergies:</p>
            <div className="flex flex-wrap gap-2">
              {allergies.map(allergy => (
                <span
                  key={allergy}
                  className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-red-600 text-white"
                >
                  {allergy}
                  <button
                    onClick={() => removeAllergy(allergy)}
                    className="ml-2 text-red-200 hover:text-white"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Spice Level */}
      <div className="bg-dark-700 rounded-lg p-6 border border-dark-600">
        <h4 className="text-white font-medium mb-4">Spice Level Preference</h4>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
          {SPICE_LEVEL_OPTIONS.map(level => (
            <button
              key={level.value}
              onClick={() => setSpiceLevel(level.value)}
              className={`p-4 rounded-lg border-2 transition-colors duration-200 ${spiceLevel === level.value
                  ? 'border-sera-orange bg-orange-600/20 text-sera-orange'
                  : 'border-dark-600 bg-dark-600 text-gray-300 hover:border-dark-500'
                }`}
            >
              <div className="text-2xl mb-2">{level.emoji}</div>
              <div className="text-sm font-medium">{level.label}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Calorie Preference */}
      <div className="bg-dark-700 rounded-lg p-6 border border-dark-600">
        <h4 className="text-white font-medium mb-4">Calorie Preference</h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {CALORIE_PREFERENCE_OPTIONS.map(pref => (
            <button
              key={pref.value}
              onClick={() => setCaloriePreference(pref.value)}
              className={`p-4 rounded-lg border-2 transition-colors duration-200 ${caloriePreference === pref.value
                  ? 'border-sera-orange bg-orange-600/20 text-sera-orange'
                  : 'border-dark-600 bg-dark-600 text-gray-300 hover:border-dark-500'
                }`}
            >
              <div className="font-medium">{pref.label}</div>
              <div className="text-sm opacity-75">{pref.desc}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Cuisine Preferences */}
      <div className="bg-dark-700 rounded-lg p-6 border border-dark-600">
        <h4 className="text-white font-medium mb-4">Preferred Cuisines</h4>
        <p className="text-gray-400 text-sm mb-4">Select cuisines you enjoy to get better recommendations</p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {Object.entries(cuisinePreferences).map(([key, value]) => (
            <button
              key={key}
              onClick={() => handleCuisineChange(key as keyof CuisinePreferences)}
              className={`p-3 rounded-lg border-2 transition-colors duration-200 ${value
                  ? 'border-sera-orange bg-orange-600/20 text-sera-orange'
                  : 'border-dark-600 bg-dark-600 text-gray-300 hover:border-dark-500'
                }`}
            >
              <div className="capitalize">{key}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Validation Modal */}
      <ValidationModal
        isOpen={showValidationModal}
        onClose={closeValidationModal}
        missingFields={missingFields}
        title="Food Preferences Required"
      />
    </div>
  );
};

export default FoodPreferences;