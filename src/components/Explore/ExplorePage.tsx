import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Search,
  MapPin
} from 'lucide-react';
import RestaurantCard from './RestaurantCard';
import RestaurantListItem from './RestaurantListItem';
import { apiService, Restaurant } from '../../services/api';

// Debounce hook for search
const useDebounce = (value: string, delay: number) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
};

const ExplorePage: React.FC = () => {
  const navigate = useNavigate();
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCuisine, setSelectedCuisine] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedDietary, setSelectedDietary] = useState('all');
  const [selectedPriceRange, setSelectedPriceRange] = useState('all');
  const [selectedDistance, setSelectedDistance] = useState('any');
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [sortBy, setSortBy] = useState('rating');
  
  // Quick filter states
  const [selectedVegFilter, setSelectedVegFilter] = useState(false);
  const [selectedRatingFilter, setSelectedRatingFilter] = useState('4+');
  const [offersOnly, setOffersOnly] = useState(false);
  const [freeDelivery, setFreeDelivery] = useState(false);

  // Debounced search query
  const debouncedSearchQuery = useDebounce(searchQuery, 500);

  // Fetch restaurants from backend
  const fetchRestaurants = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('Starting to fetch restaurants...');
      
      const params: any = {};
      if (debouncedSearchQuery) params.search = debouncedSearchQuery;
      if (selectedCuisine !== 'all') params.cuisine = selectedCuisine;
      if (selectedStatus !== 'all') params.status = selectedStatus;
      if (selectedDietary !== 'all') params.dietary = selectedDietary;
      if (selectedPriceRange !== 'all') params.priceRange = selectedPriceRange;
      if (selectedDistance !== 'any') params.distance = selectedDistance;
      if (sortBy) params.sortBy = sortBy;
      
      console.log('API parameters:', params);
      
      const response = await apiService.getRestaurants(params);
      
      console.log('API response received:', response);
      
      if (response.success) {
        setRestaurants(response.data.restaurants);
        console.log('Restaurants set successfully:', response.data.restaurants.length);
      } else {
        console.error('API returned success: false');
        setError('Failed to fetch restaurants');
      }
    } catch (err: any) {
      console.error('Error fetching restaurants:', err);
      console.error('Error details:', {
        message: err?.message,
        stack: err?.stack,
        name: err?.name
      });
      setError(`Failed to load restaurants: ${err?.message || 'Unknown error'}`);
    } finally {
      setLoading(false);
    }
  }, [debouncedSearchQuery, selectedCuisine, selectedStatus, selectedDietary, selectedPriceRange, selectedDistance, sortBy]);

  // Fetch restaurants on component mount and when filters change
  useEffect(() => {
    fetchRestaurants();
  }, [fetchRestaurants]);

  const handleFavoriteToggle = (id: string) => {
    setRestaurants(prev => 
      prev.map(restaurant => 
        restaurant._id === id 
          ? { ...restaurant, isFavorite: !restaurant.isFavorite }
          : restaurant
      )
    );
  };

  const handleViewMenu = (restaurant: Restaurant) => {
    navigate(`/restaurant/${restaurant._id}`);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // Search is now debounced, so no need to manually trigger
  };

  const clearFilters = () => {
    setSearchQuery('');
    setSelectedCuisine('all');
    setSelectedStatus('all');
    setSelectedDietary('all');
    setSelectedPriceRange('all');
    setSelectedDistance('any');
    setSortBy('rating');
    setSelectedVegFilter(false);
    setSelectedRatingFilter('4+');
    setOffersOnly(false);
    setFreeDelivery(false);
  };

  const applyFilters = () => {
    setShowFilterModal(false);
    // Filters are applied automatically via useEffect
  };

  const handleRatingFilter = (rating: string) => {
    setSelectedRatingFilter(rating);
    // Rating filter is applied automatically via useEffect
  };

  const cuisineOptions = [
    { value: 'all', label: 'All Cuisines' },
    { value: 'Indian', label: 'Indian' },
    { value: 'Italian', label: 'Italian' },
    { value: 'Chinese', label: 'Chinese' },
    { value: 'American', label: 'American' },
    { value: 'Japanese', label: 'Japanese' },
    { value: 'Thai', label: 'Thai' },
    { value: 'Mexican', label: 'Mexican' },
    { value: 'Mediterranean', label: 'Mediterranean' },
    { value: 'Korean', label: 'Korean' },
    { value: 'Vietnamese', label: 'Vietnamese' },
    { value: 'French', label: 'French' }
  ];

  const statusOptions = [
    { value: 'all', label: 'All Status' },
    { value: 'open', label: 'Open Now' },
    { value: 'closed', label: 'Closed' },
    { value: 'busy', label: 'Busy' },
    { value: 'temporarily_closed', label: 'Temporarily Closed' }
  ];

  const distanceOptions = [
    { value: 'any', label: 'Any Distance' },
    { value: '0-1', label: '0-1 km' },
    { value: '1-3', label: '1-3 km' },
    { value: '3-5', label: '3-5 km' },
    { value: '5-10', label: '5-10 km' },
    { value: '10+', label: '10+ km' }
  ];

  const dietaryOptions = [
    { value: 'all', label: 'All Dietary' },
    { value: 'vegetarian', label: 'Vegetarian' },
    { value: 'vegan', label: 'Vegan' },
    { value: 'non-vegetarian', label: 'Non-Vegetarian' },
    { value: 'jain', label: 'Jain' },
    { value: 'gluten-free', label: 'Gluten-Free' }
  ];

  const priceRangeOptions = [
    { value: 'all', label: 'All Prices' },
    { value: 'budget', label: 'Budget ($)' },
    { value: 'mid-range', label: 'Mid-Range ($$)' },
    { value: 'premium', label: 'Premium ($$$)' }
  ];

  const sortOptions = [
    { value: 'rating', label: 'Rating' },
    { value: 'name', label: 'Name' },
    { value: 'deliveryTime', label: 'Delivery Time' },
    { value: 'price', label: 'Price' },
    { value: 'distance', label: 'Distance' }
  ];

  return (
    <div className="min-h-screen bg-slate-900">
      {/* Header */}
      <div className="bg-slate-800 border-b border-slate-700 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          {/* Search Bar */}
          <form onSubmit={handleSearch} className="mb-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search restaurants, cuisines, or dishes..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-sera-blue focus:border-transparent"
              />
            </div>
          </form>

          {/* Filter Bar */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setShowFilterModal(true)}
                className="flex items-center space-x-2 bg-slate-700 hover:bg-slate-600 text-white px-4 py-2 rounded-lg transition-colors"
              >
                                 <span>🔍</span>
                 <span>Filters</span>
              </button>

              <div className="flex items-center space-x-2 bg-slate-700 rounded-lg p-1">
                                 <button
                   onClick={() => setViewMode('grid')}
                   className={`p-2 rounded transition-colors ${
                     viewMode === 'grid' ? 'bg-sera-blue text-white' : 'text-gray-400 hover:text-white'
                   }`}
                 >
                   <span className="text-sm">⊞</span>
                 </button>
                 <button
                   onClick={() => setViewMode('list')}
                   className={`p-2 rounded transition-colors ${
                     viewMode === 'list' ? 'bg-sera-blue text-white' : 'text-gray-400 hover:text-white'
                   }`}
                 >
                   <span className="text-sm">☰</span>
                 </button>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-sera-blue"
              >
                {sortOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-sera-blue"></div>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="text-center py-12">
          <div className="text-red-400 text-6xl mb-4">⚠️</div>
          <h2 className="text-white text-2xl font-semibold mb-2">Error loading restaurants</h2>
          <p className="text-gray-400 mb-6">{error}</p>
          <button
            onClick={fetchRestaurants}
            className="bg-sera-blue text-white px-6 py-3 rounded-lg hover:bg-sera-blue/80 transition-colors"
          >
            Try Again
          </button>
        </div>
      )}

      {/* Filter Modal */}
      {showFilterModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-800 rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-slate-700">
              <h2 className="text-white text-xl font-semibold flex items-center gap-2">
                                 <span>🔍</span>
                 Advanced Filters
              </h2>
              <button
                onClick={() => setShowFilterModal(false)}
                className="text-gray-400 hover:text-white p-2 rounded-lg hover:bg-slate-700 transition-colors"
              >
                ✕
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6 space-y-6 max-h-[60vh] overflow-y-auto">
              {/* Cuisine Section */}
              <div>
                <h3 className="text-white font-semibold mb-3 flex items-center gap-2">
                  <span>🍽️</span>
                  Cuisine Type
                </h3>
                <select
                  value={selectedCuisine}
                  onChange={(e) => setSelectedCuisine(e.target.value)}
                  className="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-sera-blue"
                >
                  {cuisineOptions.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Status Section */}
              <div>
                <h3 className="text-white font-semibold mb-3 flex items-center gap-2">
                  <span>🟢</span>
                  Restaurant Status
                </h3>
                <select
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value)}
                  className="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-sera-blue"
                >
                  {statusOptions.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Distance Section */}
              <div>
                <h3 className="text-white font-semibold mb-3 flex items-center gap-2">
                  <MapPin className="w-4 h-4" />
                  Distance
                </h3>
                <select
                  value={selectedDistance}
                  onChange={(e) => setSelectedDistance(e.target.value)}
                  className="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-sera-blue"
                >
                  {distanceOptions.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Dietary Section */}
              <div>
                <h3 className="text-white font-semibold mb-3 flex items-center gap-2">
                  <span>🌿</span>
                  Dietary Preferences
                </h3>
                <select
                  value={selectedDietary}
                  onChange={(e) => setSelectedDietary(e.target.value)}
                  className="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-sera-blue"
                >
                  {dietaryOptions.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Price Range Section */}
              <div>
                                 <h3 className="text-white font-semibold mb-3 flex items-center gap-2">
                   <span>💰</span>
                   Price Range
                 </h3>
                <select
                  value={selectedPriceRange}
                  onChange={(e) => setSelectedPriceRange(e.target.value)}
                  className="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-sera-blue"
                >
                  {priceRangeOptions.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Quick Filters Section */}
              <div>
                <h3 className="text-white font-semibold mb-3 flex items-center gap-2">
                  <span>⚡</span>
                  Quick Filters
                </h3>
                <div className="space-y-4">
                  {/* Rating Filter */}
                  <div>
                    <label className="text-white text-sm mb-2 block">Minimum Rating</label>
                    <div className="flex space-x-2">
                      {['4+', '4.5+', '5'].map((rating) => (
                        <button
                          key={rating}
                          onClick={() => handleRatingFilter(rating)}
                          className={`px-3 py-2 rounded-lg border transition-colors ${
                            selectedRatingFilter === rating
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

                  {/* Checkbox Filters */}
                  <div className="space-y-3">
                    <label className="flex items-center space-x-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={offersOnly}
                        onChange={(e) => setOffersOnly(e.target.checked)}
                        className="w-4 h-4 text-sera-blue bg-slate-700 border-slate-600 rounded focus:ring-sera-blue focus:ring-2"
                      />
                                             <span className="text-white flex items-center gap-2">
                         <span>🎁</span>
                         Offers Only
                       </span>
                    </label>

                    <label className="flex items-center space-x-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={freeDelivery}
                        onChange={(e) => setFreeDelivery(e.target.checked)}
                        className="w-4 h-4 text-sera-blue bg-slate-700 border-slate-600 rounded focus:ring-sera-blue focus:ring-2"
                      />
                                             <span className="text-white flex items-center gap-2">
                         <span>🚚</span>
                         Free Delivery
                       </span>
                    </label>
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-6 border-t border-slate-700 space-y-3">
              {/* Action Buttons */}
              <div className="flex space-x-3">
                <button
                  onClick={applyFilters}
                  className="flex-1 flex items-center justify-center space-x-2 bg-sera-blue text-white px-4 py-3 rounded-lg hover:bg-sera-blue/80 transition-colors font-medium"
                >
                  <span>✓</span>
                  <span>Apply Filters</span>
                </button>
                <button
                  onClick={() => setShowFilterModal(false)}
                  className="flex-1 flex items-center justify-center space-x-2 bg-slate-700 text-white px-4 py-3 rounded-lg hover:bg-slate-600 transition-colors"
                >
                  <span>✕</span>
                  <span>Cancel</span>
                </button>
              </div>

              {/* Clear All Filters Button */}
              <button
                onClick={clearFilters}
                className="w-full flex items-center justify-center space-x-2 bg-orange-500 text-white px-4 py-3 rounded-lg hover:bg-orange-600 transition-colors"
              >
                <span>🗑️</span>
                <span>Clear All Filters</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Restaurant List */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Results Header */}
        <div className="flex justify-between items-center mb-6">
          <div className="text-white font-semibold text-lg">
            {restaurants.length} Restaurants Found
          </div>
          <div className="text-gray-400 text-sm">
            Showing {restaurants.length} of {restaurants.length} restaurants
          </div>
        </div>

        {restaurants.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-400 text-6xl mb-4">🍽️</div>
            <h2 className="text-white text-2xl font-semibold mb-2">No restaurants found</h2>
            <p className="text-gray-400 mb-6">Try adjusting your search or filters</p>
            <button
              onClick={clearFilters}
              className="bg-sera-blue text-white px-6 py-3 rounded-lg hover:bg-sera-blue/80 transition-colors"
            >
              Clear Filters
            </button>
          </div>
        ) : (
          <div className={viewMode === 'grid' 
            ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'
            : 'space-y-4'
          }>
            {restaurants.map(restaurant => (
              viewMode === 'grid' ? (
                <RestaurantCard
                  key={restaurant._id}
                  restaurant={restaurant}
                  onFavoriteToggle={handleFavoriteToggle}
                  onViewMenu={handleViewMenu}
                />
              ) : (
                <RestaurantListItem
                  key={restaurant._id}
                  restaurant={restaurant}
                  onFavoriteToggle={handleFavoriteToggle}
                  onViewMenu={handleViewMenu}
                />
              )
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ExplorePage;
