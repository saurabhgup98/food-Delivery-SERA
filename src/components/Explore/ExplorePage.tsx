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
      <div className="min-h-screen bg-dark-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-sera-blue mx-auto mb-4"></div>
          <p className="text-white">Loading restaurants...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-dark-900 flex items-center justify-center">
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
    <div className="min-h-screen bg-dark-900">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-sera-pink/10 via-sera-orange/10 to-sera-yellow/10 border-b border-dark-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center mb-8">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              <span className="bg-gradient-to-r from-sera-pink to-sera-orange bg-clip-text text-transparent">
                Explore
              </span>
              <span className="text-white"> Restaurants</span>
            </h1>
            <p className="text-gray-300 text-lg max-w-2xl mx-auto">
              Discover amazing food from the best restaurants near you
            </p>
          </div>
        </div>
      </div>

      {/* Search and Filter Bar */}
      <div className="bg-dark-800 border-b border-dark-700 sticky top-16 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col lg:flex-row gap-4 items-center">
            {/* Search Bar */}
            <div className="flex-1 w-full">
              <form onSubmit={handleSearch} className="relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search restaurants, cuisines, or dishes..."
                  className="w-full px-4 py-3 pl-12 bg-dark-700 border border-dark-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-sera-blue focus:border-transparent"
                />
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              </form>
            </div>

            {/* Filter Controls */}
            <div className="flex flex-wrap gap-3">
              {/* Location */}
              <button className="flex items-center space-x-2 bg-dark-700 border border-dark-600 px-3 py-2 rounded-lg text-white hover:bg-dark-600 transition-colors text-sm">
                <MapPin className="w-4 h-4" />
                <span>Deliver to: Current Location</span>
              </button>

              {/* Sort Dropdown */}
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-dark-700 border border-dark-600 px-3 py-2 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-sera-blue text-sm"
              >
                {sortOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>

              {/* Filter Toggle */}
              <button 
                onClick={() => setShowFilters(!showFilters)}
                className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-white transition-colors text-sm ${
                  showFilters 
                    ? 'bg-sera-orange border border-sera-orange/50' 
                    : 'bg-dark-700 border border-dark-600 hover:bg-dark-600'
                }`}
              >
                <span className="text-sm">⚙️</span>
                <span>Filters</span>
              </button>

              {/* View Toggle */}
              <div className="flex bg-dark-700 border border-dark-600 rounded-lg overflow-hidden">
                <button 
                  onClick={() => setViewMode('grid')}
                  className={`px-3 py-2 text-sm transition-colors ${
                    viewMode === 'grid' 
                      ? 'bg-sera-blue text-white' 
                      : 'text-gray-400 hover:text-white'
                  }`}
                >
                  🔲
                </button>
                <button 
                  onClick={() => setViewMode('list')}
                  className={`px-3 py-2 text-sm transition-colors ${
                    viewMode === 'list' 
                      ? 'bg-sera-blue text-white' 
                      : 'text-gray-400 hover:text-white'
                  }`}
                >
                  📋
                </button>
              </div>
            </div>
          </div>

          {/* Quick Filters */}
          <div className="mt-4">
            <p className="text-gray-400 text-sm mb-3">Quick Filters:</p>
            <div className="flex flex-wrap gap-2">
              {/* Dietary Filters */}
              <button className="flex items-center space-x-2 bg-dark-700 border border-dark-600 px-3 py-2 rounded-lg text-white hover:bg-dark-600 transition-colors text-sm">
                <span>🌿</span>
                <span>Veg Only</span>
              </button>
              <button className="flex items-center space-x-2 bg-dark-700 border border-dark-600 px-3 py-2 rounded-lg text-white hover:bg-dark-600 transition-colors text-sm">
                <span>🍗</span>
                <span>Non-Veg</span>
              </button>
              <button className="flex items-center space-x-2 bg-dark-700 border border-dark-600 px-3 py-2 rounded-lg text-white hover:bg-dark-600 transition-colors text-sm">
                <span>🟣</span>
                <span>Both</span>
              </button>
              <button className="flex items-center space-x-2 bg-dark-700 border border-dark-600 px-3 py-2 rounded-lg text-white hover:bg-dark-600 transition-colors text-sm">
                <span>🟣</span>
                <span>Jain</span>
              </button>
              <button className="flex items-center space-x-2 bg-dark-700 border border-dark-600 px-3 py-2 rounded-lg text-white hover:bg-dark-600 transition-colors text-sm">
                <span>🌱</span>
                <span>Vegan</span>
              </button>

              {/* Cuisine Filters */}
              <button className="flex items-center space-x-2 bg-dark-700 border border-dark-600 px-3 py-2 rounded-lg text-white hover:bg-dark-600 transition-colors text-sm">
                <span>🇮🇳</span>
                <span>Indian</span>
              </button>
              <button className="flex items-center space-x-2 bg-dark-700 border border-dark-600 px-3 py-2 rounded-lg text-white hover:bg-dark-600 transition-colors text-sm">
                <span>🇨🇳</span>
                <span>Chinese</span>
              </button>
              <button className="flex items-center space-x-2 bg-dark-700 border border-dark-600 px-3 py-2 rounded-lg text-white hover:bg-dark-600 transition-colors text-sm">
                <span>🇮🇹</span>
                <span>Italian</span>
              </button>

              {/* Rating Filters */}
              <button className="flex items-center space-x-2 bg-dark-700 border border-dark-600 px-3 py-2 rounded-lg text-white hover:bg-dark-600 transition-colors text-sm">
                <span>⭐</span>
                <span>4+ Stars</span>
              </button>
              <button className="flex items-center space-x-2 bg-dark-700 border border-dark-600 px-3 py-2 rounded-lg text-white hover:bg-dark-600 transition-colors text-sm">
                <span>⭐</span>
                <span>3+ Stars</span>
              </button>
              <button className="flex items-center space-x-2 bg-dark-700 border border-dark-600 px-3 py-2 rounded-lg text-white hover:bg-dark-600 transition-colors text-sm">
                <span>⭐</span>
                <span>2+ Stars</span>
              </button>
              <button className="flex items-center space-x-2 bg-dark-700 border border-dark-600 px-3 py-2 rounded-lg text-white hover:bg-dark-600 transition-colors text-sm">
                <span>⭐</span>
                <span>1+ Stars</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Restaurant List */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Results Header */}
        <div className="flex justify-between items-center mb-6">
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
