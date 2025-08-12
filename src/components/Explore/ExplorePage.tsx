import React, { useState, useMemo } from 'react';
import { restaurants, cuisines, dietaryOptions, sortOptions, Restaurant } from '../../data/restaurants';
import RestaurantCard from './RestaurantCard';
import RestaurantListItem from './RestaurantListItem';

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
  const [restaurantData, setRestaurantData] = useState(restaurants);

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
      default: // distance
        filtered.sort((a, b) => {
          const aDist = parseFloat(a.distance.replace(' km', ''));
          const bDist = parseFloat(b.distance.replace(' km', ''));
          return aDist - bDist;
        });
    }

    return filtered;
  }, [restaurantData, searchQuery, selectedDietary, selectedCuisines, selectedSort, selectedRating, showOffers, showFreeDelivery, selectedFavorites]);

  // Handle favorite toggle
  const handleFavoriteToggle = (id: string) => {
    setRestaurantData(prev => 
      prev.map(restaurant => 
        restaurant.id === id 
          ? { ...restaurant, isFavorite: !restaurant.isFavorite }
          : restaurant
      )
    );
  };

  // Handle view menu
  const handleViewMenu = (restaurant: Restaurant) => {
    console.log('View menu for:', restaurant.name);
    // TODO: Navigate to restaurant menu page
  };

  // Handle cuisine filter toggle
  const handleCuisineToggle = (cuisine: string) => {
    setSelectedCuisines(prev => 
      prev.includes(cuisine) 
        ? prev.filter(c => c !== cuisine)
        : [...prev, cuisine]
    );
  };

  return (
    <div className="min-h-screen bg-dark-900">
      {/* Header Section */}
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
      <div className="sticky top-16 z-40 bg-dark-800 border-b border-dark-700 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2 sm:py-3">
          <div className="flex flex-col lg:flex-row gap-2 sm:gap-3 items-center">
            {/* Search Input */}
            <div className="flex-1 w-full lg:w-auto">
              <div className="relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search restaurants, cuisines, or dishes..."
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
                  {option.label}
                </option>
              ))}
            </select>

            {/* Favorites Dropdown */}
            <select 
              value={selectedFavorites}
              onChange={(e) => setSelectedFavorites(e.target.value as 'all' | 'favorites' | 'recently-viewed' | 'popular')}
              className="bg-dark-700 border border-dark-600 rounded-lg px-3 sm:px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-sera-blue text-sm sm:text-base"
            >
              <option value="all">All Restaurants</option>
              <option value="favorites">❤️ Favorites</option>
              <option value="recently-viewed">🕒 Recently Viewed</option>
              <option value="popular">🔥 Popular</option>
            </select>

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
                <button className="px-1.5 sm:px-2 lg:px-3 py-0.5 sm:py-1 lg:py-1.5 bg-dark-600 text-gray-300 rounded-full text-xs sm:text-sm font-medium hover:bg-dark-500 hover:text-white transition-all duration-200 hover:scale-105 whitespace-nowrap">
                  More...
                </button>
              </div>
            </div>

            {/* Separator */}
            <div className="w-px h-3 sm:h-4 lg:h-5 bg-dark-600 mx-0.5 sm:mx-1"></div>

            {/* Additional Filters */}
            <div className="flex items-center gap-0.5 sm:gap-1">
              <button
                onClick={() => setSelectedRating(selectedRating === 4 ? 0 : 4)}
                className={`px-1.5 sm:px-2 lg:px-3 py-0.5 sm:py-1 lg:py-1.5 rounded-full text-xs sm:text-sm font-medium transition-all duration-200 hover:scale-105 flex items-center whitespace-nowrap ${
                  selectedRating === 4
                    ? 'bg-gradient-to-r from-yellow-500 to-yellow-600 text-white shadow-sm'
                    : 'bg-dark-600 text-gray-300 hover:bg-dark-500 hover:text-white'
                }`}
              >
                ⭐ 4+
              </button>
              <button
                onClick={() => setShowFreeDelivery(!showFreeDelivery)}
                className={`px-1.5 sm:px-2 lg:px-3 py-0.5 sm:py-1 lg:py-1.5 rounded-full text-xs sm:text-sm font-medium transition-all duration-200 hover:scale-105 flex items-center whitespace-nowrap ${
                  showFreeDelivery
                    ? 'bg-gradient-to-r from-green-500 to-green-600 text-white shadow-sm'
                    : 'bg-dark-600 text-gray-300 hover:bg-dark-500 hover:text-white'
                }`}
              >
                🚚 Free
              </button>
              <button
                onClick={() => setShowOffers(!showOffers)}
                className={`px-1.5 sm:px-2 lg:px-3 py-0.5 sm:py-1 lg:py-1.5 rounded-full text-xs sm:text-sm font-medium transition-all duration-200 hover:scale-105 flex items-center whitespace-nowrap ${
                  showOffers
                    ? 'bg-gradient-to-r from-purple-500 to-purple-600 text-white shadow-sm'
                    : 'bg-dark-600 text-gray-300 hover:bg-dark-500 hover:text-white'
                }`}
              >
                🎉 Offers
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                 {/* Quick Stats */}
         <div className="mb-6">
           <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
             <div className="text-white">
               <span className="text-gray-400">Showing </span>
               <span className="font-semibold">{filteredRestaurants.length} restaurants</span>
               <span className="text-gray-400"> near you</span>
             </div>
             <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-3 sm:space-y-0 sm:space-x-4 lg:space-x-6 text-sm">
               {/* Sort by - Enhanced styling */}
               <div className="flex items-center space-x-2 bg-gradient-to-r from-dark-700 to-dark-600 px-2 py-1.5 rounded-lg border border-dark-600 shadow-sm w-full sm:w-auto">
                 <svg className="w-3 h-3 text-sera-blue flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4h13M3 8h9m-9 4h6m4 0l4-4m0 0l4 4m-4-4v12" />
                 </svg>
                 <span className="text-gray-300 font-medium text-xs">Sort by:</span>
                 <span className="text-white font-semibold bg-sera-blue/20 px-1.5 py-0.5 rounded-md text-xs truncate">
                   {sortOptions.find(opt => opt.value === selectedSort)?.label}
                 </span>
               </div>
               
               {/* Filtered by - Enhanced styling */}
               {selectedDietary && (
                 <div className="flex items-center space-x-2 bg-gradient-to-r from-dark-700 to-dark-600 px-2 py-1.5 rounded-lg border border-dark-600 shadow-sm w-full sm:w-auto">
                   <svg className="w-3 h-3 text-sera-orange flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.207A1 1 0 013 6.5V4z" />
                   </svg>
                   <span className="text-gray-300 font-medium text-xs">Filtered by:</span>
                   <span className="text-white font-semibold bg-sera-orange/20 px-1.5 py-0.5 rounded-md text-xs truncate">
                     {dietaryOptions.find(opt => opt.value === selectedDietary)?.label}
                   </span>
                 </div>
               )}
             </div>
           </div>
         </div>

                 {/* Content Based on View Mode */}
         {viewMode === 'grid' && (
           <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
             {filteredRestaurants.length > 0 ? (
               filteredRestaurants.map(restaurant => (
                 <RestaurantCard
                   key={restaurant.id}
                   restaurant={restaurant}
                   onFavoriteToggle={handleFavoriteToggle}
                   onViewMenu={handleViewMenu}
                 />
               ))
             ) : (
               <div className="col-span-full text-center py-12">
                 <div className="text-gray-400 text-lg mb-2">No restaurants found</div>
                 <p className="text-gray-500">Try adjusting your filters or search terms</p>
               </div>
             )}
           </div>
         )}

                 {viewMode === 'list' && (
           <div className="space-y-4">
             {filteredRestaurants.length > 0 ? (
               filteredRestaurants.map(restaurant => (
                 <RestaurantListItem
                   key={restaurant.id}
                   restaurant={restaurant}
                   onFavoriteToggle={handleFavoriteToggle}
                   onViewMenu={handleViewMenu}
                 />
               ))
             ) : (
               <div className="text-center py-12">
                 <div className="text-gray-400 text-lg mb-2">No restaurants found</div>
                 <p className="text-gray-500">Try adjusting your filters or search terms</p>
               </div>
             )}
           </div>
         )}

        {viewMode === 'map' && (
          <div className="bg-dark-700 rounded-lg h-96 flex items-center justify-center">
            <div className="text-center">
              <svg className="w-16 h-16 text-gray-500 mx-auto mb-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
              </svg>
              <p className="text-gray-400">Map View - Coming Soon</p>
              <p className="text-gray-500 text-sm">Interactive map showing restaurant locations</p>
            </div>
          </div>
        )}

        {/* Load More Button */}
        <div className="mt-8 text-center">
          <button className="px-8 py-3 bg-dark-700 text-white rounded-lg hover:bg-dark-600 transition-colors">
            Load More Restaurants
          </button>
        </div>
      </div>

      {/* Quick Actions Floating Button */}
      <div className="fixed bottom-6 right-6">
        <button className="w-14 h-14 bg-sera-blue text-white rounded-full shadow-lg hover:bg-sera-blue/80 transition-colors flex items-center justify-center">
          <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default ExplorePage;
