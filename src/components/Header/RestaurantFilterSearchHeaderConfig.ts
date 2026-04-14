import { BtnConfig } from "../../Style";

/**
 * Get search bar props for restaurant search and filter header
 */
export const getRestaurantSearchBarProps = (
  searchQuery: string,
  isSearchValid: boolean,
  onSearch: (query: string) => void,
  onSearchInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void
) => ({
  value: searchQuery,
  onChange: (value: string) => onSearchInputChange({ target: { value } } as React.ChangeEvent<HTMLInputElement>),
  onSearch: (query: string) => {
    // Only search when user explicitly clicks search button and query is valid
    if (query.trim() && isSearchValid) {
      onSearch(query);
    }
  },
  placeholder: "Search restaurants, cuisines, or dishes... (min 3 words)",
  showActionButtons: true, // Enable dual action buttons (X and ->)
  showEnterIcon: false, // Disable the old enter icon behavior
  leftIcon: null, // No left icon initially
  inputBg: "bg-slate-700",
  inputBorder: `${searchQuery.trim() !== '' && !isSearchValid 
    ? 'border-orange-500' 
    : 'border-slate-600'}`,
  inputFocusRing: `${searchQuery.trim() !== '' && !isSearchValid 
    ? 'focus:ring-orange-500' 
    : 'focus:ring-blue-500'}`,
  inputTextColor: "text-white",
  inputPlaceholderColor: "placeholder-gray-400",
  leftIconColor: "text-gray-400",
  rightIconColor: "text-gray-400",
  rightIconBg: "bg-transparent",
  rightIconBgHover: "hover:bg-slate-600",
  className: "text-sm"
});

/**
 * Get toggle button props for view mode (Grid/List)
 */
export const getViewModeToggleProps = (
  viewMode: 'grid' | 'list',
  onViewModeChange: (mode: 'grid' | 'list') => void
) => ({
  options: [
    { value: 'grid', label: 'Grid' },
    { value: 'list', label: 'List' }
  ],
  value: viewMode,
  onChange: (mode: string) => onViewModeChange(mode as 'grid' | 'list'),
  size: 'md' as const
});

/**
 * Get location button props
 */
export const getLocationButtonProps = (onClick: () => void) => ({
  onClick,
  icon: undefined, // Will be passed from component
  text: "Current Location",
  className: "hover:bg-slate-600 transition-all duration-200 shadow-sm hover:shadow-md"
});

/**
 * Get filter button props
 */
export const getFilterButtonProps = (onClick: () => void) => ({
  onClick,
  icon: undefined, // Will be passed from component
  text: "Filters",
  ...BtnConfig.OAuth
});

/**
 * Restaurant Filter Search Header configuration constants
 */
export const RESTAURANT_FILTER_SEARCH_HEADER_CONFIG = {
  // Search validation
  search: {
    minWords: 3,
    validationMessage: "Type at least 3 words to search"
  }
} as const;
