import React from 'react';
import RestaurantCard from '../Explore/RestaurantCard';
import RestaurantListItem from '../Explore/RestaurantListItem';
import { Restaurant } from '../../services/api';

interface RestaurantDisplayProps {
  restaurants: Restaurant[];
  viewMode: 'grid' | 'list';
  onFavoriteToggle: (restaurantId: string) => void;
  onViewMenu: (restaurant: Restaurant) => void;
  onClearFilters?: () => void;
  className?: string;
}

const RestaurantDisplay: React.FC<RestaurantDisplayProps> = ({
  restaurants,
  viewMode,
  onFavoriteToggle,
  onViewMenu,
  onClearFilters,
  className = ""
}) => {
  return (
    <div className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 ${className}`}>
      {/* Results Header */}
      <div className="flex justify-between items-center mb-4">
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
          {onClearFilters && (
            <button
              onClick={onClearFilters}
              className="bg-sera-blue text-white px-6 py-3 rounded-lg hover:bg-sera-blue/80 transition-colors"
            >
              Clear Filters
            </button>
          )}
        </div>
      ) : (
        <div className={viewMode === 'grid' 
          ? 'restaurant-grid grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4'
          : 'space-y-4'
        }>
          {restaurants.map(restaurant => (
            viewMode === 'grid' ? (
              <RestaurantCard
                key={restaurant._id}
                restaurant={restaurant}
                onFavoriteToggle={onFavoriteToggle}
                onViewMenu={onViewMenu}
              />
            ) : (
              <RestaurantListItem
                key={restaurant._id}
                restaurant={restaurant}
                onFavoriteToggle={onFavoriteToggle}
                onViewMenu={onViewMenu}
              />
            )
          ))}
        </div>
      )}
    </div>
  );
};

export default RestaurantDisplay;
