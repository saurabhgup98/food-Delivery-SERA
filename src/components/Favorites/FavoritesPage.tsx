import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { AnimatedLoader } from '../Loader';
import QuickFilters from '../Common/QuickFilters';
import RestaurantDisplay from '../Common/RestaurantDisplay';
import FilterModal from '../Common/FilterModal';
import { apiService, Restaurant } from '../../services/api';
import { MapPin, Search } from 'lucide-react';
import HeartIcon from '../Icons/HeartIcon';
import StarIcon from '../Icons/StarIcon';
import FilterIcon from '../Icons/FilterIcon';

const FavoritesPage: React.FC = () => {
  const navigate = useNavigate();
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedVegFilter, setSelectedVegFilter] = useState(false);
  const [selectedRatingFilter, setSelectedRatingFilter] = useState('');
  const [showFilterModal, setShowFilterModal] = useState(false);
  const headerRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Filter states (for FilterModal)
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedCuisine, setSelectedCuisine] = useState('all');
  const [selectedDietary, setSelectedDietary] = useState('all');
  const [selectedPriceRange, setSelectedPriceRange] = useState('all');
  const [selectedDistance, setSelectedDistance] = useState('any');
  const [selectedRatingFilterModal, setSelectedRatingFilterModal] = useState('');
  const [offersOnly, setOffersOnly] = useState(false);
  const [freeDelivery, setFreeDelivery] = useState(false);

  // Temporary filter states (for FilterModal)
  const [tempStatus, setTempStatus] = useState('all');
  const [tempCuisine, setTempCuisine] = useState('all');
  const [tempDietary, setTempDietary] = useState('all');
  const [tempPriceRange, setTempPriceRange] = useState('all');
  const [tempDistance, setTempDistance] = useState('any');
  const [tempRatingFilter, setTempRatingFilter] = useState('');
  const [tempOffersOnly, setTempOffersOnly] = useState(false);
  const [tempFreeDelivery, setTempFreeDelivery] = useState(false);

  // Debounced search state
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState('');

  // Handle scroll for sticky header with throttling
  useEffect(() => {
    let ticking = false;
    
    const handleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Debounced search effect
  useEffect(() => {
    const timer = setTimeout(() => {
      // Only search if query has 3 or more words
      const wordCount = searchQuery.trim().split(/\s+/).filter(word => word.length > 0).length;
      if (wordCount >= 3 || searchQuery.trim() === '') {
        setDebouncedSearchQuery(searchQuery);
      }
    }, 800); // 800ms delay

    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Maintain focus on search input after search
  useEffect(() => {
    if (searchInputRef.current && debouncedSearchQuery !== searchQuery) {
      searchInputRef.current.focus();
    }
  }, [debouncedSearchQuery, searchQuery]);

  const fetchFavorites = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      console.log('Fetching favorite restaurants...');
      const params: any = {
        favorites: true // This will filter only favorite restaurants
      };
      if (debouncedSearchQuery) params.search = debouncedSearchQuery;
      if (selectedVegFilter) params.dietary = 'vegetarian';
      if (selectedRatingFilter) params.rating = selectedRatingFilter;
      if (selectedStatus !== 'all') params.status = selectedStatus;
      if (selectedCuisine !== 'all') params.cuisine = selectedCuisine;
      if (selectedDietary !== 'all') params.dietary = selectedDietary;
      if (selectedPriceRange !== 'all') params.priceRange = selectedPriceRange;
      if (selectedDistance !== 'any') params.distance = selectedDistance;
      if (selectedRatingFilterModal) params.rating = selectedRatingFilterModal;
      if (offersOnly) params.offersOnly = true;
      if (freeDelivery) params.freeDelivery = true;

      const response = await apiService.getRestaurants(params);
      if (response.success) {
        setRestaurants(response.data.restaurants);
        console.log('Favorite restaurants loaded:', response.data.restaurants.length);
      } else {
        setError('Failed to fetch favorite restaurants');
      }
    } catch (err: any) {
      console.error('Error fetching favorites:', err);
      setError(`Failed to load favorites: ${err?.message || 'Unknown error'}`);
    } finally {
      setLoading(false);
    }
  }, [
    debouncedSearchQuery,
    selectedVegFilter,
    selectedRatingFilter,
    selectedStatus,
    selectedCuisine,
    selectedDietary,
    selectedPriceRange,
    selectedDistance,
    selectedRatingFilterModal,
    offersOnly,
    freeDelivery
  ]);

  useEffect(() => {
    fetchFavorites();
  }, [fetchFavorites]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // Force search on form submit regardless of word count
    setDebouncedSearchQuery(searchQuery);
  };

  const handleSearchInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchQuery(value);
    
    // Clear search if input is empty
    if (value.trim() === '') {
      setDebouncedSearchQuery('');
    }
  };

  const handleFavoriteToggle = (restaurantId: string) => {
    // Update the local state to reflect the change
    setRestaurants(prev => 
      prev.map(restaurant => 
        restaurant._id === restaurantId 
          ? { ...restaurant, isFavorite: !restaurant.isFavorite }
          : restaurant
      )
    );
    // Refresh the list to remove unfavorited restaurants
    fetchFavorites();
  };

  const handleViewMenu = (restaurant: Restaurant) => {
    navigate(`/restaurant/${restaurant._id}`);
  };

  const openFilterModal = () => {
    setTempStatus(selectedStatus);
    setTempCuisine(selectedCuisine);
    setTempDietary(selectedDietary);
    setTempPriceRange(selectedPriceRange);
    setTempDistance(selectedDistance);
    setTempRatingFilter(selectedRatingFilterModal);
    setTempOffersOnly(offersOnly);
    setTempFreeDelivery(freeDelivery);
    setShowFilterModal(true);
  };

  const applyFilters = () => {
    setSelectedStatus(tempStatus);
    setSelectedCuisine(tempCuisine);
    setSelectedDietary(tempDietary);
    setSelectedPriceRange(tempPriceRange);
    setSelectedDistance(tempDistance);
    setSelectedRatingFilterModal(tempRatingFilter);
    setOffersOnly(tempOffersOnly);
    setFreeDelivery(tempFreeDelivery);
    setShowFilterModal(false);
    
    // Smooth scroll to top when filters are applied
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  const clearFilters = () => {
    setSelectedStatus('all');
    setSelectedCuisine('all');
    setSelectedDietary('all');
    setSelectedPriceRange('all');
    setSelectedDistance('any');
    setSelectedRatingFilterModal('');
    setOffersOnly(false);
    setFreeDelivery(false);
    setSelectedVegFilter(false);
    setSelectedRatingFilter('');
    setSearchQuery('');
    setDebouncedSearchQuery('');
    
    // Smooth scroll to top when filters are cleared
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  // Get word count for search validation
  const wordCount = searchQuery.trim().split(/\s+/).filter(word => word.length > 0).length;
  const isSearchValid = wordCount >= 3 || searchQuery.trim() === '';

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <AnimatedLoader type="restaurant" size="large" className="mx-auto mb-6" />
          <p className="text-white text-lg font-medium">Loading favorite restaurants...</p>
          <p className="text-gray-400 text-sm mt-2">Finding your favorite places</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-400 text-4xl mb-4">⚠️</div>
          <h2 className="text-white text-xl font-semibold mb-2">Error Loading Favorites</h2>
          <p className="text-gray-400 mb-4">{error}</p>
          <button 
            onClick={fetchFavorites}
            className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-3 rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all duration-200 shadow-lg hover:shadow-xl"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Compact Hero Section */}
      <div ref={headerRef} className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-red-600/10 via-pink-600/10 to-purple-600/10"></div>
        <div className="relative bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 border-b border-slate-700/50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-8">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-r from-red-500 to-pink-500 rounded-full mb-4 shadow-lg">
                <HeartIcon className="w-6 h-6 text-white" filled={true} />
              </div>
              <h1 className="text-3xl md:text-4xl font-bold text-white mb-2 bg-gradient-to-r from-white via-gray-100 to-gray-300 bg-clip-text text-transparent">
                Favorite Restaurants
              </h1>
              <p className="text-gray-300 text-base md:text-lg max-w-2xl mx-auto leading-relaxed">
                Your saved restaurants and favorite places to eat.
              </p>
              <div className="flex items-center justify-center mt-4 space-x-4 text-gray-400">
                <div className="flex items-center space-x-2">
                  <StarIcon className="w-4 h-4 text-yellow-400" filled={true} />
                  <span className="text-sm">Personalized picks</span>
                </div>
                <div className="w-1 h-1 bg-gray-500 rounded-full"></div>
                <div className="flex items-center space-x-2">
                  <MapPin className="w-4 h-4 text-blue-400" />
                  <span className="text-sm">Quick access</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Always Sticky Search and Filter Header */}
      <div className="sticky-header sticky top-0 z-40 bg-slate-800/95 backdrop-blur-md border-b border-slate-700/50 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <div className="flex flex-col lg:flex-row gap-3 items-center">
            {/* Search Bar */}
            <div className="flex-1 w-full lg:w-auto">
              <form onSubmit={handleSearch} className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  ref={searchInputRef}
                  type="text"
                  value={searchQuery}
                  onChange={handleSearchInputChange}
                  placeholder="Search your favorite restaurants... (min 3 words)"
                  className={`w-full bg-slate-700 border rounded-xl pl-10 pr-4 py-2.5 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:border-transparent transition-all duration-200 text-sm ${
                    searchQuery.trim() !== '' && !isSearchValid 
                      ? 'border-orange-500 focus:ring-orange-500' 
                      : 'border-slate-600 focus:ring-blue-500'
                  }`}
                />
                {searchQuery.trim() !== '' && !isSearchValid && (
                  <div className="absolute -bottom-6 left-0 text-xs text-orange-400">
                    Type at least 3 words to search
                  </div>
                )}
              </form>
            </div>

            {/* Filter Controls */}
            <div className="flex flex-wrap gap-2">
              {/* Location */}
              <button className="flex items-center space-x-2 bg-slate-700 border border-slate-600 px-3 py-2.5 rounded-xl text-white hover:bg-slate-600 transition-all duration-200 text-xs font-medium shadow-sm hover:shadow-md">
                <MapPin className="w-3 h-3" />
                <span>Current Location</span>
              </button>

              {/* Filter Toggle */}
              <button 
                onClick={openFilterModal}
                className="flex items-center space-x-2 px-3 py-2.5 rounded-xl text-white transition-all duration-200 text-xs font-medium border bg-gradient-to-r from-blue-600 to-blue-700 border-blue-600 hover:from-blue-700 hover:to-blue-800 shadow-sm hover:shadow-md"
              >
                <FilterIcon className="w-3 h-3" />
                <span>Filters</span>
              </button>

              {/* View Toggle */}
              <div className="flex bg-slate-700 rounded-xl p-1 border border-slate-600">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 ${
                    viewMode === 'grid'
                      ? 'bg-blue-600 text-white shadow-sm'
                      : 'text-gray-300 hover:text-white'
                  }`}
                >
                  Grid
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 ${
                    viewMode === 'list'
                      ? 'bg-blue-600 text-white shadow-sm'
                      : 'text-gray-300 hover:text-white'
                  }`}
                >
                  List
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Compact Quick Filters - Always visible */}
        <QuickFilters
          selectedVegFilter={selectedVegFilter}
          onVegFilterChange={setSelectedVegFilter}
          selectedRatingFilter={selectedRatingFilter}
          onRatingFilterChange={setSelectedRatingFilter}
          className="border-t border-slate-700/50"
        />
      </div>

      {/* Restaurant Display with smooth scrolling */}
      <div className="pb-8">
        <RestaurantDisplay
          restaurants={restaurants}
          viewMode={viewMode}
          onFavoriteToggle={handleFavoriteToggle}
          onViewMenu={handleViewMenu}
          onClearFilters={clearFilters}
        />
      </div>

      {/* Enhanced Filter Modal */}
      {showFilterModal && (
        <FilterModal
          tempStatus={tempStatus}
          setTempStatus={setTempStatus}
          tempCuisine={tempCuisine}
          setTempCuisine={setTempCuisine}
          tempDietary={tempDietary}
          setTempDietary={setTempDietary}
          tempPriceRange={tempPriceRange}
          setTempPriceRange={setTempPriceRange}
          tempDistance={tempDistance}
          setTempDistance={setTempDistance}
          tempRatingFilter={tempRatingFilter}
          setTempRatingFilter={setTempRatingFilter}
          tempOffersOnly={tempOffersOnly}
          setTempOffersOnly={setTempOffersOnly}
          tempFreeDelivery={tempFreeDelivery}
          setTempFreeDelivery={setTempFreeDelivery}
          onApply={applyFilters}
          onCancel={() => setShowFilterModal(false)}
          onClear={clearFilters}
        />
      )}
    </div>
  );
};

export default FavoritesPage;
