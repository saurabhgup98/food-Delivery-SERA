import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Restaurant } from '../../data/restaurants';

interface RestaurantCardProps {
  restaurant: Restaurant;
  onFavoriteToggle: (id: string) => void;
  onViewMenu: (restaurant: Restaurant) => void;
}

const RestaurantCard: React.FC<RestaurantCardProps> = ({ 
  restaurant, 
  onFavoriteToggle, 
  onViewMenu 
}) => {
  const navigate = useNavigate();
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
    <div className="bg-dark-800 rounded-lg border border-dark-700 overflow-hidden hover:shadow-lg transition-all duration-300 hover:border-sera-blue/50 group">
      {/* Restaurant Image */}
      <div className="relative h-48 overflow-hidden">
        <img 
          src={restaurant.image} 
          alt={restaurant.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        
        {/* Overlay with offers */}
        {restaurant.offers.length > 0 && (
          <div className="absolute top-3 left-3">
            <div className="bg-sera-orange text-white text-xs px-2 py-1 rounded-full font-medium">
              {restaurant.offers[0]}
            </div>
          </div>
        )}

        {/* Favorite Button */}
        <button
          onClick={() => onFavoriteToggle(restaurant.id)}
          className="absolute top-3 right-3 p-2 bg-dark-800/80 rounded-full hover:bg-dark-700 transition-colors"
        >
          <svg 
            className={`w-5 h-5 ${restaurant.isFavorite ? 'text-red-500 fill-current' : 'text-gray-400 hover:text-red-500'}`} 
            fill={restaurant.isFavorite ? 'currentColor' : 'none'} 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
          </svg>
        </button>

        {/* Dietary Badge */}
        <div className="absolute bottom-3 left-3">
          <div className="bg-white/90 text-dark-900 text-xs px-2 py-1 rounded-full font-medium flex items-center space-x-1">
            <span>{getDietaryIcon(restaurant.dietary)}</span>
            <span>{restaurant.dietary === 'both' ? 'Veg & Non-Veg' : restaurant.dietary.toUpperCase()}</span>
          </div>
        </div>

        {/* Open/Closed Badge */}
        <div className="absolute bottom-3 right-3">
          <div className={`text-xs px-2 py-1 rounded-full font-medium ${
            restaurant.isOpen 
              ? 'bg-green-500/90 text-white' 
              : 'bg-red-500/90 text-white'
          }`}>
            {restaurant.isOpen ? 'Open' : 'Closed'}
          </div>
        </div>
      </div>

      {/* Restaurant Info */}
      <div className="p-4">
        {/* Name and Rating */}
        <div className="flex items-start justify-between mb-2">
          <h3 className="text-white font-semibold text-lg group-hover:text-sera-blue transition-colors">
            {restaurant.name}
          </h3>
          <div className="flex items-center space-x-1">
            {renderStars(restaurant.rating)}
            <span className="text-white text-sm font-medium">{restaurant.rating}</span>
          </div>
        </div>

        {/* Cuisine and Reviews */}
        <p className="text-gray-400 text-sm mb-2">
          {restaurant.cuisine.slice(0, 2).join(' • ')}
          {restaurant.cuisine.length > 2 && ' • More'}
        </p>
        <p className="text-gray-500 text-xs mb-3">
          {restaurant.reviewCount.toLocaleString()} reviews
        </p>

        {/* Popular Dishes */}
        <div className="mb-3">
          <p className="text-gray-500 text-xs mb-1">Popular: {restaurant.popularDishes.slice(0, 2).join(', ')}</p>
        </div>

        {/* Delivery Info */}
        <div className="flex items-center justify-between text-sm mb-3">
          <div className="flex items-center space-x-2 text-gray-400">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <circle cx="12" cy="12" r="10"></circle>
              <polyline points="12,6 12,12 16,14"></polyline>
            </svg>
            <span>{restaurant.deliveryTime}</span>
          </div>
          <div className="flex items-center space-x-2 text-gray-400">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
              <path d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
            </svg>
            <span>{restaurant.distance}</span>
          </div>
        </div>

        {/* Price and Delivery Fee */}
        <div className="flex items-center justify-between text-sm mb-4">
          <span className="text-gray-400">Min. {restaurant.minimumOrder}</span>
          <span className="text-gray-400">{restaurant.deliveryFee} delivery</span>
        </div>

        {/* View Menu Button */}
        <button
          onClick={() => navigate(`/restaurant/${restaurant.id}`)}
          className="w-full bg-sera-blue text-white py-2 px-4 rounded-lg font-medium hover:bg-sera-blue/80 transition-colors"
        >
          View Menu
        </button>
      </div>
    </div>
  );
};

export default RestaurantCard;
