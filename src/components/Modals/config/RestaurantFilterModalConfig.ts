import React from 'react';
import { FormField } from '../../Form/PrimaryForm';
import { BtnConfig } from '../../../Style';

// Filter data interfaces
export interface RestaurantFilterData {
  status: string;
  distance: string;
  cuisine: string[];
  dietary: string[];
  priceRange: string;
  ratingFilter: string;
  offersOnly: boolean;
  freeDelivery: boolean;
}

// Filter options data
export const STATUS_OPTIONS = [
  { value: 'all', label: 'All Restaurants' },
  { value: 'open', label: 'Open Now' },
  { value: 'closed', label: 'Closed' }
];

export const DISTANCE_OPTIONS = [
  { value: 'all', label: 'Any Distance' },
  { value: '1km', label: 'Within 1 km' },
  { value: '2km', label: 'Within 2 km' },
  { value: '5km', label: 'Within 5 km' },
  { value: '10km', label: 'Within 10 km' }
];

export const PRIMARY_CUISINE_OPTIONS = [
  { value: 'indian', label: 'Indian', iconNode: '🇮🇳' },
  { value: 'chinese', label: 'Chinese', iconNode: '🇨🇳' },
  { value: 'italian', label: 'Italian', iconNode: '🇮🇹' },
  { value: 'mexican', label: 'Mexican', iconNode: '🇲🇽' },
  { value: 'american', label: 'American', iconNode: '🇺🇸' },
  { value: 'japanese', label: 'Japanese', iconNode: '🇯🇵' },
  { value: 'thai', label: 'Thai', iconNode: '🇹🇭' },
  { value: 'mediterranean', label: 'Mediterranean', iconNode: '🇬🇷' }
];

export const SECONDARY_CUISINE_OPTIONS = [
  { value: 'korean', label: 'Korean', iconNode: '🇰🇷' },
  { value: 'vietnamese', label: 'Vietnamese', iconNode: '🇻🇳' },
  { value: 'french', label: 'French', iconNode: '🇫🇷' },
  { value: 'middle-eastern', label: 'Middle Eastern', iconNode: '🇦🇪' },
  { value: 'continental', label: 'Continental', iconNode: '🇪🇺' },
  { value: 'desserts', label: 'Desserts', iconNode: '🍰' },
  { value: 'beverages', label: 'Beverages', iconNode: '☕' },
  { value: 'fast-food', label: 'Fast Food', iconNode: '🍔' }
];

export const DIETARY_OPTIONS = [
  { value: 'vegetarian', label: 'Vegetarian', iconNode: '🥗' },
  { value: 'non-vegetarian', label: 'Non-Vegetarian', iconNode: '🍖' },
  { value: 'both', label: 'Veg & Non-Veg', iconNode: '🥘' },
  { value: 'jain', label: 'Jain', iconNode: '🕉️' },
  { value: 'vegan', label: 'Vegan', iconNode: '🌱' }
];

export const PRICE_RANGE_OPTIONS = [
  { value: 'all', label: 'Any Price' },
  { value: '$', label: '$ - Budget Friendly' },
  { value: '$$', label: '$$ - Moderate' },
  { value: '$$$', label: '$$$ - Expensive' },
  { value: '$$$$', label: '$$$$ - Premium' }
];

export const RATING_OPTIONS = [
  { value: '', label: 'Any Rating' },
  { value: '1+', label: '1+ Stars' },
  { value: '2+', label: '2+ Stars' },
  { value: '3+', label: '3+ Stars' },
  { value: '4+', label: '4+ Stars' },
  { value: '4.5+', label: '4.5+ Stars' },
  { value: '5', label: '5 Stars' }
];

export const QUICK_FILTER_CHECKBOXES = [
  {
    id: 'offersOnly',
    label: 'Offers Only',
    icon: '🎁',
    description: 'Show restaurants with active offers'
  },
  {
    id: 'freeDelivery',
    label: 'Free Delivery',
    icon: '🚚',
    description: 'Show restaurants with free delivery'
  }
];

// Initial filter data
export const getInitialRestaurantFilterData = (): RestaurantFilterData => ({
  status: 'all',
  distance: 'all',
  cuisine: [],
  dietary: [],
  priceRange: 'all',
  ratingFilter: '',
  offersOnly: false,
  freeDelivery: false
});

// Form fields configuration
export const getRestaurantFilterFormFieldsConfig = ( 
  filterData: RestaurantFilterData,
  setFilterData: React.Dispatch<React.SetStateAction<RestaurantFilterData>>,
  isEditing: boolean = true
): FormField[] => [
    // Status Filter
    {
      id: 'status',
      type: 'dropdown',
      label: 'Restaurant Status',
      placeholder: 'Select status',
      value: filterData.status,
      onChange: (value) => setFilterData(prev => ({ ...prev, status: value as string })),
      disabled: !isEditing,
      options: STATUS_OPTIONS
    },

    // Distance Filter
    {
      id: 'distance',
      type: 'dropdown',
      label: 'Distance Range',
      placeholder: 'Select distance',
      value: filterData.distance,
      onChange: (value) => setFilterData(prev => ({ ...prev, distance: value as string })),
      disabled: !isEditing,
      options: DISTANCE_OPTIONS
    },

    // Cuisine Filter (Multi-select)
    {
      id: 'cuisine',
      type: 'multiselect',
      label: 'Cuisine Type',
      placeholder: 'Select cuisines',
      value: filterData.cuisine,
      onChange: (value) => setFilterData(prev => ({ ...prev, cuisine: value as string[] })),
      disabled: !isEditing,
      options: [...PRIMARY_CUISINE_OPTIONS, ...SECONDARY_CUISINE_OPTIONS]
    },

    // Dietary Filter (Multi-select)
    {
      id: 'dietary',
      type: 'multiselect',
      label: 'Dietary Preferences',
      placeholder: 'Select dietary preferences',
      value: filterData.dietary,
      onChange: (value) => setFilterData(prev => ({ ...prev, dietary: value as string[] })),
      disabled: !isEditing,
      options: DIETARY_OPTIONS
    },

    // Price Range Filter
    {
      id: 'priceRange',
      type: 'dropdown',
      label: 'Price Range',
      placeholder: 'Select price range',
      value: filterData.priceRange,
      onChange: (value) => setFilterData(prev => ({ ...prev, priceRange: value as string })),
      disabled: !isEditing,
      options: PRICE_RANGE_OPTIONS
    }
  ];

