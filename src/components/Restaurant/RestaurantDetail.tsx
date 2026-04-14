import React, { useState, useMemo, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Menu, ShoppingCart, X } from 'lucide-react';
import { useCart } from '../../contexts/CartContext';
import MenuFilterModal, { MenuFilterSelections } from './MenuFilterModal';
import { DEFAULT_MENU_FILTERS } from './Config/RestaurantMenuFilterModalConfig';
import CartModal from '../Cart/CartModal';
import { AnimatedLoader } from '../Loader';
import PrimaryDropdown, { DropdownOptionI } from '../Dropdown/PrimaryDropdown';
import PrimarySearchBar from '../Input/PrimarySearchBar';
import DishCustomizationModal from '../Modal/DishCustomizationModal';
import RestaurantDetailsHeroSection from './RestaurantDetailsHeroSection';
import RestaurantItemCard from './RestaurantItemCard';
import { PrimaryActionBtn } from '../buttons';
import { MenuItemI, RestaurantI } from './Config/RestaurantInterfaces';
import { restaurantService } from '../../services/RestaurantService';
import { getRestaurantButtonProps, RestaurantButtonType } from './Config/RestaurantButtonConfig';

type TabType = 'all-meals' | 'top-meals' | 'quick-order' | 'chef-specials' | 'trending';

