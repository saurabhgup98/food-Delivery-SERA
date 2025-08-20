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
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
        <div className="flex items-center justify-between mb-3">
          <p className="text-gray-400 text-sm font-medium">Quick Filters:</p>
          <div className="text-xs text-gray-500">
            Quick access
          </div>
        </div>
        
        <div className="flex flex-wrap gap-2">
          {/* Dietary Filters - Compact Design */}
          <div className="flex flex-wrap gap-1.5">
            <button 
              onClick={() => onVegFilterChange(!selectedVegFilter)}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-white transition-all duration-200 text-xs font-medium border ${
                selectedVegFilter 
                  ? 'bg-green-600/20 border-green-500/50 text-green-400 shadow-sm' 
                  : 'bg-slate-700/50 border-slate-600/50 hover:bg-slate-600/50 hover:border-slate-500/50'
              }`}
            >
              <span className="text-sm">🌿</span>
              <span>Veg Only</span>
            </button>
            
            <button className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-white transition-all duration-200 text-xs font-medium border bg-slate-700/50 border-slate-600/50 hover:bg-slate-600/50 hover:border-slate-500/50">
              <span className="text-sm">🍗</span>
              <span>Non-Veg</span>
            </button>
            
            <button className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-white transition-all duration-200 text-xs font-medium border bg-slate-700/50 border-slate-600/50 hover:bg-slate-600/50 hover:border-slate-500/50">
              <span className="text-sm">🟣</span>
              <span>Both</span>
            </button>
            
            <button className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-white transition-all duration-200 text-xs font-medium border bg-slate-700/50 border-slate-600/50 hover:bg-slate-600/50 hover:border-slate-500/50">
              <span className="text-sm">🟣</span>
              <span>Jain</span>
            </button>
            
            <button className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-white transition-all duration-200 text-xs font-medium border bg-slate-700/50 border-slate-600/50 hover:bg-slate-600/50 hover:border-slate-500/50">
              <span className="text-sm">🌱</span>
              <span>Vegan</span>
            </button>
          </div>

          {/* Separator */}
          <div className="w-px h-6 bg-slate-600/50 mx-2"></div>

          {/* Cuisine Filters - Compact */}
          <div className="flex flex-wrap gap-1.5">
            <button className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-white transition-all duration-200 text-xs font-medium border bg-slate-700/50 border-slate-600/50 hover:bg-slate-600/50 hover:border-slate-500/50">
              <span className="text-sm">🇮🇳</span>
              <span>Indian</span>
            </button>
            
            <button className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-white transition-all duration-200 text-xs font-medium border bg-slate-700/50 border-slate-600/50 hover:bg-slate-600/50 hover:border-slate-500/50">
              <span className="text-sm">🇨🇳</span>
              <span>Chinese</span>
            </button>
            
            <button className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-white transition-all duration-200 text-xs font-medium border bg-slate-700/50 border-slate-600/50 hover:bg-slate-600/50 hover:border-slate-500/50">
              <span className="text-sm">🇮🇹</span>
              <span>Italian</span>
            </button>
            
            <button className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-white transition-all duration-200 text-xs font-medium border bg-slate-700/50 border-slate-600/50 hover:bg-slate-600/50 hover:border-slate-500/50">
              <span className="text-sm">🇯🇵</span>
              <span>Japanese</span>
            </button>
            
            <button className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-white transition-all duration-200 text-xs font-medium border bg-slate-700/50 border-slate-600/50 hover:bg-slate-600/50 hover:border-slate-500/50">
              <span className="text-sm">🇹🇭</span>
              <span>Thai</span>
            </button>
          </div>

          {/* Separator */}
          <div className="w-px h-6 bg-slate-600/50 mx-2"></div>

          {/* Rating Filters - Compact */}
          <div className="flex flex-wrap gap-1.5">
            <button 
              onClick={() => handleRatingFilter('4+')}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-white transition-all duration-200 text-xs font-medium border ${
                selectedRatingFilter === '4+' 
                  ? 'bg-yellow-600/20 border-yellow-500/50 text-yellow-400 shadow-sm' 
                  : 'bg-slate-700/50 border-slate-600/50 hover:bg-slate-600/50 hover:border-slate-500/50'
              }`}
            >
              <span className="text-sm">⭐</span>
              <span>4+ Stars</span>
            </button>
            
            <button 
              onClick={() => handleRatingFilter('3+')}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-white transition-all duration-200 text-xs font-medium border ${
                selectedRatingFilter === '3+' 
                  ? 'bg-yellow-600/20 border-yellow-500/50 text-yellow-400 shadow-sm' 
                  : 'bg-slate-700/50 border-slate-600/50 hover:bg-slate-600/50 hover:border-slate-500/50'
              }`}
            >
              <span className="text-sm">⭐</span>
              <span>3+ Stars</span>
            </button>
            
            <button 
              onClick={() => handleRatingFilter('2+')}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-white transition-all duration-200 text-xs font-medium border ${
                selectedRatingFilter === '2+' 
                  ? 'bg-yellow-600/20 border-yellow-500/50 text-yellow-400 shadow-sm' 
                  : 'bg-slate-700/50 border-slate-600/50 hover:bg-slate-600/50 hover:border-slate-500/50'
              }`}
            >
              <span className="text-sm">⭐</span>
              <span>2+ Stars</span>
            </button>
            
            <button 
              onClick={() => handleRatingFilter('1+')}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-white transition-all duration-200 text-xs font-medium border ${
                selectedRatingFilter === '1+' 
                  ? 'bg-yellow-600/20 border-yellow-500/50 text-yellow-400 shadow-sm' 
                  : 'bg-slate-700/50 border-slate-600/50 hover:bg-slate-600/50 hover:border-slate-500/50'
              }`}
            >
              <span className="text-sm">⭐</span>
              <span>1+ Stars</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuickFilters;
