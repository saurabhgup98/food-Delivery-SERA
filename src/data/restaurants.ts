export interface Restaurant {
  id: string;
  name: string;
  image: string;
  rating: number;
  reviewCount: number;
  cuisine: string[];
  dietary: 'veg' | 'non-veg' | 'both' | 'jain' | 'vegan';
  deliveryTime: string;
  deliveryFee: string;
  minimumOrder: string;
  distance: string;
  popularDishes: string[];
  offers: string[];
  isOpen: boolean;
  isFavorite: boolean;
  priceRange: 'budget' | 'mid-range' | 'premium';
  features: string[];
  // New status system
  status: 'OPEN' | 'CLOSED' | 'TEMPORARILY_CLOSED' | 'PERMANENTLY_CLOSED';
  subStatus?: 'NORMAL' | 'BUSY' | 'VERY_BUSY'; // Only for OPEN status
  statusDetails?: {
    nextOpenTime?: string; // For CLOSED status
    tempCloseReason?: string; // For TEMPORARILY_CLOSED status
    tempCloseDuration?: string; // For TEMPORARILY_CLOSED status
  };
}

export const restaurants: Restaurant[] = [
  {
    id: '1',
    name: 'Spice Garden',
    image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=400&h=300&fit=crop',
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
    features: ['Pure veg available', 'Family restaurant', 'Fine dining'],
    status: 'OPEN',
    subStatus: 'NORMAL'
  },
  {
    id: '2',
    name: 'Pizza Palace',
    image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=400&h=300&fit=crop',
    rating: 4.2,
    reviewCount: 892,
    cuisine: ['Italian', 'Pizza', 'Pasta'],
    dietary: 'both',
    deliveryTime: '25-40 min',
    deliveryFee: '₹40',
    minimumOrder: '₹300',
    distance: '1.8 km',
    popularDishes: ['Margherita Pizza', 'Pepperoni Pizza', 'Pasta Carbonara', 'Garlic Bread'],
    offers: ['Buy 1 Get 1 Free on Pizzas'],
    isOpen: true,
    isFavorite: true,
    priceRange: 'mid-range',
    features: ['Wood-fired oven', 'Fresh ingredients'],
    status: 'OPEN',
    subStatus: 'BUSY'
  },
  {
    id: '3',
    name: 'Green Leaf',
    image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&h=300&fit=crop',
    rating: 4.7,
    reviewCount: 567,
    cuisine: ['Indian', 'South Indian', 'Vegetarian'],
    dietary: 'veg',
    deliveryTime: '20-35 min',
    deliveryFee: '₹20',
    minimumOrder: '₹150',
    distance: '1.2 km',
    popularDishes: ['Masala Dosa', 'Idli Sambar', 'Pongal', 'Filter Coffee'],
    offers: ['15% off for first order'],
    isOpen: true,
    isFavorite: false,
    priceRange: 'budget',
    features: ['Pure vegetarian', 'Traditional recipes'],
    status: 'OPEN',
    subStatus: 'NORMAL'
  },
  {
    id: '4',
    name: 'Dragon Wok',
    image: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=300&fit=crop',
    rating: 4.3,
    reviewCount: 734,
    cuisine: ['Chinese', 'Asian', 'Fast Food'],
    dietary: 'both',
    deliveryTime: '35-50 min',
    deliveryFee: '₹35',
    minimumOrder: '₹250',
    distance: '3.2 km',
    popularDishes: ['Kung Pao Chicken', 'Sweet & Sour Pork', 'Fried Rice', 'Spring Rolls'],
    offers: ['Free delivery on orders above ₹400'],
    isOpen: true,
    isFavorite: false,
    priceRange: 'mid-range',
    features: ['Authentic Chinese', 'Spicy options'],
    status: 'OPEN',
    subStatus: 'VERY_BUSY'
  },
  {
    id: '5',
    name: 'Burger House',
    image: 'https://images.unsplash.com/photo-1571091718767-18b5b1457add?w=400&h=300&fit=crop',
    rating: 4.1,
    reviewCount: 445,
    cuisine: ['American', 'Fast Food', 'Burgers'],
    dietary: 'both',
    deliveryTime: '15-30 min',
    deliveryFee: '₹25',
    minimumOrder: '₹180',
    distance: '0.8 km',
    popularDishes: ['Classic Burger', 'Chicken Burger', 'French Fries', 'Milkshake'],
    offers: ['Combo deals available'],
    isOpen: false,
    isFavorite: false,
    priceRange: 'budget',
    features: ['Quick service', 'Fresh ingredients'],
    status: 'CLOSED',
    statusDetails: {
      nextOpenTime: 'tomorrow at 10:00 AM'
    }
  },
  {
    id: '6',
    name: 'Sushi Master',
    image: 'https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?w=400&h=300&fit=crop',
    rating: 4.8,
    reviewCount: 321,
    cuisine: ['Japanese', 'Sushi', 'Asian'],
    dietary: 'both',
    deliveryTime: '40-55 min',
    deliveryFee: '₹50',
    minimumOrder: '₹400',
    distance: '4.1 km',
    popularDishes: ['California Roll', 'Salmon Nigiri', 'Miso Soup', 'Tempura'],
    offers: ['Premium delivery', 'Fresh fish guarantee'],
    isOpen: false,
    isFavorite: true,
    priceRange: 'premium',
    features: ['Fresh fish', 'Authentic Japanese'],
    status: 'TEMPORARILY_CLOSED',
    statusDetails: {
      tempCloseReason: 'Kitchen maintenance',
      tempCloseDuration: '2 hours'
    }
  },
  {
    id: '7',
    name: 'Taco Fiesta',
    image: 'https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=400&h=300&fit=crop',
    rating: 4.4,
    reviewCount: 298,
    cuisine: ['Mexican', 'Latin American'],
    dietary: 'both',
    deliveryTime: '30-45 min',
    deliveryFee: '₹30',
    minimumOrder: '₹220',
    distance: '2.8 km',
    popularDishes: ['Chicken Tacos', 'Beef Burrito', 'Guacamole', 'Nachos'],
    offers: ['Free salsa with every order'],
    isOpen: true,
    isFavorite: false,
    priceRange: 'mid-range',
    features: ['Authentic Mexican', 'Spicy options'],
    status: 'OPEN',
    subStatus: 'NORMAL'
  },
  {
    id: '8',
    name: 'Jain Delights',
    image: 'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=400&h=300&fit=crop',
    rating: 4.6,
    reviewCount: 412,
    cuisine: ['Indian', 'Jain', 'Vegetarian'],
    dietary: 'jain',
    deliveryTime: '25-40 min',
    deliveryFee: '₹25',
    minimumOrder: '₹200',
    distance: '1.5 km',
    popularDishes: ['Jain Thali', 'Sabudana Khichdi', 'Jain Pizza', 'Fruit Custard'],
    offers: ['Jain certified kitchen'],
    isOpen: true,
    isFavorite: false,
    priceRange: 'mid-range',
    features: ['Jain certified', 'No onion garlic'],
    status: 'OPEN',
    subStatus: 'BUSY'
  },
  {
    id: '9',
    name: 'Vegan Paradise',
    image: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=400&h=300&fit=crop',
    rating: 4.3,
    reviewCount: 189,
    cuisine: ['Vegan', 'Healthy', 'International'],
    dietary: 'vegan',
    deliveryTime: '35-50 min',
    deliveryFee: '₹40',
    minimumOrder: '₹300',
    distance: '3.5 km',
    popularDishes: ['Vegan Buddha Bowl', 'Plant-based Burger', 'Quinoa Salad', 'Smoothie Bowl'],
    offers: ['100% plant-based', 'Organic ingredients'],
    isOpen: true,
    isFavorite: false,
    priceRange: 'premium',
    features: ['100% vegan', 'Organic ingredients'],
    status: 'OPEN',
    subStatus: 'NORMAL'
  },
  {
    id: '10',
    name: 'Street Food Hub',
    image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&h=300&fit=crop',
    rating: 4.0,
    reviewCount: 567,
    cuisine: ['Indian', 'Street Food', 'Fast Food'],
    dietary: 'both',
    deliveryTime: '20-35 min',
    deliveryFee: '₹20',
    minimumOrder: '₹100',
    distance: '0.5 km',
    popularDishes: ['Pani Puri', 'Vada Pav', 'Samosa', 'Chai'],
    offers: ['Street food experience'],
    isOpen: true,
    isFavorite: false,
    priceRange: 'budget',
    features: ['Street food', 'Quick bites'],
    status: 'OPEN',
    subStatus: 'VERY_BUSY'
  },
  {
    id: '11',
    name: 'Royal Biryani',
    image: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=300&fit=crop',
    rating: 4.5,
    reviewCount: 892,
    cuisine: ['Indian', 'Hyderabadi', 'Biryani'],
    dietary: 'both',
    deliveryTime: '40-55 min',
    deliveryFee: '₹35',
    minimumOrder: '₹250',
    distance: '2.3 km',
    popularDishes: ['Chicken Biryani', 'Mutton Biryani', 'Veg Biryani', 'Raita'],
    offers: ['Authentic Hyderabadi taste'],
    isOpen: true,
    isFavorite: true,
    priceRange: 'mid-range',
    features: ['Authentic Hyderabadi', 'Slow cooked'],
    status: 'OPEN',
    subStatus: 'NORMAL'
  },
  {
    id: '12',
    name: 'Dessert Corner',
    image: 'https://images.unsplash.com/photo-1565958011703-44f9829ba187?w=400&h=300&fit=crop',
    rating: 4.7,
    reviewCount: 234,
    cuisine: ['Desserts', 'Beverages', 'Bakery'],
    dietary: 'both',
    deliveryTime: '15-30 min',
    deliveryFee: '₹25',
    minimumOrder: '₹150',
    distance: '1.0 km',
    popularDishes: ['Chocolate Cake', 'Ice Cream', 'Pastries', 'Coffee'],
    offers: ['Sweet deals on combos'],
    isOpen: true,
    isFavorite: false,
    priceRange: 'mid-range',
    features: ['Fresh baked', 'Artisan desserts'],
    status: 'OPEN',
    subStatus: 'BUSY'
  }
];

export const cuisines = [
  'Indian', 'Chinese', 'Italian', 'Mexican', 'Japanese', 'American', 
  'Thai', 'Mediterranean', 'Korean', 'Vietnamese', 'French', 'Spanish'
];

export const dietaryOptions = [
  { value: 'veg', label: 'Veg Only', icon: '🌿' },
  { value: 'non-veg', label: 'Non-Veg', icon: '🍖' },
  { value: 'both', label: 'Both', icon: '🍽️' },
  { value: 'jain', label: 'Jain', icon: '🕉️' },
  { value: 'vegan', label: 'Vegan', icon: '🌱' }
];

export const sortOptions = [
  { value: 'distance', label: 'Distance', icon: '📍' },
  { value: 'rating', label: 'Rating', icon: '⭐' },
  { value: 'delivery-time', label: 'Delivery Time', icon: '⏱️' },
  { value: 'price-low', label: 'Price: Low to High', icon: '💰' },
  { value: 'price-high', label: 'Price: High to Low', icon: '💎' }
];