const RestaurantDetail: React.FC = () => {
  const { id: restaurantId } = useParams<{ id: string }>();
  const [activeTab, setActiveTab] = useState<TabType>('all-meals');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [isFavorite, setIsFavorite] = useState(false);
  const { state: cartState, addItem, getItemQuantity, updateQuantity } = useCart();
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [filterValues, setFilterValues] = useState<MenuFilterSelections>(DEFAULT_MENU_FILTERS);
  const [isDishCustomizationOpen, setIsDishCustomizationOpen] = useState(false);
  const [selectedDish, setSelectedDish] = useState<MenuItemI | null>(null);
  const [hoveredDishId, setHoveredDishId] = useState<string | null>(null);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [showAllItems, setShowAllItems] = useState(false);

  // State for API data
  const [restaurant, setRestaurant] = useState<RestaurantI | null>(null);
  const [menuItems, setMenuItems] = useState<MenuItemI[]>([]);
  const [loading, setLoading] = useState(true);
  const [menuLoading, setMenuLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch restaurant data from API
  const fetchRestaurant = async () => {
    if (!restaurantId) return;

    setLoading(true);
    setError(null);

    try {
      const response = await restaurantService.getRestaurant(restaurantId);
      if (response.success && response.data.restaurant) {
        setRestaurant(response.data.restaurant);
        setIsFavorite(response.data.restaurant.isFavorite || false);
      } else {
        setError('Failed to load restaurant');
      }
    } catch (err: any) {
      console.error('Error fetching restaurant:', err);
      setError(err?.message || 'Failed to load restaurant');
      setRestaurant(null);
    } finally {
      setLoading(false);
    }
  };

  // Fetch menu items from API
  const fetchMenuItems = async () => {
    if (!restaurantId) return;

    setMenuLoading(true);

    try {
      const response = await restaurantService.getRestaurantMenu(restaurantId, {
        category: selectedCategory && selectedCategory !== 'all' ? selectedCategory : undefined
      });
      if (response.success && response.data.menu) {
        setMenuItems(response.data.menu);
      } else {
        setMenuItems([]);
      }
    } catch (err: any) {
      console.error('Error fetching menu items:', err);
      setMenuItems([]);
    } finally {
      setMenuLoading(false);
    }
  };

  // Fetch data on component mount and when dependencies change
  useEffect(() => {
    fetchRestaurant();
  }, [restaurantId]);

  useEffect(() => {
    if (restaurantId && restaurant) {
      // Always fetch menu items (even for closed restaurants)
      // Users can browse menu but cannot add to cart or customize
      fetchMenuItems();
    }
  }, [restaurantId, selectedCategory, restaurant]);

  // Show all menu items (filtering will be done by API later)
  const filteredMenuItems = menuItems || [];

  // Menu categories
  const menuCategories = useMemo(() => {
    const categories = ['starters', 'mains', 'breads', 'desserts', 'beverages'];
    return categories.map(category => ({
      id: category,
      name: category.charAt(0).toUpperCase() + category.slice(1),
      count: filteredMenuItems ? filteredMenuItems.filter(item => item.category === category).length : 0
    }));
  }, [filteredMenuItems]);

  // Dropdown options for categories
  const categoryOptions: DropdownOptionI[] = useMemo(() => {
    const options: DropdownOptionI[] = [
      { value: 'all', label: 'All Categories', icon: '🍽️' }
    ];

    menuCategories.forEach(category => {
      options.push({
        value: category.id,
        label: `${category.name} (${category.count})`,
        icon: category.id === 'starters' ? '🥗' :
          category.id === 'mains' ? '🍛' :
            category.id === 'breads' ? '🍞' :
              category.id === 'desserts' ? '🍰' :
                category.id === 'beverages' ? '🥤' : '🍽️'
      });
    });

    return options;
  }, [menuCategories]);

  // Calculate tab counts based on ALL menu items (not filtered ones)
  const tabCounts = useMemo(() => {
    if (!menuItems || menuItems.length === 0) {
      return {
        'all-meals': 0,
        'top-meals': 0,
        'quick-order': 0,
        'chef-specials': 0,
        'trending': 0
      };
    }
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

  const handleAddToCart = (item: MenuItemI) => {
    if (!restaurant || restaurant.status !== 'OPEN') {
      return; // Prevent adding items from closed restaurants
    }
    addItem(item);
  };

  const handleCustomizeDish = (item: MenuItemI) => {
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
      <RestaurantDetailsHeroSection
        restaurant={restaurant}
        isFavorite={isFavorite}
        onFavoriteToggle={() => setIsFavorite(!isFavorite)}
        onShare={() => console.log('Share restaurant')}
      />


      {/* Search & Filter Bar */}
      <div className="sticky top-16 z-40 bg-dark-800 border-b border-dark-700 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col md:flex-row gap-4 items-center">
            {/* Search Bar */}
            <div className="flex-1 w-full md:w-auto">
              <PrimarySearchBar
                placeholder="Search in menu..."
                onSearch={setSearchQuery}
                inputBg="bg-slate-700"
                inputBorder="border-slate-600"
                inputTextColor="text-white"
                inputPlaceholderColor="placeholder-gray-400"
                inputFocusRing="focus:ring-blue-500"
                inputFocusBorder="focus:border-transparent"
                leftIconColor="text-gray-400"
                rightIconBg="bg-sera-blue"
                rightIconBgHover="hover:bg-sera-blue/90"
                rightIconColor="text-white"
                className="w-full"
              />
            </div>

            {/* Category Filter */}
            <PrimaryDropdown
              value={selectedCategory}
              onChange={setSelectedCategory}
              options={categoryOptions}
              placeholder="All Categories"
              className="min-w-[200px]"
            />

            {/* Filter Button */}
            <PrimaryActionBtn
              {...getRestaurantButtonProps(RestaurantButtonType.MENU_FILTER_BUTTON_DETAIL, () => setIsFilterOpen(true))}
            />
          </div>
        </div>
      </div>

      <MenuFilterModal
        isOpen={isFilterOpen}
        onClose={() => setIsFilterOpen(false)}
        initialValues={filterValues}
        onApply={(vals) => setFilterValues(vals)}
        onClear={() => setFilterValues(DEFAULT_MENU_FILTERS)}
      />


      {/* Quick Filter Chips */}
      {(filterValues.dietary.length > 0 || filterValues.priceRange.length > 0 || 
        filterValues.mealType.length > 0 || filterValues.cuisine.length > 0 ||
        filterValues.prepTime.length > 0 || filterValues.availability.length > 0 ||
        filterValues.spiceLevel.length > 0 || filterValues.cookingStyle.length > 0 ||
        filterValues.valueOptions.length > 0 || filterValues.sortBy !== 'name' || filterValues.sortOrder !== 'asc') && (
        <div className="sticky top-[120px] z-30 bg-dark-800 border-b border-dark-700 px-4 py-3 shadow-lg">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-wrap gap-2">
              {filterValues.dietary.map(diet => (
                <span key={diet} className="inline-flex items-center gap-1 px-3 py-1 bg-sera-blue/20 text-sera-blue rounded-full text-sm">
                  {diet === 'Veg' ? '🌿' : diet === 'Non-Veg' ? '🍖' : diet === 'Vegan' ? '🌱' : '🕉️'} {diet}
                  <button
                    onClick={() => setFilterValues(prev => ({
                      ...prev,
                      dietary: prev.dietary.filter(d => d !== diet)
                    }))}
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
                    onClick={() => setFilterValues(prev => ({
                      ...prev,
                      priceRange: prev.priceRange.filter(p => p !== price)
                    }))}
                    className="ml-1 hover:text-red-400"
                  >
                    ×
                  </button>
                </span>
              ))}
              {filterValues.mealType.map(meal => (
                <span key={meal} className="inline-flex items-center gap-1 px-3 py-1 bg-green-500/20 text-green-400 rounded-full text-sm">
                  🍽️ {meal}
                  <button
                    onClick={() => setFilterValues(prev => ({
                      ...prev,
                      mealType: prev.mealType.filter(m => m !== meal)
                    }))}
                    className="ml-1 hover:text-red-400"
                  >
                    ×
                  </button>
                </span>
              ))}
              {filterValues.cuisine.map(cuisine => (
                <span key={cuisine} className="inline-flex items-center gap-1 px-3 py-1 bg-purple-500/20 text-purple-400 rounded-full text-sm">
                  🌍 {cuisine}
                  <button
                    onClick={() => setFilterValues(prev => ({
                      ...prev,
                      cuisine: prev.cuisine.filter(c => c !== cuisine)
                    }))}
                    className="ml-1 hover:text-red-400"
                  >
                    ×
                  </button>
                </span>
              ))}
              {(filterValues.sortBy !== 'name' || filterValues.sortOrder !== 'asc') && (
                <span className="inline-flex items-center gap-1 px-3 py-1 bg-gray-600 text-gray-300 rounded-full text-sm">
                  🔄 Sort: {filterValues.sortBy} ({filterValues.sortOrder})
                </span>
              )}
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
                className={`flex items-center space-x-2 py-4 px-2 border-b-2 transition-colors whitespace-nowrap ${activeTab === tab.id
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
        {/* Restaurant Status Banner for Closed Restaurants */}
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
          let displayItems = menuItems || [];
          if (activeTab !== 'all-meals') {
            switch (activeTab) {
              case 'top-meals':
                displayItems = (menuItems || []).filter(item => item.isPopular);
                break;
              case 'quick-order':
                displayItems = (menuItems || []).filter(item => item.isQuickOrder);
                break;
              case 'chef-specials':
                displayItems = (menuItems || []).filter(item => item.isChefSpecial);
                break;
              case 'trending':
                displayItems = (menuItems || []).filter(item => item.isTrending);
                break;
              default:
                displayItems = menuItems || [];
            }
          }

          // Note: Filtering will be done by API later
          // For now, we show all items based on tab selection

          console.log('Current displayItems state:', displayItems);

          // Limit items to 8 if not showing all
          const itemsToShow = showAllItems ? displayItems : (displayItems || []).slice(0, 8);
          const hasMoreItems = (displayItems || []).length > 8;

          return !displayItems || displayItems.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-gray-400 text-lg mb-2">🍽️</div>
              <h3 className="text-white text-xl font-semibold mb-2">No menu items found</h3>
              <p className="text-gray-400">No menu items available for the selected filters</p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {(itemsToShow || []).map(item => {
                  const isHovered = hoveredDishId === item._id;

                  return (
                    <RestaurantItemCard
                      key={item._id}
                      item={item}
                      onAddToCart={handleAddToCart}
                      onCustomize={handleCustomizeDish}
                      getItemQuantity={getItemQuantity}
                      updateQuantity={handleUpdateQuantity}
                      restaurantStatus={restaurant.status}
                      isHovered={isHovered}
                      onMouseEnter={() => setHoveredDishId(item._id)}
                      onMouseLeave={() => setHoveredDishId(null)}
                    />
                  );
                })}
              </div>

              {/* View All Button */}
              {hasMoreItems && (
                <div className="mt-8 text-center">
                  <button
                    onClick={() => setShowAllItems(!showAllItems)}
                    className="px-8 py-3 bg-gradient-to-r from-sera-blue to-blue-600 text-white rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all duration-200 hover:scale-105 active:scale-95 shadow-lg hover:shadow-xl border border-blue-500/30 font-semibold"
                  >
                    {showAllItems ? 'Show Less' : `View All Menu (${(displayItems || []).length} items)`}
                  </button>
                </div>
              )}
            </>
          );
        })()}
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
