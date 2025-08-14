import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Search,
  MapPin
} from 'lucide-react';
import RestaurantCard from './RestaurantCard';
import RestaurantListItem from './RestaurantListItem';
import { apiService, Restaurant } from '../../services/api';

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
  const [showFilters, setShowFilters] = useState(false);
  const [sortBy, setSortBy] = useState('rating');
  
  // Quick filter states
  const [selectedVegFilter, setSelectedVegFilter] = useState(false);
  const [selectedRatingFilter, setSelectedRatingFilter] = useState('4+');

  // Fetch restaurants from backend
  const fetchRestaurants = async () => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('Starting to fetch restaurants...');
      
      const params: any = {};
      if (searchQuery) params.search = searchQuery;
      if (selectedCuisine !== 'all') params.cuisine = selectedCuisine;
      if (selectedStatus !== 'all') params.status = selectedStatus;
      if (selectedDietary !== 'all') params.dietary = selectedDietary;
      if (selectedPriceRange !== 'all') params.priceRange = selectedPriceRange;
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
  };

  // Fetch restaurants on component mount and when filters change
  useEffect(() => {
    fetchRestaurants();
  }, [searchQuery, selectedCuisine, selectedStatus, selectedDietary, selectedPriceRange, sortBy]);

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
    fetchRestaurants();
  };

  const clearFilters = () => {
    setSearchQuery('');
    setSelectedCuisine('all');
    setSelectedStatus('all');
    setSelectedDietary('all');
    setSelectedPriceRange('all');
    setSortBy('rating');
    setSelectedVegFilter(false);
    setSelectedRatingFilter('4+');
  };

  const cuisineOptions = [
    { value: 'all', label: 'All Cuisines' },
    { value: 'Indian', label: 'Indian' },
    { value: 'Italian', label: 'Italian' },
    { value: 'Chinese', label: 'Chinese' },
    { value: 'American', label: 'American' },
    { value: 'Mexican', label: 'Mexican' },
    { value: 'Thai', label: 'Thai' },
    { value: 'Japanese', label: 'Japanese' },
    { value: 'Korean', label: 'Korean' },
    { value: 'Mediterranean', label: 'Mediterranean' }
  ];

  const statusOptions = [
    { value: 'all', label: 'All Status' },
    { value: 'OPEN', label: 'Open Now' },
    { value: 'CLOSED', label: 'Closed' },
    { value: 'TEMPORARILY_CLOSED', label: 'Temporarily Closed' }
  ];

  const dietaryOptions = [
    { value: 'all', label: 'All Dietary' },
    { value: 'veg', label: 'Vegetarian' },
    { value: 'non-veg', label: 'Non-Vegetarian' },
    { value: 'both', label: 'Both' },
    { value: 'jain', label: 'Jain' },
    { value: 'vegan', label: 'Vegan' }
  ];

  const priceRangeOptions = [
    { value: 'all', label: 'All Prices' },
    { value: 'budget', label: 'Budget (₹100-300)' },
    { value: 'mid-range', label: 'Mid-Range (₹300-600)' },
    { value: 'premium', label: 'Premium (₹600+)' }
  ];

  const sortOptions = [
    { value: 'rating', label: 'Rating' },
    { value: 'deliveryTime', label: 'Delivery Time' },
    { value: 'price', label: 'Price' },
    { value: 'distance', label: 'Distance' }
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-sera-blue mx-auto mb-4"></div>
          <p className="text-white">Loading restaurants...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-400 text-4xl mb-4">⚠️</div>
          <h2 className="text-white text-xl font-semibold mb-2">Error Loading Restaurants</h2>
          <p className="text-gray-400 mb-4">{error}</p>
          <button 
            onClick={fetchRestaurants}
            className="bg-sera-blue text-white px-6 py-2 rounded-lg hover:bg-sera-blue/80 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900">
      {/* Hero Section */}
      <div className="bg-slate-900 border-b border-slate-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-3">
              Explore Restaurants
            </h1>
            <p className="text-gray-300 text-lg max-w-2xl mx-auto">
              Discover amazing food from the best restaurants near you
            </p>
          </div>
        </div>
      </div>

      {/* Search and Filter Bar */}
      <div className="bg-slate-800 border-b border-slate-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col lg:flex-row gap-3 items-center">
            {/* Search Bar */}
            <div className="flex-1 w-full">
              <form onSubmit={handleSearch} className="relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search restaurants, cuisines, or dishes..."
                  className="w-full px-4 py-2.5 pl-10 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-sera-blue focus:border-transparent"
                />
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              </form>
            </div>

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
                onClick={() => setShowFilters(!showFilters)}
                className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-white transition-colors text-sm border ${
                  showFilters 
                    ? 'bg-sera-orange border-sera-orange/50' 
                    : 'bg-slate-700 border-slate-600 hover:bg-slate-600'
                }`}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.207A1 1 0 013 6.5V4z" />
                </svg>
                <span>Filters</span>
                <span className="text-gray-400">▼</span>
              </button>

              {/* View Toggle */}
              <div className="flex bg-slate-700 border border-slate-600 rounded-lg overflow-hidden">
                <button 
                  onClick={() => setViewMode('grid')}
                  className={`px-3 py-2 text-sm transition-colors ${
                    viewMode === 'grid' 
                      ? 'bg-sera-blue text-white' 
                      : 'text-gray-400 hover:text-white'
                  }`}
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M3 3h7v7H3V3zm0 11h7v7H3v-7zm11-11h7v7h-7V3zm0 11h7v7h-7v-7z"/>
                  </svg>
                </button>
                <button 
                  onClick={() => setViewMode('list')}
                  className={`px-3 py-2 text-sm transition-colors ${
                    viewMode === 'list' 
                      ? 'bg-sera-blue text-white' 
                      : 'text-gray-400 hover:text-white'
                  }`}
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M3 13h2v-2H3v2zm0 4h2v-2H3v2zm0-8h2V7H3v2zm4 4h14v-2H7v2zm0 4h14v-2H7v2zM7 7v2h14V7H7z"/>
                  </svg>
                </button>
              </div>

              {/* Map View Button */}
              <button className="flex items-center space-x-2 bg-slate-700 border border-slate-600 px-3 py-2 rounded-lg text-white hover:bg-slate-600 transition-colors text-sm">
                <MapPin className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Filters */}
      <div className="bg-slate-800 border-b border-slate-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <p className="text-gray-400 text-sm mb-3">Quick Filters:</p>
          <div className="flex flex-wrap gap-2">
            {/* Dietary Filters */}
            <button 
              onClick={() => setSelectedVegFilter(!selectedVegFilter)}
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
              onClick={() => setSelectedRatingFilter('4+')}
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
              onClick={() => setSelectedRatingFilter('3+')}
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
              onClick={() => setSelectedRatingFilter('2+')}
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
              onClick={() => setSelectedRatingFilter('1+')}
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

      {/* Advanced Filters Panel */}
      {showFilters && (
        <div className="bg-slate-800 border-b border-slate-700">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Cuisine Filter */}
              <div>
                <label className="block text-white text-sm font-medium mb-2">Cuisine</label>
                <select
                  value={selectedCuisine}
                  onChange={(e) => setSelectedCuisine(e.target.value)}
                  className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-sera-blue"
                >
                  {cuisineOptions.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Status Filter */}
              <div>
                <label className="block text-white text-sm font-medium mb-2">Status</label>
                <select
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value)}
                  className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-sera-blue"
                >
                  {statusOptions.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Dietary Filter */}
              <div>
                <label className="block text-white text-sm font-medium mb-2">Dietary</label>
                <select
                  value={selectedDietary}
                  onChange={(e) => setSelectedDietary(e.target.value)}
                  className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-sera-blue"
                >
                  {dietaryOptions.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Price Range Filter */}
              <div>
                <label className="block text-white text-sm font-medium mb-2">Price Range</label>
                <select
                  value={selectedPriceRange}
                  onChange={(e) => setSelectedPriceRange(e.target.value)}
                  className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-sera-blue"
                >
                  {priceRangeOptions.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Clear Filters Button */}
            <div className="mt-4 flex justify-end">
              <button
                onClick={clearFilters}
                className="bg-sera-orange text-white px-4 py-2 rounded-lg hover:bg-sera-orange/80 transition-colors text-sm"
              >
                Clear All Filters
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Restaurant List */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Results Header */}
        <div className="flex justify-between items-center mb-4">
          <div className="text-white font-semibold">
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
            ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4'
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
