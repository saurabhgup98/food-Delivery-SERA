// Restaurant Card Styles - Centralized styling for RestaurantCard component
// This file contains all the styles for RestaurantInfo section

export const RestaurantCardStyles = {
  // Main container styles
  container: 'bg-dark-800 rounded-lg border border-dark-700 overflow-hidden hover:shadow-lg transition-all duration-300 hover:border-sera-blue/50 group',
  
  // Restaurant Info section
  infoContainer: 'p-4',
  
  // Name and Rating section
  nameRatingContainer: 'flex items-start justify-between mb-2',
  nameRatingContainerHeight: { height: '40px', minHeight: '40px' },
  
  // Restaurant name styles
  restaurantName: 'text-white font-semibold text-lg group-hover:text-sera-blue transition-colors',
  restaurantNameStyle: {
    height: '2.4rem',
    minHeight: '2.4rem',
    lineHeight: '1.2rem',
    overflow: 'hidden',
    display: '-webkit-box',
    WebkitLineClamp: 2,
    WebkitBoxOrient: 'vertical',
    margin: 0,
    flex: 1,
    marginRight: '24px' // Increased from 8px to 24px (mr-6)
  },
  
  // Rating section - Stars on first line, Rating on second line
  ratingContainer: 'flex flex-col items-end mb-2 flex-shrink-0 w-fit min-w-fit',
  starsContainer: 'w-fit mb-1.5 flex items-center justify-center',
  ratingValueContainer: 'bg-dark-700/80 px-2 py-1 rounded-md border border-dark-600 inline-flex items-center justify-center mb-1 w-fit',
  ratingText: 'text-white text-sm font-semibold',
  
  // Cuisine section
  cuisineContainer: { height: '20px', marginBottom: '8px', overflow: 'hidden' },
  cuisineText: 'text-gray-400 text-sm',
  cuisineTextStyle: {
    margin: 0,
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    lineHeight: '1.25rem'
  },
  
  // Reviews section
  reviewsContainer: { height: '16px', marginBottom: '8px', overflow: 'hidden' },
  reviewsText: 'text-gray-500 text-xs',
  reviewsTextStyle: {
    margin: 0,
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    lineHeight: '1rem'
  },
  
  // Popular dishes section
  popularDishesContainer: { height: '32px', marginBottom: '12px', overflow: 'hidden' },
  popularDishesText: 'text-gray-500 text-xs',
  popularDishesTextStyle: {
    margin: 0,
    lineHeight: '1rem',
    maxHeight: '2rem',
    overflow: 'hidden',
    display: '-webkit-box',
    WebkitLineClamp: 2,
    WebkitBoxOrient: 'vertical'
  },
  
  // Delivery info section
  deliveryInfoContainer: 'flex items-center justify-between text-sm mb-3',
  deliveryInfoContainerHeight: { height: '20px', overflow: 'hidden' },
  deliveryInfoItem: 'flex items-center space-x-2 text-gray-400',
  
  // Price and delivery fee section
  priceContainer: 'flex items-center justify-between text-sm mb-4',
  priceContainerHeight: { height: '20px', overflow: 'hidden' },
  priceText: 'text-gray-400',
  
  // View menu button
  viewMenuButton: 'w-full py-2 px-4'
} as const;

// Export styles directly
export const getRestaurantCardStyles = () => RestaurantCardStyles;