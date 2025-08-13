import React, { useState, useMemo, useEffect, useRef } from 'react';
import { restaurants, cuisines, dietaryOptions, sortOptions, Restaurant } from '../../data/restaurants';
import RestaurantCard from './RestaurantCard';
import RestaurantListItem from './RestaurantListItem';
import { useAuth } from '../../contexts/AuthContext';

const ExplorePage: React.FC = () => {
  const [viewMode, setViewMode] = useState<'grid' | 'list' | 'map'>('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSort, setSelectedSort] = useState('rating');
  const [selectedDietary, setSelectedDietary] = useState('all');
  const [selectedCuisines, setSelectedCuisines] = useState<string[]>([]);
  const [selectedRating, setSelectedRating] = useState(0);
  const [showFreeDelivery, setShowFreeDelivery] = useState(false);
  const [showOffers, setShowOffers] = useState(false);
  const [selectedFavorites, setSelectedFavorites] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedDistance, setSelectedDistance] = useState('all');
  const [isFilterDropdownOpen, setIsFilterDropdownOpen] = useState(false);
  const [restaurantData, setRestaurantData] = useState(restaurants);
  const { user, openLoginModal } = useAuth();
  const filterDropdownRef = useRef<HTMLDivElement>(null);

  // Temporary state for filter dropdown
  const [tempFilters, setTempFilters] = useState({
    favorites: 'all',
    status: 'all',
    distance: 'all',
    sort: 'rating',
    offers: false,
    freeDelivery: false
  });

  // Handle clicking outside the dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (filterDropdownRef.current && !filterDropdownRef.current.contains(event.target as Node)) {
        setIsFilterDropdownOpen(false);
      }
    };

    if (isFilterDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isFilterDropdownOpen]);

  const handleFavoritesChange = (value: 'all' | 'favorites' | 'recently-viewed' | 'popular' | 'suggested') => {
    if (value !== 'all' && !user) {
      openLoginModal();
      return;
    }
    setSelectedFavorites(value);
  };

  const handleCuisineToggle = (cuisine: string) => {
    setSelectedCuisines(prev => 
      prev.includes(cuisine) 
        ? prev.filter(c => c !== cuisine)
        : [...prev, cuisine]
    );
  };

  const handleApplyFilters = () => {
    setSelectedFavorites(tempFilters.favorites as any);
    setSelectedStatus(tempFilters.status);
    setSelectedDistance(tempFilters.distance);
    setSelectedSort(tempFilters.sort);
    setShowOffers(tempFilters.offers);
    setShowFreeDelivery(tempFilters.freeDelivery);
    setIsFilterDropdownOpen(false);
  };

  const handleCancelFilters = () => {
    setTempFilters({
      favorites: selectedFavorites,
      status: selectedStatus,
      distance: selectedDistance,
      sort: selectedSort,
      offers: showOffers,
      freeDelivery: showFreeDelivery
    });
    setIsFilterDropdownOpen(false);
  };

  const handleClearAllFilters = () => {
    setSelectedFavorites('all');
    setSelectedStatus('all');
    setSelectedDistance('all');
    setSelectedSort('rating');
    setShowOffers(false);
    setShowFreeDelivery(false);
    setSelectedDietary('all');
    setSelectedCuisines([]);
    setSelectedRating(0);
    setSearchQuery('');
    setTempFilters({
      favorites: 'all',
      status: 'all',
      distance: 'all',
      sort: 'rating',
      offers: false,
      freeDelivery: false
    });
  };

  // Filter and sort restaurants
  const filteredRestaurants = useMemo(() => {
    let filtered = restaurantData.filter(restaurant => {
      // Search filter
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        const matchesName = restaurant.name.toLowerCase().includes(query);
        const matchesCuisine = restaurant.cuisine.some(c => c.toLowerCase().includes(query));
        const matchesDishes = restaurant.popularDishes.some(d => d.toLowerCase().includes(query));
        if (!matchesName && !matchesCuisine && !matchesDishes) return false;
      }

      // Dietary filter
      if (selectedDietary && selectedDietary !== 'all') {
        if (restaurant.dietary !== selectedDietary && restaurant.dietary !== 'both') return false;
      }

      // Cuisine filter
      if (selectedCuisines.length > 0) {
        const hasMatchingCuisine = selectedCuisines.some(cuisine => 
          restaurant.cuisine.includes(cuisine)
        );
        if (!hasMatchingCuisine) return false;
      }

      // Rating filter
      if (selectedRating > 0) {
        if (restaurant.rating < selectedRating) return false;
      }

      // Offers filter
      if (showOffers && restaurant.offers.length === 0) return false;

      // Free delivery filter
      if (showFreeDelivery) {
        if (!restaurant.offers.some(offer => offer.toLowerCase().includes('free delivery'))) return false;
      }

      // Status filter
      if (selectedStatus !== 'all') {
        if (restaurant.status !== selectedStatus) return false;
      }

      // Distance filter
      if (selectedDistance !== 'all') {
        const distance = parseInt(restaurant.distance.split(' ')[0]);
        switch (selectedDistance) {
          case '0-5':
            if (distance > 5) return false;
            break;
          case '5-10':
            if (distance < 5 || distance > 10) return false;
            break;
          case '10-15':
            if (distance < 10 || distance > 15) return false;
            break;
          case '15+':
            if (distance < 15) return false;
            break;
        }
      }

      // Favorites filter
      if (selectedFavorites === 'favorites' && !restaurant.isFavorite) return false;
      if (selectedFavorites === 'recently-viewed') {
        // Mock recently viewed - in real app, this would come from user's browsing history
        const recentlyViewedIds = ['1', '3', '5']; // Mock data
        if (!recentlyViewedIds.includes(restaurant.id)) return false;
      }
      if (selectedFavorites === 'popular') {
        // Mock popular - in real app, this would be based on order count, ratings, etc.
        const popularIds = ['1', '2', '4', '6']; // Mock data
        if (!popularIds.includes(restaurant.id)) return false;
      }
      if (selectedFavorites === 'suggested') {
        // Mock suggested - in real app, this would be based on user preferences, location, etc.
        const suggestedIds = ['2', '4', '7', '8']; // Mock data
        if (!suggestedIds.includes(restaurant.id)) return false;
      }

      return true;
    });

    // Sort restaurants
    switch (selectedSort) {
      case 'rating':
        filtered.sort((a, b) => b.rating - a.rating);
        break;
      case 'delivery-time':
        filtered.sort((a, b) => {
          const aTime = parseInt(a.deliveryTime.split('-')[0]);
          const bTime = parseInt(b.deliveryTime.split('-')[0]);
          return aTime - bTime;
        });
        break;
      case 'price-low':
        filtered.sort((a, b) => {
          const aPrice = parseInt(a.minimumOrder.replace('₹', ''));
          const bPrice = parseInt(b.minimumOrder.replace('₹', ''));
          return aPrice - bPrice;
        });
        break;
      case 'price-high':
        filtered.sort((a, b) => {
          const aPrice = parseInt(a.minimumOrder.replace('₹', ''));
          const bPrice = parseInt(b.minimumOrder.replace('₹', ''));
          return bPrice - aPrice;
        });
        break;
      case 'distance':
        filtered.sort((a, b) => {
          const aDistance = parseInt(a.distance.split(' ')[0]);
          const bDistance = parseInt(b.distance.split(' ')[0]);
          return aDistance - bDistance;
        });
        break;
    }

    return filtered;
  }, [
    restaurantData, 
    searchQuery, 
    selectedDietary, 
    selectedCuisines, 
    selectedRating, 
    showOffers, 
    showFreeDelivery, 
    selectedFavorites,
    selectedStatus,
    selectedDistance,
    selectedSort
  ]);

  const toggleFavorite = (id: string) => {
    if (!user) {
      openLoginModal();
      return;
    }
    setRestaurantData(prev => 
      prev.map(restaurant => 
        restaurant.id === id 
          ? { ...restaurant, isFavorite: !restaurant.isFavorite }
          : restaurant
      )
    );
  };

  const handleViewMenu = (restaurant: Restaurant) => {
    // Navigate to restaurant detail page
    console.log('View menu for:', restaurant.name);
  };

  return (
    <div className="min-h-screen bg-dark-900">
      {/* Hero Section - Reduced Height */}
      <div className="bg-gradient-to-br from-dark-800 via-dark-700 to-dark-600 py-4 sm:py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-1 sm:mb-2">
              Explore Restaurants
            </h1>
            <p className="text-white/80 text-base sm:text-lg">
              Discover amazing food from the best restaurants near you
            </p>
          </div>
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="sticky top-16 z-30 bg-dark-800 border-b border-dark-700 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2 sm:py-3">
          <div className="flex flex-col lg:flex-row gap-2 sm:gap-3 items-center">
            {/* Search Input */}
            <div className="flex-1 w-full lg:w-auto">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search restaurants, cuisines, or dishes..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full px-3 sm:px-4 py-2 pl-10 sm:pl-12 bg-dark-700 border border-dark-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-sera-blue focus:border-transparent text-sm sm:text-base"
                />
                <svg className="absolute left-3 sm:left-4 top-1/2 transform -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </div>

            {/* Location Filter */}
            <div className="flex items-center space-x-2 bg-dark-700 px-3 sm:px-4 py-2 rounded-lg border border-dark-600">
              <svg className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <span className="text-white text-xs sm:text-sm">Deliver to: Current Location</span>
            </div>

            {/* Sort Dropdown */}
            <select 
              value={selectedSort}
              onChange={(e) => setSelectedSort(e.target.value)}
              className="bg-dark-700 border border-dark-600 rounded-lg px-3 sm:px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-sera-blue text-sm sm:text-base"
            >
              {sortOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.icon} {option.label}
                </option>
              ))}
            </select>

            {/* Enhanced Filter Dropdown */}
            <div className="relative" ref={filterDropdownRef}>
              <button
                onClick={() => {
                  setIsFilterDropdownOpen(!isFilterDropdownOpen);
                  // Initialize temp filters with current values
                  setTempFilters({
                    favorites: selectedFavorites,
                    status: selectedStatus,
                    distance: selectedDistance,
                    sort: selectedSort,
                    offers: showOffers,
                    freeDelivery: showFreeDelivery
                  });
                }}
                className="flex items-center gap-2 bg-dark-700 border border-dark-600 rounded-lg px-3 sm:px-4 py-2 text-white hover:bg-dark-600 transition-colors text-sm sm:text-base"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.207A1 1 0 013 6.5V4z" />
                </svg>
                <span>Filters</span>
                <svg className={`w-4 h-4 transition-transform ${isFilterDropdownOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {/* Filter Dropdown */}
              {isFilterDropdownOpen && (
                <div className="absolute top-full mt-2 bg-dark-800 border border-dark-600 rounded-lg shadow-xl z-50 max-h-[80vh] overflow-y-auto
                  w-[calc(100vw-2rem)] sm:w-96 
                  left-1/2 transform -translate-x-1/2 sm:left-auto sm:right-0 sm:transform-none
                  mx-0 sm:mx-0">
                  <div className="p-3 sm:p-4 space-y-4 sm:space-y-6">
                    {/* Filter Type */}
                    <div>
                      <label className="block text-white text-sm font-medium mb-2 sm:mb-3">Filter Type</label>
                      <select 
                        value={tempFilters.favorites}
                        onChange={(e) => setTempFilters(prev => ({ ...prev, favorites: e.target.value }))}
                        className="w-full bg-dark-700 border border-dark-600 rounded-lg px-2 sm:px-3 py-2 sm:py-3 text-white focus:outline-none focus:ring-2 focus:ring-sera-blue text-sm"
                      >
                        <option value="all">🍽️ All Restaurants</option>
                        <option value="favorites">❤️ Favorites</option>
                        <option value="recently-viewed">🕒 Recently Viewed</option>
                        <option value="popular">🔥 Popular</option>
                        <option value="suggested">💡 Suggested</option>
                      </select>
                    </div>

                    {/* Divider */}
                    <div className="border-t border-dark-600"></div>

                    {/* Status Filter */}
                    <div>
                      <label className="block text-white text-sm font-medium mb-2 sm:mb-3">Status</label>
                      <select 
                        value={tempFilters.status}
                        onChange={(e) => setTempFilters(prev => ({ ...prev, status: e.target.value }))}
                        className="w-full bg-dark-700 border border-dark-600 rounded-lg px-2 sm:px-3 py-2 sm:py-3 text-white focus:outline-none focus:ring-2 focus:ring-sera-blue text-sm"
                      >
                        <option value="all">🟢 All Status</option>
                        <option value="OPEN">🟢 Open</option>
                        <option value="CLOSED">🔴 Closed</option>
                        <option value="TEMPORARILY_CLOSED">🟣 Temporarily Closed</option>
                        <option value="PERMANENTLY_CLOSED">⚫ Permanently Closed</option>
                      </select>
                    </div>

                    {/* Divider */}
                    <div className="border-t border-dark-600"></div>

                    {/* Distance Filter */}
                    <div>
                      <label className="block text-white text-sm font-medium mb-2 sm:mb-3">Distance</label>
                      <select 
                        value={tempFilters.distance}
                        onChange={(e) => setTempFilters(prev => ({ ...prev, distance: e.target.value }))}
                        className="w-full bg-dark-700 border border-dark-600 rounded-lg px-2 sm:px-3 py-2 sm:py-3 text-white focus:outline-none focus:ring-2 focus:ring-sera-blue text-sm"
                      >
                        <option value="all">📍 Any Distance</option>
                        <option value="0-5">🚶‍♂️ 0-5 km</option>
                        <option value="5-10">🚲 5-10 km</option>
                        <option value="10-15">🚗 10-15 km</option>
                        <option value="15+">🚚 15+ km</option>
                      </select>
                    </div>

                    {/* Divider */}
                    <div className="border-t border-dark-600"></div>

                    {/* Quick Toggles */}
                    <div className="space-y-3 sm:space-y-4">
                      <label className="block text-white text-sm font-medium">Quick Filters</label>
                      <div className="space-y-2 sm:space-y-3">
                        <div className="flex items-center gap-2 sm:gap-3">
                          <input
                            type="checkbox"
                            id="showOffers"
                            checked={tempFilters.offers}
                            onChange={(e) => setTempFilters(prev => ({ ...prev, offers: e.target.checked }))}
                            className="w-4 h-4 sm:w-5 sm:h-5 text-sera-orange bg-dark-700 border-dark-600 rounded focus:ring-sera-orange"
                          />
                          <label htmlFor="showOffers" className="text-white text-sm cursor-pointer">🎁 Offers Only</label>
                        </div>
                        <div className="flex items-center gap-2 sm:gap-3">
                          <input
                            type="checkbox"
                            id="showFreeDelivery"
                            checked={tempFilters.freeDelivery}
                            onChange={(e) => setTempFilters(prev => ({ ...prev, freeDelivery: e.target.checked }))}
                            className="w-4 h-4 sm:w-5 sm:h-5 text-sera-orange bg-dark-700 border-dark-600 rounded focus:ring-sera-orange"
                          />
                          <label htmlFor="showFreeDelivery" className="text-white text-sm cursor-pointer">🚚 Free Delivery</label>
                        </div>
                      </div>
                    </div>

                    {/* Divider */}
                    <div className="border-t border-dark-600"></div>

                    {/* Action Buttons */}
                    <div className="flex gap-2 sm:gap-3 pt-2">
                      <button
                        onClick={handleApplyFilters}
                        className="flex-1 bg-sera-blue text-white py-2 sm:py-3 px-3 sm:px-4 rounded-lg font-medium hover:bg-sera-blue/80 transition-colors text-sm"
                      >
                        ✅ Apply
                      </button>
                      <button
                        onClick={handleCancelFilters}
                        className="flex-1 bg-dark-600 text-white py-2 sm:py-3 px-3 sm:px-4 rounded-lg font-medium hover:bg-dark-500 transition-colors text-sm"
                      >
                        ❌ Cancel
                      </button>
                    </div>

                    {/* Clear All Filters */}
                    <button
                      onClick={handleClearAllFilters}
                      className="w-full bg-sera-orange text-white py-2 sm:py-3 px-3 sm:px-4 rounded-lg font-medium hover:bg-sera-orange/80 transition-colors text-sm"
                    >
                      🗑️ Clear All Filters
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* View Mode Toggle */}
            <div className="flex bg-dark-700 rounded-lg p-1 border border-dark-600">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-1.5 rounded ${viewMode === 'grid' ? 'bg-sera-blue text-white' : 'text-gray-400 hover:text-white'}`}
              >
                <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM11 13a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                </svg>
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-1.5 rounded ${viewMode === 'list' ? 'bg-sera-blue text-white' : 'text-gray-400 hover:text-white'}`}
              >
                <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
                </svg>
              </button>
              <button
                onClick={() => setViewMode('map')}
                className={`p-1.5 rounded ${viewMode === 'map' ? 'bg-sera-blue text-white' : 'text-gray-400 hover:text-white'}`}
              >
                <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Filters Section */}
      <div className="bg-dark-800 border-b border-dark-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2">
          {/* Inline Header and Filters */}
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center">
              <svg className="w-3 h-3 sm:w-4 sm:h-4 text-sera-blue mr-1 sm:mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.207A1 1 0 013 6.5V4z" />
              </svg>
              <h3 className="text-white text-xs sm:text-sm font-semibold mr-2 sm:mr-4">Quick Filters:</h3>
            </div>
            <span className="text-gray-400 text-xs">Refine your search</span>
          </div>

          {/* All Filters in One Line */}
          <div className="flex flex-wrap items-center gap-1 sm:gap-2">
            {/* Dietary Filters */}
            <div className="flex items-center">
              <span className="text-white text-xs font-medium mr-1">🍽️</span>
              <div className="flex gap-0.5 sm:gap-1">
                {dietaryOptions.map(option => (
                  <button
                    key={option.value}
                    onClick={() => setSelectedDietary(option.value)}
                    className={`px-1.5 sm:px-2 lg:px-3 py-0.5 sm:py-1 lg:py-1.5 rounded-full text-xs sm:text-sm font-medium transition-all duration-200 hover:scale-105 whitespace-nowrap ${
                      selectedDietary === option.value
                        ? 'bg-gradient-to-r from-sera-blue to-sera-blue/90 text-white shadow-sm'
                        : 'bg-dark-600 text-gray-300 hover:bg-dark-500 hover:text-white'
                    }`}
                  >
                    {option.icon} {option.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Separator */}
            <div className="w-px h-3 sm:h-4 lg:h-5 bg-dark-600 mx-0.5 sm:mx-1"></div>

            {/* Cuisine Filters */}
            <div className="flex items-center">
              <span className="text-white text-xs font-medium mr-1">🌍</span>
              <div className="flex gap-0.5 sm:gap-1">
                {cuisines.slice(0, 3).map(cuisine => (
                  <button
                    key={cuisine}
                    onClick={() => handleCuisineToggle(cuisine)}
                    className={`px-1.5 sm:px-2 lg:px-3 py-0.5 sm:py-1 lg:py-1.5 rounded-full text-xs sm:text-sm font-medium transition-all duration-200 hover:scale-105 whitespace-nowrap ${
                      selectedCuisines.includes(cuisine)
                        ? 'bg-gradient-to-r from-sera-orange to-sera-orange/90 text-white shadow-sm'
                        : 'bg-dark-600 text-gray-300 hover:bg-dark-500 hover:text-white'
                    }`}
                  >
                    {cuisine}
                  </button>
                ))}
              </div>
            </div>

            {/* Separator */}
            <div className="w-px h-3 sm:h-4 lg:h-5 bg-dark-600 mx-0.5 sm:mx-1"></div>

            {/* Rating Filter */}
            <div className="flex items-center">
              <span className="text-white text-xs font-medium mr-1">⭐</span>
              <div className="flex gap-0.5 sm:gap-1">
                {[4, 3, 2, 1].map(rating => (
                  <button
                    key={rating}
                    onClick={() => setSelectedRating(selectedRating === rating ? 0 : rating)}
                    className={`px-1.5 sm:px-2 lg:px-3 py-0.5 sm:py-1 lg:py-1.5 rounded-full text-xs sm:text-sm font-medium transition-all duration-200 hover:scale-105 whitespace-nowrap ${
                      selectedRating >= rating
                        ? 'bg-gradient-to-r from-yellow-500 to-yellow-600 text-white shadow-sm'
                        : 'bg-dark-600 text-gray-300 hover:bg-dark-500 hover:text-white'
                    }`}
                  >
                    {rating}+ Stars
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Results Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Results Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <h2 className="text-white text-lg sm:text-xl font-bold">
              {filteredRestaurants.length} Restaurant{filteredRestaurants.length !== 1 ? 's' : ''} Found
            </h2>
            {(selectedFavorites !== 'all' || selectedStatus !== 'all' || selectedDistance !== 'all' || showOffers || showFreeDelivery) && (
              <span className="bg-sera-blue/20 text-sera-blue text-xs px-2 py-1 rounded-full font-medium">
                Filtered
              </span>
            )}
          </div>
          <div className="text-gray-400 text-sm">
            Showing {filteredRestaurants.length} of {restaurants.length} restaurants
          </div>
        </div>

        {/* Restaurant Grid/List */}
        {viewMode === 'grid' ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
            {filteredRestaurants.map(restaurant => (
              <RestaurantCard
                key={restaurant.id}
                restaurant={restaurant}
                onFavoriteToggle={toggleFavorite}
                onViewMenu={handleViewMenu}
              />
            ))}
          </div>
        ) : viewMode === 'list' ? (
          <div className="space-y-4">
            {filteredRestaurants.map(restaurant => (
              <RestaurantListItem
                key={restaurant.id}
                restaurant={restaurant}
                onFavoriteToggle={toggleFavorite}
                onViewMenu={handleViewMenu}
              />
            ))}
          </div>
        ) : (
          <div className="bg-dark-800 rounded-lg p-8 text-center">
            <svg className="w-16 h-16 text-gray-600 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-1.447-.894L15 4m0 13V4m-6 3l6-3" />
            </svg>
            <h3 className="text-white text-lg font-semibold mb-2">Map View Coming Soon</h3>
            <p className="text-gray-400">Interactive map view will be available in the next update.</p>
          </div>
        )}

        {/* No Results */}
        {filteredRestaurants.length === 0 && (
          <div className="text-center py-12">
            <svg className="w-16 h-16 text-gray-600 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <h3 className="text-white text-lg font-semibold mb-2">No restaurants found</h3>
            <p className="text-gray-400 mb-4">Try adjusting your filters or search terms.</p>
            <button
              onClick={handleClearAllFilters}
              className="bg-sera-blue text-white px-6 py-2 rounded-lg font-medium hover:bg-sera-blue/80 transition-colors"
            >
              Clear All Filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ExplorePage;
