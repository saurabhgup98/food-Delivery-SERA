import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { AnimatedLoader } from '../Loader';
import ExploreHeader from '../Common/ExploreHeader';
import QuickFilters from '../Common/QuickFilters';
import RestaurantDisplay from '../Common/RestaurantDisplay';
import FilterModal from '../Common/FilterModal';
import { apiService, Restaurant } from '../../services/api';

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
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
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
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-400 text-4xl mb-4">⚠️</div>
          <h2 className="text-white text-xl font-semibold mb-2">Error Loading Favorites</h2>
          <p className="text-gray-400 mb-4">{error}</p>
          <button 
            onClick={fetchFavorites}
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
              Favorite Restaurants
            </h1>
            <p className="text-gray-300 text-lg max-w-2xl mx-auto">
              Your saved restaurants and favorite places to eat
            </p>
          </div>
        </div>
      </div>

      {/* Search and Filter Header */}
      <ExploreHeader
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onSearchSubmit={handleSearch}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        onFilterClick={openFilterModal}
      />

      {/* Quick Filters */}
      <QuickFilters
        selectedVegFilter={selectedVegFilter}
        onVegFilterChange={setSelectedVegFilter}
        selectedRatingFilter={selectedRatingFilter}
        onRatingFilterChange={setSelectedRatingFilter}
      />

      {/* Restaurant Display */}
      <RestaurantDisplay
        restaurants={restaurants}
        viewMode={viewMode}
        onFavoriteToggle={handleFavoriteToggle}
        onViewMenu={handleViewMenu}
        onClearFilters={clearFilters}
      />

      {/* Filter Modal */}
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
