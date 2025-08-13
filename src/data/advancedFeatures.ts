export interface AllergenInfo {
  id: string;
  name: string;
  icon: string;
  description: string;
  severity: 'low' | 'medium' | 'high';
}

export interface NutritionalInfo {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber: number;
  sugar: number;
  sodium: number;
}

export interface SmartRecommendation {
  id: string;
  name: string;
  reason: string;
  icon: string;
  category: 'topping' | 'extra' | 'cooking-style' | 'size';
  priority: number;
}

export interface DietaryRestriction {
  id: string;
  name: string;
  description: string;
  icon: string;
  restrictions: string[];
}

// Allergen information
export const allergens: AllergenInfo[] = [
  { id: 'dairy', name: 'Dairy', icon: '🥛', description: 'Milk, cheese, butter, cream', severity: 'high' },
  { id: 'eggs', name: 'Eggs', icon: '🥚', description: 'Eggs and egg products', severity: 'high' },
  { id: 'fish', name: 'Fish', icon: '🐟', description: 'Fish and seafood', severity: 'high' },
  { id: 'shellfish', name: 'Shellfish', icon: '🦐', description: 'Shrimp, crab, lobster', severity: 'high' },
  { id: 'tree-nuts', name: 'Tree Nuts', icon: '🌰', description: 'Almonds, walnuts, cashews', severity: 'high' },
  { id: 'peanuts', name: 'Peanuts', icon: '🥜', description: 'Peanuts and peanut products', severity: 'high' },
  { id: 'wheat', name: 'Wheat', icon: '🌾', description: 'Wheat and gluten', severity: 'medium' },
  { id: 'soy', name: 'Soy', icon: '🫘', description: 'Soybeans and soy products', severity: 'medium' },
  { id: 'sesame', name: 'Sesame', icon: '⚪', description: 'Sesame seeds and oil', severity: 'medium' },
  { id: 'sulfites', name: 'Sulfites', icon: '🍷', description: 'Preservatives in dried fruits', severity: 'low' }
];

// Allergen mapping for ingredients
export const ingredientAllergens: Record<string, string[]> = {
  'cheese': ['dairy'],
  'milk': ['dairy'],
  'butter': ['dairy'],
  'cream': ['dairy'],
  'egg': ['eggs'],
  'eggs': ['eggs'],
  'fish': ['fish'],
  'shrimp': ['shellfish'],
  'crab': ['shellfish'],
  'lobster': ['shellfish'],
  'almonds': ['tree-nuts'],
  'walnuts': ['tree-nuts'],
  'cashews': ['tree-nuts'],
  'peanuts': ['peanuts'],
  'wheat': ['wheat'],
  'flour': ['wheat'],
  'bread': ['wheat'],
  'soy': ['soy'],
  'soybeans': ['soy'],
  'sesame': ['sesame'],
  'sesame-seeds': ['sesame'],
  'sulfites': ['sulfites']
};

// Smart recommendations based on dish type and user preferences
export const getSmartRecommendations = (
  dishType: string, 
  selectedToppings: string[], 
  spiceLevel: string,
  dietaryPreference: string
): SmartRecommendation[] => {
  const recommendations: SmartRecommendation[] = [];

  // Pizza recommendations
  if (dishType === 'pizza') {
    if (!selectedToppings.includes('cheese')) {
      recommendations.push({
        id: 'cheese',
        name: 'Extra Cheese',
        reason: 'Most popular pizza topping',
        icon: '🧀',
        category: 'topping',
        priority: 1
      });
    }
    
    if (spiceLevel === 'mild' && !selectedToppings.includes('jalapenos')) {
      recommendations.push({
        id: 'jalapenos',
        name: 'Jalapeños',
        reason: 'Add some heat to your pizza',
        icon: '🌶️',
        category: 'topping',
        priority: 2
      });
    }

    if (dietaryPreference === 'veg' && !selectedToppings.includes('mushrooms')) {
      recommendations.push({
        id: 'mushrooms',
        name: 'Mushrooms',
        reason: 'Great vegetarian protein option',
        icon: '🍄',
        category: 'topping',
        priority: 3
      });
    }
  }

  // Burger recommendations
  if (dishType === 'burger') {
    if (!selectedToppings.includes('cheese')) {
      recommendations.push({
        id: 'cheese',
        name: 'Cheese Slice',
        reason: 'Classic burger addition',
        icon: '🧀',
        category: 'topping',
        priority: 1
      });
    }

    if (dietaryPreference !== 'veg' && !selectedToppings.includes('bacon')) {
      recommendations.push({
        id: 'bacon',
        name: 'Bacon Strips',
        reason: 'Popular meat topping',
        icon: '🥓',
        category: 'topping',
        priority: 2
      });
    }
  }

  // Pasta recommendations
  if (dishType === 'pasta') {
    if (!selectedToppings.includes('cheese')) {
      recommendations.push({
        id: 'cheese',
        name: 'Parmesan Cheese',
        reason: 'Essential pasta topping',
        icon: '🧀',
        category: 'topping',
        priority: 1
      });
    }

    if (dietaryPreference !== 'veg' && !selectedToppings.includes('chicken')) {
      recommendations.push({
        id: 'chicken',
        name: 'Grilled Chicken',
        reason: 'Popular protein choice',
        icon: '🍗',
        category: 'topping',
        priority: 2
      });
    }
  }

  // General recommendations
  if (spiceLevel === 'mild' || spiceLevel === 'medium') {
    recommendations.push({
      id: 'drink',
      name: 'Soft Drink',
      reason: 'Perfect to cool down spicy food',
      icon: '🥤',
      category: 'extra',
      priority: 4
    });
  }

  return recommendations.sort((a, b) => a.priority - b.priority);
};

