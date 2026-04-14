import React from 'react';

// Filter button styles for PrimarySelectBtn
export const getFilterButtonStyles = (isSelected: boolean) => {
  return {
    isSelected,
    textColor: 'text-gray-300',
    textHoverColor: 'hover:text-white',
    bgColor: 'bg-dark-700',
    hoverBgColor: 'hover:bg-dark-600',
    border: 'border',
    hoverBorderColor: 'hover:border-dark-500',
    selectedTextColor: 'text-sera-blue',
    selectedBgColor: 'bg-sera-blue/20',
    selectedBorderColor: 'border-sera-blue',
    size: 'sm' as const,
    textSize: 'sm' as const,
    className: 'px-3 py-2'
  };
};

// Category navigation button styles for PrimarySelectBtn
export const getCategoryButtonStyles = (isSelected: boolean) => {
  return {
    isSelected,
    textColor: 'text-gray-300',
    textHoverColor: 'hover:text-white',
    bgColor: 'bg-transparent',
    hoverBgColor: 'hover:bg-dark-700',
    border: '',
    hoverBorderColor: '',
    selectedTextColor: 'text-white',
    selectedBgColor: 'bg-dark-700',
    selectedBorderColor: '',
    size: 'sm' as const,
    textSize: 'sm' as const,
    className: 'w-full px-3 py-2 justify-start'
  };
};

// Filter label interface
export interface FilterLabel {
  value: string;
  label: string;
}

// Subheading interface
export interface FilterSubheading {
  id: string;
  label: string;
  filters: FilterLabel[];
  filterKey: keyof MenuFilterSelections; // Key to store selected values
  isArray?: boolean; // Whether this filter stores an array (default: true)
}

// Main heading interface
export interface FilterMainHeading {
  id: string;
  label: string;
  icon: string;
  subheadings: FilterSubheading[];
}

// Menu filter selections interface
export interface MenuFilterSelections {
  mealType: string[];
  cuisine: string[];
  dietary: string[];
  priceRange: string[];
  prepTime: string[];
  availability: string[];
  spiceLevel: string[];
  cookingStyle: string[];
  valueOptions: string[];
  sortBy: 'name' | 'price' | 'rating' | 'prepTime';
  sortOrder: 'asc' | 'desc';
}

// Default filter values
export const DEFAULT_MENU_FILTERS: MenuFilterSelections = {
  mealType: [],
  cuisine: [],
  dietary: [],
  priceRange: [],
  prepTime: [],
  availability: [],
  spiceLevel: [],
  cookingStyle: [],
  valueOptions: [],
  sortBy: 'name',
  sortOrder: 'asc',
};

// All available filter options constant
export const ALL_MENU_FILTER_OPTIONS = {
  mealType: ['Breakfast', 'Lunch', 'Dinner', 'Snacks', 'Late Night'],
  cuisine: ['Indian', 'Chinese', 'Italian', 'Mexican', 'Thai', 'Japanese', 'American', 'Mediterranean'],
  dietary: ['Veg', 'Non-Veg', 'Vegan', 'Jain', 'Gluten-Free', 'Dairy-Free', 'Nut-Free'],
  healthOptions: ['Low Calorie', 'High Protein', 'Low Carb', 'Keto-Friendly', 'Organic'],
  prepTime: ['Quick (< 15 min)', 'Standard (15-30 min)', 'Slow Cooked (> 30 min)'],
  availability: ['Available Now', 'Pre-order', 'Limited Time', 'Seasonal'],
  spiceLevel: ['Mild', 'Medium', 'Hot', 'Extra Hot'],
  cookingStyle: ['Grilled', 'Fried', 'Baked', 'Steamed', 'Tandoori', 'Curry'],
  priceRange: ['Budget <₹100', '₹100-₹300', '₹300-₹500', 'Premium >₹500'],
  valueOptions: ['Best Value', 'Portion Size', 'Combo Deals', 'Family Packs'],
} as const;

// Get menu filter modal configuration
export const getMenuFilterModalConfig = (): FilterMainHeading[] => {
  return [
    {
      id: 'food-type',
      label: 'Food Type',
      icon: '🍽️',
      subheadings: [
        {
          id: 'meal-type',
          label: 'Meal Type',
          filterKey: 'mealType',
          filters: ALL_MENU_FILTER_OPTIONS.mealType.map(value => ({ value, label: value }))
        },
        {
          id: 'cuisine',
          label: 'Cuisine',
          filterKey: 'cuisine',
          filters: ALL_MENU_FILTER_OPTIONS.cuisine.map(value => ({ value, label: value }))
        }
      ]
    },
    {
      id: 'dietary',
      label: 'Dietary & Health',
      icon: '🌿',
      subheadings: [
        {
          id: 'dietary-preferences',
          label: 'Dietary Preferences',
          filterKey: 'dietary',
          filters: ALL_MENU_FILTER_OPTIONS.dietary.map(value => ({ value, label: value }))
        },
        {
          id: 'health-options',
          label: 'Health Options',
          filterKey: 'dietary', // Health options also stored in dietary array
          filters: ALL_MENU_FILTER_OPTIONS.healthOptions.map(value => ({ value, label: value }))
        }
      ]
    },
    {
      id: 'availability',
      label: 'Availability',
      icon: '⏰',
      subheadings: [
        {
          id: 'prep-time',
          label: 'Preparation Time',
          filterKey: 'prepTime',
          filters: ALL_MENU_FILTER_OPTIONS.prepTime.map(value => ({ value, label: value }))
        },
        {
          id: 'availability-status',
          label: 'Availability Status',
          filterKey: 'availability',
          filters: ALL_MENU_FILTER_OPTIONS.availability.map(value => ({ value, label: value }))
        }
      ]
    },
    {
      id: 'preferences',
      label: 'Preferences',
      icon: '⭐',
      subheadings: [
        {
          id: 'spice-level',
          label: 'Spice Level',
          filterKey: 'spiceLevel',
          filters: ALL_MENU_FILTER_OPTIONS.spiceLevel.map(value => ({ value, label: value }))
        },
        {
          id: 'cooking-style',
          label: 'Cooking Style',
          filterKey: 'cookingStyle',
          filters: ALL_MENU_FILTER_OPTIONS.cookingStyle.map(value => ({ value, label: value }))
        }
      ]
    },
    {
      id: 'price',
      label: 'Price & Value',
      icon: '💰',
      subheadings: [
        {
          id: 'price-range',
          label: 'Price Range',
          filterKey: 'priceRange',
          filters: ALL_MENU_FILTER_OPTIONS.priceRange.map(value => ({ value, label: value }))
        },
        {
          id: 'value-options',
          label: 'Value Options',
          filterKey: 'valueOptions',
          filters: ALL_MENU_FILTER_OPTIONS.valueOptions.map(value => ({ value, label: value }))
        }
      ]
    },
    {
      id: 'sorting',
      label: 'Sorting',
      icon: '🔄',
      subheadings: [
        {
          id: 'sort-by',
          label: 'Sort By',
          filterKey: 'sortBy' as keyof MenuFilterSelections,
          isArray: false, // sortBy is a single value, not an array
          filters: [
            { value: 'name', label: 'Name' },
            { value: 'price', label: 'Price' },
            { value: 'rating', label: 'Rating' },
            { value: 'prepTime', label: 'Prep Time' }
          ]
        }
      ]
    }
  ];
};

// Get category navigation config
export const getMenuFilterCategories = () => {
  return getMenuFilterModalConfig().map(category => ({
    id: category.id,
    label: category.label,
    icon: category.icon
  }));
};