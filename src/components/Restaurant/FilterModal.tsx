import React, { useState } from 'react';
import { X, Menu } from 'lucide-react';

export interface FilterSelections {
  mealType: string[];
  cuisine: string[];
  dietary: string[];
  priceRange: string[];
  sortBy: 'name' | 'price' | 'rating' | 'prepTime';
  sortOrder: 'asc' | 'desc';
}

interface FilterModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApply?: (values: FilterSelections) => void;
  onClear?: () => void;
  initialValues?: FilterSelections;
}

const defaultValues: FilterSelections = {
  mealType: [],
  cuisine: [],
  dietary: [],
  priceRange: [],
  sortBy: 'name',
  sortOrder: 'asc',
};

type FilterCategory = 'food-type' | 'dietary' | 'availability' | 'preferences' | 'price' | 'sorting';

const FilterModal: React.FC<FilterModalProps> = ({ isOpen, onClose, onApply, onClear, initialValues }) => {
  const [values, setValues] = useState<FilterSelections>(initialValues || defaultValues);
  const [activeCategory, setActiveCategory] = useState<FilterCategory>('food-type');

  if (!isOpen) return null;

  const toggleInArray = (key: keyof FilterSelections, item: string) => {
    setValues(prev => {
      const arr = Array.isArray(prev[key]) ? (prev[key] as string[]) : [];
      const exists = arr.includes(item);
      const nextArr = exists ? arr.filter(v => v !== item) : [...arr, item];
      return { ...prev, [key]: nextArr } as FilterSelections;
    });
  };

  const isSelected = (key: keyof FilterSelections, item: string) => {
    const arr = Array.isArray(values[key]) ? (values[key] as string[]) : [];
    return arr.includes(item);
  };

  const categories = [
    { id: 'food-type', label: 'Food Type', icon: '🍽️' },
    { id: 'dietary', label: 'Dietary & Health', icon: '🌿' },
    { id: 'availability', label: 'Availability', icon: '⏰' },
    { id: 'preferences', label: 'Preferences', icon: '⭐' },
    { id: 'price', label: 'Price & Value', icon: '💰' },
    { id: 'sorting', label: 'Sorting', icon: '🔄' }
  ];

  const renderContent = () => {
    switch (activeCategory) {
      case 'food-type':
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-white font-semibold mb-3">Meal Type</h3>
              <div className="flex flex-wrap gap-2">
                {['Breakfast', 'Lunch', 'Dinner', 'Snacks', 'Late Night'].map((label) => (
                  <button
                    key={label}
                    onClick={() => toggleInArray('mealType', label)}
                    className={`px-3 py-2 rounded-lg border transition-colors ${
                      isSelected('mealType', label)
                        ? 'bg-sera-blue/20 border-sera-blue text-sera-blue'
                        : 'bg-dark-700 text-gray-300 border-dark-600 hover:bg-dark-600'
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-white font-semibold mb-3">Cuisine</h3>
              <div className="flex flex-wrap gap-2">
                {['Indian', 'Chinese', 'Italian', 'Mexican', 'Thai', 'Japanese', 'American', 'Mediterranean'].map((label) => (
                  <button
                    key={label}
                    onClick={() => toggleInArray('cuisine', label)}
                    className={`px-3 py-2 rounded-lg border transition-colors ${
                      isSelected('cuisine', label)
                        ? 'bg-sera-blue/20 border-sera-blue text-sera-blue'
                        : 'bg-dark-700 text-gray-300 border-dark-600 hover:bg-dark-600'
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        );

      case 'dietary':
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-white font-semibold mb-3">Dietary Preferences</h3>
              <div className="flex flex-wrap gap-2">
                {['Veg', 'Non-Veg', 'Vegan', 'Jain', 'Gluten-Free', 'Dairy-Free', 'Nut-Free'].map((label) => (
                  <button
                    key={label}
                    onClick={() => toggleInArray('dietary', label)}
                    className={`px-3 py-2 rounded-lg border transition-colors ${
                      isSelected('dietary', label)
                        ? 'bg-sera-blue/20 border-sera-blue text-sera-blue'
                        : 'bg-dark-700 text-gray-300 border-dark-600 hover:bg-dark-600'
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-white font-semibold mb-3">Health Options</h3>
              <div className="flex flex-wrap gap-2">
                {['Low Calorie', 'High Protein', 'Low Carb', 'Keto-Friendly', 'Organic'].map((label) => (
                  <button
                    key={label}
                    onClick={() => toggleInArray('dietary', label)}
                    className={`px-3 py-2 rounded-lg border transition-colors ${
                      isSelected('dietary', label)
                        ? 'bg-sera-blue/20 border-sera-blue text-sera-blue'
                        : 'bg-dark-700 text-gray-300 border-dark-600 hover:bg-dark-600'
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        );

      case 'availability':
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-white font-semibold mb-3">Preparation Time</h3>
              <div className="flex flex-wrap gap-2">
                {['Quick (< 15 min)', 'Standard (15-30 min)', 'Slow Cooked (> 30 min)'].map((label) => (
                  <button
                    key={label}
                    onClick={() => toggleInArray('mealType', label)}
                    className={`px-3 py-2 rounded-lg border transition-colors ${
                      isSelected('mealType', label)
                        ? 'bg-sera-blue/20 border-sera-blue text-sera-blue'
                        : 'bg-dark-700 text-gray-300 border-dark-600 hover:bg-dark-600'
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-white font-semibold mb-3">Availability Status</h3>
              <div className="flex flex-wrap gap-2">
                {['Available Now', 'Pre-order', 'Limited Time', 'Seasonal'].map((label) => (
                  <button
                    key={label}
                    onClick={() => toggleInArray('mealType', label)}
                    className={`px-3 py-2 rounded-lg border transition-colors ${
                      isSelected('mealType', label)
                        ? 'bg-sera-blue/20 border-sera-blue text-sera-blue'
                        : 'bg-dark-700 text-gray-300 border-dark-600 hover:bg-dark-600'
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        );

      case 'preferences':
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-white font-semibold mb-3">Spice Level</h3>
              <div className="flex flex-wrap gap-2">
                {['Mild', 'Medium', 'Hot', 'Extra Hot'].map((label) => (
                  <button
                    key={label}
                    onClick={() => toggleInArray('dietary', label)}
                    className={`px-3 py-2 rounded-lg border transition-colors ${
                      isSelected('dietary', label)
                        ? 'bg-sera-blue/20 border-sera-blue text-sera-blue'
                        : 'bg-dark-700 text-gray-300 border-dark-600 hover:bg-dark-600'
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-white font-semibold mb-3">Cooking Style</h3>
              <div className="flex flex-wrap gap-2">
                {['Grilled', 'Fried', 'Baked', 'Steamed', 'Tandoori', 'Curry'].map((label) => (
                  <button
                    key={label}
                    onClick={() => toggleInArray('cuisine', label)}
                    className={`px-3 py-2 rounded-lg border transition-colors ${
                      isSelected('cuisine', label)
                        ? 'bg-sera-blue/20 border-sera-blue text-sera-blue'
                        : 'bg-dark-700 text-gray-300 border-dark-600 hover:bg-dark-600'
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        );

      case 'price':
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-white font-semibold mb-3">Price Range</h3>
              <div className="flex flex-wrap gap-2">
                {['Budget <₹100', '₹100-₹300', '₹300-₹500', 'Premium >₹500'].map((label) => (
                  <button
                    key={label}
                    onClick={() => toggleInArray('priceRange', label)}
                    className={`px-3 py-2 rounded-lg border transition-colors ${
                      isSelected('priceRange', label)
                        ? 'bg-sera-blue/20 border-sera-blue text-sera-blue'
                        : 'bg-dark-700 text-gray-300 border-dark-600 hover:bg-dark-600'
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-white font-semibold mb-3">Value Options</h3>
              <div className="flex flex-wrap gap-2">
                {['Best Value', 'Portion Size', 'Combo Deals', 'Family Packs'].map((label) => (
                  <button
                    key={label}
                    onClick={() => toggleInArray('mealType', label)}
                    className={`px-3 py-2 rounded-lg border transition-colors ${
                      isSelected('mealType', label)
                        ? 'bg-sera-blue/20 border-sera-blue text-sera-blue'
                        : 'bg-dark-700 text-gray-300 border-dark-600 hover:bg-dark-600'
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        );

      case 'sorting':
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-white font-semibold mb-3">Sort By</h3>
              <div className="grid grid-cols-2 gap-3">
                <select
                  value={values.sortBy}
                  onChange={(e) => setValues(prev => ({ ...prev, sortBy: e.target.value as FilterSelections['sortBy'] }))}
                  className="w-full bg-dark-700 border border-dark-600 rounded-lg px-3 py-2 text-white"
                >
                  <option value="name">Name</option>
                  <option value="price">Price</option>
                  <option value="rating">Rating</option>
                  <option value="prepTime">Prep Time</option>
                </select>
                <select
                  value={values.sortOrder}
                  onChange={(e) => setValues(prev => ({ ...prev, sortOrder: e.target.value as FilterSelections['sortOrder'] }))}
                  className="w-full bg-dark-700 border border-dark-600 rounded-lg px-3 py-2 text-white"
                >
                  <option value="asc">Ascending</option>
                  <option value="desc">Descending</option>
                </select>
              </div>
            </div>

            <div>
              <h3 className="text-white font-semibold mb-3">Quick Sort Options</h3>
              <div className="flex flex-wrap gap-2">
                {['Most Popular', 'Highest Rated', 'Lowest Price', 'Fastest Prep'].map((label) => (
                  <button
                    key={label}
                    onClick={() => {
                      switch (label) {
                        case 'Most Popular':
                          setValues(prev => ({ ...prev, sortBy: 'rating', sortOrder: 'desc' }));
                          break;
                        case 'Highest Rated':
                          setValues(prev => ({ ...prev, sortBy: 'rating', sortOrder: 'desc' }));
                          break;
                        case 'Lowest Price':
                          setValues(prev => ({ ...prev, sortBy: 'price', sortOrder: 'asc' }));
                          break;
                        case 'Fastest Prep':
                          setValues(prev => ({ ...prev, sortBy: 'prepTime', sortOrder: 'asc' }));
                          break;
                      }
                    }}
                    className="px-3 py-2 rounded-lg border border-dark-600 bg-dark-700 text-gray-300 hover:bg-dark-600 transition-colors"
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />

      <div className="relative w-full max-w-4xl h-full max-h-[95vh] bg-dark-800 border border-dark-700 rounded-xl shadow-xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-4 sm:px-6 py-4 border-b border-dark-700 flex-shrink-0">
          <div className="flex items-center gap-2 text-white">
            <Menu className="w-5 h-5" />
            <span className="font-semibold">Filters</span>
          </div>
          <button onClick={onClose} className="p-2 rounded-lg hover:bg-dark-700 text-gray-300">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body - Responsive layout */}
        <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
          {/* Left nav - Mobile: horizontal scroll, Desktop: vertical */}
          <div className="md:w-64 md:border-r border-dark-700 bg-dark-750 flex-shrink-0">
            {/* Mobile: Horizontal scroll */}
            <div className="md:hidden overflow-x-auto">
              <div className="flex space-x-2 p-4">
                {categories.map((category) => (
                  <button
                    key={category.id}
                    onClick={() => setActiveCategory(category.id as FilterCategory)}
                    className={`flex-shrink-0 px-3 py-2 rounded-lg transition-colors whitespace-nowrap ${
                      activeCategory === category.id
                        ? 'bg-dark-700 text-white'
                        : 'text-gray-300 hover:bg-dark-700'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <span>{category.icon}</span>
                      <span className="text-sm">{category.label}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
            
            {/* Desktop: Vertical layout */}
            <div className="hidden md:block p-4 space-y-2">
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => setActiveCategory(category.id as FilterCategory)}
                  className={`w-full text-left px-3 py-2 rounded-lg transition-colors ${
                    activeCategory === category.id
                      ? 'bg-dark-700 text-white'
                      : 'text-gray-300 hover:bg-dark-700'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span>{category.icon}</span>
                    <span>{category.label}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Right content - Scrollable area */}
          <div className="flex-1 overflow-y-auto">
            <div className="p-4 sm:p-6 space-y-6">
              {renderContent()}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-4 sm:px-6 py-4 border-t border-dark-700 flex-shrink-0">
          <button
            onClick={() => {
              setValues(defaultValues);
              onClear && onClear();
            }}
            className="px-4 py-2 text-gray-300 hover:text-white text-sm sm:text-base"
          >
            Clear All
          </button>
          <div className="flex gap-2 sm:gap-3">
            <button 
              onClick={onClose} 
              className="px-3 sm:px-5 py-2 rounded-lg bg-dark-700 text-white hover:bg-dark-600 text-sm sm:text-base"
            >
              Cancel
            </button>
            <button
              onClick={() => {
                onApply && onApply(values);
                onClose();
              }}
              className="px-3 sm:px-5 py-2 rounded-lg bg-sera-blue text-white hover:bg-sera-blue/80 text-sm sm:text-base"
            >
              Apply
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FilterModal;


