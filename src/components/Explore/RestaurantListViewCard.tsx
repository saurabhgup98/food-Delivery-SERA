import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import RestaurantStatus from './RestaurantStatus';
import PrimaryCenteredActionBtn from '../Button/PrimaryCenteredActionBtn';
import PrimaryActionBtn from '../Button/PrimaryActionBtn';
import LocationIcon from '../Icon/LocationIcon';
import TimingIcon from '../Icon/TimingIcon';
import HeartIcon from '../Icon/HeartIcon';
import StarRating from '../Icon/StarRating';
import { getDietaryIcon, DIETARY_CONFIG, FAVORITE_ICON_CONFIG } from './config/RestaurantConfig';
import { getFavoriteButtonProps } from '../Header/HeaderConfig';
import { RestaurantI } from '../Restaurant/Config/RestaurantInterfaces';
import SecondaryContentContainer from '../Container/SecondaryContentContainer';

interface RestaurantListViewCardProps {
  restaurant: RestaurantI;
  onFavoriteToggle: (id: string) => void;
  onViewMenu: (restaurant: RestaurantI) => void;
}

const RestaurantListViewCard: React.FC<RestaurantListViewCardProps> = ({
  restaurant,
  onFavoriteToggle,
  onViewMenu
}) => {
  const navigate = useNavigate();
  const { user, openLoginModal } = useAuth();
  const [isHovered, setIsHovered] = useState(false);

  const handleFavoriteClick = () => {
    if (!user) {
      openLoginModal();
      return;
    }
    onFavoriteToggle(restaurant._id);
  };

  // Get dietary badge config
  const dietaryConfig = DIETARY_CONFIG[restaurant.dietary] || DIETARY_CONFIG['both'];
  const dietaryBadgeClasses = `inline-flex items-center gap-1.5 px-2 py-1 rounded-md text-xs font-semibold transition-all duration-300 border backdrop-blur-sm shadow-sm ${dietaryConfig.bgColor} ${dietaryConfig.textColor}`;

  return (
    <div 
      className="bg-dark-800 rounded-xl border border-dark-700 p-4 hover:shadow-xl transition-all duration-300 hover:border-blue-500/50 group relative overflow-hidden"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Mobile-optimized layout */}
      <div className="flex flex-col sm:flex-row sm:space-x-4 space-y-4 sm:space-y-0 sm:items-center">
        {/* Restaurant Image - Larger and more prominent on all screens */}
        <div className="relative w-full sm:w-40 md:w-48 lg:w-56 h-48 sm:h-40 md:h-44 lg:h-48 flex-shrink-0 rounded-lg overflow-hidden">
          <img
            src={restaurant.image}
            alt={restaurant.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />

          {/* Dietary Badge - Repositioned for mobile */}
          <div className="absolute top-2 left-2 z-10">
            <div className={dietaryBadgeClasses}>
              <div className={`w-4 h-4 ${getDietaryIcon(restaurant.dietary).bgColor} rounded-full flex items-center justify-center ${getDietaryIcon(restaurant.dietary).textColor} text-xs font-bold`}>
                {getDietaryIcon(restaurant.dietary).icon}
              </div>
            </div>
          </div>

          {/* Restaurant Status - Bottom right corner, more visible */}
          <div className="absolute bottom-2 right-2 z-20">
            <RestaurantStatus
              status={restaurant.status}
              subStatus={restaurant.subStatus}
              statusDetails={restaurant.statusDetails}
              isHovered={isHovered}
            />
          </div>

          {/* Favorite Button - Floating on image for mobile */}
          <div className="absolute top-2 right-2 sm:hidden z-20">
            <PrimaryActionBtn
              {...getFavoriteButtonProps(handleFavoriteClick, restaurant.isFavorite, 'sm')}
              className="p-2 bg-dark-800/90 rounded-full hover:bg-dark-700 transition-colors shadow-lg"
              content={React.createElement(SecondaryContentContainer, {
                rows: [
                  {
                    components: {
                      content: React.createElement(HeartIcon, { 
                        className: `${FAVORITE_ICON_CONFIG.size} transition-colors duration-200 ${restaurant.isFavorite ? 'text-white' : 'text-gray-400'}`,
                        filled: restaurant.isFavorite 
                      }),
                      marginRight: 'mr-0',
                    },
                    className: 'w-fit h-full',
                  },
                ],
                className: 'w-fit h-full',
              })}
            />
          </div>
        </div>

        {/* Restaurant Info - Improved mobile layout */}
        <div className="flex-1 min-w-0 flex flex-col justify-center">
          {/* Top section: Name, Rating, Offers, and Desktop Favorite */}
          <div className="flex items-start justify-between mb-2">
            <div className="flex-1 min-w-0 mr-6 flex-grow">
              <div className="flex items-start gap-3 mb-1">
                <h3 className="text-white font-semibold text-lg sm:text-xl group-hover:text-blue-400 transition-colors line-clamp-2 flex-1 tracking-tight font-display">
                  {restaurant.name}
                </h3>
                {/* Offers - Inline with name */}
                {restaurant.offers.length > 0 && (
                  <div className="flex flex-wrap gap-2 flex-shrink-0">
                    {restaurant.offers.slice(0, 2).map((offer, index) => (
                      <div key={index} className="bg-gradient-to-r from-sera-orange/20 to-sera-orange/10 text-sera-orange text-xs px-2 py-1 rounded-full font-medium border border-sera-orange/20 whitespace-nowrap">
                        {offer}
                      </div>
                    ))}
                    {restaurant.offers.length > 2 && (
                      <div className="bg-gradient-to-r from-sera-orange/20 to-sera-orange/10 text-sera-orange text-xs px-2 py-1 rounded-full font-medium border border-sera-orange/20 whitespace-nowrap">
                        +{restaurant.offers.length - 2}
                      </div>
                    )}
                  </div>
                )}
                {/* Desktop Favorite Button - Inline with name and offers */}
                <div className="hidden sm:block">
                  <PrimaryActionBtn
                    {...getFavoriteButtonProps(handleFavoriteClick, restaurant.isFavorite, 'sm')}
                    className="p-2 bg-dark-800/90 rounded-full hover:bg-dark-700 transition-colors shadow-lg"
                    content={React.createElement(SecondaryContentContainer, {
                      rows: [
                        {
                          components: {
                            content: React.createElement(HeartIcon, { 
                              className: `${FAVORITE_ICON_CONFIG.size} transition-colors duration-200 ${restaurant.isFavorite ? 'text-white' : 'text-gray-400'}`,
                              filled: restaurant.isFavorite 
                            }),
                            marginRight: 'mr-0',
                          },
                          className: 'w-fit h-full',
                        },
                      ],
                      className: 'w-fit h-full',
                    })}
                  />
                </div>
              </div>
            </div>

            {/* Rating and Reviews - Stars on first line, Rating on second line */}
            <div className="flex flex-col items-end mb-2 flex-shrink-0 w-fit min-w-fit">
              <div className="w-fit mb-2.5 flex items-center justify-center">
                <StarRating rating={restaurant.rating} />
              </div>
              <div className="bg-dark-700/80 px-2 py-1 rounded-md border border-dark-600 inline-flex items-center justify-center mb-2 w-fit">
                <span className="text-white text-sm font-semibold">{restaurant.rating}</span>
              </div>
              <div className="text-gray-300 text-sm font-medium">
                {restaurant.reviewCount.toLocaleString()} reviews
              </div>
            </div>
          </div>

          {/* Cuisine and Popular Dishes */}
          <div className="mb-3">
            <p className="text-gray-100 text-sm font-medium mb-2 tracking-wide">
              {restaurant.cuisine.join('  •  ')}
            </p>
            <p className="text-gray-200 text-sm leading-relaxed font-normal">
              <span className="font-semibold text-gray-100">Popular:</span> {restaurant.popularDishes.join(', ')}
            </p>
          </div>

          {/* Delivery Info and View Menu Button - Inline layout */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div className="grid grid-cols-2 sm:flex sm:items-center sm:space-x-4 text-sm text-gray-200">
              <div className="flex items-center space-x-2 mb-2 sm:mb-0">
                <TimingIcon />
                <span className="font-medium text-gray-200">{restaurant.deliveryTime}</span>
              </div>
              <div className="flex items-center space-x-2 mb-2 sm:mb-0">
                <LocationIcon />
                <span className="font-medium text-gray-200">{restaurant.distance}</span>
              </div>
              <div className="flex items-center space-x-2 mb-2 sm:mb-0">
                <span className="font-medium text-gray-200">Min. {restaurant.minimumOrder}</span>
              </div>
              <div className="flex items-center space-x-2 mb-2 sm:mb-0">
                <span className="font-medium text-gray-200">{restaurant.deliveryFee} delivery</span>
              </div>
            </div>

            {/* View Menu Button - Inline with delivery info */}
            <PrimaryCenteredActionBtn
              onClick={() => navigate(`/restaurant/${restaurant._id}`)}
              text="View Menu"
              size="sm"
              className="w-full sm:min-w-[120px] sm:w-auto py-2 px-5"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default RestaurantListViewCard;