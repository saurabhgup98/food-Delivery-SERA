import React from 'react';
import { X } from 'lucide-react';
import PrimaryDropdown from './PrimaryDropdown';
import { 
  statusOptions, 
  distanceOptions, 
  cuisineOptions, 
  dietaryOptions, 
  priceRangeOptions 
} from '../../data/filterOptions';

interface FilterModalProps {
  tempStatus: string;
  setTempStatus: (value: string) => void;
  tempCuisine: string;
  setTempCuisine: (value: string) => void;
  tempDietary: string;
  setTempDietary: (value: string) => void;
  tempPriceRange: string;
  setTempPriceRange: (value: string) => void;
  tempDistance: string;
  setTempDistance: (value: string) => void;
  tempRatingFilter: string;
  setTempRatingFilter: (value: string) => void;
  tempOffersOnly: boolean;
  setTempOffersOnly: (value: boolean) => void;
  tempFreeDelivery: boolean;
  setTempFreeDelivery: (value: boolean) => void;
  onApply: () => void;
  onCancel: () => void;
  onClear: () => void;
}

const FilterModal: React.FC<FilterModalProps> = ({
  tempStatus,
  setTempStatus,
  tempCuisine,
  setTempCuisine,
  tempDietary,
  setTempDietary,
  tempPriceRange,
  setTempPriceRange,
  tempDistance,
  setTempDistance,
  tempRatingFilter,
  setTempRatingFilter,
  tempOffersOnly,
  setTempOffersOnly,
  tempFreeDelivery,
  setTempFreeDelivery,
  onApply,
  onCancel,
  onClear
}) => {
  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-gradient-to-br from-slate-800 via-slate-700 to-slate-800 rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] flex flex-col border border-slate-600/50 overflow-hidden">
        {/* Modal Header - Always Visible */}
        <div className="p-6 border-b border-slate-600/50 bg-gradient-to-r from-slate-700 to-slate-800 flex-shrink-0">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-white text-2xl font-bold">Advanced Filters</h2>
              <p className="text-gray-400 text-sm mt-1">Customize your restaurant search</p>
            </div>
            <button
              onClick={onCancel}
              className="p-2 rounded-lg bg-slate-600/50 hover:bg-slate-600 transition-all duration-200 text-gray-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Content - Scrollable */}
        <div className="p-6 space-y-6 flex-1 overflow-y-auto overflow-x-hidden custom-scrollbar min-h-0" style={{ contain: 'layout style paint' }}>
          {/* Status Section */}
          <div className="space-y-3">
            <h3 className="text-white font-semibold text-lg flex items-center">
              <span className="w-2 h-2 bg-green-400 rounded-full mr-3"></span>
              Restaurant Status
            </h3>
            <PrimaryDropdown
              value={tempStatus}
              onChange={setTempStatus}
              options={statusOptions}
              placeholder="Select status"
            />
          </div>

          {/* Distance Section */}
          <div className="space-y-3">
            <h3 className="text-white font-semibold text-lg flex items-center">
              <span className="w-2 h-2 bg-blue-400 rounded-full mr-3"></span>
              Distance Range
            </h3>
            <PrimaryDropdown
              value={tempDistance}
              onChange={setTempDistance}
              options={distanceOptions}
              placeholder="Select distance"
            />
          </div>

          {/* Cuisine Section */}
          <div className="space-y-3">
            <h3 className="text-white font-semibold text-lg flex items-center">
              <span className="w-2 h-2 bg-purple-400 rounded-full mr-3"></span>
              Cuisine Type
            </h3>
            <PrimaryDropdown
              value={tempCuisine}
              onChange={setTempCuisine}
              options={cuisineOptions}
              placeholder="Select cuisine"
            />
          </div>

          {/* Dietary Section */}
          <div className="space-y-3">
            <h3 className="text-white font-semibold text-lg flex items-center">
              <span className="w-2 h-2 bg-green-400 rounded-full mr-3"></span>
              Dietary Preferences
            </h3>
            <PrimaryDropdown
              value={tempDietary}
              onChange={setTempDietary}
              options={dietaryOptions}
              placeholder="Select dietary preference"
            />
          </div>

          {/* Price Range Section */}
          <div className="space-y-3">
            <h3 className="text-white font-semibold text-lg flex items-center">
              <span className="w-2 h-2 bg-yellow-400 rounded-full mr-3"></span>
              Price Range
            </h3>
            <PrimaryDropdown
              value={tempPriceRange}
              onChange={setTempPriceRange}
              options={priceRangeOptions}
              placeholder="Select price range"
            />
          </div>

          {/* Quick Filters Section */}
          <div className="space-y-4">
            <h3 className="text-white font-semibold text-lg flex items-center">
              <span className="w-2 h-2 bg-pink-400 rounded-full mr-3"></span>
              Quick Filters
            </h3>
            
            {/* Rating Filter */}
            <div className="space-y-2">
              <label className="text-white text-sm font-medium">Minimum Rating</label>
              <div className="flex flex-wrap gap-2">
                {['1+', '2+', '3+', '4+', '4.5+', '5'].map((rating) => (
                  <button
                    key={rating}
                    onClick={() => setTempRatingFilter(tempRatingFilter === rating ? '' : rating)}
                    className={`px-3 py-2 rounded-lg border transition-all duration-200 font-medium text-sm ${
                      tempRatingFilter === rating
                        ? 'bg-yellow-600/20 border-yellow-500/50 text-yellow-400 shadow-sm'
                        : 'bg-slate-700/50 text-gray-300 border-slate-600/50 hover:bg-slate-600/50 hover:border-slate-500/50'
                    }`}
                  >
                    <span className="inline mr-1">⭐</span>
                    {rating}
                  </button>
                ))}
              </div>
            </div>

            {/* Checkbox Options */}
            <div className="space-y-3">
              <label className="flex items-center space-x-3 cursor-pointer group">
                <input
                  type="checkbox"
                  checked={tempOffersOnly}
                  onChange={(e) => setTempOffersOnly(e.target.checked)}
                  className="w-5 h-5 text-blue-600 bg-slate-700/50 border-slate-600/50 rounded focus:ring-blue-500 focus:ring-2 transition-all duration-200"
                />
                <span className="text-white group-hover:text-blue-400 transition-colors">Offers Only</span>
                <span className="text-gray-400">🎁</span>
              </label>

              <label className="flex items-center space-x-3 cursor-pointer group">
                <input
                  type="checkbox"
                  checked={tempFreeDelivery}
                  onChange={(e) => setTempFreeDelivery(e.target.checked)}
                  className="w-5 h-5 text-blue-600 bg-slate-700/50 border-slate-600/50 rounded focus:ring-blue-500 focus:ring-2 transition-all duration-200"
                />
                <span className="text-white group-hover:text-blue-400 transition-colors">Free Delivery</span>
                <span className="text-gray-400">🚚</span>
              </label>
            </div>
          </div>
        </div>

        {/* Modal Footer - Always Visible */}
        <div className="p-6 border-t border-slate-600/50 bg-gradient-to-r from-slate-700 to-slate-800 flex-shrink-0">
          <div className="flex flex-col sm:flex-row gap-3">
            {/* Clear All Filters Button */}
            <button
              onClick={onClear}
              className="flex-1 flex items-center justify-center space-x-2 bg-gradient-to-r from-orange-500 to-red-500 text-white px-4 py-3 rounded-xl hover:from-orange-600 hover:to-red-600 transition-all duration-200 font-medium shadow-lg hover:shadow-xl"
            >
              <span className="text-white">🗑️</span>
              <span>Clear All</span>
            </button>

            {/* Cancel Button */}
            <button
              onClick={onCancel}
              className="flex-1 flex items-center justify-center space-x-2 bg-slate-600/50 text-white px-4 py-3 rounded-xl hover:bg-slate-600 transition-all duration-200 font-medium border border-slate-500/50"
            >
              <span className="text-red-400">✕</span>
              <span>Cancel</span>
            </button>

            {/* Apply Button */}
            <button
              onClick={onApply}
              className="flex-1 flex items-center justify-center space-x-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white px-4 py-3 rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all duration-200 font-medium shadow-lg hover:shadow-xl"
            >
              <span className="text-green-400">✓</span>
              <span>Apply Filters</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FilterModal;
