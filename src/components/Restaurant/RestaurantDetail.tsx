import React, { useState, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  Search,
  Menu,
  ShoppingCart
} from 'lucide-react';
import { Restaurant } from '../../data/restaurants';
import { 
  menuItems, 
  getPopularItems, 
  getChefSpecials, 
  getQuickOrderItems, 
  getTrendingItems,
  searchMenuItems,
  MenuItem 
} from '../../data/menuItems';
import { useCart } from '../../contexts/CartContext';
import FilterModal, { FilterSelections } from './FilterModal';

type TabType = 'top-meals' | 'quick-order' | 'chef-specials' | 'trending';

const RestaurantDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [activeTab, setActiveTab] = useState<TabType>('top-meals');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [isFavorite, setIsFavorite] = useState(false);
  const { state: cartState, addItem, getItemQuantity } = useCart();
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [filterValues, setFilterValues] = useState<FilterSelections | null>(null);

  // Helper function to get price range from price string
  const getPriceRange = (price: string) => {
    const num = parseInt(price.replace('₹', ''));
    if (num < 100) return 'Budget <₹100';
    if (num <= 300) return '₹100-₹300';
    return '>₹300';
  };

  // Helper function to check if item matches dietary filter
  const matchesDietary = (item: MenuItem, dietaryFilters: string[]) => {
    if (dietaryFilters.length === 0) return true;
    return dietaryFilters.some(filter => {
      if (filter === 'Veg') return item.dietary === 'veg';
      if (filter === 'Non-Veg') return item.dietary === 'non-veg';
      if (filter === 'Vegan') return item.dietary === 'vegan';
      if (filter === 'Jain') return item.dietary === 'jain';
      return false;
    });
  };

  // Helper function to check if item matches price filter
  const matchesPrice = (item: MenuItem, priceFilters: string[]) => {
    if (priceFilters.length === 0) return true;
    const itemPriceRange = getPriceRange(item.price);
    return priceFilters.includes(itemPriceRange);
  };

  // Helper function to sort items
  const sortItems = (items: MenuItem[], sortBy: string, sortOrder: 'asc' | 'desc') => {
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
  };

  // Mock restaurant data - in real app, fetch by ID
  const restaurant: Restaurant = {
    id: '1',
    name: 'Spice Garden',
    image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&h=400&fit=crop',
    rating: 4.5,
    reviewCount: 1247,
    cuisine: ['Indian', 'North Indian', 'Mughlai'],
    dietary: 'both',
    deliveryTime: '30-45 min',
    deliveryFee: '₹30',
    minimumOrder: '₹200',
    distance: '2.1 km',
    popularDishes: ['Butter Chicken', 'Biryani', 'Naan', 'Tandoori Chicken'],
    offers: ['20% off on orders above ₹500', 'Free delivery'],
    isOpen: true,
    isFavorite: false,
    priceRange: 'mid-range',
    features: ['Pure veg available', 'Family restaurant', 'Fine dining']
  };

  // Menu categories
  const menuCategories = [
    { id: 'starters', name: 'Starters', count: menuItems.filter(item => item.category === 'starters').length },
    { id: 'mains', name: 'Main Course', count: menuItems.filter(item => item.category === 'mains').length },
    { id: 'breads', name: 'Breads & Rice', count: menuItems.filter(item => item.category === 'breads').length },
    { id: 'desserts', name: 'Desserts', count: menuItems.filter(item => item.category === 'desserts').length },
    { id: 'beverages', name: 'Beverages', count: menuItems.filter(item => item.category === 'beverages').length }
  ];

  // Get menu items based on active tab
  const getTabData = (tab: TabType): MenuItem[] => {
    switch (tab) {
      case 'top-meals':
        return getPopularItems();
      case 'quick-order':
        return getQuickOrderItems();
      case 'chef-specials':
        return getChefSpecials();
      case 'trending':
        return getTrendingItems();
      default:
        return getPopularItems();
    }
  };

  // Filter menu items based on search and category
  const filteredMenuItems = useMemo(() => {
    let items = getTabData(activeTab);

    // Search filter
    if (searchQuery) {
      items = searchMenuItems(searchQuery).filter(item => 
        getTabData(activeTab).some(tabItem => tabItem.id === item.id)
      );
    }

    // Category filter
    if (selectedCategory !== 'all') {
      items = items.filter(item => item.category === selectedCategory);
    }

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
  }, [activeTab, searchQuery, selectedCategory, filterValues]);

  const tabs = [
    { id: 'top-meals', label: 'Top Meals', count: getPopularItems().length },
    { id: 'quick-order', label: 'Quick Order', count: getQuickOrderItems().length },
    { id: 'chef-specials', label: 'Chef\'s Specials', count: getChefSpecials().length },
    { id: 'trending', label: 'Trending Now', count: getTrendingItems().length }
  ];

  const handleAddToCart = (item: MenuItem) => {
    addItem(item);
  };

     const renderStars = (rating: number) => {
     const stars: JSX.Element[] = [];
     const fullStars = Math.floor(rating);
     const hasHalfStar = rating % 1 !== 0;

     for (let i = 0; i < fullStars; i++) {
       stars.push(
         <span key={i} className="text-yellow-400">⭐</span>
       );
     }

     if (hasHalfStar) {
       stars.push(
         <span key="half" className="text-yellow-400">⭐</span>
       );
     }

     const emptyStars = 5 - Math.ceil(rating);
     for (let i = 0; i < emptyStars; i++) {
       stars.push(
         <span key={`empty-${i}`} className="text-gray-400">☆</span>
       );
     }

     return stars;
   };

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
            <select 
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="bg-dark-700 border border-dark-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-sera-blue"
            >
              <option value="all">All Categories</option>
              {menuCategories.map(category => (
                <option key={category.id} value={category.id}>
                  {category.name} ({category.count})
                </option>
              ))}
            </select>

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
         {filteredMenuItems.length === 0 ? (
           <div className="text-center py-12">
             <div className="text-gray-400 text-lg mb-2">🍽️</div>
             <h3 className="text-white text-xl font-semibold mb-2">No items found</h3>
             <p className="text-gray-400">Try adjusting your search or filters</p>
           </div>
         ) : (
           <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
             {filteredMenuItems.map(item => {
               const quantity = getItemQuantity(item.id);
               return (
                 <div key={item.id} className="bg-dark-800 rounded-lg border border-dark-700 overflow-hidden hover:shadow-lg transition-all duration-300 hover:border-sera-blue/50 group">
                   {/* Dish Image */}
                   <div className="relative h-48 overflow-hidden">
                     <img 
                       src={item.image} 
                       alt={item.name}
                       className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                     />
                     
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
                       <button
                         onClick={() => handleAddToCart(item)}
                         className="absolute bottom-3 right-3 bg-sera-blue text-white p-2 rounded-full hover:bg-sera-blue/80 transition-colors shadow-lg"
                       >
                         <ShoppingCart className="w-5 h-5" />
                       </button>
                     ) : (
                       <div className="absolute bottom-3 right-3 bg-sera-blue text-white px-3 py-1 rounded-full flex items-center space-x-2 shadow-lg">
                         <button
                           onClick={() => handleAddToCart(item)}
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
                       </div>
                     )}
                   </div>

                   {/* Dish Info */}
                   <div className="p-4">
                     <div className="flex items-start justify-between mb-2">
                       <h3 className="text-white font-semibold text-lg group-hover:text-sera-blue transition-colors">
                         {item.name}
                       </h3>
                       <div className="flex items-center space-x-1">
                         {renderStars(item.rating)}
                         <span className="text-white text-sm font-medium">{item.rating}</span>
                       </div>
                     </div>

                     <p className="text-gray-400 text-sm mb-3 line-clamp-2">
                       {item.description}
                     </p>

                     <div className="flex items-center justify-between text-sm mb-3">
                       <div className="flex items-center space-x-2 text-gray-400">
                         <span>⏰ {item.prepTime}</span>
                         {item.calories && <span>🔥 {item.calories} cal</span>}
                       </div>
                       <span className="text-sera-orange font-semibold">{item.price}</span>
                     </div>

                     {quantity === 0 ? (
                       <button
                         onClick={() => handleAddToCart(item)}
                         className="w-full bg-sera-blue text-white py-2 px-4 rounded-lg font-medium hover:bg-sera-blue/80 transition-colors"
                       >
                         Add to Cart
                       </button>
                     ) : (
                       <div className="flex items-center justify-between">
                         <span className="text-white text-sm">In cart: {quantity}</span>
                         <button
                           onClick={() => handleAddToCart(item)}
                           className="bg-sera-orange text-white px-3 py-1 rounded-lg text-sm font-medium hover:bg-sera-orange/80 transition-colors"
                         >
                           Add More
                         </button>
                       </div>
                     )}
                   </div>
                 </div>
               );
             })}
           </div>
         )}

        {/* View All Button */}
        <div className="mt-8 text-center">
          <button className="px-8 py-3 bg-dark-700 text-white rounded-lg hover:bg-dark-600 transition-colors">
            View All Menu Items
          </button>
        </div>
      </div>

             {/* Floating Cart Button */}
       {cartState.totalItems > 0 && (
         <div className="fixed bottom-6 right-6">
           <button className="relative w-14 h-14 bg-sera-blue text-white rounded-full shadow-lg hover:bg-sera-blue/80 transition-colors flex items-center justify-center">
             <ShoppingCart className="w-6 h-6" />
             <span className="absolute -top-2 -right-2 w-6 h-6 bg-sera-orange text-white rounded-full text-xs flex items-center justify-center font-bold">
               {cartState.totalItems}
             </span>
           </button>
         </div>
       )}
    </div>
  );
};

export default RestaurantDetail;
