export interface FilterConfig {
  selectedBgColor: string;
  selectedBorderColor: string;
  selectedTextColor: string;
}

// Unselected (default) filter styles
export const FILTER_UNSELECTED_STYLES: FilterConfig = {
  selectedBgColor: 'bg-slate-700/50',
  selectedBorderColor: 'border-slate-600/50',
  selectedTextColor: 'text-white',
};

// Selection style variants
export const FILTER_SELECTED_STYLES = {
  // Green variant - for veg, free delivery
  green: {
    selectedBgColor: 'bg-green-600/20',
    selectedBorderColor: 'border-green-500/50',
    selectedTextColor: 'text-green-400',
  },
  // Yellow variant - for ratings
  yellow: {
    selectedBgColor: 'bg-yellow-600/20',
    selectedBorderColor: 'border-yellow-500/50',
    selectedTextColor: 'text-yellow-400',
  },
  // Orange variant - for offers
  orange: {
    selectedBgColor: 'bg-orange-600/20',
    selectedBorderColor: 'border-orange-500/50',
    selectedTextColor: 'text-orange-400',
  },
  // Blue variant - default selection
  blue: {
    selectedBgColor: 'bg-blue-600/20',
    selectedBorderColor: 'border-blue-500/50',
    selectedTextColor: 'text-blue-400',
  },
  // Purple variant - for special filters
  purple: {
    selectedBgColor: 'bg-purple-600/20',
    selectedBorderColor: 'border-purple-500/50',
    selectedTextColor: 'text-purple-400',
  },
} as const;

export type FilterStyleVariant = keyof typeof FILTER_SELECTED_STYLES;