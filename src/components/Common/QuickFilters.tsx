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
    <div className={`bg-slate-800/50 backdrop-blur-sm ${className}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2">
        <div className="flex items-center justify-between mb-2">
          <p className="text-gray-400 text-xs font-medium">Quick Filters:</p>
          <div className="text-xs text-gray-500">
            Quick access
          </div>
        </div>
        
        <div className="flex flex-wrap items-center gap-1.5">
          {/* Dietary Filters - Compact Design */}
          <button 
            onClick={() => onVegFilterChange(!selectedVegFilter)}
            className={`flex items-center space-x-1 px-2.5 py-1 rounded-lg text-white transition-all duration-200 text-xs font-medium border ${
              selectedVegFilter 
                ? 'bg-green-600/20 border-green-500/50 text-green-400 shadow-sm' 
                : 'bg-slate-700/50 border-slate-600/50 hover:bg-slate-600/50 hover:border-slate-500/50'
            }`}
          >
            <span className="text-xs">🌿</span>
            <span>Veg Only</span>
          </button>
          
          <button className="flex items-center space-x-1 px-2.5 py-1 rounded-lg text-white transition-all duration-200 text-xs font-medium border bg-slate-700/50 border-slate-600/50 hover:bg-slate-600/50 hover:border-slate-500/50">
            <span className="text-xs">🍗</span>
            <span>Non-Veg</span>
          </button>
          
          <button className="flex items-center space-x-1 px-2.5 py-1 rounded-lg text-white transition-all duration-200 text-xs font-medium border bg-slate-700/50 border-slate-600/50 hover:bg-slate-600/50 hover:border-slate-500/50">
            <span className="text-xs">🟣</span>
            <span>Both</span>
          </button>
          
          <button className="flex items-center space-x-1 px-2.5 py-1 rounded-lg text-white transition-all duration-200 text-xs font-medium border bg-slate-700/50 border-slate-600/50 hover:bg-slate-600/50 hover:border-slate-500/50">
            <span className="text-xs">🟣</span>
            <span>Jain</span>
          </button>

          {/* Separator */}
          <div className="w-px h-4 bg-slate-600/50 mx-1"></div>

          {/* Cuisine Filters - Compact */}
          <button className="flex items-center space-x-1 px-2.5 py-1 rounded-lg text-white transition-all duration-200 text-xs font-medium border bg-slate-700/50 border-slate-600/50 hover:bg-slate-600/50 hover:border-slate-500/50">
            <span className="text-xs">🇮🇳</span>
            <span>Indian</span>
          </button>
          
          <button className="flex items-center space-x-1 px-2.5 py-1 rounded-lg text-white transition-all duration-200 text-xs font-medium border bg-slate-700/50 border-slate-600/50 hover:bg-slate-600/50 hover:border-slate-500/50">
            <span className="text-xs">🇨🇳</span>
            <span>Chinese</span>
          </button>
          
          <button className="flex items-center space-x-1 px-2.5 py-1 rounded-lg text-white transition-all duration-200 text-xs font-medium border bg-slate-700/50 border-slate-600/50 hover:bg-slate-600/50 hover:border-slate-500/50">
            <span className="text-xs">🇮🇹</span>
            <span>Italian</span>
          </button>
          
          <button className="flex items-center space-x-1 px-2.5 py-1 rounded-lg text-white transition-all duration-200 text-xs font-medium border bg-slate-700/50 border-slate-600/50 hover:bg-slate-600/50 hover:border-slate-500/50">
            <span className="text-xs">🇯🇵</span>
            <span>Japanese</span>
          </button>
          
          <button className="flex items-center space-x-1 px-2.5 py-1 rounded-lg text-white transition-all duration-200 text-xs font-medium border bg-slate-700/50 border-slate-600/50 hover:bg-slate-600/50 hover:border-slate-500/50">
            <span className="text-xs">🇹🇭</span>
            <span>Thai</span>
          </button>

          {/* Separator */}
          <div className="w-px h-4 bg-slate-600/50 mx-1"></div>

          {/* Rating Filters - Compact - Only 4+ and 3+ */}
          <button 
            onClick={() => handleRatingFilter('4+')}
            className={`flex items-center space-x-1 px-2.5 py-1 rounded-lg text-white transition-all duration-200 text-xs font-medium border ${
              selectedRatingFilter === '4+' 
                ? 'bg-yellow-600/20 border-yellow-500/50 text-yellow-400 shadow-sm' 
                : 'bg-slate-700/50 border-slate-600/50 hover:bg-slate-600/50 hover:border-slate-500/50'
            }`}
          >
            <span className="text-xs">⭐</span>
            <span>4+ Stars</span>
          </button>
          
          <button 
            onClick={() => handleRatingFilter('3+')}
            className={`flex items-center space-x-1 px-2.5 py-1 rounded-lg text-white transition-all duration-200 text-xs font-medium border ${
              selectedRatingFilter === '3+' 
                ? 'bg-yellow-600/20 border-yellow-500/50 text-yellow-400 shadow-sm' 
                : 'bg-slate-700/50 border-slate-600/50 hover:bg-slate-600/50 hover:border-slate-500/50'
            }`}
          >
            <span className="text-xs">⭐</span>
            <span>3+ Stars</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default QuickFilters;
