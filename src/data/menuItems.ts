export interface MenuItem {
  id: number;
  name: string;
  description: string;
  price: string;
  image: string;
  category: string;
  dietary: 'veg' | 'non-veg' | 'jain' | 'vegan';
  prepTime: string;
  rating: number;
  isPopular: boolean;
  isChefSpecial: boolean;
  isQuickOrder: boolean;
  isTrending: boolean;
  spiceLevel?: 'mild' | 'medium' | 'hot' | 'extra-hot';
  allergens?: string[];
  calories?: number;
}

export const menuItems: MenuItem[] = [
  // Starters
  {
    id: 1,
    name: 'Paneer Tikka',
    description: 'Marinated cottage cheese grilled to perfection with aromatic spices',
    price: '₹220',
    image: 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=300&h=200&fit=crop',
    category: 'starters',
    dietary: 'veg',
    prepTime: '12 min',
    rating: 4.5,
    isPopular: true,
    isChefSpecial: false,
    isQuickOrder: true,
    isTrending: false,
    spiceLevel: 'medium',
    allergens: ['dairy'],
    calories: 280
  },
  {
    id: 2,
    name: 'Chicken 65',
    description: 'Spicy deep-fried chicken with curry leaves and red chilies',
    price: '₹280',
    image: 'https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=300&h=200&fit=crop',
    category: 'starters',
    dietary: 'non-veg',
    prepTime: '15 min',
    rating: 4.7,
    isPopular: true,
    isChefSpecial: false,
    isQuickOrder: false,
    isTrending: true,
    spiceLevel: 'hot',
    allergens: ['eggs'],
    calories: 320
  },
  {
    id: 3,
    name: 'Veg Spring Rolls',
    description: 'Crispy rolls filled with fresh vegetables and noodles',
    price: '₹180',
    image: 'https://images.unsplash.com/photo-1563379091339-03246963d8a9?w=300&h=200&fit=crop',
    category: 'starters',
    dietary: 'veg',
    prepTime: '8 min',
    rating: 4.3,
    isPopular: false,
    isChefSpecial: false,
    isQuickOrder: true,
    isTrending: false,
    spiceLevel: 'mild',
    calories: 220
  },

  // Main Course
  {
    id: 4,
    name: 'Butter Chicken',
    description: 'Tender chicken in rich tomato and butter gravy with cream',
    price: '₹320',
    image: 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=300&h=200&fit=crop',
    category: 'mains',
    dietary: 'non-veg',
    prepTime: '20 min',
    rating: 4.8,
    isPopular: true,
    isChefSpecial: true,
    isQuickOrder: false,
    isTrending: true,
    spiceLevel: 'mild',
    allergens: ['dairy'],
    calories: 450
  },
  {
    id: 5,
    name: 'Paneer Butter Masala',
    description: 'Cottage cheese in rich tomato and butter gravy',
    price: '₹280',
    image: 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=300&h=200&fit=crop',
    category: 'mains',
    dietary: 'veg',
    prepTime: '18 min',
    rating: 4.6,
    isPopular: true,
    isChefSpecial: false,
    isQuickOrder: false,
    isTrending: false,
    spiceLevel: 'mild',
    allergens: ['dairy'],
    calories: 380
  },
  {
    id: 6,
    name: 'Chicken Biryani',
    description: 'Aromatic basmati rice cooked with tender chicken and spices',
    price: '₹380',
    image: 'https://images.unsplash.com/photo-1563379091339-03246963d8a9?w=300&h=200&fit=crop',
    category: 'mains',
    dietary: 'non-veg',
    prepTime: '25 min',
    rating: 4.9,
    isPopular: true,
    isChefSpecial: true,
    isQuickOrder: false,
    isTrending: true,
    spiceLevel: 'medium',
    calories: 520
  },
  {
    id: 7,
    name: 'Veg Biryani',
    description: 'Aromatic basmati rice with fresh vegetables and spices',
    price: '₹280',
    image: 'https://images.unsplash.com/photo-1563379091339-03246963d8a9?w=300&h=200&fit=crop',
    category: 'mains',
    dietary: 'veg',
    prepTime: '22 min',
    rating: 4.4,
    isPopular: false,
    isChefSpecial: false,
    isQuickOrder: false,
    isTrending: false,
    spiceLevel: 'medium',
    calories: 420
  },
  {
    id: 8,
    name: 'Tandoori Chicken',
    description: 'Marinated chicken roasted in traditional clay oven',
    price: '₹350',
    image: 'https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=300&h=200&fit=crop',
    category: 'mains',
    dietary: 'non-veg',
    prepTime: '20 min',
    rating: 4.7,
    isPopular: true,
    isChefSpecial: false,
    isQuickOrder: false,
    isTrending: true,
    spiceLevel: 'medium',
    calories: 480
  },

  // Breads & Rice
  {
    id: 9,
    name: 'Butter Naan',
    description: 'Soft leavened bread brushed with butter',
    price: '₹40',
    image: 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=300&h=200&fit=crop',
    category: 'breads',
    dietary: 'veg',
    prepTime: '5 min',
    rating: 4.2,
    isPopular: true,
    isChefSpecial: false,
    isQuickOrder: true,
    isTrending: false,
    allergens: ['dairy'],
    calories: 120
  },
  {
    id: 10,
    name: 'Jeera Rice',
    description: 'Basmati rice flavored with cumin seeds',
    price: '₹120',
    image: 'https://images.unsplash.com/photo-1563379091339-03246963d8a9?w=300&h=200&fit=crop',
    category: 'breads',
    dietary: 'veg',
    prepTime: '8 min',
    rating: 4.0,
    isPopular: false,
    isChefSpecial: false,
    isQuickOrder: true,
    isTrending: false,
    calories: 180
  },
  {
    id: 11,
    name: 'Veg Fried Rice',
    description: 'Stir-fried rice with fresh vegetables',
    price: '₹180',
    image: 'https://images.unsplash.com/photo-1563379091339-03246963d8a9?w=300&h=200&fit=crop',
    category: 'breads',
    dietary: 'veg',
    prepTime: '10 min',
    rating: 4.3,
    isPopular: false,
    isChefSpecial: false,
    isQuickOrder: true,
    isTrending: false,
    spiceLevel: 'mild',
    calories: 250
  },

  // Desserts
  {
    id: 12,
    name: 'Gulab Jamun',
    description: 'Soft milk solids dumplings soaked in sugar syrup',
    price: '₹80',
    image: 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=300&h=200&fit=crop',
    category: 'desserts',
    dietary: 'veg',
    prepTime: '3 min',
    rating: 4.5,
    isPopular: true,
    isChefSpecial: false,
    isQuickOrder: true,
    isTrending: false,
    allergens: ['dairy'],
    calories: 280
  },
  {
    id: 13,
    name: 'Rasmalai',
    description: 'Soft cottage cheese patties in sweetened milk',
    price: '₹100',
    image: 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=300&h=200&fit=crop',
    category: 'desserts',
    dietary: 'veg',
    prepTime: '3 min',
    rating: 4.6,
    isPopular: false,
    isChefSpecial: true,
    isQuickOrder: true,
    isTrending: true,
    allergens: ['dairy'],
    calories: 320
  },

  // Beverages
  {
    id: 14,
    name: 'Masala Chai',
    description: 'Traditional Indian spiced tea with milk',
    price: '₹40',
    image: 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=300&h=200&fit=crop',
    category: 'beverages',
    dietary: 'veg',
    prepTime: '5 min',
    rating: 4.1,
    isPopular: true,
    isChefSpecial: false,
    isQuickOrder: true,
    isTrending: false,
    allergens: ['dairy'],
    calories: 80
  },
  {
    id: 15,
    name: 'Mango Lassi',
    description: 'Sweet yogurt-based drink with fresh mango',
    price: '₹60',
    image: 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=300&h=200&fit=crop',
    category: 'beverages',
    dietary: 'veg',
    prepTime: '3 min',
    rating: 4.4,
    isPopular: false,
    isChefSpecial: false,
    isQuickOrder: true,
    isTrending: true,
    allergens: ['dairy'],
    calories: 150
  }
];

export const getMenuItemsByCategory = (category: string): MenuItem[] => {
  return menuItems.filter(item => item.category === category);
};

export const getPopularItems = (): MenuItem[] => {
  return menuItems.filter(item => item.isPopular);
};

export const getChefSpecials = (): MenuItem[] => {
  return menuItems.filter(item => item.isChefSpecial);
};

export const getQuickOrderItems = (): MenuItem[] => {
  return menuItems.filter(item => item.isQuickOrder);
};

export const getTrendingItems = (): MenuItem[] => {
  return menuItems.filter(item => item.isTrending);
};

export const searchMenuItems = (query: string): MenuItem[] => {
  const searchTerm = query.toLowerCase();
  return menuItems.filter(item => 
    item.name.toLowerCase().includes(searchTerm) ||
    item.description.toLowerCase().includes(searchTerm) ||
    item.category.toLowerCase().includes(searchTerm)
  );
};
