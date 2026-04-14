import { ExploreFiltersI } from "../interfaces/ExploreInterfaces";

export const INITIAL_FILTERS: ExploreFiltersI = {
  search: '',
  status: 'all',
  cuisine: [],
  dietary: [],
  priceRange: 'all',
  distance: 'any',
  sortBy: 'rating',
  ratingFilter: '4+',
  offersOnly: false,
  freeDelivery: false,
  vegFilter: false,
};

// Filter options for reference
export const FILTER_OPTIONS = {
  status: [
    { value: 'all', label: 'All Restaurants' },
    { value: 'open', label: 'Open Now' },
    { value: 'closed', label: 'Closed' },
  ],
  distance: [
    { value: 'any', label: 'Any Distance' },
    { value: '1km', label: 'Within 1 km' },
    { value: '2km', label: 'Within 2 km' },
    { value: '5km', label: 'Within 5 km' },
    { value: '10km', label: 'Within 10 km' },
  ],
  priceRange: [
    { value: 'all', label: 'Any Price' },
    { value: 'budget', label: 'Budget Friendly' },
    { value: 'mid-range', label: 'Moderate' },
    { value: 'premium', label: 'Premium' },
  ],
  sortBy: [
    { value: 'rating', label: 'Rating' },
    { value: 'distance', label: 'Distance' },
    { value: 'deliveryTime', label: 'Delivery Time' },
    { value: 'price', label: 'Price' },
  ],
  ratingFilter: [
    { value: '', label: 'Any Rating' },
    { value: '1+', label: '1+ Stars' },
    { value: '2+', label: '2+ Stars' },
    { value: '3+', label: '3+ Stars' },
    { value: '4+', label: '4+ Stars' },
    { value: '4.5+', label: '4.5+ Stars' },
    { value: '5', label: '5 Stars' },
  ],
} as const;

// Helper function to reset filters to initial values
export const resetFilters = (): ExploreFiltersI => {
  return { ...INITIAL_FILTERS };
};

// Helper function to check if filters are at initial state
export const areFiltersDefault = (filters: ExploreFiltersI): boolean => {
  return JSON.stringify(filters) === JSON.stringify(INITIAL_FILTERS);
};

// Quick Filter Definitions
export interface QuickFilterDef {
  id: string;
  label: string;
  icon: string;
  styleVariant: 'green' | 'yellow' | 'orange' | 'blue' | 'purple';
  isSeparator?: boolean;
}

export const QUICK_FILTERS: QuickFilterDef[] = [
  // Dietary Filters
  {
    id: 'veg-only',
    label: 'Veg Only',
    icon: '🌿',
    styleVariant: 'green',
  },
  {
    id: 'non-veg',
    label: 'Non-Veg',
    icon: '🍗',
    styleVariant: 'blue',
  },
  {
    id: 'both',
    label: 'Both',
    icon: '🟣',
    styleVariant: 'purple',
  },
  {
    id: 'jain',
    label: 'Jain',
    icon: '🟣',
    styleVariant: 'purple',
  },
  // Separator
  { id: 'separator-1', label: '', icon: '', styleVariant: 'blue', isSeparator: true },
  // Cuisine Filters
  {
    id: 'indian',
    label: 'Indian',
    icon: '🇮🇳',
    styleVariant: 'blue',
  },
  {
    id: 'chinese',
    label: 'Chinese',
    icon: '🇨🇳',
    styleVariant: 'blue',
  },
  {
    id: 'italian',
    label: 'Italian',
    icon: '🇮🇹',
    styleVariant: 'blue',
  },
  {
    id: 'japanese',
    label: 'Japanese',
    icon: '🇯🇵',
    styleVariant: 'blue',
  },
  {
    id: 'thai',
    label: 'Thai',
    icon: '🇹🇭',
    styleVariant: 'blue',
  },
  // Separator
  { id: 'separator-2', label: '', icon: '', styleVariant: 'blue', isSeparator: true },
  // Rating Filters
  {
    id: 'rating-4-plus',
    label: '4+ Stars',
    icon: '⭐',
    styleVariant: 'yellow',
  },
  {
    id: 'rating-3-plus',
    label: '3+ Stars',
    icon: '⭐',
    styleVariant: 'yellow',
  },
  // Offers and Delivery Filters
  {
    id: 'offers-only',
    label: 'Offers Only',
    icon: '',
    styleVariant: 'orange',
  },
  {
    id: 'free-delivery',
    label: 'Free Delivery',
    icon: '',
    styleVariant: 'green',
  },
];