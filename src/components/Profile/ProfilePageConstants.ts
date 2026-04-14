import { FoodPreferenceI } from "./ProfilePageInterfaces";

export const DIETARY_PREFERENCES: FoodPreferenceI[] = [
    {
      id: 'vegetarian',
      name: 'Vegetarian',
      icon: '🌿',
      description: 'Plant-based diet',
      isSelected: false,
      category: 'dietary'
    },
    {
      id: 'vegan',
      name: 'Vegan',
      icon: '🌱',
      description: 'No animal products',
      isSelected: false,
      category: 'dietary'
    },
    {
      id: 'jain',
      name: 'Jain',
      icon: '🕉️',
      description: 'Jain dietary restrictions',
      isSelected: false,
      category: 'dietary'
    },
    {
      id: 'halal',
      name: 'Halal',
      icon: '☪️',
      description: 'Islamic dietary laws',
      isSelected: false,
      category: 'dietary'
    },
    {
      id: 'kosher',
      name: 'Kosher',
      icon: '✡️',
      description: 'Jewish dietary laws',
      isSelected: false,
      category: 'dietary'
    }
  ];
  
  export const CUISINE_PREFERENCES: FoodPreferenceI[] = [
    {
      id: 'indian',
      name: 'Indian',
      icon: '🍛',
      description: 'Traditional Indian cuisine',
      isSelected: false,
      category: 'cuisine'
    },
    {
      id: 'chinese',
      name: 'Chinese',
      icon: '🥢',
      description: 'Chinese cuisine',
      isSelected: false,
      category: 'cuisine'
    },
    {
      id: 'italian',
      name: 'Italian',
      icon: '🍝',
      description: 'Italian cuisine',
      isSelected: false,
      category: 'cuisine'
    },
    {
      id: 'mexican',
      name: 'Mexican',
      icon: '🌮',
      description: 'Mexican cuisine',
      isSelected: false,
      category: 'cuisine'
    },
    {
      id: 'thai',
      name: 'Thai',
      icon: '🍜',
      description: 'Thai cuisine',
      isSelected: false,
      category: 'cuisine'
    },
    {
      id: 'japanese',
      name: 'Japanese',
      icon: '🍣',
      description: 'Japanese cuisine',
      isSelected: false,
      category: 'cuisine'
    }
  ];
  
  export const ALLERGY_PREFERENCES: FoodPreferenceI[] = [
    {
      id: 'nuts',
      name: 'Nuts',
      icon: '🥜',
      description: 'Tree nuts and peanuts',
      isSelected: false,
      category: 'allergy'
    },
    {
      id: 'dairy',
      name: 'Dairy',
      icon: '🥛',
      description: 'Milk and dairy products',
      isSelected: false,
      category: 'allergy'
    },
    {
      id: 'gluten',
      name: 'Gluten',
      icon: '🌾',
      description: 'Wheat and gluten',
      isSelected: false,
      category: 'allergy'
    },
    {
      id: 'seafood',
      name: 'Seafood',
      icon: '🦐',
      description: 'Fish and shellfish',
      isSelected: false,
      category: 'allergy'
    },
    {
      id: 'eggs',
      name: 'Eggs',
      icon: '🥚',
      description: 'Eggs and egg products',
      isSelected: false,
      category: 'allergy'
    }
  ];
  
  export const SPICE_LEVELS: FoodPreferenceI[] = [
    {
      id: 'mild',
      name: 'Mild',
      icon: '🌶️',
      description: 'No spice or very mild',
      isSelected: false,
      category: 'spice'
    },
    {
      id: 'medium',
      name: 'Medium',
      icon: '🌶️🌶️',
      description: 'Moderate spice level',
      isSelected: false,
      category: 'spice'
    },
    {
      id: 'hot',
      name: 'Hot',
      icon: '🌶️🌶️🌶️',
      description: 'High spice level',
      isSelected: false,
      category: 'spice'
    },
    {
      id: 'extra-hot',
      name: 'Extra Hot',
      icon: '🌶️🌶️🌶️🌶️',
      description: 'Maximum spice level',
      isSelected: false,
      category: 'spice'
    }
  ];