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
      <div className="min-h-screen bg-gradient-to-br from-dark-900 via-dark-800 to-dark-900 flex items-center justify-center">
        <div className="text-center">
          <div className="relative">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-sera-blue/20 border-t-sera-blue mx-auto mb-6"></div>
            <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-sera-orange animate-spin" style={{ animationDirection: 'reverse', animationDuration: '1.5s' }}></div>
          </div>
          <h3 className="text-white text-lg font-semibold mb-2">Discovering Amazing Restaurants</h3>
          <p className="text-gray-400">Loading your culinary journey...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-dark-900 via-dark-800 to-dark-900 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-6">
          <div className="text-red-400 text-6xl mb-6">🍽️</div>
          <h2 className="text-white text-2xl font-bold mb-4">Oops! Something went wrong</h2>
          <p className="text-gray-400 mb-8 leading-relaxed">{error}</p>
          <div className="space-y-4">
            <button 
              onClick={fetchRestaurants}
              className="w-full bg-gradient-to-r from-sera-blue to-sera-blue/90 text-white px-8 py-3 rounded-xl hover:from-sera-blue/90 hover:to-sera-blue transition-all duration-300 font-semibold shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              Try Again
            </button>
            <button 
              onClick={clearFilters}
              className="w-full bg-dark-700 text-white px-8 py-3 rounded-xl hover:bg-dark-600 transition-all duration-300 font-semibold border border-dark-600"
            >
              Clear Filters
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-dark-900 via-dark-800 to-dark-900">
      {/* Hero Section with Search */}
      <div className="relative bg-gradient-to-r from-sera-pink/20 via-sera-orange/20 to-sera-yellow/20 border-b border-white/10">
        <div className="absolute inset-0 bg-gradient-to-r from-sera-pink/5 to-sera-orange/5"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Page Title */}
          <div className="text-center mb-8">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              <span className="bg-gradient-to-r from-sera-pink to-sera-orange bg-clip-text text-transparent">
                Explore
              </span>
              <span className="text-white"> Restaurants</span>
            </h1>
            <p className="text-gray-300 text-lg max-w-2xl mx-auto">
              Discover the best restaurants in your area. Order delicious food and get it delivered to your doorstep.
            </p>
          </div>

          {/* Search and Filter Bar */}
          <div className="bg-dark-800/80 backdrop-blur-sm rounded-2xl border border-white/10 p-6 shadow-2xl">
            <div className="flex flex-col lg:flex-row gap-4 items-center">
              {/* Search Bar */}
              <div className="flex-1 w-full">
                <form onSubmit={handleSearch} className="relative">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search restaurants, cuisines, or dishes..."
                    className="w-full px-6 py-4 pl-14 bg-dark-700/50 border border-white/10 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-sera-blue focus:border-transparent backdrop-blur-sm transition-all duration-300"
                  />
                  <Search className="absolute left-5 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <button
                    type="submit"
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-gradient-to-r from-sera-blue to-sera-blue/90 text-white px-4 py-2 rounded-lg hover:from-sera-blue/90 hover:to-sera-blue transition-all duration-300 text-sm font-semibold"
                  >
                    Search
                  </button>
                </form>
              </div>

              {/* Quick Actions */}
              <div className="flex flex-wrap gap-3">
                {/* Location */}
                <button className="flex items-center space-x-2 bg-dark-700/50 border border-white/10 px-4 py-3 rounded-xl text-white hover:bg-dark-600/50 transition-all duration-300 backdrop-blur-sm">
                  <MapPin className="w-4 h-4 text-sera-orange" />
                  <span className="text-sm font-medium">Deliver to</span>
                </button>

                {/* Filter Toggle */}
                <button 
                  onClick={() => setShowFilters(!showFilters)}
                  className={`flex items-center space-x-2 px-4 py-3 rounded-xl text-white transition-all duration-300 backdrop-blur-sm ${
                    showFilters 
                      ? 'bg-gradient-to-r from-sera-orange to-sera-orange/90 border border-sera-orange/50' 
                      : 'bg-dark-700/50 border border-white/10 hover:bg-dark-600/50'
                  }`}
                >
                  <span className="text-sm">⚙️</span>
                  <span className="text-sm font-medium">Filters</span>
                </button>

                {/* View Toggle */}
                <button 
                  onClick={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')}
                  className="flex items-center space-x-2 bg-dark-700/50 border border-white/10 px-4 py-3 rounded-xl text-white hover:bg-dark-600/50 transition-all duration-300 backdrop-blur-sm"
                >
                  {viewMode === 'grid' ? (
                    <span className="text-sm">📋</span>
                  ) : (
                    <span className="text-sm">🔲</span>
                  )}
                  <span className="text-sm font-medium">{viewMode === 'grid' ? 'List' : 'Grid'}</span>
                </button>

                {/* Results Count */}
                <div className="flex items-center space-x-2 bg-gradient-to-r from-sera-blue/20 to-sera-blue/10 border border-sera-blue/20 px-4 py-3 rounded-xl text-white backdrop-blur-sm">
                  <span className="text-sera-blue text-lg">🍽️</span>
                  <span className="text-sm font-semibold">{restaurants.length} restaurants</span>
                </div>
              </div>
            </div>

            {/* Advanced Filters Panel */}
            {showFilters && (
              <div className="mt-6 p-6 bg-dark-700/30 rounded-xl border border-white/10 backdrop-blur-sm">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                  {/* Sort By */}
                  <div>
                    <label className="block text-white text-sm font-semibold mb-2">Sort By</label>
                    <select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value)}
                      className="w-full bg-dark-600/50 border border-white/10 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-sera-blue backdrop-blur-sm"
                    >
                      {sortOptions.map(option => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Cuisine Filter */}
                  <div>
                    <label className="block text-white text-sm font-semibold mb-2">Cuisine</label>
                    <select
                      value={selectedCuisine}
                      onChange={(e) => setSelectedCuisine(e.target.value)}
                      className="w-full bg-dark-600/50 border border-white/10 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-sera-blue backdrop-blur-sm"
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
                    <label className="block text-white text-sm font-semibold mb-2">Status</label>
                    <select
                      value={selectedStatus}
                      onChange={(e) => setSelectedStatus(e.target.value)}
                      className="w-full bg-dark-600/50 border border-white/10 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-sera-blue backdrop-blur-sm"
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
                    <label className="block text-white text-sm font-semibold mb-2">Dietary</label>
                    <select
                      value={selectedDietary}
                      onChange={(e) => setSelectedDietary(e.target.value)}
                      className="w-full bg-dark-600/50 border border-white/10 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-sera-blue backdrop-blur-sm"
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
                    <label className="block text-white text-sm font-semibold mb-2">Price Range</label>
                    <select
                      value={selectedPriceRange}
                      onChange={(e) => setSelectedPriceRange(e.target.value)}
                      className="w-full bg-dark-600/50 border border-white/10 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-sera-blue backdrop-blur-sm"
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
                <div className="mt-6 flex justify-end">
                  <button
                    onClick={clearFilters}
                    className="bg-gradient-to-r from-sera-orange to-sera-orange/90 text-white px-6 py-2 rounded-lg hover:from-sera-orange/90 hover:to-sera-orange transition-all duration-300 font-semibold shadow-lg hover:shadow-xl transform hover:scale-105"
                  >
                    Clear All Filters
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Restaurant List */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {restaurants.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-gray-400 text-8xl mb-6">🍽️</div>
            <h2 className="text-white text-3xl font-bold mb-4">No restaurants found</h2>
            <p className="text-gray-400 mb-8 text-lg max-w-md mx-auto">
              Try adjusting your search criteria or filters to discover more amazing restaurants
            </p>
            <button
              onClick={clearFilters}
              className="bg-gradient-to-r from-sera-blue to-sera-blue/90 text-white px-8 py-3 rounded-xl hover:from-sera-blue/90 hover:to-sera-blue transition-all duration-300 font-semibold shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              Clear All Filters
            </button>
          </div>
        ) : (
          <div className={viewMode === 'grid' 
            ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8'
            : 'space-y-6'
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
