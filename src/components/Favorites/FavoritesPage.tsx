import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { AnimatedLoader } from '../Loader';
import QuickFilters from '../Common/QuickFilters';
import RestaurantDisplay from '../Common/RestaurantDisplay';
import FilterModal from '../Common/FilterModal';
import { apiService, Restaurant } from '../../services/api';
import { MapPin, Search, X } from 'lucide-react';
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

  // Smart sticky header state
  const [isHeaderVisible, setIsHeaderVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  // Handle scroll for smart sticky header
  useEffect(() => {
    let ticking = false;
    
    const handleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          const currentScrollY = window.scrollY;
          
          // Show header if scrolling up (even 1px) or at the top
          if (currentScrollY < lastScrollY || currentScrollY <= 0) {
            setIsHeaderVisible(true);
          } 
          // Hide header if scrolling down and not at the top
          else if (currentScrollY > lastScrollY && currentScrollY > 100) {
            setIsHeaderVisible(false);
          }
          
          setLastScrollY(currentScrollY);
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

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

  // Auto-search when word count reaches 3
  useEffect(() => {
    const wordCount = searchQuery.trim().split(/\s+/).filter(word => word.length > 0).length;
    if (wordCount >= 3) {
      setDebouncedSearchQuery(searchQuery);
    }
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
    // Force search on form submit regardless of word count and show header
    setDebouncedSearchQuery(searchQuery);
    setIsHeaderVisible(true);
  };

  const handleSearchInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchQuery(value);
    
    // Clear search if input is empty
    if (value.trim() === '') {
      setDebouncedSearchQuery('');
    }
  };

  const clearSearch = () => {
    setSearchQuery('');
    setDebouncedSearchQuery('');
    if (searchInputRef.current) {
      searchInputRef.current.focus();
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
    
    // Show header and scroll to top when filters are applied
    setIsHeaderVisible(true);
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
    
    // Show header and scroll to top when filters are cleared
    setIsHeaderVisible(true);
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
      {/* Compact Hero Section - Positioned below main header */}
      <div ref={headerRef} className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-sera-pink/20 via-sera-orange/20 to-sera-pink/20"></div>
        <div className="relative bg-gradient-to-r from-sera-pink to-sera-orange border-b border-slate-700/50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 md:py-6">
            <div className="text-center">
              {/* Hero Content - Compact Layout */}
              <div className="flex flex-col lg:flex-row items-center justify-center gap-3 lg:gap-4 mb-3">
                {/* Love Icon - Only on large screens, horizontal with text */}
                <div className="hidden lg:flex items-center gap-3">
                  <div className="inline-flex items-center justify-center w-8 h-8 bg-white/20 backdrop-blur-sm rounded-full shadow-lg border border-white/30">
                    <HeartIcon className="w-4 h-4 text-white" filled={true} />
                  </div>
                </div>
                
                {/* Main Title */}
                <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-white">
                  Favorite Restaurants
                </h1>
              </div>
              
              {/* Description */}
              <p className="text-white/90 text-sm md:text-base max-w-2xl mx-auto leading-relaxed mb-3">
                Your saved restaurants and favorite places to eat.
              </p>
              
              {/* Features */}
              <div className="flex items-center justify-center space-x-4 text-white/80">
                <div className="flex items-center space-x-2">
                  <StarIcon className="w-3 h-3 text-yellow-400" filled={true} />
                  <span className="text-xs">Personalized picks</span>
                </div>
                <div className="w-1 h-1 bg-gray-500 rounded-full"></div>
                <div className="flex items-center space-x-2">
                  <MapPin className="w-3 h-3 text-blue-400" />
                  <span className="text-xs">Quick access</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Smart Sticky Search and Filter Header */}
      <div className={`sticky top-16 z-40 bg-slate-800/95 backdrop-blur-md border-b border-slate-700/50 shadow-lg transition-transform duration-300 ease-in-out ${
        isHeaderVisible ? 'translate-y-0' : '-translate-y-full'
      }`}>
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
                  className={`w-full bg-slate-700 border rounded-xl pl-10 pr-10 py-2.5 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:border-transparent transition-all duration-200 text-sm ${
                    searchQuery.trim() !== '' && !isSearchValid 
                      ? 'border-orange-500 focus:ring-orange-500' 
                      : 'border-slate-600 focus:ring-blue-500'
                  }`}
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={clearSearch}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 hover:text-white transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
                {searchQuery.trim() !== '' && !isSearchValid && (
                  <div className="absolute top-full left-0 mt-1 text-xs text-orange-400 z-10 bg-slate-800 px-2 py-1 rounded border border-orange-500/50">
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
