import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { apiService } from '../services/api';
import StateDisplay from '../components/common/StateDisplay';
import PrimaryCenteredActionBtn from '../components/Button/PrimaryCenteredActionBtn';
import RestaurantsSearchAndFilterHeader from '../components/Header/RestaurantsSearchAndFilterHeader';
import SectionHeadingSecondary from '../components/Header/SectionHeadingSecondary';
import RestaurantFilterModal from '../components/Modals/RestaurantFilterModal';
import { RestaurantI } from '../components/Restaurant/Config/RestaurantInterfaces';
import { INITIAL_FILTERS, resetFilters } from './constant/ExploreConstants';
import { ExploreFiltersI } from './interfaces/ExploreInterfaces';
import { getCompactHeroProps, getRestaurantDisplayHeaderProps } from './config/ExploreConfig';
import RestaurantGridViewCard from '../components/Explore/RestaurantGridViewCard';
import RestaurantListViewCard from '../components/Explore/RestaurantListViewCard';
import ItemContainer from '../components/common/ItemContainer';
import { getRestaurantButtonProps, RestaurantButtonType } from '../components/Restaurant/Config/RestaurantButtonConfig';

const ExplorePage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Get mode from URL parameters
  const searchParams = new URLSearchParams(location.search);
  const mode = (searchParams.get('mode') || 'all') as 'all' | 'favorites';

  const [showFilterModal, setShowFilterModal] = useState(false);
  const [restaurants, setRestaurants] = useState<RestaurantI[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  // Single filters state object
  const [filters, setFilters] = useState<ExploreFiltersI>(INITIAL_FILTERS);

  // Search input ref and validation
  const searchInputRef = useRef<HTMLInputElement>(null);

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
  const wordCount = filters.search.trim().split(/\s+/).filter(word => word.length > 0).length;
  const isSearchValid = wordCount >= 3 || filters.search.trim() === '';

  const handleSearchInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setFilters(prev => ({ ...prev, search: value }));
  };

  // Fetch restaurants from backend
  const fetchRestaurants = async (filtersToUse: ExploreFiltersI, modeToUse: 'all' | 'favorites') => {
    try {
      setLoading(true);
      setError(null);
      const response = await apiService.fetchRestaurantsWithFilters(filtersToUse, modeToUse);
      if (response.success) {
        setRestaurants(response.data.restaurants);
      } else {
        setError('Failed to fetch restaurants');
      }
    } catch (err: any) {
      setError(`Failed to load restaurants: ${err?.message || 'Unknown error'}`);
    } finally {
      setLoading(false);
    }
  };

  // Handle URL search parameters
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const searchParam = params.get('search');
    if (searchParam) {
      setFilters(prev => ({ ...prev, search: searchParam }));
    }
  }, [location.search]);

  // Fetch restaurants on component mount and when filters or mode change
  useEffect(() => {
    fetchRestaurants(filters, mode);
  }, [filters, mode]);

  const handleFavoriteToggle = (id: string) => {
    setRestaurants(prev =>
      prev.map(restaurant =>
        restaurant._id === id
          ? { ...restaurant, isFavorite: !restaurant.isFavorite }
          : restaurant
      )
    );
  };

  const handleViewMenu = (restaurant: RestaurantI) => {
    navigate(`/restaurant/${restaurant._id}`);
  };

  const handleSearch = (query: string) => {
    setFilters(prev => ({ ...prev, search: query }));
  };

  const handleOpenFilterModal = () => {
    setShowFilterModal(true);
  };

  const clearFilters = () => {
    setFilters(resetFilters());
    setIsHeaderVisible(true);
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  const handleApplyFilters = (filterData: { status: string; cuisine: string[]; dietary: string[]; priceRange: string; distance: string; ratingFilter: string; offersOnly: boolean; freeDelivery: boolean }) => {
    setFilters(prev => ({
      ...prev,
      status: filterData.status,
      cuisine: filterData.cuisine,
      dietary: filterData.dietary,
      priceRange: filterData.priceRange,
      distance: filterData.distance,
      ratingFilter: filterData.ratingFilter,
      offersOnly: filterData.offersOnly,
      freeDelivery: filterData.freeDelivery,
    }));
    setShowFilterModal(false);
    setIsHeaderVisible(true);
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  const handleRatingFilter = (rating: string) => {
    setFilters(prev => ({ ...prev, ratingFilter: rating }));
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <StateDisplay
          status="loading"
          config={{
            text: "Loading restaurants...",
            subtext: "Discovering amazing food near you",
            loadingType: "restaurant"
          }}
          size="xl"
          containerClassName="bg-transparent border-none"
        />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <StateDisplay
          status="error"
          config={{
            icon: '⚠️',
            text: "Error Loading Restaurants",
            subtext: error,
            button: React.createElement(PrimaryCenteredActionBtn, {
              onClick: () => fetchRestaurants(filters, mode),
              text: "Try Again",
              size: "md"
            })
          }}
          size="xl"
          containerClassName="bg-transparent border-none"
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">

      {/* Compact Hero Section - Positioned below main header */}
      <SectionHeadingSecondary {...getCompactHeroProps(mode)} />

      {/* Smart Sticky Search and Filter Header */}
      <RestaurantsSearchAndFilterHeader
        searchQuery={filters.search}
        onSearchInputChange={handleSearchInputChange}
        onSearch={handleSearch}
        onOpenFilterModal={handleOpenFilterModal}
        onViewModeChange={setViewMode}
        viewMode={viewMode}
        isSearchValid={isSearchValid}
        isHeaderVisible={isHeaderVisible}
        selectedVegFilter={filters.vegFilter}
        onVegFilterChange={(value) => setFilters(prev => ({ ...prev, vegFilter: value }))}
        selectedRatingFilter={filters.ratingFilter}
        onRatingFilterChange={handleRatingFilter}
        offersOnly={filters.offersOnly}
        onOffersOnlyChange={(value) => setFilters(prev => ({ ...prev, offersOnly: value }))}
        freeDelivery={filters.freeDelivery}
        onFreeDeliveryChange={(value) => setFilters(prev => ({ ...prev, freeDelivery: value }))}
      />

      {/* Enhanced Filter Modal */}
      {showFilterModal && (
        <RestaurantFilterModal
          initialFilters={{
            status: filters.status,
            cuisine: filters.cuisine,
            dietary: filters.dietary,
            priceRange: filters.priceRange,
            distance: filters.distance,
            ratingFilter: filters.ratingFilter,
            offersOnly: filters.offersOnly,
            freeDelivery: filters.freeDelivery,
          }}
          onApply={handleApplyFilters}
          onCancel={() => setShowFilterModal(false)}
          onClear={clearFilters}
        />
      )}

      {/* Restaurant Display with smooth scrolling */}
      <div className={`pb-8 ${mode === 'favorites' ? 'pt-4' : 'pt-4'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-4 md:px-6 lg:px-8">
          {/* Container with border and radius */}
          <div className="bg-dark-800 border border-dark-700 rounded-xl overflow-hidden shadow-lg">
            {/* Results Header  */}
            <div className="w-full h-20">
              <ItemContainer {...getRestaurantDisplayHeaderProps(restaurants.length)} />
            </div>

            {/* Content Area */}
            <div className="p-4 sm:p-6 lg:p-8">
              {restaurants.length === 0 ? (
                <div className="text-center py-12">
                  <div className="text-gray-400 text-6xl mb-4">🍽️</div>
                  <h2 className="text-white text-2xl font-semibold mb-2">No restaurants found</h2>
                  <p className="text-gray-400 mb-6">Try adjusting your search or filters</p>
                  <PrimaryCenteredActionBtn
                    {...getRestaurantButtonProps(RestaurantButtonType.RESTAURANT_CLEAR_FILTERS, clearFilters)}
                  />
                </div>
              ) : (
                <div className={viewMode === 'grid'
                  ? 'restaurant-grid grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6'
                  : 'space-y-4'
                }>
                  {restaurants.map(restaurant => (
                    viewMode === 'grid' ? (
                      <RestaurantGridViewCard
                        key={restaurant._id}
                        restaurant={restaurant}
                        onFavoriteToggle={handleFavoriteToggle}
                        onViewMenu={handleViewMenu}
                      />
                    ) : (
                      <RestaurantListViewCard
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
        </div>
      </div>
    </div>
  );
};

export default ExplorePage;