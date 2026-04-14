import { StateConfig } from "../common/StateDisplay";

/**
 * Interfaces required for the Personal Info Tab
 */
export interface PersonalInfoFormDataI {
    name: string;
    email: string;
    phone: string;
    countryCode: string;
    dateOfBirth: string;
    gender: string;
}

export interface PersonalInfoButtonI {
    text: string;
    onClick: () => void;
    variant: 'primary' | 'secondary' | 'outline';
    size: 'sm' | 'md' | 'lg';
    disabled?: boolean;
    loading?: boolean;
    className?: string;
}

export interface AccountSecurityItemI {
    title: string;
    description: string;
    button: PersonalInfoButtonI;
    status?: 'enabled' | 'disabled' | 'pending';
}

export interface AccountSecuritySectionI {
    title: string;
    description: string;
    items: AccountSecurityItemI[];
}

export interface ProfilePicturePropsI {
    userInitial: string;
    isEditing: boolean;
    onPictureChange: () => void;
}

export interface PersonalInfoSectionI {
    title: string;
    description: string;
    formData: PersonalInfoFormDataI;
    isEditing: boolean;
    onEdit: () => void;
    onSave: () => void;
    onCancel: () => void;
}

/**
 * Interfaces required for the Delivery Address Tab
 */
export interface DeliveryAddressButtonI {
    text: string;
    onClick: () => void;
    size: 'sm' | 'md' | 'lg';
    className?: string;
    key: string;
  }
  
  export interface FetchDeliveryAddressOperationResultPropsI {
    loading: StateConfig;
    empty: StateConfig;
  }
  
  export interface DeliveryAddressFormDataI {
    fullName: string;
    phone: string;
    countryCode: string;
    address: string;
    city: string;
    state: string;
    country: string;
    postalCode: string;
    landmark: string;
    isDefault: boolean;
  }

/**
 * Interfaces required for the Food Preference Tab
 */

export interface FoodPreferenceI {
  id: string;
  name: string;
  icon: string;
  description: string;
  isSelected: boolean;
  category: 'dietary' | 'cuisine' | 'allergy' | 'spice';
}

export interface FoodPreferenceCategoryI {
  id: string;
  name: string;
  icon: string;
  preferences: FoodPreferenceI[];
}

export interface FoodPreferenceSectionI {
  title: string;
  description: string;
  categories: FoodPreferenceCategoryI[];
}

export interface FoodPreferenceFormDataI {
  dietary: string[];
  cuisines: string[];
  allergies: string[];
  spiceLevel: string;
  specialInstructions: string;
}

export interface FoodPreferenceButtonI {
  text: string;
  onClick: () => void;
  variant: 'primary' | 'secondary' | 'outline';
  size: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  loading?: boolean;
}

export interface DietaryPreferencesI {
    vegetarian: boolean;
    vegan: boolean;
    glutenFree: boolean;
    dairyFree: boolean;
    nutFree: boolean;
    seafoodFree: boolean;
    eggFree: boolean;
  }
  
  export interface CuisinePreferencesI {
    indian: boolean;
    chinese: boolean;
    italian: boolean;
    mexican: boolean;
    thai: boolean;
    japanese: boolean;
    mediterranean: boolean;
    american: boolean;
  }
  
  export interface SpiceLevelI {
    value: string;
    label: string;
    emoji: string;
  }
  
  export interface CaloriePreferenceI {
    value: string;
    label: string;
    desc: string;
  }
  
  export interface FoodPreferencesDataI {
    dietaryPreferences: DietaryPreferencesI;
    cuisinePreferences: CuisinePreferencesI;
    spiceLevel: string;
    caloriePreference: string;
    allergies: string[];
  }

/**
 * Interfaces required for the Payment Method Tab
 */
export interface PaymentMethodI {
  id: string;
  type: 'card' | 'upi' | 'wallet';
  name: string;
  details: string;
  isDefault: boolean;
  isVerified: boolean;
  lastUsed?: string;
}

/**
 * Interfaces required for the Notifications Tab
 */
export interface NotificationSettingsTypeI {
  orderUpdates: boolean;
  promotionalOffers: boolean;
  newRestaurants: boolean;
  priceDrops: boolean;
  deliveryReminders: boolean;
  birthdayOffers: boolean;
  appUpdates: boolean;
  pushNotifications: boolean;
  emailNotifications: boolean;
  smsNotifications: boolean;
}