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

  // Fetch restaurants from backend
  const fetchRestaurants = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const params: any = {};
      if (searchQuery) params.search = searchQuery;
      if (selectedCuisine !== 'all') params.cuisine = selectedCuisine;
      if (selectedStatus !== 'all') params.status = selectedStatus;
      if (selectedDietary !== 'all') params.dietary = selectedDietary;
      if (selectedPriceRange !== 'all') params.priceRange = selectedPriceRange;
      
      const response = await apiService.getRestaurants(params);
      
      if (response.success) {
        setRestaurants(response.data.restaurants);
      } else {
        setError('Failed to fetch restaurants');
      }
    } catch (err) {
      console.error('Error fetching restaurants:', err);
      setError('Failed to load restaurants. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Fetch restaurants on component mount and when filters change
  useEffect(() => {
    fetchRestaurants();
  }, [searchQuery, selectedCuisine, selectedStatus, selectedDietary, selectedPriceRange]);

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
  };

  const cuisineOptions = [
    { value: 'all', label: 'All Cuisines' },
    { value: 'Indian', label: 'Indian' },
    { value: 'Italian', label: 'Italian' },
    { value: 'Chinese', label: 'Chinese' },
    { value: 'American', label: 'American' },
    { value: 'Mexican', label: 'Mexican' },
    { value: 'Thai', label: 'Thai' },
    { value: 'Japanese', label: 'Japanese' }
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
    { value: 'budget', label: 'Budget' },
    { value: 'mid-range', label: 'Mid-Range' },
    { value: 'premium', label: 'Premium' }
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
      {/* Header */}
      <div className="bg-dark-800 border-b border-dark-700 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col lg:flex-row gap-4 items-center">
            {/* Search Bar */}
            <div className="flex-1 w-full lg:w-auto">
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

            {/* Filter Controls - Responsive Layout */}
            <div className="flex flex-wrap gap-2 w-full lg:w-auto">
              {/* Medium screens: 2x2 grid */}
              <div className="grid grid-cols-2 gap-2 md:flex md:flex-wrap md:gap-2">
                {/* Deliver to - Placeholder for future location feature */}
                <button className="flex items-center space-x-2 bg-dark-700 border border-dark-600 px-3 py-2 rounded-lg text-white hover:bg-dark-600 transition-colors text-sm">
                  <MapPin className="w-4 h-4" />
                  <span>Deliver to</span>
                </button>

                {/* Sort/Filter */}
                <button 
                  onClick={() => setShowFilters(!showFilters)}
                  className="flex items-center space-x-2 bg-dark-700 border border-dark-600 px-3 py-2 rounded-lg text-white hover:bg-dark-600 transition-colors text-sm"
                >
                  <span className="text-sm">⚙️</span>
                  <span>Sort/Filter</span>
                </button>

                {/* Layout Toggle */}
                <button 
                  onClick={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')}
                  className="flex items-center space-x-2 bg-dark-700 border border-dark-600 px-3 py-2 rounded-lg text-white hover:bg-dark-600 transition-colors text-sm"
                >
                  <span className="text-sm">{viewMode === 'grid' ? '📋' : '🔲'}</span>
                  <span>{viewMode === 'grid' ? 'List' : 'Grid'}</span>
                </button>

                {/* Quick Stats */}
                <div className="flex items-center space-x-2 bg-dark-700 border border-dark-600 px-3 py-2 rounded-lg text-white text-sm">
                  <span className="text-sera-blue">⏰</span>
                  <span>{restaurants.length} restaurants</span>
                </div>
              </div>
            </div>

            {/* Filters Panel */}
            {showFilters && (
              <div className="mt-4 p-4 bg-dark-700 rounded-lg border border-dark-600">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {/* Cuisine Filter */}
                  <div>
                    <label className="block text-white text-sm font-medium mb-2">Cuisine</label>
                    <select
                      value={selectedCuisine}
                      onChange={(e) => setSelectedCuisine(e.target.value)}
                      className="w-full bg-dark-600 border border-dark-500 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-sera-blue"
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
                      className="w-full bg-dark-600 border border-dark-500 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-sera-blue"
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
                      className="w-full bg-dark-600 border border-dark-500 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-sera-blue"
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
                      className="w-full bg-dark-600 border border-dark-500 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-sera-blue"
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
            )}
          </div>
        </div>
      </div>

      {/* Restaurant List */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
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