// Dietary restrictions and guidelines
export const dietaryRestrictions: DietaryRestriction[] = [
  {
    id: 'jain',
    name: 'Jain',
    icon: '🕉️',
    description: 'No root vegetables, garlic, onion',
    restrictions: ['onion', 'garlic', 'potato', 'carrot', 'radish', 'beetroot']
  },
  {
    id: 'vegan',
    name: 'Vegan',
    icon: '🌱',
    description: 'No animal products',
    restrictions: ['cheese', 'milk', 'butter', 'egg', 'bacon', 'chicken', 'fish', 'shrimp']
  },
  {
    id: 'gluten-free',
    name: 'Gluten Free',
    icon: '🌾',
    description: 'No wheat, barley, rye',
    restrictions: ['wheat', 'flour', 'bread', 'pasta']
  },
  {
    id: 'dairy-free',
    name: 'Dairy Free',
    icon: '🥛',
    description: 'No milk products',
    restrictions: ['cheese', 'milk', 'butter', 'cream']
  }
];

// Nutritional information for common ingredients (per 100g)
export const nutritionalData: Record<string, NutritionalInfo> = {
  'cheese': { calories: 402, protein: 25, carbs: 1.3, fat: 33, fiber: 0, sugar: 0.5, sodium: 621 },
  'mushrooms': { calories: 22, protein: 3.1, carbs: 3.3, fat: 0.3, fiber: 1, sugar: 1.7, sodium: 5 },
  'bacon': { calories: 541, protein: 37, carbs: 1.4, fat: 42, fiber: 0, sugar: 0, sodium: 1715 },
  'chicken': { calories: 165, protein: 31, carbs: 0, fat: 3.6, fiber: 0, sugar: 0, sodium: 74 },
  'bell-peppers': { calories: 20, protein: 0.9, carbs: 4.6, fat: 0.2, fiber: 1.7, sugar: 2.4, sodium: 4 },
  'onions': { calories: 40, protein: 1.1, carbs: 9.3, fat: 0.1, fiber: 1.7, sugar: 4.7, sodium: 4 },
  'olives': { calories: 115, protein: 0.8, carbs: 6.3, fat: 10.7, fiber: 3.2, sugar: 0, sodium: 735 },
  'jalapenos': { calories: 29, protein: 0.9, carbs: 6.5, fat: 0.4, fiber: 2.8, sugar: 4.1, sodium: 3 },
  'spinach': { calories: 23, protein: 2.9, carbs: 3.6, fat: 0.4, fiber: 2.2, sugar: 0.4, sodium: 79 },
  'tomatoes': { calories: 18, protein: 0.9, carbs: 3.9, fat: 0.2, fiber: 1.2, sugar: 2.6, sodium: 5 }
};

// Helper functions
export const getAllergensForIngredients = (ingredients: string[]): AllergenInfo[] => {
  const allergenIds = new Set<string>();
  
  ingredients.forEach(ingredient => {
    const allergens = ingredientAllergens[ingredient.toLowerCase()];
    if (allergens) {
      allergens.forEach(allergenId => allergenIds.add(allergenId));
    }
  });
  
  return allergens.filter(allergen => allergenIds.has(allergen.id));
};

export const calculateNutritionalInfo = (ingredients: string[], baseNutrition: NutritionalInfo): NutritionalInfo => {
  let total = { ...baseNutrition };
  
  ingredients.forEach(ingredient => {
    const nutrition = nutritionalData[ingredient.toLowerCase()];
    if (nutrition) {
      total.calories += nutrition.calories;
      total.protein += nutrition.protein;
      total.carbs += nutrition.carbs;
      total.fat += nutrition.fat;
      total.fiber += nutrition.fiber;
      total.sugar += nutrition.sugar;
      total.sodium += nutrition.sodium;
    }
  });
  
  return total;
};

export const checkDietaryCompliance = (
  ingredients: string[], 
  dietaryPreference: string
): { compliant: boolean; violations: string[] } => {
  const restriction = dietaryRestrictions.find(d => d.id === dietaryPreference);
  if (!restriction) return { compliant: true, violations: [] };
  
  const violations = restriction.restrictions.filter(restricted => 
    ingredients.some(ingredient => 
      ingredient.toLowerCase().includes(restricted.toLowerCase())
    )
  );
  
  return {
    compliant: violations.length === 0,
    violations
  };
};

export const getHealthScore = (nutrition: NutritionalInfo): number => {
  let score = 100;
  
  // Penalize high calories
  if (nutrition.calories > 500) score -= 20;
  else if (nutrition.calories > 300) score -= 10;
  
  // Reward protein
  if (nutrition.protein > 20) score += 15;
  else if (nutrition.protein > 10) score += 10;
  
  // Penalize high fat
  if (nutrition.fat > 30) score -= 15;
  else if (nutrition.fat > 20) score -= 10;
  
  // Reward fiber
  if (nutrition.fiber > 5) score += 10;
  else if (nutrition.fiber > 2) score += 5;
  
  // Penalize high sodium
  if (nutrition.sodium > 1000) score -= 15;
  else if (nutrition.sodium > 500) score -= 10;
  
  return Math.max(0, Math.min(100, score));
};
