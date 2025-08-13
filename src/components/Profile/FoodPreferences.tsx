import React, { useState } from 'react';

interface DietaryPreferences {
  vegetarian: boolean;
  vegan: boolean;
  glutenFree: boolean;
  dairyFree: boolean;
  nutFree: boolean;
  seafoodFree: boolean;
  eggFree: boolean;
}

interface CuisinePreferences {
  indian: boolean;
  chinese: boolean;
  italian: boolean;
  mexican: boolean;
  thai: boolean;
  japanese: boolean;
  mediterranean: boolean;
  american: boolean;
}

const FoodPreferences: React.FC = () => {
  const [dietaryPreferences, setDietaryPreferences] = useState<DietaryPreferences>({
    vegetarian: false,
    vegan: false,
    glutenFree: false,
    dairyFree: false,
    nutFree: false,
    seafoodFree: false,
    eggFree: false,
  });

  const [cuisinePreferences, setCuisinePreferences] = useState<CuisinePreferences>({
    indian: true,
    chinese: true,
    italian: true,
    mexican: false,
    thai: true,
    japanese: false,
    mediterranean: false,
    american: true,
  });

  const [spiceLevel, setSpiceLevel] = useState('medium');
  const [caloriePreference, setCaloriePreference] = useState('moderate');
  const [healthGoals, setHealthGoals] = useState<string[]>([]);
  const [allergies, setAllergies] = useState<string[]>([]);
  const [customAllergies, setCustomAllergies] = useState('');

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

  const handleHealthGoalToggle = (goal: string) => {
    setHealthGoals(prev => 
      prev.includes(goal) 
        ? prev.filter(g => g !== goal)
        : [...prev, goal]
    );
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

  const handleSave = () => {
    // TODO: Implement save functionality
    console.log('Saving food preferences:', {
      dietaryPreferences,
      cuisinePreferences,
      spiceLevel,
      caloriePreference,
      healthGoals,
      allergies
    });
  };

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
          className="px-4 py-2 bg-sera-orange text-white rounded-lg hover:bg-orange-600 transition-colors duration-200"
        >
          Save Preferences
        </button>
      </div>

      {/* Dietary Restrictions */}
      <div className="bg-dark-700 rounded-lg p-6 border border-dark-600">
        <h4 className="text-white font-medium mb-4">Dietary Restrictions</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {Object.entries(dietaryPreferences).map(([key, value]) => (
            <div key={key} className="flex items-center">
              <input
                type="checkbox"
                id={key}
                checked={value}
                onChange={() => handleDietaryChange(key as keyof DietaryPreferences)}
                className="w-4 h-4 text-sera-orange bg-dark-600 border-dark-500 rounded focus:ring-sera-orange focus:ring-2"
              />
              <label htmlFor={key} className="ml-2 text-sm text-gray-300 capitalize">
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
            {['Peanuts', 'Tree Nuts', 'Milk', 'Eggs', 'Soy', 'Wheat', 'Fish', 'Shellfish'].map(allergy => (
              <button
                key={allergy}
                onClick={() => handleAllergyToggle(allergy)}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors duration-200 ${
                  allergies.includes(allergy)
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
          {[
            { value: 'mild', label: 'Mild', emoji: '🌶️' },
            { value: 'medium', label: 'Medium', emoji: '🌶️🌶️' },
            { value: 'hot', label: 'Hot', emoji: '🌶️🌶️🌶️' },
            { value: 'extra-hot', label: 'Extra Hot', emoji: '🌶️🌶️🌶️🌶️' }
          ].map(level => (
            <button
              key={level.value}
              onClick={() => setSpiceLevel(level.value)}
              className={`p-4 rounded-lg border-2 transition-colors duration-200 ${
                spiceLevel === level.value
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
          {[
            { value: 'low', label: 'Low Calorie', desc: 'Under 500 cal' },
            { value: 'moderate', label: 'Moderate', desc: '500-800 cal' },
            { value: 'high', label: 'High Calorie', desc: '800+ cal' }
          ].map(pref => (
            <button
              key={pref.value}
              onClick={() => setCaloriePreference(pref.value)}
              className={`p-4 rounded-lg border-2 transition-colors duration-200 ${
                caloriePreference === pref.value
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

      {/* Health Goals */}
      <div className="bg-dark-700 rounded-lg p-6 border border-dark-600">
        <h4 className="text-white font-medium mb-4">Health Goals</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {[
            'Weight Loss',
            'Muscle Gain',
            'Heart Health',
            'Diabetes Management',
            'Digestive Health',
            'Energy Boost'
          ].map(goal => (
            <button
              key={goal}
              onClick={() => handleHealthGoalToggle(goal)}
              className={`p-3 rounded-lg border-2 transition-colors duration-200 ${
                healthGoals.includes(goal)
                  ? 'border-green-500 bg-green-600/20 text-green-400'
                  : 'border-dark-600 bg-dark-600 text-gray-300 hover:border-dark-500'
              }`}
            >
              {goal}
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
              className={`p-3 rounded-lg border-2 transition-colors duration-200 ${
                value
                  ? 'border-sera-orange bg-orange-600/20 text-sera-orange'
                  : 'border-dark-600 bg-dark-600 text-gray-300 hover:border-dark-500'
              }`}
            >
              <div className="capitalize">{key}</div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FoodPreferences;
