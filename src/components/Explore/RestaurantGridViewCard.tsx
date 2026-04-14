import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import RestaurantStatus from './RestaurantStatus';
import PrimaryCenteredActionBtn from '../Button/PrimaryCenteredActionBtn';
import PrimaryActionBtn from '../Button/PrimaryActionBtn';
import { getRestaurantCardStyles } from './style/RestaurantCardStyle';
import LocationIcon from '../Icon/LocationIcon';
import TimingIcon from '../Icon/TimingIcon';
import HeartIcon from '../Icon/HeartIcon';
import { getFavoriteButtonProps } from '../Header/HeaderConfig';
import StarRating from '../Icon/StarRating';
import { RestaurantI } from '../Restaurant/Config/RestaurantInterfaces';
import SecondaryContentContainer from '../Container/SecondaryContentContainer';

interface RestaurantGridViewCardProps {
  restaurant: RestaurantI;
  onFavoriteToggle: (id: string) => void;
  onViewMenu: (restaurant: RestaurantI) => void;
}

const RestaurantGridViewCard: React.FC<RestaurantGridViewCardProps> = ({
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

  const styles = getRestaurantCardStyles();

  return (
    <div 
      className={styles.container}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Restaurant Image */}
      <div className="relative h-48 overflow-hidden">
        <img
          src={restaurant.image}
          alt={restaurant.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />

        {/* Overlay with offers */}
        {restaurant.offers && restaurant.offers.length > 0 && (
          <div className="absolute top-3 left-3">
            <div className="bg-sera-orange text-white text-xs px-2 py-1 rounded-full font-medium">
              {restaurant.offers[0]}
            </div>
          </div>
        )}

        {/* Favorite Button */}
        <div className="absolute top-3 right-3">
          <PrimaryActionBtn
            {...getFavoriteButtonProps(handleFavoriteClick, restaurant.isFavorite, 'sm')}
            content={React.createElement(SecondaryContentContainer, {
              rows: [
                {
                  components: {
                    content: React.createElement(HeartIcon, { 
                      className: `w-4 h-4 ${restaurant.isFavorite ? 'text-white' : 'text-gray-400'}`,
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

        {/* Dietary Badge */}
        <div className="absolute bottom-3 left-3 z-10">
          <div className="inline-flex items-center gap-1.5 px-2 py-1 rounded-md text-xs font-semibold transition-all duration-300 border backdrop-blur-sm shadow-sm bg-purple-600/90 text-white border-purple-500/50">
            <span className="text-xs">🟣</span>
            <span className="font-bold">{restaurant.dietary === 'both' ? 'Veg & Non-Veg' : restaurant.dietary.toUpperCase()}</span>
          </div>
        </div>

        {/* Restaurant Status */}
        <div className="absolute bottom-3 right-2 z-10">
          <RestaurantStatus
            status={restaurant.status}
            subStatus={restaurant.subStatus}
            statusDetails={restaurant.statusDetails}
            isHovered={isHovered}
          />
        </div>
      </div>

      {/* Restaurant Info */}
      <div className={styles.infoContainer}>
        {/* Name and Rating - Stars on first line, Rating on second line */}
        <div className={styles.nameRatingContainer} style={styles.nameRatingContainerHeight}>
          <h3 
            className={styles.restaurantName}
            style={styles.restaurantNameStyle}
          >
            {restaurant.name}
          </h3>
          <div className={styles.ratingContainer}>
            <div className={styles.starsContainer}>
              <StarRating rating={restaurant.rating} />
            </div>
            <div className={styles.ratingValueContainer}>
              <span className={styles.ratingText}>{restaurant.rating}</span>
            </div>
          </div>
        </div>

        {/* Cuisine and Reviews - Fixed height */}
        <div style={styles.cuisineContainer}>
          <p 
            className={styles.cuisineText}
            style={styles.cuisineTextStyle}
          >
            {restaurant.cuisine.slice(0, 2).join(' • ')}
            {restaurant.cuisine.length > 2 && ' • More'}
          </p>
        </div>
        
        <div style={styles.reviewsContainer}>
          <p 
            className={styles.reviewsText}
            style={styles.reviewsTextStyle}
          >
            {restaurant.reviewCount.toLocaleString()} reviews
          </p>
        </div>

        {/* Popular Dishes - Fixed height */}
        <div style={styles.popularDishesContainer}>
          <p 
            className={styles.popularDishesText}
            style={styles.popularDishesTextStyle}
          >
            Popular: {restaurant.popularDishes.slice(0, 2).join(', ')}
          </p>
        </div>



        {/* Delivery Info - Fixed height */}
        <div className={styles.deliveryInfoContainer} style={styles.deliveryInfoContainerHeight}>
          <div className={styles.deliveryInfoItem}>
            <TimingIcon />
            <span>{restaurant.deliveryTime}</span>
          </div>
          <div className={styles.deliveryInfoItem}>
            <LocationIcon />
            <span>{restaurant.distance}</span>
          </div>
        </div>

        {/* Price and Delivery Fee - Fixed height */}
        <div className={styles.priceContainer} style={styles.priceContainerHeight}>
          <span className={styles.priceText}>Min. {restaurant.minimumOrder}</span>
          <span className={styles.priceText}>{restaurant.deliveryFee} delivery</span>
        </div>

        {/* View Menu Button */}
        <PrimaryCenteredActionBtn
          onClick={() => navigate(`/restaurant/${restaurant._id}`)}
          text="View Menu"
          size="md"
          className={styles.viewMenuButton}
        />
      </div>
    </div>
  );
};

export default RestaurantGridViewCard;