// Rating filter configuration for PrimarySelectBtn
export const getRatingFilterConfig = (
  value: string,
  onChange: (value: string) => void
) => ({
  options: RATING_OPTIONS.map(option => ({
    value: option.value,
    label: option.label,
    iconNode: option.value ? '⭐' : null
  })),
  value,
  onChange,
  size: 'sm' as const,
  containerBg: 'bg-slate-700',
  containerBorder: 'border border-slate-600',
  containerRounded: 'rounded-lg',
  buttonPadding: 'px-2 py-1',
  buttonTextSize: 'text-xs',
  activeBg: 'bg-yellow-600/20',
  activeTextColor: 'text-yellow-400',
  activeBorder: 'border-yellow-500/50',
  inactiveTextColor: 'text-gray-300',
  inactiveHoverTextColor: 'hover:text-white',
  className: 'w-full'
});

// Checkbox configuration
export const getQuickFilterCheckboxesConfig = (
  filterData: RestaurantFilterData,
  setFilterData: React.Dispatch<React.SetStateAction<RestaurantFilterData>>,
  isEditing: boolean = true
) => QUICK_FILTER_CHECKBOXES.map(checkbox => ({
  id: checkbox.id,
  checked: filterData[checkbox.id as keyof RestaurantFilterData] as boolean,
  onChange: (checked: boolean) => setFilterData(prev => ({
    ...prev,
    [checkbox.id]: checked
  })),
  label: checkbox.label,
  disabled: !isEditing,
  shape: 'rectangle' as const,
  checkboxSize: 'md' as const,
  icon: checkbox.icon,
  description: checkbox.description
}));

// Action buttons configuration
export const getRestaurantFilterActionButtons = (
  onApply: () => void,
  onCancel: () => void,
  onClear: () => void,
  loading: boolean = false
) => [
    // Clear All Button
    {
      onClick: onClear,
      text: 'Clear All',
      size: 'md' as const,
      disabled: loading,
      loading: false,
      className: 'flex-1',
      ...BtnConfig.Danger
    },

    // Cancel Button
    {
      onClick: onCancel,
      text: 'Cancel',
      size: 'md' as const,
      disabled: loading,
      loading: false,
      className: 'flex-1',
      ...BtnConfig.Secondary
    },

    // Apply Button
    {
      onClick: onApply,
      text: 'Apply Filters',
      size: 'md' as const,
      disabled: loading,
      loading: loading,
      className: 'flex-1',
      ...BtnConfig.Primary
    }
  ];

// Cuisine classification helper
export const getCuisineOptionsByType = (type: 'primary' | 'secondary' | 'all') => {
  switch (type) {
    case 'primary':
      return PRIMARY_CUISINE_OPTIONS;
    case 'secondary':
      return SECONDARY_CUISINE_OPTIONS;
    case 'all':
    default:
      return [...PRIMARY_CUISINE_OPTIONS, ...SECONDARY_CUISINE_OPTIONS];
  }
};

// Filter validation helper
export const validateRestaurantFilters = (filterData: RestaurantFilterData) => {
  const errors: string[] = [];

  if (filterData.cuisine.length > 10) {
    errors.push('Maximum 10 cuisines can be selected');
  }

  if (filterData.dietary.length > 5) {
    errors.push('Maximum 5 dietary preferences can be selected');
  }

  return {
    isValid: errors.length === 0,
    errors
  };
};

// Filter summary helper
export const getFilterSummary = (filterData: RestaurantFilterData) => {
  const summary: string[] = [];

  if (filterData.status !== 'all') {
    summary.push(`Status: ${STATUS_OPTIONS.find(opt => opt.value === filterData.status)?.label}`);
  }

  if (filterData.distance !== 'all') {
    summary.push(`Distance: ${DISTANCE_OPTIONS.find(opt => opt.value === filterData.distance)?.label}`);
  }

  if (filterData.cuisine.length > 0) {
    summary.push(`Cuisines: ${filterData.cuisine.length} selected`);
  }

  if (filterData.dietary.length > 0) {
    summary.push(`Dietary: ${filterData.dietary.length} selected`);
  }

  if (filterData.priceRange !== 'all') {
    summary.push(`Price: ${PRICE_RANGE_OPTIONS.find(opt => opt.value === filterData.priceRange)?.label}`);
  }

  if (filterData.ratingFilter) {
    summary.push(`Rating: ${RATING_OPTIONS.find(opt => opt.value === filterData.ratingFilter)?.label}`);
  }

  if (filterData.offersOnly) {
    summary.push('Offers Only');
  }

  if (filterData.freeDelivery) {
    summary.push('Free Delivery');
  }

  return summary;
};