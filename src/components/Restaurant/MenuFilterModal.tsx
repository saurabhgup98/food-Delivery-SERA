import React, { useState, useEffect } from 'react';
import { X, Menu } from 'lucide-react';
import PrimaryActionBtn from '../Button/PrimaryActionBtn';
import PrimarySelectBtn from '../Button/PrimarySelectBtn';
import { getRestaurantButtonProps, RestaurantButtonType } from './Config/RestaurantButtonConfig';
import {
  getMenuFilterModalConfig,
  getMenuFilterCategories,
  getFilterButtonStyles,
  getCategoryButtonStyles,
  MenuFilterSelections,
  DEFAULT_MENU_FILTERS
} from './Config/RestaurantMenuFilterModalConfig';

export interface MenuFilterModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApply?: (values: MenuFilterSelections) => void;
  onClear?: () => void;
  initialValues?: MenuFilterSelections;
}

type FilterCategory = 'food-type' | 'dietary' | 'availability' | 'preferences' | 'price' | 'sorting';

const MenuFilterModal: React.FC<MenuFilterModalProps> = ({ 
  isOpen, 
  onClose, 
  onApply, 
  onClear, 
  initialValues 
}) => {
  const [values, setValues] = useState<MenuFilterSelections>(
    initialValues || DEFAULT_MENU_FILTERS
  );
  const [activeCategory, setActiveCategory] = useState<FilterCategory>('food-type');

  // Sync with initialValues when modal opens
  useEffect(() => {
    if (isOpen && initialValues) {
      setValues(initialValues);
    }
  }, [isOpen, initialValues]);

  if (!isOpen) return null;

  const config = getMenuFilterModalConfig();
  const categories = getMenuFilterCategories();

  // Toggle filter value : selct or unselect
  const toggleFilter = (key: keyof MenuFilterSelections, item: string) => {
    setValues(prev => {
      const currentValue = prev[key];
      if (Array.isArray(currentValue)) {
        const exists = currentValue.includes(item);
        const nextArr = exists 
          ? currentValue.filter(v => v !== item) 
          : [...currentValue, item];
        return { ...prev, [key]: nextArr } as MenuFilterSelections;
      }
      return { ...prev, [key]: item } as MenuFilterSelections;
    });
  };

  // Check if filter is selected
  const isSelected = (key: keyof MenuFilterSelections, item: string) => {
    const currentValue = values[key];
    if (Array.isArray(currentValue)) {
      return currentValue.includes(item);
    }
    return currentValue === item;
  };

  // Handle Apply
  const handleApply = () => {
    onApply && onApply(values);
    onClose();
  };

  // Handle Clear All
  const handleClear = () => {
    setValues(DEFAULT_MENU_FILTERS);
    onClear && onClear();
  };

  // Render content for active category
  const renderContent = () => {
    const activeCategoryConfig = config.find(cat => cat.id === activeCategory);
    if (!activeCategoryConfig) return null;

    // Special handling for sorting category
    if (activeCategory === 'sorting') {
      const sortBySubheading = activeCategoryConfig.subheadings[0];
      return (
        <div className="space-y-6">
          <div>
            <h3 className="text-white font-semibold mb-3">{sortBySubheading.label}</h3>
            <div className="grid grid-cols-2 gap-3">
              <select
                value={values.sortBy}
                onChange={(e) => setValues(prev => ({ 
                  ...prev, 
                  sortBy: e.target.value as MenuFilterSelections['sortBy'] 
                }))}
                className="w-full bg-dark-700 border border-dark-600 rounded-lg px-3 py-2 text-white"
              >
                {sortBySubheading.filters.map(filter => (
                  <option key={filter.value} value={filter.value}>
                    {filter.label}
                  </option>
                ))}
              </select>
              <select
                value={values.sortOrder}
                onChange={(e) => setValues(prev => ({ 
                  ...prev, 
                  sortOrder: e.target.value as 'asc' | 'desc' 
                }))}
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
              {[
                { label: 'Most Popular', sortBy: 'rating' as const, sortOrder: 'desc' as const },
                { label: 'Highest Rated', sortBy: 'rating' as const, sortOrder: 'desc' as const },
                { label: 'Lowest Price', sortBy: 'price' as const, sortOrder: 'asc' as const },
                { label: 'Fastest Prep', sortBy: 'prepTime' as const, sortOrder: 'asc' as const }
              ].map((option) => (
                <PrimarySelectBtn
                  key={option.label}
                  text={option.label}
                  onClick={() => setValues(prev => ({ 
                    ...prev, 
                    sortBy: option.sortBy, 
                    sortOrder: option.sortOrder 
                  }))}
                  {...getFilterButtonStyles(
                    values.sortBy === option.sortBy && values.sortOrder === option.sortOrder
                  )}
                />
              ))}
            </div>
          </div>
        </div>
      );
    }

    // Regular category rendering with PrimarySelectBtn
    return (
      <div className="space-y-6">
        {activeCategoryConfig.subheadings.map((subheading) => (
          <div key={subheading.id}>
            <h3 className="text-white font-semibold mb-3">{subheading.label}</h3>
            <div className="flex flex-wrap gap-2">
              {subheading.filters.map((filter) => (
                <PrimarySelectBtn
                  key={filter.value}
                  text={filter.label}
                  onClick={() => toggleFilter(subheading.filterKey, filter.value)}
                  {...getFilterButtonStyles(isSelected(subheading.filterKey, filter.value))}
                />
              ))}
            </div>
          </div>
        ))}
      </div>
    );
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
                  <PrimarySelectBtn
                    key={category.id}
                    text={category.label}
                    iconNode={<span className="text-xs">{category.icon}</span>}
                    onClick={() => setActiveCategory(category.id as FilterCategory)}
                    {...getCategoryButtonStyles(activeCategory === category.id)}
                    className="flex-shrink-0 whitespace-nowrap"
                  />
                ))}
              </div>
            </div>

            {/* Desktop: Vertical layout */}
            <div className="hidden md:block p-4 space-y-2">
              {categories.map((category) => (
                <PrimarySelectBtn
                  key={category.id}
                  text={category.label}
                  iconNode={<span>{category.icon}</span>}
                  onClick={() => setActiveCategory(category.id as FilterCategory)}
                  {...getCategoryButtonStyles(activeCategory === category.id)}
                />
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
          <PrimaryActionBtn
            {...getRestaurantButtonProps(RestaurantButtonType.MENU_FILTER_CLEAR, handleClear)}
          />
          <div className="flex gap-2 sm:gap-3">
            <PrimaryActionBtn
              {...getRestaurantButtonProps(RestaurantButtonType.MENU_FILTER_CANCEL, onClose)}
            />
            <PrimaryActionBtn
              {...getRestaurantButtonProps(RestaurantButtonType.MENU_FILTER_APPLY, handleApply)}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default MenuFilterModal;
export type { MenuFilterSelections } from './Config/RestaurantMenuFilterModalConfig';