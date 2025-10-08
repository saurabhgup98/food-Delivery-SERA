export interface ProfileTab {
  id: string;
  label: string;
  icon: string;
  component: () => Promise<{ default: React.ComponentType }>;
}

export const PROFILE_TABS: ProfileTab[] = [
  {
    id: 'personal',
    label: 'Personal Info',
    icon: '👤',
    component: () => import('../components/Profile/PersonalInfo')
  },
  {
    id: 'addresses',
    label: 'Delivery Addresses',
    icon: '📍',
    component: () => import('../components/Profile/DeliveryAddresses')
  },
  {
    id: 'preferences',
    label: 'Food Preferences',
    icon: '🍽️',
    component: () => import('../components/Profile/FoodPreferences')
  },
  {
    id: 'payment',
    label: 'Payment Methods',
    icon: '💳',
    component: () => import('../components/Profile/PaymentMethods')
  },
  {
    id: 'notifications',
    label: 'Notifications',
    icon: '🔔',
    component: () => import('../components/Profile/NotificationSettings')
  }
];

export type TabType = 'personal' | 'addresses' | 'preferences' | 'payment' | 'notifications';
