import React, { useRef, useMemo } from 'react';
import { Search, X, MapPin } from 'lucide-react';
import FilterIcon from '../Icon/FilterIcon';
import PrimarySelectBtn from '../Button/PrimarySelectBtn';
import PrimarySearchBar from '../Input/PrimarySearchBar';
import ToggleBtnPrimary from '../Button/ToggleBtnPrimary';
import {
  getRestaurantSearchBarProps,
  getViewModeToggleProps,
  getLocationButtonProps,
  getFilterButtonProps,
  RESTAURANT_FILTER_SEARCH_HEADER_CONFIG
} from './RestaurantFilterSearchHeaderConfig';
import { createFilterConfigs } from '../../pages/config/ExploreConfig';
import { FilterStatesI } from '../../pages/interfaces/ExploreInterfaces';

interface RestaurantsSearchAndFilterHeaderProps {
  searchQuery: string;
  onSearchInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSearch: (query: string) => void;
  onOpenFilterModal: () => void;
  onViewModeChange: (mode: 'grid' | 'list') => void;
  viewMode: 'grid' | 'list';
  isSearchValid: boolean;
  isHeaderVisible: boolean;
  // Quick filter props
  selectedVegFilter: boolean;
  onVegFilterChange: (value: boolean) => void;
  selectedRatingFilter: string;
  onRatingFilterChange: (rating: string) => void;
  offersOnly: boolean;
  onOffersOnlyChange: (value: boolean) => void;
  freeDelivery: boolean;
  onFreeDeliveryChange: (value: boolean) => void;
}

const RestaurantsSearchAndFilterHeader: React.FC<RestaurantsSearchAndFilterHeaderProps> = ({
  searchQuery,
  onSearchInputChange,
  onSearch,
  onOpenFilterModal,
  onViewModeChange,
  viewMode,
  isSearchValid,
  isHeaderVisible,
  selectedVegFilter,
  onVegFilterChange,
  selectedRatingFilter,
  onRatingFilterChange,
  offersOnly,
  onOffersOnlyChange,
  freeDelivery,
  onFreeDeliveryChange
}) => {
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Create filter configurations with handlers
  const filterConfigs = useMemo(() => {
    const states: FilterStatesI = {
      selectedVegFilter,
      selectedRatingFilter,
      offersOnly,
      freeDelivery
    };

    const handlers = {
      onVegFilterChange,
      onRatingFilterChange,
      onOffersOnlyChange,
      onFreeDeliveryChange
    };

    return createFilterConfigs(states, handlers);
  }, [selectedVegFilter, selectedRatingFilter, offersOnly, freeDelivery, onVegFilterChange, onRatingFilterChange, onOffersOnlyChange, onFreeDeliveryChange]);

  return (
    <div className={`sticky top-16 z-40 bg-slate-800/95 backdrop-blur-md border-b border-slate-700/50 shadow-lg transition-transform duration-400 ease-in-out ${isHeaderVisible ? 'translate-y-0' : '-translate-y-full'
      }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
        <div className="flex flex-col lg:flex-row gap-3 items-center">
          {/* Search Bar */}
          <div className="flex-1 w-full lg:w-auto relative">
            <PrimarySearchBar
              {...getRestaurantSearchBarProps(
                searchQuery,
                isSearchValid,
                onSearch,
                onSearchInputChange
              )}
            />
            {searchQuery.trim() !== '' && !isSearchValid && (
              <div className="absolute top-full left-0 mt-1 text-xs text-orange-400 z-10 bg-slate-800 px-2 py-1 rounded border border-orange-500/50">
                {RESTAURANT_FILTER_SEARCH_HEADER_CONFIG.search.validationMessage}
              </div>
            )}
          </div>

          {/* Filter Controls */}
          <div className="flex flex-wrap gap-2">
            {/* Location */}
            <PrimarySelectBtn
              {...getLocationButtonProps(() => { })}
              icon={MapPin}
            />

            {/* Filter Toggle */}
            <PrimarySelectBtn
              {...getFilterButtonProps(onOpenFilterModal)}
              icon={FilterIcon}
            />

            {/* View Toggle */}
            <ToggleBtnPrimary
              {...getViewModeToggleProps(viewMode, onViewModeChange)}
            />
          </div>
        </div>

        {/* Quick Filters */}
        <div className="bg-slate-800/50 backdrop-blur-sm border-t border-slate-700/50 mt-3">
          <div className="flex items-center justify-between mb-2 pt-2">
            <p className="text-gray-400 text-xs font-medium">Quick Filters:</p>
          </div>

          <div className="flex flex-wrap items-center gap-1.5">
            {filterConfigs.map((filter) => {
              if (filter.isSeparator) {
                return <div key={filter.id} className="w-px h-4 bg-slate-600/50 mx-1"></div>;
              }

              return (
                <PrimarySelectBtn
                  key={filter.id}
                  onClick={filter.onClick}
                  iconNode={filter.icon ? <span className="text-xs">{filter.icon}</span> : undefined}
                  text={filter.label}
                  isSelected={filter.isSelected}
                  selectedBgColor={filter.selectedBgColor}
                  selectedBorderColor={filter.selectedBorderColor}
                  selectedTextColor={filter.selectedTextColor}
                />
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RestaurantsSearchAndFilterHeader;