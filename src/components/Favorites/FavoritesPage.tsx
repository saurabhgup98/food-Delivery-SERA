import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { AnimatedLoader } from '../Loader';
import ExploreHeader from '../Common/ExploreHeader';
import QuickFilters from '../Common/QuickFilters';
import RestaurantDisplay from '../Common/RestaurantDisplay';
import FilterModal from '../Common/FilterModal';
import { apiService, Restaurant } from '../../services/api';
import { MapPin, X, Search } from 'lucide-react';
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
  const [isHeaderSticky, setIsHeaderSticky] = useState(false);
  const headerRef = useRef<HTMLDivElement>(null);

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

  // Handle scroll for sticky header
  useEffect(() => {
    const handleScroll = () => {
      if (headerRef.current) {
        const rect = headerRef.current.getBoundingClientRect();
        setIsHeaderSticky(rect.bottom <= 0);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const fetchFavorites = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      console.log('Fetching favorite restaurants...');
      const params: any = {
        favorites: true // This will filter only favorite restaurants
      };
      if (searchQuery) params.search = searchQuery;
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
    searchQuery,
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
    fetchFavorites();
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
    
    // Smooth scroll to top when filters are cleared
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

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
      {/* Hero Section */}
      <div ref={headerRef} className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-red-600/20 via-pink-600/20 to-purple-600/20"></div>
        <div className="relative bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 border-b border-slate-700/50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-red-500 to-pink-500 rounded-full mb-6 shadow-lg">
                <HeartIcon className="w-8 h-8 text-white" filled={true} />
              </div>
              <h1 className="text-4xl md:text-6xl font-bold text-white mb-4 bg-gradient-to-r from-white via-gray-100 to-gray-300 bg-clip-text text-transparent">
                Favorite Restaurants
              </h1>
              <p className="text-gray-300 text-lg md:text-xl max-w-3xl mx-auto leading-relaxed">
                Your saved restaurants and favorite places to eat. Discover your culinary journey with our curated collection of beloved dining spots.
              </p>
              <div className="flex items-center justify-center mt-6 space-x-4 text-gray-400">
                <div className="flex items-center space-x-2">
                  <StarIcon className="w-5 h-5 text-yellow-400" filled={true} />
                  <span>Personalized picks</span>
                </div>
                <div className="w-1 h-1 bg-gray-500 rounded-full"></div>
                <div className="flex items-center space-x-2">
                  <MapPin className="w-5 h-5 text-blue-400" />
                  <span>Quick access</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Sticky Search and Filter Header */}
      <div className={`transition-all duration-300 ${isHeaderSticky ? 'fixed top-0 left-0 right-0 z-40 bg-slate-800/95 backdrop-blur-md border-b border-slate-700/50 shadow-lg' : 'bg-slate-800 border-b border-slate-700'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col lg:flex-row gap-4 items-center">
            {/* Search Bar */}
            <div className="flex-1 w-full lg:w-auto">
              <form onSubmit={handleSearch} className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search your favorite restaurants..."
                  className="w-full bg-slate-700 border border-slate-600 rounded-xl pl-10 pr-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                />
              </form>
            </div>

            {/* Filter Controls */}
            <div className="flex flex-wrap gap-3">
              {/* Location */}
              <button className="flex items-center space-x-2 bg-slate-700 border border-slate-600 px-4 py-3 rounded-xl text-white hover:bg-slate-600 transition-all duration-200 text-sm font-medium shadow-sm hover:shadow-md">
                <MapPin className="w-4 h-4" />
                <span>Current Location</span>
              </button>

              {/* Filter Toggle */}
              <button 
                onClick={openFilterModal}
                className="flex items-center space-x-2 px-4 py-3 rounded-xl text-white transition-all duration-200 text-sm font-medium border bg-gradient-to-r from-blue-600 to-blue-700 border-blue-600 hover:from-blue-700 hover:to-blue-800 shadow-sm hover:shadow-md"
              >
                <FilterIcon className="w-4 h-4" />
                <span>Filters</span>
              </button>

              {/* View Toggle */}
              <div className="flex bg-slate-700 rounded-xl p-1 border border-slate-600">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                    viewMode === 'grid'
                      ? 'bg-blue-600 text-white shadow-sm'
                      : 'text-gray-300 hover:text-white'
                  }`}
                >
                  Grid
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
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

        {/* Quick Filters - Always visible when sticky */}
        <QuickFilters
          selectedVegFilter={selectedVegFilter}
          onVegFilterChange={setSelectedVegFilter}
          selectedRatingFilter={selectedRatingFilter}
          onRatingFilterChange={setSelectedRatingFilter}
          className="border-t border-slate-700/50"
        />
      </div>

      {/* Content with top padding when header is sticky */}
      <div className={isHeaderSticky ? 'pt-32' : ''}>
        {/* Restaurant Display */}
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
