import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Restaurant } from '../../data/restaurants';
import { useAuth } from '../../contexts/AuthContext';

interface RestaurantListItemProps {
  restaurant: Restaurant;
  onFavoriteToggle: (id: string) => void;
  onViewMenu: (restaurant: Restaurant) => void;
}

const RestaurantListItem: React.FC<RestaurantListItemProps> = ({ 
  restaurant, 
  onFavoriteToggle, 
  onViewMenu 
}) => {
  const navigate = useNavigate();
  const { user, openLoginModal } = useAuth();

  const handleFavoriteClick = () => {
    if (!user) {
      openLoginModal();
      return;
    }
    onFavoriteToggle(restaurant.id);
  };

  const renderStars = (rating: number) => {
    const stars: JSX.Element[] = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < fullStars; i++) {
      stars.push(
        <svg key={i} className="w-4 h-4 text-yellow-400 fill-current" viewBox="0 0 20 20">
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      );
    }

    if (hasHalfStar) {
      stars.push(
        <svg key="half" className="w-4 h-4 text-yellow-400 fill-current" viewBox="0 0 20 20">
          <defs>
            <linearGradient id="halfStar">
              <stop offset="50%" stopColor="currentColor" />
              <stop offset="50%" stopColor="transparent" />
            </linearGradient>
          </defs>
          <path fill="url(#halfStar)" d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      );
    }

    const emptyStars = 5 - Math.ceil(rating);
    for (let i = 0; i < emptyStars; i++) {
      stars.push(
        <svg key={`empty-${i}`} className="w-4 h-4 text-gray-400 fill-current" viewBox="0 0 20 20">
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      );
    }

    return stars;
  };

  const getDietaryIcon = (dietary: string) => {
    switch (dietary) {
      case 'veg': return '🌿';
      case 'non-veg': return '🍖';
      case 'jain': return '🕉️';
      case 'vegan': return '🌱';
      default: return '🍽️';
    }
  };

  return (
    <div className="bg-dark-800 rounded-xl border border-dark-700 p-5 hover:shadow-xl transition-all duration-300 hover:border-sera-blue/50 group relative overflow-hidden">
      {/* Mobile-optimized layout */}
      <div className="flex flex-col sm:flex-row sm:space-x-4 space-y-4 sm:space-y-0">
        {/* Restaurant Image - Larger and more prominent on mobile */}
        <div className="relative w-full sm:w-28 h-48 sm:h-28 flex-shrink-0 rounded-lg overflow-hidden">
          <img 
            src={restaurant.image} 
            alt={restaurant.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
          
          {/* Dietary Badge - Repositioned for mobile */}
          <div className="absolute top-2 left-2">
            <div className="bg-white/95 text-dark-900 text-xs px-2 py-1 rounded-full font-semibold flex items-center space-x-1 shadow-sm">
              <span>{getDietaryIcon(restaurant.dietary)}</span>
            </div>
          </div>

          {/* Open/Closed Badge - Repositioned for mobile */}
          <div className="absolute top-2 right-2">
            <div className={`text-xs px-2 py-1 rounded-full font-semibold shadow-sm ${
              restaurant.isOpen 
                ? 'bg-green-500/95 text-white' 
                : 'bg-red-500/95 text-white'
            }`}>
              {restaurant.isOpen ? 'Open' : 'Closed'}
            </div>
          </div>

          {/* Favorite Button - Floating on image for mobile */}
          <button
            onClick={handleFavoriteClick}
            className="absolute bottom-2 right-2 p-2 bg-dark-800/90 rounded-full hover:bg-dark-700 transition-colors shadow-lg sm:hidden"
          >
            <svg 
              className={`w-4 h-4 ${restaurant.isFavorite ? 'text-red-500 fill-current' : 'text-gray-400 hover:text-red-500'}`} 
              fill={restaurant.isFavorite ? 'currentColor' : 'none'} 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
          </button>
        </div>

        {/* Restaurant Info - Improved mobile layout */}
        <div className="flex-1 min-w-0 flex flex-col justify-between">
          {/* Top section: Name, Rating, and Desktop Favorite */}
          <div className="flex items-start justify-between mb-3">
            <div className="flex-1 min-w-0 mr-3">
              <h3 className="text-white font-bold text-xl sm:text-lg group-hover:text-sera-blue transition-colors mb-1 line-clamp-2">
                {restaurant.name}
              </h3>
              <div className="flex items-center space-x-2 mb-2">
                <div className="flex items-center space-x-1">
                  {renderStars(restaurant.rating)}
                  <span className="text-white text-sm font-semibold">{restaurant.rating}</span>
                </div>
                <span className="text-gray-400 text-sm">•</span>
                <span className="text-gray-400 text-sm">{restaurant.reviewCount.toLocaleString()} reviews</span>
              </div>
            </div>
            
            {/* Desktop Favorite Button */}
            <button
              onClick={handleFavoriteClick}
              className="p-2 text-gray-400 hover:text-red-500 transition-colors hidden sm:block"
            >
              <svg 
                className={`w-5 h-5 ${restaurant.isFavorite ? 'text-red-500 fill-current' : ''}`} 
                fill={restaurant.isFavorite ? 'currentColor' : 'none'} 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            </button>
          </div>

          {/* Cuisine and Popular Dishes */}
          <div className="mb-4">
            <p className="text-gray-300 text-sm font-medium mb-2">
              {restaurant.cuisine.join(' • ')}
            </p>
            <p className="text-gray-500 text-sm leading-relaxed">
              <span className="font-medium text-gray-400">Popular:</span> {restaurant.popularDishes.join(', ')}
            </p>
          </div>

          {/* Delivery Info - Improved mobile layout */}
          <div className="grid grid-cols-2 sm:flex sm:items-center sm:space-x-4 text-sm text-gray-400 mb-4">
            <div className="flex items-center space-x-2 mb-2 sm:mb-0">
              <svg className="w-4 h-4 text-sera-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <circle cx="12" cy="12" r="10"></circle>
                <polyline points="12,6 12,12 16,14"></polyline>
              </svg>
              <span className="font-medium">{restaurant.deliveryTime}</span>
            </div>
            <div className="flex items-center space-x-2 mb-2 sm:mb-0">
              <svg className="w-4 h-4 text-sera-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
                <path d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
              </svg>
              <span className="font-medium">{restaurant.distance}</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-gray-500">Min. {restaurant.minimumOrder}</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-gray-500">{restaurant.deliveryFee} delivery</span>
            </div>
          </div>

          {/* Action Buttons - Improved mobile layout */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-3 space-y-3 sm:space-y-0">
            {/* View Menu Button - Full width on mobile */}
            <button
              onClick={() => navigate(`/restaurant/${restaurant.id}`)}
              className="w-full sm:w-auto bg-gradient-to-r from-sera-blue to-sera-blue/90 text-white py-3 px-6 rounded-xl text-sm font-semibold hover:from-sera-blue/90 hover:to-sera-blue/80 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-[1.02] active:scale-[0.98]"
            >
              View Menu
            </button>
          </div>
        </div>
      </div>

      {/* Offers - Improved mobile layout */}
      {restaurant.offers.length > 0 && (
        <div className="mt-4 pt-4 border-t border-dark-700">
          <div className="flex flex-wrap gap-2">
            {restaurant.offers.map((offer, index) => (
              <div key={index} className="bg-gradient-to-r from-sera-orange/20 to-sera-orange/10 text-sera-orange text-xs px-3 py-2 rounded-full font-medium border border-sera-orange/20">
                {offer}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default RestaurantListItem;