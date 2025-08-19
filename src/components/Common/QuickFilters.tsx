import React from 'react';

interface QuickFiltersProps {
  selectedVegFilter: boolean;
  onVegFilterChange: (value: boolean) => void;
  selectedRatingFilter: string;
  onRatingFilterChange: (rating: string) => void;
  className?: string;
}

const QuickFilters: React.FC<QuickFiltersProps> = ({
  selectedVegFilter,
  onVegFilterChange,
  selectedRatingFilter,
  onRatingFilterChange,
  className = ""
}) => {
  const handleRatingFilter = (rating: string) => {
    onRatingFilterChange(selectedRatingFilter === rating ? '' : rating);
  };

  return (
    <div className={`bg-slate-800 border-b border-slate-700 ${className}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
        <p className="text-gray-400 text-sm mb-3">Quick Filters:</p>
        <div className="flex flex-wrap gap-2">
          {/* Dietary Filters */}
          <button 
            onClick={() => onVegFilterChange(!selectedVegFilter)}
            className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-white transition-colors text-sm border ${
              selectedVegFilter 
                ? 'bg-green-600 border-green-500' 
                : 'bg-slate-700 border-slate-600 hover:bg-slate-600'
            }`}
          >
            <span>🌿</span>
            <span>Veg Only</span>
          </button>
          <button className="flex items-center space-x-2 bg-slate-700 border border-slate-600 px-3 py-2 rounded-lg text-white hover:bg-slate-600 transition-colors text-sm">
            <span>🍗</span>
            <span>Non-Veg</span>
          </button>
          <button className="flex items-center space-x-2 bg-slate-700 border border-slate-600 px-3 py-2 rounded-lg text-white hover:bg-slate-600 transition-colors text-sm">
            <span>🟣</span>
            <span>Both</span>
          </button>
          <button className="flex items-center space-x-2 bg-slate-700 border border-slate-600 px-3 py-2 rounded-lg text-white hover:bg-slate-600 transition-colors text-sm">
            <span>🟣</span>
            <span>Jain</span>
          </button>
          <button className="flex items-center space-x-2 bg-slate-700 border border-slate-600 px-3 py-2 rounded-lg text-white hover:bg-slate-600 transition-colors text-sm">
            <span>🌱</span>
            <span>Vegan</span>
          </button>

          {/* Cuisine Filters */}
          <button className="flex items-center space-x-2 bg-slate-700 border border-slate-600 px-3 py-2 rounded-lg text-white hover:bg-slate-600 transition-colors text-sm">
            <span>🇮🇳</span>
            <span>Indian</span>
          </button>
          <button className="flex items-center space-x-2 bg-slate-700 border border-slate-600 px-3 py-2 rounded-lg text-white hover:bg-slate-600 transition-colors text-sm">
            <span>🇨🇳</span>
            <span>Chinese</span>
          </button>
          <button className="flex items-center space-x-2 bg-slate-700 border border-slate-600 px-3 py-2 rounded-lg text-white hover:bg-slate-600 transition-colors text-sm">
            <span>🇮🇹</span>
            <span>Italian</span>
          </button>

          {/* Rating Filters */}
          <button 
            onClick={() => handleRatingFilter('4+')}
            className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-white transition-colors text-sm border ${
              selectedRatingFilter === '4+' 
                ? 'bg-slate-600 border-slate-500' 
                : 'bg-slate-700 border-slate-600 hover:bg-slate-600'
            }`}
          >
            <span>⭐</span>
            <span>4+ Stars</span>
          </button>
          <button 
            onClick={() => handleRatingFilter('3+')}
            className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-white transition-colors text-sm border ${
              selectedRatingFilter === '3+' 
                ? 'bg-slate-600 border-slate-500' 
                : 'bg-slate-700 border-slate-600 hover:bg-slate-600'
            }`}
          >
            <span>⭐</span>
            <span>3+ Stars</span>
          </button>
          <button 
            onClick={() => handleRatingFilter('2+')}
            className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-white transition-colors text-sm border ${
              selectedRatingFilter === '2+' 
                ? 'bg-slate-600 border-slate-500' 
                : 'bg-slate-700 border-slate-600 hover:bg-slate-600'
            }`}
          >
            <span>⭐</span>
            <span>2+ Stars</span>
          </button>
          <button 
            onClick={() => handleRatingFilter('1+')}
            className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-white transition-colors text-sm border ${
              selectedRatingFilter === '1+' 
                ? 'bg-slate-600 border-slate-500' 
                : 'bg-slate-700 border-slate-600 hover:bg-slate-600'
            }`}
          >
            <span>⭐</span>
            <span>1+ Stars</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default QuickFilters;
