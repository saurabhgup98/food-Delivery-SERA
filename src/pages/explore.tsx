import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  Search,
  MapPin,
  X
} from 'lucide-react';
import QuickFilters from '../components/Common/QuickFilters';
import RestaurantDisplay from '../components/Common/RestaurantDisplay';
import FilterModal from '../components/Common/FilterModal';
import FilterIcon from '../components/Icons/FilterIcon';
import { apiService, Restaurant } from '../services/api';
import { AnimatedLoader } from '../components/Loader';

// Debounce hook for search
const useDebounce = (value: string, delay: number) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    // Only debounce if the value has at least 3 characters or is empty
    if (value.length >= 3 || value.length === 0) {
      const handler = setTimeout(() => {
        setDebouncedValue(value);
      }, delay);

      return () => {
        clearTimeout(handler);
      };
    }
  }, [value, delay]);

  return debouncedValue;
};

const ExplorePage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
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
  
  // Filter states for modal (not applied until user clicks Apply)
  const [tempCuisine, setTempCuisine] = useState('all');
  const [tempStatus, setTempStatus] = useState('all');
  const [tempDietary, setTempDietary] = useState('all');
  const [tempPriceRange, setTempPriceRange] = useState('all');
  const [tempDistance, setTempDistance] = useState('any');
  const [tempRatingFilter, setTempRatingFilter] = useState('4+');
  const [tempOffersOnly, setTempOffersOnly] = useState(false);
  const [tempFreeDelivery, setTempFreeDelivery] = useState(false);
  
  // Quick filter states
  const [selectedVegFilter, setSelectedVegFilter] = useState(false);
  const [selectedRatingFilter, setSelectedRatingFilter] = useState('4+');
  const [offersOnly, setOffersOnly] = useState(false);
  const [freeDelivery, setFreeDelivery] = useState(false);

  // Search input ref and validation
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Debounced search query
  const debouncedSearchQuery = useDebounce(searchQuery, 500);

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
          if (currentScrollY < lastScrollY || currentScrollY <= 100) {
            setIsHeaderVisible(true);
          } 
          // Hide header if scrolling down and not at the top
          else if (currentScrollY > lastScrollY && currentScrollY > 200) {
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

  // Search validation
  const wordCount = searchQuery.trim().split(/\s+/).filter(word => word.length > 0).length;
  const isSearchValid = wordCount >= 3 || searchQuery.trim() === '';

  const handleSearchInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchQuery(value);
  };

  const clearSearch = () => {
    setSearchQuery('');
    if (searchInputRef.current) {
      searchInputRef.current.focus();
    }
  };

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



  // Handle URL search parameters
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const searchParam = params.get('search');
    if (searchParam) {
      setSearchQuery(searchParam);
    }
  }, [location.search]);

  // Fetch restaurants on component mount and when filters change
  useEffect(() => {
    fetchRestaurants();
  }, [fetchRestaurants]);

  // Scroll to top when search query changes and results update
  useEffect(() => {
    if (debouncedSearchQuery && restaurants.length > 0) {
      // Only scroll if we're not already at the top
      if (window.scrollY > 100) {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    }
  }, [debouncedSearchQuery, restaurants.length]);

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
    // Force search on form submit regardless of word count and show header
    setIsHeaderVisible(true);
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
    
    // Clear temp filters
    setTempCuisine('all');
    setTempStatus('all');
    setTempDietary('all');
    setTempPriceRange('all');
    setTempDistance('any');
    setTempRatingFilter('4+');
    setTempOffersOnly(false);
    setTempFreeDelivery(false);
    
    // Show header and scroll to top when filters are cleared
    setIsHeaderVisible(true);
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  const applyFilters = () => {
    // Apply temp filters to actual filters
    setSelectedCuisine(tempCuisine);
    setSelectedStatus(tempStatus);
    setSelectedDietary(tempDietary);
    setSelectedPriceRange(tempPriceRange);
    setSelectedDistance(tempDistance);
    setSelectedRatingFilter(tempRatingFilter);
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

  const handleRatingFilter = (rating: string) => {
    setSelectedRatingFilter(rating);
    // Rating filter is applied automatically via useEffect
  };

  const openFilterModal = () => {
    // Initialize temp filters with current applied filters
    setTempCuisine(selectedCuisine);
    setTempStatus(selectedStatus);
    setTempDietary(selectedDietary);
    setTempPriceRange(selectedPriceRange);
    setTempDistance(selectedDistance);
    setTempRatingFilter(selectedRatingFilter);
    setTempOffersOnly(offersOnly);
    setTempFreeDelivery(freeDelivery);
    setShowFilterModal(true);
  };



  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="text-center">
          <AnimatedLoader type="restaurant" size="large" className="mx-auto mb-6" />
          <p className="text-white text-lg font-medium">Loading restaurants...</p>
          <p className="text-gray-400 text-sm mt-2">Discovering amazing food near you</p>
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
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Compact Hero Section - Positioned below main header */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-sera-pink/20 via-sera-orange/20 to-sera-pink/20"></div>
        <div className="relative bg-gradient-to-r from-sera-pink to-sera-orange border-b border-slate-700/50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 md:py-6">
            <div className="text-center">
              {/* Hero Content - Compact Layout */}
              <div className="flex flex-col lg:flex-row items-center justify-center gap-3 lg:gap-4 mb-3">
                {/* Search Icon - Only on large screens, horizontal with text */}
                <div className="hidden lg:flex items-center gap-3">
                  <div className="inline-flex items-center justify-center w-8 h-8 bg-white/20 backdrop-blur-sm rounded-full shadow-lg border border-white/30">
                    <Search className="w-4 h-4 text-white" />
                  </div>
                </div>
                
                {/* Main Title */}
                <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-white">
                  Explore Restaurants
                </h1>
              </div>
              
              {/* Description */}
              <p className="text-white/90 text-sm md:text-base max-w-2xl mx-auto leading-relaxed mb-3">
                Discover amazing food from the best restaurants near you.
              </p>
              
              {/* Features */}
              <div className="flex items-center justify-center space-x-4 text-white/80">
                <div className="flex items-center space-x-2">
                  <svg className="w-3 h-3 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                  </svg>
                  <span className="text-xs">Top rated</span>
                </div>
                <div className="w-1 h-1 bg-gray-500 rounded-full"></div>
                <div className="flex items-center space-x-2">
                  <MapPin className="w-3 h-3 text-blue-400" />
                  <span className="text-xs">Near you</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Smart Sticky Search and Filter Header */}
      <div className={`sticky top-16 z-40 bg-slate-800/95 backdrop-blur-md border-b border-slate-700/50 shadow-lg transition-transform duration-400 ease-in-out ${
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
                  placeholder="Search restaurants, cuisines, or dishes... (min 3 words)"
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
    </div>
  );
};

export default ExplorePage;