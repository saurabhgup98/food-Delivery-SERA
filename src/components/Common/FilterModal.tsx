import React from 'react';

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
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-slate-800 rounded-lg shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
        {/* Modal Header */}
        <div className="p-6 border-b border-slate-700">
          <h2 className="text-white text-xl font-semibold">Filters</h2>
        </div>

        {/* Modal Content */}
        <div className="p-6 space-y-8">
          {/* Status Section */}
          <div>
            <h3 className="text-white font-medium mb-3">Status</h3>
            <select
              value={tempStatus}
              onChange={(e) => setTempStatus(e.target.value)}
              className="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-sera-blue"
            >
              <option value="all">All Status</option>
              <option value="open">Open Now</option>
              <option value="closed">Closed</option>
              <option value="busy">Busy</option>
              <option value="temporarily_closed">Temporarily Closed</option>
            </select>
          </div>

          {/* Distance Section */}
          <div>
            <h3 className="text-white font-medium mb-3">Distance</h3>
            <select
              value={tempDistance}
              onChange={(e) => setTempDistance(e.target.value)}
              className="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-sera-blue"
            >
              <option value="any">Any Distance</option>
              <option value="0-1">0-1 km</option>
              <option value="1-3">1-3 km</option>
              <option value="3-5">3-5 km</option>
              <option value="5-10">5-10 km</option>
              <option value="10+">10+ km</option>
            </select>
          </div>

          {/* Cuisine Section */}
          <div>
            <h3 className="text-white font-medium mb-3">Cuisine Type</h3>
            <select
              value={tempCuisine}
              onChange={(e) => setTempCuisine(e.target.value)}
              className="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-sera-blue"
            >
              <option value="all">All Cuisines</option>
              <option value="Indian">Indian</option>
              <option value="Italian">Italian</option>
              <option value="Chinese">Chinese</option>
              <option value="Japanese">Japanese</option>
              <option value="Thai">Thai</option>
              <option value="Mexican">Mexican</option>
              <option value="Mediterranean">Mediterranean</option>
              <option value="Korean">Korean</option>
              <option value="Vietnamese">Vietnamese</option>
              <option value="French">French</option>
            </select>
          </div>

          {/* Dietary Section */}
          <div>
            <h3 className="text-white font-medium mb-3">Dietary Preferences</h3>
            <select
              value={tempDietary}
              onChange={(e) => setTempDietary(e.target.value)}
              className="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-sera-blue"
            >
              <option value="all">All Dietary</option>
              <option value="vegetarian">Vegetarian</option>
              <option value="vegan">Vegan</option>
              <option value="non-vegetarian">Non-Vegetarian</option>
              <option value="jain">Jain</option>
              <option value="gluten-free">Gluten-Free</option>
            </select>
          </div>

          {/* Price Range Section */}
          <div>
            <h3 className="text-white font-medium mb-3">Price Range</h3>
            <select
              value={tempPriceRange}
              onChange={(e) => setTempPriceRange(e.target.value)}
              className="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-sera-blue"
            >
              <option value="all">All Prices</option>
              <option value="budget">Budget ($)</option>
              <option value="mid-range">Mid-Range ($$)</option>
              <option value="premium">Premium ($$$)</option>
            </select>
          </div>

          {/* Quick Filters Section */}
          <div>
            <h3 className="text-white font-medium mb-3">Quick Filters</h3>
            <div className="space-y-3">
              {/* Rating Filter */}
              <div>
                <label className="text-white text-sm mb-2 block">Minimum Rating</label>
                <div className="flex space-x-2">
                  {['4+', '4.5+', '5'].map((rating) => (
                    <button
                      key={rating}
                      onClick={() => setTempRatingFilter(rating)}
                      className={`px-3 py-2 rounded-lg border transition-colors ${
                        tempRatingFilter === rating
                          ? 'bg-sera-blue/20 border-sera-blue text-sera-blue'
                          : 'bg-slate-700 text-gray-300 border-slate-600 hover:bg-slate-600'
                      }`}
                    >
                      <span className="inline mr-1">⭐</span>
                      {rating}
                    </button>
                  ))}
                </div>
              </div>

              {/* Offers Only */}
              <label className="flex items-center space-x-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={tempOffersOnly}
                  onChange={(e) => setTempOffersOnly(e.target.checked)}
                  className="w-4 h-4 text-sera-blue bg-slate-700 border-slate-600 rounded focus:ring-sera-blue focus:ring-2"
                />
                <span className="text-white">Offers Only</span>
                <span className="text-gray-400">🎁</span>
              </label>

              {/* Free Delivery */}
              <label className="flex items-center space-x-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={tempFreeDelivery}
                  onChange={(e) => setTempFreeDelivery(e.target.checked)}
                  className="w-4 h-4 text-sera-blue bg-slate-700 border-slate-600 rounded focus:ring-sera-blue focus:ring-2"
                />
                <span className="text-white">Free Delivery</span>
                <span className="text-gray-400">🚚</span>
              </label>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-6 border-t border-slate-700 space-y-3">
          {/* Action Buttons */}
          <div className="flex space-x-3">
            <button
              onClick={onApply}
              className="flex-1 flex items-center justify-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              <span className="text-green-400">✓</span>
              <span>Apply</span>
            </button>
            <button
              onClick={onCancel}
              className="flex-1 flex items-center justify-center space-x-2 bg-slate-700 text-white px-4 py-2 rounded-lg hover:bg-slate-600 transition-colors"
            >
              <span className="text-red-400">✕</span>
              <span>Cancel</span>
            </button>
          </div>

          {/* Clear All Filters Button */}
          <button
            onClick={onClear}
            className="w-full flex items-center justify-center space-x-2 bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 transition-colors"
          >
            <span className="text-white">🗑️</span>
            <span>Clear All Filters</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default FilterModal;
