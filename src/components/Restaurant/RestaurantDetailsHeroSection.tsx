import React from 'react';
import { Link } from 'react-router-dom';
import { Search, Menu, ShoppingCart } from 'lucide-react';
import PrimaryActionBtn from '../Button/PrimaryActionBtn';
import { RestaurantDetailsHeroSectionPropsI } from './Config/RestaurantInterfaces';
import { getRestaurantButtonProps, RestaurantButtonType } from './Config/RestaurantButtonConfig';
import { PrimaryCenteredActionBtn } from '../buttons';

const RestaurantDetailsHeroSection: React.FC<RestaurantDetailsHeroSectionPropsI> = ({
  restaurant,
  isFavorite,
  onFavoriteToggle,
  onShare
}) => {
  // Render stars for rating
  const renderStars = (rating: number) => {
    const stars: React.ReactNode[] = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < fullStars; i++) {
      stars.push(
        <span key={i} className="text-yellow-400 text-sm">★</span>
      );
    }

    if (hasHalfStar) {
      stars.push(
        <span key="half" className="text-yellow-400 text-sm">☆</span>
      );
    }

    const remainingStars = 5 - Math.ceil(rating);
    for (let i = 0; i < remainingStars; i++) {
      stars.push(
        <span key={`empty-${i}`} className="text-gray-400 text-sm">☆</span>
      );
    }

    return stars;
  };

  return (
    <div className="relative h-80">
      {/* Background Image */}
      <div className="absolute inset-0">
        <img
          src={restaurant.image}
          alt={restaurant.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-dark-900/80 via-dark-900/40 to-transparent"></div>
      </div>

      {/* Back Button */}
      <div className="absolute top-4 left-4">
        <Link to="/explore">
          <PrimaryActionBtn
            {...getRestaurantButtonProps(RestaurantButtonType.BACK_TO_RESTAURANT_BUTTON, () => {})}
          />
        </Link>
      </div>

      {/* Action Buttons */}
      <div className="absolute top-4 right-4 flex space-x-2">
        <PrimaryCenteredActionBtn
          rightIconNode={<span className="text-sm">📤</span>}
          onClick={onShare}
          size="sm"
          bgColor="bg-dark-800/80"
          hoverBgColor="hover:bg-dark-700/80"
          textColor="text-white"
          className="backdrop-blur-sm"
        />
        <PrimaryActionBtn
          {...getRestaurantButtonProps(RestaurantButtonType.RESTAURANT_FAVORITES_BUTTON, onFavoriteToggle, { isFavorite })}
        />
      </div>

      {/* Restaurant Info */}
      <div className="absolute bottom-0 left-0 right-0 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-end justify-between">
            <div className="flex-1">
              <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
                {restaurant.name}
              </h1>

              {/* Restaurant Status Indicator */}
              <div className="mb-3">
                {restaurant.status === 'OPEN' ? (
                  <div className="inline-flex items-center gap-2 bg-green-500/20 text-green-400 px-3 py-1 rounded-full text-sm font-medium border border-green-500/30">
                    <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
                    Open Now
                    {restaurant.subStatus && restaurant.subStatus !== 'NORMAL' && (
                      <span className="text-yellow-400">
                        • {restaurant.subStatus === 'BUSY' ? 'Busy' : 'Very Busy'}
                      </span>
                    )}
                  </div>
                ) : restaurant.status === 'CLOSED' ? (
                  <div className="inline-flex items-center gap-2 bg-red-500/20 text-red-400 px-3 py-1 rounded-full text-sm font-medium border border-red-500/30">
                    <span className="w-2 h-2 bg-red-400 rounded-full"></span>
                    Closed
                    {restaurant.statusDetails?.nextOpenTime && (
                      <span className="text-gray-300">
                        • Opens {restaurant.statusDetails.nextOpenTime}
                      </span>
                    )}
                  </div>
                ) : restaurant.status === 'TEMPORARILY_CLOSED' ? (
                  <div className="inline-flex items-center gap-2 bg-orange-500/20 text-orange-400 px-3 py-1 rounded-full text-sm font-medium border border-orange-500/30">
                    <span className="w-2 h-2 bg-orange-400 rounded-full animate-pulse"></span>
                    Temporarily Closed
                    {restaurant.statusDetails?.tempCloseReason && (
                      <span className="text-gray-300">
                        • {restaurant.statusDetails.tempCloseReason}
                      </span>
                    )}
                  </div>
                ) : (
                  <div className="inline-flex items-center gap-2 bg-gray-500/20 text-gray-400 px-3 py-1 rounded-full text-sm font-medium border border-gray-500/30">
                    <span className="w-2 h-2 bg-gray-400 rounded-full"></span>
                    Permanently Closed
                  </div>
                )}
              </div>

              <div className="flex items-center space-x-4 text-white/80 mb-3">
                <div className="flex items-center space-x-1">
                  {renderStars(restaurant.rating)}
                  <span className="font-medium">{restaurant.rating}</span>
                  <span>({restaurant.reviewCount.toLocaleString()})</span>
                </div>
                <span>•</span>
                <span>{restaurant.cuisine.join(', ')}</span>
              </div>
              
              <div className="flex items-center space-x-6 text-white/80 text-sm">
                <div className="flex items-center space-x-1">
                  <span className="text-sm">⏰</span>
                  <span>{restaurant.deliveryTime}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <span className="text-sm">📍</span>
                  <span>{restaurant.distance}</span>
                </div>
                <span>Min. {restaurant.minimumOrder}</span>
                <span>{restaurant.deliveryFee} delivery</span>
              </div>
            </div>

            {/* Open/Closed Badge */}
            <div className={`px-4 py-2 rounded-full font-medium ${restaurant.isOpen
                ? 'bg-green-500 text-white'
                : 'bg-red-500 text-white'
              }`}>
              {restaurant.isOpen ? 'Open' : 'Closed'}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RestaurantDetailsHeroSection;