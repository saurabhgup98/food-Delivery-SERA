import { MenuFilterSelections } from '../Restaurant/Config/RestaurantMenuFilterModalConfig';
import { MenuItemI } from '../Restaurant/Config/RestaurantInterfaces';

/**
 * Get price range category from price string
 * @param price - Price string (e.g., "₹320")
 * @returns Price range category string
 */
export const getPriceRange = (price: string): string => {
  const num = parseInt(price.replace('₹', ''));
  if (num < 100) return 'Budget <₹100';
  if (num <= 300) return '₹100-₹300';
  return '>₹300';
};

/**
 * Check if menu item matches dietary filter
 * @param item - Menu item to check
 * @param dietaryFilters - Array of dietary filter strings
 * @returns True if item matches any dietary filter
 */
export const matchesDietary = (item: MenuItemI, dietaryFilters: string[]): boolean => {
  if (!dietaryFilters || dietaryFilters.length === 0) return true;
  return dietaryFilters.some(filter => {
    if (filter === 'Veg') return item.dietary === 'veg';
    if (filter === 'Non-Veg') return item.dietary === 'non-veg';
    if (filter === 'Vegan') return item.dietary === 'vegan';
    if (filter === 'Jain') return item.dietary === 'jain';
    return false;
  });
};

/**
 * Check if menu item matches price filter
 * @param item - Menu item to check
 * @param priceFilters - Array of price range filter strings
 * @returns True if item matches any price filter
 */
export const matchesPrice = (item: MenuItemI, priceFilters: string[]): boolean => {
  if (!priceFilters || priceFilters.length === 0) return true;
  const itemPriceRange = getPriceRange(item.price);
  return priceFilters.includes(itemPriceRange);
};

/**
 * Sort menu items by specified criteria
 * @param items - Array of menu items to sort
 * @param sortBy - Field to sort by ('name', 'price', 'rating', 'prepTime')
 * @param sortOrder - Sort order ('asc' or 'desc')
 * @returns Sorted array of menu items
 */
export const sortItems = (
  items: MenuItemI[],
  sortBy: string,
  sortOrder: 'asc' | 'desc'
): MenuItemI[] => {
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

/**
 * @param items - Array of menu items to filter
 * @param filterValues - Filter selections object
 * @returns Filtered and sorted array of menu items
 */
export const filterMenuItems = (
  items: MenuItemI[],
  filterValues: MenuFilterSelections | null
): MenuItemI[] => {
  let filteredItems = items || [];

  // Apply advanced filters
  if (filterValues) {
    // Dietary filter
    filteredItems = filteredItems.filter(item => 
      matchesDietary(item, filterValues.dietary)
    );

    // Price filter
    filteredItems = filteredItems.filter(item => 
      matchesPrice(item, filterValues.priceRange)
    );

    // Sort items
    filteredItems = sortItems(
      filteredItems,
      filterValues.sortBy,
      filterValues.sortOrder
    );
  }

  return filteredItems;
};