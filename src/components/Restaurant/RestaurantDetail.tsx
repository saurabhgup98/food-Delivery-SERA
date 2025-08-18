import React, { useState, useMemo, useCallback, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  Search,
  Menu,
  ShoppingCart
} from 'lucide-react';
import { apiService, Restaurant, MenuItem } from '../../services/api';
import { useCart } from '../../contexts/CartContext';
import FilterModal, { FilterSelections } from './FilterModal';
import DishCustomizationModal from './DishCustomizationModal';
import CartModal from '../Cart/CartModal';
import { AnimatedLoader } from '../Loader';

// Debounce hook for search
const useDebounce = (value: string, delay: number) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    // Only debounce if the value has at least 3 characters or is empty
    if (value.length >= 3 || value.length === 0) {
      const handler = setTimeout(() => {
        setDebouncedValue(value);
      }, delay);

      return () => {
        clearTimeout(handler);
      };
    }
  }, [value, delay]);

  return debouncedValue;
};

type TabType = 'all-meals' | 'top-meals' | 'quick-order' | 'chef-specials' | 'trending';

const RestaurantDetail: React.FC = () => {
  const { id: restaurantId } = useParams<{ id: string }>();
  const [activeTab, setActiveTab] = useState<TabType>('all-meals');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [isFavorite, setIsFavorite] = useState(false);
  const { state: cartState, addItem, getItemQuantity, updateQuantity } = useCart();
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [filterValues, setFilterValues] = useState<FilterSelections | null>(null);
  const [isDishCustomizationOpen, setIsDishCustomizationOpen] = useState(false);
  const [selectedDish, setSelectedDish] = useState<MenuItem | null>(null);
  const [hoveredDishId, setHoveredDishId] = useState<string | null>(null);
  const [isCartOpen, setIsCartOpen] = useState(false);

  // State for API data
  const [restaurant, setRestaurant] = useState<Restaurant | null>(null);
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [menuLoading, setMenuLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Debounced search query
  const debouncedSearchQuery = useDebounce(searchQuery, 500);

  // Fetch restaurant data
  const fetchRestaurant = async () => {
    if (!restaurantId) return;
    
    try {
      setLoading(true);
      setError(null);
      
      const response = await apiService.getRestaurant(restaurantId);
      
      if (response.success) {
        setRestaurant(response.data.restaurant);
        setIsFavorite(response.data.restaurant.isFavorite);
      } else {
        setError('Failed to fetch restaurant');
      }
    } catch (err) {
      console.error('Error fetching restaurant:', err);
      setError('Failed to load restaurant. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Fetch menu items - always fetch all items
  const fetchMenuItems = async () => {
    if (!restaurantId) return;
    
    try {
      setMenuLoading(true);
      
      const response = await apiService.getRestaurantMenu(restaurantId, {
        type: 'all', // Always fetch all items
        category: selectedCategory !== 'all' ? selectedCategory : undefined,
        search: debouncedSearchQuery || undefined
      });
      
      if (response.success) {
        setMenuItems(response.data.menuItems);
      }
    } catch (err) {
      console.error('Error fetching menu items:', err);
    } finally {
      setMenuLoading(false);
    }
  };



  // Fetch data on component mount and when dependencies change
  useEffect(() => {
    fetchRestaurant();
  }, [restaurantId]);

  useEffect(() => {
    if (restaurant) {
      fetchMenuItems();
    }
  }, [restaurantId, selectedCategory, debouncedSearchQuery]);

  // Scroll to top when search query changes
  useEffect(() => {
    if (debouncedSearchQuery && menuItems.length > 0) {
      // Only scroll if we're not already at the top
      if (window.scrollY > 100) {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    }
  }, [debouncedSearchQuery, menuItems.length]);



  // Helper function to get price range from price string
  const getPriceRange = useCallback((price: string) => {
    const num = parseInt(price.replace('₹', ''));
    if (num < 100) return 'Budget <₹100';
    if (num <= 300) return '₹100-₹300';
    return '>₹300';
  }, []);

  // Helper function to check if item matches dietary filter
  const matchesDietary = useCallback((item: MenuItem, dietaryFilters: string[]) => {
    if (dietaryFilters.length === 0) return true;
    return dietaryFilters.some(filter => {
      if (filter === 'Veg') return item.dietary === 'veg';
      if (filter === 'Non-Veg') return item.dietary === 'non-veg';
      if (filter === 'Vegan') return item.dietary === 'vegan';
      if (filter === 'Jain') return item.dietary === 'jain';
      return false;
    });
  }, []);

  // Helper function to check if item matches price filter
  const matchesPrice = useCallback((item: MenuItem, priceFilters: string[]) => {
    if (priceFilters.length === 0) return true;
    const itemPriceRange = getPriceRange(item.price);
    return priceFilters.includes(itemPriceRange);
  }, [getPriceRange]);

  // Helper function to sort items
  const sortItems = useCallback((items: MenuItem[], sortBy: string, sortOrder: 'asc' | 'desc') => {
    return [...items].sort((a, b) => {
      let aValue: any, bValue: any;
      
      switch (sortBy) {
        case 'name':
          aValue = a.name.toLowerCase();
          bValue = b.name.toLowerCase();
          break;
        case 'price':
          aValue = parseInt(a.price.replace('₹', ''));
          bValue = parseInt(b.price.replace('₹', ''));
          break;
        case 'rating':
          aValue = a.rating;
          bValue = b.rating;
          break;
        case 'prepTime':
          aValue = parseInt(a.prepTime.replace(' min', ''));
          bValue = parseInt(b.prepTime.replace(' min', ''));
          break;
        default:
          return 0;
      }
      
      if (sortOrder === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });
  }, []);

  // Filter menu items based on search and category
  const filteredMenuItems = useMemo(() => {
    let items = menuItems;

    // Apply advanced filters
    if (filterValues) {
      // Dietary filter
      items = items.filter(item => matchesDietary(item, filterValues.dietary));
      
      // Price filter
      items = items.filter(item => matchesPrice(item, filterValues.priceRange));
      
      // Sort items
      items = sortItems(items, filterValues.sortBy, filterValues.sortOrder);
    }

    return items;
  }, [menuItems, filterValues, matchesDietary, matchesPrice, sortItems]);

  // Menu categories
  const menuCategories = useMemo(() => {
    const categories = ['starters', 'mains', 'breads', 'desserts', 'beverages'];
    return categories.map(category => ({
      id: category,
      name: category.charAt(0).toUpperCase() + category.slice(1),
      count: filteredMenuItems.filter(item => item.category === category).length
    }));
  }, [filteredMenuItems]);

  // Calculate tab counts based on ALL menu items (not filtered ones)
  const tabCounts = useMemo(() => {
    return {
      'all-meals': menuItems.length,
      'top-meals': menuItems.filter(item => item.isPopular).length,
      'quick-order': menuItems.filter(item => item.isQuickOrder).length,
      'chef-specials': menuItems.filter(item => item.isChefSpecial).length,
      'trending': menuItems.filter(item => item.isTrending).length
    };
  }, [menuItems]);

  const tabs = [
    { id: 'all-meals', label: 'All Meals', count: tabCounts['all-meals'] },
    { id: 'top-meals', label: 'Top Meals', count: tabCounts['top-meals'] },
    { id: 'quick-order', label: 'Quick Order', count: tabCounts['quick-order'] },
    { id: 'chef-specials', label: 'Chef\'s Specials', count: tabCounts['chef-specials'] },
    { id: 'trending', label: 'Trending Now', count: tabCounts['trending'] }
  ];

  const handleAddToCart = (item: MenuItem) => {
    if (!restaurant || restaurant.status !== 'OPEN') {
      return; // Prevent adding items from closed restaurants
    }
    addItem(item);
  };

  const handleCustomizeDish = (item: MenuItem) => {
    if (!restaurant || restaurant.status !== 'OPEN') {
      return; // Prevent customization for closed restaurants
    }
    setSelectedDish(item);
    setIsDishCustomizationOpen(true);
  };

  const handleCloseCustomization = () => {
    setIsDishCustomizationOpen(false);
    setSelectedDish(null);
  };

  const handleUpdateQuantity = (itemId: string, newQuantity: number) => {
    if (!restaurant || restaurant.status !== 'OPEN') {
      return; // Prevent quantity updates for closed restaurants
    }
    const cartItem = cartState.items.find(cartItem => cartItem.id === itemId && !cartItem.customization);
    if (cartItem) {
      updateQuantity(cartItem.uniqueId, newQuantity);
    }
  };

  const renderStars = (rating: number) => {
    const stars: JSX.Element[] = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < fullStars; i++) {
      stars.push(
        <span key={i} className="text-yellow-400 text-xs">
          ⭐
        </span>
      );
    }

    if (hasHalfStar) {
      stars.push(
        <span key="half" className="text-yellow-400 text-xs">
          ⭐
        </span>
      );
    }

    const emptyStars = 5 - Math.ceil(rating);
    for (let i = 0; i < emptyStars; i++) {
      stars.push(
        <span key={`empty-${i}`} className="text-gray-500 text-xs">
          ☆
        </span>
      );
    }

    return stars;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-dark-900 flex items-center justify-center">
        <div className="text-center">
          <AnimatedLoader type="restaurant" size="large" className="mx-auto mb-6" />
          <p className="text-white text-lg font-medium">Loading restaurant...</p>
          <p className="text-gray-400 text-sm mt-2">Preparing the menu for you</p>
        </div>
      </div>
    );
  }

  if (error || !restaurant) {
    return (
      <div className="min-h-screen bg-dark-900 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-400 text-4xl mb-4">⚠️</div>
          <h2 className="text-white text-xl font-semibold mb-2">Error Loading Restaurant</h2>
          <p className="text-gray-400 mb-4">{error || 'Restaurant not found'}</p>
          <Link 
            to="/explore"
            className="bg-sera-blue text-white px-6 py-2 rounded-lg hover:bg-sera-blue/80 transition-colors"
          >
            Back to Restaurants
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-dark-900">
      {/* Hero Section */}
      <div className="relative h-80">
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
          <Link 
            to="/explore"
            className="flex items-center space-x-2 bg-dark-800/80 text-white px-3 py-2 rounded-lg hover:bg-dark-700/80 transition-colors"
          >
                         <span className="text-lg">←</span>
            <span>Back</span>
          </Link>
        </div>

        {/* Action Buttons */}
        <div className="absolute top-4 right-4 flex space-x-2">
                     <button className="p-2 bg-dark-800/80 text-white rounded-lg hover:bg-dark-700/80 transition-colors">
             <span className="text-sm">📤</span>
           </button>
                     <button 
             onClick={() => setIsFavorite(!isFavorite)}
             className={`p-2 rounded-lg transition-colors ${
               isFavorite 
                 ? 'bg-red-500/80 text-white' 
                 : 'bg-dark-800/80 text-white hover:bg-dark-700/80'
             }`}
           >
             <span className={`text-sm ${isFavorite ? 'text-red-500' : 'text-white'}`}>
               {isFavorite ? '❤️' : '🤍'}
             </span>
           </button>
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
              <div className={`px-4 py-2 rounded-full font-medium ${
                restaurant.isOpen 
                  ? 'bg-green-500 text-white' 
                  : 'bg-red-500 text-white'
              }`}>
                {restaurant.isOpen ? 'Open' : 'Closed'}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="sticky top-16 z-40 bg-dark-800 border-b border-dark-700 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col lg:flex-row gap-4 items-center">
            {/* Search Input */}
            <div className="flex-1 w-full lg:w-auto">
              <div className="relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search in menu..."
                  className="w-full px-4 py-3 pl-12 bg-dark-700 border border-dark-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-sera-blue focus:border-transparent"
                />
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              </div>
            </div>

            {/* Category Filter */}
            <div className="relative">
              <select 
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="bg-dark-700 border border-dark-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-sera-blue appearance-none cursor-pointer transition-all duration-200 hover:border-dark-500 pr-10"
              >
                <option value="all">All Categories</option>
                {menuCategories.map(category => (
                  <option key={category.id} value={category.id}>
                    {category.name} ({category.count})
                  </option>
                ))}
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                <svg className="w-4 h-4 text-gray-400 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>

            {/* Filter Button */}
            <button
              onClick={() => setIsFilterOpen(true)}
              className="flex items-center space-x-2 bg-dark-700 border border-dark-600 px-4 py-3 rounded-lg text-white hover:bg-dark-600 transition-colors"
            >
              <Menu className="w-5 h-5" />
              <span>Filters</span>
            </button>
          </div>
        </div>
      </div>
      <FilterModal
        isOpen={isFilterOpen}
        onClose={() => setIsFilterOpen(false)}
        initialValues={filterValues || undefined}
        onApply={(vals) => setFilterValues(vals)}
        onClear={() => setFilterValues(null)}
      />

      {/* Quick Filter Chips */}
      {filterValues && (
        <div className="bg-dark-800 border-b border-dark-700 px-4 py-3">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-wrap gap-2">
              {filterValues.dietary.map(diet => (
                <span key={diet} className="inline-flex items-center gap-1 px-3 py-1 bg-sera-blue/20 text-sera-blue rounded-full text-sm">
                  {diet === 'Veg' ? '🌿' : diet === 'Non-Veg' ? '🍖' : diet === 'Vegan' ? '🌱' : '🕉️'} {diet}
                  <button
                    onClick={() => setFilterValues(prev => prev ? {
                      ...prev,
                      dietary: prev.dietary.filter(d => d !== diet)
                    } : null)}
                    className="ml-1 hover:text-sera-orange"
                  >
                    ×
                  </button>
                </span>
              ))}
              {filterValues.priceRange.map(price => (
                <span key={price} className="inline-flex items-center gap-1 px-3 py-1 bg-sera-orange/20 text-sera-orange rounded-full text-sm">
                  💰 {price}
                  <button
                    onClick={() => setFilterValues(prev => prev ? {
                      ...prev,
                      priceRange: prev.priceRange.filter(p => p !== price)
                    } : null)}
                    className="ml-1 hover:text-red-400"
                  >
                    ×
                  </button>
                </span>
              ))}
              <span className="inline-flex items-center gap-1 px-3 py-1 bg-gray-600 text-gray-300 rounded-full text-sm">
                🔄 Sort: {filterValues.sortBy} ({filterValues.sortOrder})
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Tab Navigation */}
      <div className="bg-dark-800 border-b border-dark-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-8 overflow-x-auto">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as TabType)}
                className={`flex items-center space-x-2 py-4 px-2 border-b-2 transition-colors whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'border-sera-blue text-sera-blue'
                    : 'border-transparent text-gray-400 hover:text-white'
                }`}
              >
                <span className="font-medium">{tab.label}</span>
                <span className="bg-dark-700 px-2 py-1 rounded-full text-xs">
                  {tab.count}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Tab Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Restaurant Status Message */}
        {restaurant.status !== 'OPEN' && (
          <div className="mb-6 p-4 bg-gradient-to-r from-red-500/10 to-orange-500/10 border border-red-500/20 rounded-lg">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-red-500/20 rounded-full flex items-center justify-center">
                <span className="text-red-400 text-lg">⚠️</span>
              </div>
              <div>
                <h3 className="text-white font-semibold mb-1">
                  {restaurant.status === 'CLOSED' ? 'Restaurant is Currently Closed' :
                   restaurant.status === 'TEMPORARILY_CLOSED' ? 'Restaurant is Temporarily Closed' :
                   'Restaurant is Permanently Closed'}
                </h3>
                <p className="text-gray-300 text-sm">
                  {restaurant.status === 'CLOSED' && restaurant.statusDetails?.nextOpenTime
                    ? `You can browse the menu, but ordering is disabled. Restaurant will open ${restaurant.statusDetails.nextOpenTime}.`
                    : restaurant.status === 'TEMPORARILY_CLOSED' && restaurant.statusDetails?.tempCloseReason
                    ? `You can browse the menu, but ordering is disabled. ${restaurant.statusDetails.tempCloseReason} (${restaurant.statusDetails.tempCloseDuration || 'temporarily'}).`
                    : 'You can browse the menu, but ordering is currently disabled.'}
                </p>
              </div>
            </div>
          </div>
        )}
        
        {(() => {
          // Show loader while fetching menu items
          if (menuLoading) {
            return (
              <div className="text-center py-12">
                <AnimatedLoader type="restaurant" size="large" className="mx-auto mb-6" />
                <p className="text-white text-lg font-medium">Loading menu items...</p>
                <p className="text-gray-400 text-sm mt-2">Fetching delicious dishes for you</p>
              </div>
            );
          }

          // Filter items based on active tab (client-side filtering)
          let displayItems = menuItems;
          if (activeTab !== 'all-meals') {
            switch (activeTab) {
              case 'top-meals':
                displayItems = menuItems.filter(item => item.isPopular);
                break;
              case 'quick-order':
                displayItems = menuItems.filter(item => item.isQuickOrder);
                break;
              case 'chef-specials':
                displayItems = menuItems.filter(item => item.isChefSpecial);
                break;
              case 'trending':
                displayItems = menuItems.filter(item => item.isTrending);
                break;
              default:
                displayItems = menuItems;
            }
          }

          // Apply additional filters (search, category, etc.)
          if (filterValues) {
            displayItems = displayItems.filter(item => {
              // Dietary filter
              if (filterValues.dietary.length > 0) {
                const matchesDietary = filterValues.dietary.some(filter => {
                  if (filter === 'Veg') return item.dietary === 'veg';
                  if (filter === 'Non-Veg') return item.dietary === 'non-veg';
                  if (filter === 'Vegan') return item.dietary === 'vegan';
                  if (filter === 'Jain') return item.dietary === 'jain';
                  return false;
                });
                if (!matchesDietary) return false;
              }

              // Price filter
              if (filterValues.priceRange.length > 0) {
                const itemPriceRange = getPriceRange(item.price);
                if (!filterValues.priceRange.includes(itemPriceRange)) return false;
              }

              return true;
            });

            // Sort items
            displayItems = sortItems(displayItems, filterValues.sortBy, filterValues.sortOrder);
          }

          console.log('Current displayItems state:', displayItems);
          return displayItems.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-gray-400 text-lg mb-2">🍽️</div>
              <h3 className="text-white text-xl font-semibold mb-2">No menu items found</h3>
              <p className="text-gray-400">No menu items available for the selected filters</p>
            </div>
          ) : (
           <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
             {displayItems.map(item => {
                               const quantity = getItemQuantity(item._id);
                const isHovered = hoveredDishId === item._id;
               
               return (
                                   <div 
                    key={item._id} 
                    className="bg-dark-800 rounded-lg border border-dark-700 overflow-hidden hover:shadow-lg transition-all duration-300 hover:border-sera-blue/50 group relative"
                                                   onMouseEnter={() => setHoveredDishId(item._id)}
                                onMouseLeave={() => setHoveredDishId(null)}
                 >
                   {/* Dish Image */}
                   <div className="relative h-48 overflow-hidden">
                     <img 
                       src={item.image} 
                       alt={item.name}
                       className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                     />
                     
                     {/* Hover Overlay */}
                     {isHovered && (
                       <div className="absolute inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-20 transition-all duration-300">
                         <div className="text-center space-y-3">
                           <h3 className="text-white font-bold text-lg">{item.name}</h3>
                           <p className="text-white/80 text-sm px-4">{item.description}</p>
                           <div className="flex space-x-3 justify-center">
                             {restaurant.status !== 'OPEN' ? (
                               <div className="text-center">
                                 <div className="text-red-400 font-semibold mb-2">🚫 Restaurant Closed</div>
                                 <p className="text-white/70 text-sm">Orders not available at this time</p>
                               </div>
                             ) : (
                               <>
                                 <button
                                   onClick={() => handleCustomizeDish(item)}
                                   className="bg-sera-orange text-white px-4 py-2 rounded-lg font-semibold hover:bg-sera-orange/80 transition-colors"
                                 >
                                   Customize
                                 </button>
                                 <button
                                   onClick={() => handleAddToCart(item)}
                                   className="bg-sera-blue text-white px-4 py-2 rounded-lg font-semibold hover:bg-sera-blue/80 transition-colors"
                                 >
                                   Quick Add
                                 </button>
                               </>
                             )}
                           </div>
                         </div>
                       </div>
                     )}

                     {/* Dietary Badge */}
                     <div className="absolute top-3 left-3">
                       <div className="bg-white/90 text-dark-900 text-xs px-2 py-1 rounded-full font-medium">
                         {item.dietary === 'veg' ? '🌿 Veg' : item.dietary === 'non-veg' ? '🍖 Non-Veg' : item.dietary.toUpperCase()}
                       </div>
                     </div>

                     {/* Spice Level Badge */}
                     {item.spiceLevel && (
                       <div className="absolute top-3 right-3">
                         <div className="bg-red-500/90 text-white text-xs px-2 py-1 rounded-full font-medium">
                           {item.spiceLevel === 'mild' ? '🌶️ Mild' : 
                            item.spiceLevel === 'medium' ? '🌶️🌶️ Medium' :
                            item.spiceLevel === 'hot' ? '🌶️🌶️🌶️ Hot' : '🌶️🌶️🌶️🌶️ Extra Hot'}
                         </div>
                       </div>
                     )}

                     {/* Quick Add Button */}
                     {quantity === 0 ? (
                       <div className="absolute bottom-3 right-3 flex space-x-2">
                         {restaurant.status !== 'OPEN' ? (
                           <div className="bg-red-500/90 text-white px-3 py-2 rounded-full text-xs font-medium shadow-lg">
                             🚫 Closed
                           </div>
                         ) : (
                           <>
                             <button
                               onClick={() => handleCustomizeDish(item)}
                               className="bg-sera-orange text-white p-2 rounded-full hover:bg-sera-orange/80 transition-colors shadow-lg"
                               title="Customize"
                             >
                               <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                               </svg>
                             </button>
                             <button
                               onClick={() => handleAddToCart(item)}
                               className="bg-sera-blue text-white p-2 rounded-full hover:bg-sera-blue/80 transition-colors shadow-lg"
                               title="Quick Add"
                             >
                               <ShoppingCart className="w-5 h-5" />
                             </button>
                           </>
                         )}
                       </div>
                     ) : (
                       <div className="absolute bottom-3 right-3 bg-sera-blue text-white px-3 py-1 rounded-full flex items-center space-x-2 shadow-lg">
                         {restaurant.status === 'OPEN' ? (
                           <>
                             <button
                               onClick={() => handleUpdateQuantity(item._id, quantity - 1)}
                               className="text-sm font-bold hover:text-sera-orange transition-colors"
                             >
                               +
                             </button>
                             <span className="text-sm font-medium">{quantity}</span>
                             <button
                               onClick={() => handleAddToCart(item)}
                               className="text-sm font-bold hover:text-sera-orange transition-colors"
                             >
                               +
                             </button>
                           </>
                         ) : (
                           <div className="bg-red-500/90 text-white px-3 py-1 rounded-full text-xs font-medium">
                             🚫 Closed
                           </div>
                         )}
                       </div>
                     )}
                   </div>

                   {/* Dish Info */}
                   <div className="p-4">
                     {/* Name and Rating - ALWAYS 2 lines regardless of content */}
                     <div className="flex items-start justify-between mb-3" style={{ height: '48px', minHeight: '48px' }}>
                       <h3 
                         className="text-white font-semibold text-lg group-hover:text-sera-blue transition-all duration-300 leading-tight"
                         style={{
                           height: '2.8rem',
                           minHeight: '2.8rem',
                           lineHeight: '1.4rem',
                           overflow: 'hidden',
                           display: '-webkit-box',
                           WebkitLineClamp: 2,
                           WebkitBoxOrient: 'vertical',
                           margin: 0,
                           flex: 1,
                           marginRight: '12px'
                         }}
                       >
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
                     <div style={{ height: '40px', marginBottom: '12px', overflow: 'hidden' }}>
                       <p 
                         className="text-gray-400 text-sm"
                         style={{
                           margin: 0,
                           lineHeight: '1.2rem',
                           maxHeight: '2.4rem',
                           overflow: 'hidden',
                           display: '-webkit-box',
                           WebkitLineClamp: 2,
                           WebkitBoxOrient: 'vertical'
                         }}
                       >
                         {item.description}
                       </p>
                     </div>

                     {/* Prep Time and Price - Fixed height */}
                     <div className="flex items-center justify-between text-sm mb-3" style={{ height: '20px', overflow: 'hidden' }}>
                       <div className="flex items-center space-x-2 text-gray-400">
                         <span>⏰ {item.prepTime}</span>
                         {item.calories && <span>🔥 {item.calories} cal</span>}
                       </div>
                       <span className="text-sera-orange font-semibold">{item.price}</span>
                     </div>

                                           {/* Add to Cart Button - Fixed height */}
                      <div style={{ height: '40px' }}>
                        {quantity === 0 ? (
                          <div className="flex space-x-2 h-full">
                            {restaurant.status !== 'OPEN' ? (
                              <div className="flex-1 bg-red-500/90 text-white py-2 px-3 rounded-lg font-semibold text-sm flex items-center justify-center">
                                🚫 Restaurant Closed
                              </div>
                            ) : (
                              <button
                                onClick={() => handleAddToCart(item)}
                                className="flex-1 bg-gradient-to-r from-sera-blue to-blue-600 text-white py-2 px-3 rounded-lg font-semibold hover:from-blue-600 hover:to-blue-700 transition-all duration-200 hover:scale-105 active:scale-95 shadow-lg hover:shadow-xl border border-blue-500/30 text-sm"
                              >
                                Quick Add
                              </button>
                            )}
                          </div>
                       ) : (
                         <div className="flex items-center justify-between h-full bg-gradient-to-r from-sera-orange via-orange-500 to-orange-600 rounded-lg p-2 shadow-xl border border-orange-400/40 relative overflow-hidden">
                           {/* Animated background effect */}
                           <div className="absolute inset-0 bg-gradient-to-r from-white/10 via-transparent to-white/10 animate-pulse"></div>
                           
                           <div className="flex items-center space-x-3 relative z-10">
                             <div className="w-7 h-7 bg-white/25 rounded-full flex items-center justify-center backdrop-blur-sm border border-white/30">
                               <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                                 <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                               </svg>
                             </div>
                             <div className="flex flex-col">
                               <span className="text-white font-bold text-sm tracking-wide">IN CART</span>
                               <span className="text-white/90 text-xs font-medium">{quantity} {quantity === 1 ? 'item' : 'items'}</span>
                             </div>
                           </div>
                           
                           <div className="flex items-center space-x-2 relative z-10">
                                                           <button
                                onClick={() => handleUpdateQuantity(item._id, quantity - 1)}
                                className="w-7 h-7 bg-white/25 text-white rounded-full flex items-center justify-center hover:bg-white/40 transition-all duration-200 text-sm font-bold backdrop-blur-sm border border-white/30 hover:scale-110 active:scale-95"
                                disabled={restaurant.status !== 'OPEN'}
                              >
                                −
                              </button>
                             <span className="text-white font-bold text-base min-w-[24px] text-center bg-white/20 px-2 py-1 rounded-md backdrop-blur-sm border border-white/30">{quantity}</span>
                             <button
                               onClick={() => handleAddToCart(item)}
                               className="w-7 h-7 bg-white/25 text-white rounded-full flex items-center justify-center hover:bg-white/40 transition-all duration-200 text-sm font-bold backdrop-blur-sm border border-white/30 hover:scale-110 active:scale-95"
                               disabled={restaurant.status !== 'OPEN'}
                             >
                               +
                             </button>
                           </div>
                         </div>
                       )}
                     </div>
                   </div>
                 </div>
               );
             })}
           </div>
         );
       })()}

        {/* View All Button */}
        <div className="mt-8 text-center">
          <button className="px-8 py-3 bg-dark-700 text-white rounded-lg hover:bg-dark-600 transition-colors">
            View All Menu Items
          </button>
        </div>
      </div>

             {/* Floating Cart Button */}
       {cartState.totalItems > 0 && (
         <div className="fixed bottom-6 right-6 z-50">
           <button 
             onClick={() => setIsCartOpen(true)}
             className="relative w-16 h-16 bg-gradient-to-r from-sera-blue to-sera-blue/90 text-white rounded-full shadow-2xl hover:shadow-3xl transition-all duration-300 hover:scale-110 active:scale-95 flex items-center justify-center group border-2 border-white/20"
           >
             <ShoppingCart className="w-7 h-7 group-hover:scale-110 transition-transform duration-200" />
             <div className="absolute -top-3 -right-3 w-8 h-8 bg-gradient-to-r from-sera-orange to-orange-500 text-white rounded-full text-sm flex items-center justify-center font-bold shadow-lg border-2 border-white animate-pulse">
               {cartState.totalItems}
             </div>
             {/* Cart total amount tooltip */}
             <div className="absolute bottom-full right-0 mb-2 px-3 py-2 bg-dark-800 text-white text-sm rounded-lg shadow-lg border border-dark-600 opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap">
               <div className="flex items-center space-x-2">
                 <span>Total:</span>
                 <span className="font-bold text-sera-orange">₹{cartState.totalAmount}</span>
               </div>
               <div className="absolute top-full right-4 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-dark-800"></div>
             </div>
           </button>
         </div>
       )}

      {/* Dish Customization Modal */}
      <DishCustomizationModal
        isOpen={isDishCustomizationOpen}
        onClose={handleCloseCustomization}
        dish={selectedDish}
      />

      {/* Cart Modal */}
      <CartModal
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
      />
    </div>
  );
};

export default RestaurantDetail;
