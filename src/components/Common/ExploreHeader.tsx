import React from 'react';
import { MapPin } from 'lucide-react';
import GenericSearchBar from './GenericSearchBar';
import ViewModeToggle from './ViewModeToggle';

interface ExploreHeaderProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  onSearchSubmit: (e: React.FormEvent) => void;
  viewMode: 'grid' | 'list';
  onViewModeChange: (mode: 'grid' | 'list') => void;
  onFilterClick: () => void;
  className?: string;
}

const ExploreHeader: React.FC<ExploreHeaderProps> = ({
  searchQuery,
  onSearchChange,
  onSearchSubmit,
  viewMode,
  onViewModeChange,
  onFilterClick,
  className = ""
}) => {
  return (
    <div className={`bg-slate-800 border-b border-slate-700 ${className}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex flex-col lg:flex-row gap-3 items-center">
          {/* Search Bar */}
          <GenericSearchBar
            value={searchQuery}
            onChange={onSearchChange}
            onSubmit={onSearchSubmit}
            placeholder="Search restaurants, cuisines, or dishes..."
          />

          {/* Filter Controls */}
          <div className="flex flex-wrap gap-2">
            {/* Location */}
            <button className="flex items-center space-x-2 bg-slate-700 border border-slate-600 px-3 py-2 rounded-lg text-white hover:bg-slate-600 transition-colors text-sm">
              <MapPin className="w-4 h-4" />
              <span>Deliver to: Current Location</span>
            </button>

            {/* Rating Dropdown */}
            <button className="flex items-center space-x-2 bg-slate-700 border border-slate-600 px-3 py-2 rounded-lg text-white hover:bg-slate-600 transition-colors text-sm">
              <span className="text-yellow-400">⭐</span>
              <span>Rating</span>
              <span className="text-gray-400">▼</span>
            </button>

            {/* Filter Toggle */}
            <button 
              onClick={onFilterClick}
              className="flex items-center space-x-2 px-3 py-2 rounded-lg text-white transition-colors text-sm border bg-slate-700 border-slate-600 hover:bg-slate-600"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.207A1 1 0 013 6.5V4z" />
              </svg>
              <span>Filters</span>
              <span className="text-gray-400">▼</span>
            </button>

            {/* View Toggle */}
            <ViewModeToggle
              viewMode={viewMode}
              onViewModeChange={onViewModeChange}
            />

            {/* Map View Button */}
            <button className="flex items-center space-x-2 bg-slate-700 border border-slate-600 px-3 py-2 rounded-lg text-white hover:bg-slate-600 transition-colors text-sm">
              <MapPin className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExploreHeader;
