export interface FilterConfigItemI {
  id: string;
  label: string;
  icon: string;
  isSelected: boolean;
  selectedBgColor: string;
  selectedBorderColor: string;
  selectedTextColor: string;
  onClick: () => void;
  isSeparator?: boolean;
}

export interface ExploreFiltersI {
    search: string;

    status: string;
    cuisine: string[]; 
    dietary: string[]; 
    priceRange: string;
    distance: string;
    sortBy: string;

    // Quick Filters
    ratingFilter: string;
    offersOnly: boolean;
    freeDelivery: boolean;
    vegFilter: boolean; 
}

export interface FilterStatesI {
    selectedVegFilter: boolean;
    selectedRatingFilter: string;
    offersOnly: boolean;
    freeDelivery: boolean;
  }
  
  export interface FilterHandlersI {
    onVegFilterChange: (value: boolean) => void;
    onRatingFilterChange: (rating: string) => void;
    onOffersOnlyChange: (value: boolean) => void;
    onFreeDeliveryChange: (value: boolean) => void;
  }