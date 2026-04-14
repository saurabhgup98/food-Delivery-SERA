import React from 'react';
import { PrimaryActionBtn } from '../buttons';
import { renderStars } from '../../utils/restaurantUtils';
import TickIcon from '../Icon/TickIcon';
import ItemContainer from '../common/ItemContainer';
import { getRestaurantMenuBadgeProps } from './Config/RestaurantMenuConfig';
import { RestaurantItemCardPropsI } from './Config/RestaurantInterfaces';
import { getRestaurantButtonProps, RestaurantButtonType } from './Config/RestaurantButtonConfig';

const RestaurantItemCard: React.FC<RestaurantItemCardPropsI> = ({
  item,
  onAddToCart,
  onCustomize,
  getItemQuantity,
  updateQuantity,
  restaurantStatus,
  isHovered = false,
  onMouseEnter,
  onMouseLeave
}) => {
  const quantity = getItemQuantity(item._id);

  const handleAddToCart = () => {
    if (restaurantStatus !== 'OPEN') return;
    onAddToCart(item);
  };

  const handleCustomize = () => {
    if (restaurantStatus !== 'OPEN') return;
    onCustomize(item);
  };

  const handleQuantityChange = (newQuantity: number) => {
    if (restaurantStatus !== 'OPEN') return;
    if (newQuantity === 0) {
      updateQuantity(item._id, 0);
    } else {
      updateQuantity(item._id, newQuantity);
    }
  };

  return (
    <div
      className="bg-dark-800 rounded-lg border border-dark-700 overflow-hidden hover:shadow-lg transition-all duration-300 hover:border-sera-blue/50 group relative"
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      {/* Dish Image */}
      <div className="relative h-48 overflow-hidden">
        <img
          src={item.image}
          alt={item.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />

        {/* Hover Overlay when hover on the card*/}
        {isHovered && (
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-20 transition-all duration-300">
            <div className="text-center space-y-3">
              <h3 className="text-white font-bold text-lg">{item.name}</h3>
              <p className="text-white/80 text-sm px-4">{item.description}</p>
              <div className="flex space-x-3 justify-center">
                {restaurantStatus !== 'OPEN' ? (
                  <div className="text-center">
                    <div className="text-red-400 font-semibold mb-2">🚫 Restaurant Closed</div>
                    <p className="text-white/70 text-sm">Orders not available at this time</p>
                  </div>
                ) : (
                  <>
                    <PrimaryActionBtn
                      {...getRestaurantButtonProps(
                        RestaurantButtonType.DISH_HOVER_CUSTOMIZE,
                        handleCustomize
                      )}
                    />
                    <PrimaryActionBtn
                      {...getRestaurantButtonProps(
                        RestaurantButtonType.DISH_HOVER_QUICK_ADD,
                        handleAddToCart
                      )}
                    />
                  </>
                )}
              </div>
            </div>
          </div>
        )}

        {/* First Line Badges: Settings Icon, Dietary Type on Left, Spice Level on Right */}
        <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
          {/* Left side: Settings and Dish Type */}
          <div className="flex items-center space-x-2">
            <ItemContainer {...getRestaurantMenuBadgeProps('settings')} />
            <ItemContainer {...getRestaurantMenuBadgeProps('dishType', item.dietary)} />
          </div>

          {/* Right side: Spice Level */}
          {item.spiceLevel && (
            <ItemContainer {...getRestaurantMenuBadgeProps('spiceLevel', item.spiceLevel)} />
          )}
        </div>

        {/* Showing Restaurant closed message when restaurant is closed and dont allow order*/}
        {restaurantStatus !== 'OPEN' && (
          <div className="absolute bottom-3 left-1/2 transform -translate-x-1/2 z-10">
            <div className="bg-red-500/90 text-white px-3 py-2 rounded-full text-xs font-medium shadow-lg">
              🚫 Closed
            </div>
          </div>
        )}
      </div>

      {/* Dish Info */}
      <div className="p-4">
        {/* Name and Rating - ALWAYS 2 lines regardless of content */}
        <div className="flex items-start justify-between mb-3 h-12 min-h-12">
          <h3 className="text-white font-semibold text-lg group-hover:text-sera-blue transition-all duration-300 leading-tight h-11 min-h-11 line-clamp-2 overflow-hidden flex-1 mr-3 m-0">
            {item.name}
          </h3>
          <div className="flex flex-col items-end space-y-1 flex-shrink-0">
            <div className="flex items-center space-x-1 bg-dark-700 px-2 py-1 rounded-lg border border-dark-600">
              <div className="flex items-center space-x-0">
                {renderStars(item.rating)}
              </div>
              <span className="text-white font-semibold text-xs ml-1">{item.rating}</span>
            </div>
            <span className="text-gray-400 text-xs">Rating</span>
          </div>
        </div>

        {/* Description - Fixed height */}
        <div className="h-10 mb-3 overflow-hidden">
          <p className="text-gray-400 text-sm m-0 leading-5 max-h-6 line-clamp-2 overflow-hidden">
            {item.description}
          </p>
        </div>

        {/* Prep Time and Price - Fixed height */}
        <div className="flex items-center justify-between text-sm mb-3 h-5 overflow-hidden">
          <div className="flex items-center space-x-2 text-gray-400">
            <span>⏰ {item.prepTime}</span>
            {item.calories && <span>🔥 {item.calories} </span>}
          </div>
          <span className="text-sera-orange font-semibold">{item.price}</span>
        </div>

        {/* Add to Cart Button Or Increment abd Decrement Quantity Buttons- Fixed height */}
        <div className="h-10">
          {quantity === 0 ? (
            <div className="flex space-x-2 h-full">
              {restaurantStatus !== 'OPEN' ? (
                <div className="flex-1 bg-red-500/90 text-white py-2 px-3 rounded-lg font-semibold text-sm flex items-center justify-center">
                  🚫 Restaurant Closed
                </div>
              ) : (
                <PrimaryActionBtn
                  {...getRestaurantButtonProps(
                    RestaurantButtonType.DISH_MAIN_ACTION_QUICK_ADD,
                    handleAddToCart
                  )}
                />
              )}
            </div>
          ) : (
            <div className="flex items-center justify-between h-full bg-gradient-to-r from-sera-orange via-orange-500 to-orange-600 rounded-lg p-2 shadow-xl border border-orange-400/40 relative overflow-hidden">
              {/* Animated background effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-white/10 via-transparent to-white/10 animate-pulse"></div>

              <div className="flex items-center space-x-3 relative z-10">
                <div className="w-6 h-6 rounded-full bg-white/20 border border-white/30 flex items-center justify-center">
                  <TickIcon className="w-4 h-4" color="white" />
                </div>
                <div className="flex flex-col">
                  <span className="text-white font-bold text-sm tracking-wide">IN CART</span>
                  <span className="text-white/90 text-xs font-medium">{quantity} {quantity === 1 ? 'item' : 'items'}</span>
                </div>
              </div>
              {/* Quantity Buttons */}
              <div className="flex items-center space-x-2 relative z-10">
                <PrimaryActionBtn
                  {...getRestaurantButtonProps(
                    RestaurantButtonType.DISH_QUANTITY_DECREASE,
                    () => handleQuantityChange(quantity - 1),
                    { customText: "-" }
                  )}
                  className="w-6 h-6 rounded-full text-xs font-bold"
                />
                <span className="text-white font-bold text-sm min-w-[20px] text-center">{quantity}</span>
                <PrimaryActionBtn
                  {...getRestaurantButtonProps(
                    RestaurantButtonType.DISH_QUANTITY_INCREASE,
                    () => handleQuantityChange(quantity + 1),
                    { customText: "+" }
                  )}
                  className="w-6 h-6 rounded-full text-xs font-bold"
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default RestaurantItemCard;