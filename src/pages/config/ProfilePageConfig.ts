import React from 'react';

export interface ProfileTab {
  id: string;
  label: string;
  icon: string;
  component: () => Promise<{ default: React.ComponentType }>;
}

export interface ProfileOverviewProps {
  user: any; // Flexible type to work with both old and new User types
  totalSpent: number;
}

export interface ProfilePageProps {
  user: any;
  totalSpent: number;
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
}

export type TabType = 'personal' | 'addresses' | 'preferences' | 'payment' | 'notifications';

// ============================================================================
// PROFILE PAGE CONSTANTS
// ============================================================================

export const PROFILE_TABS: ProfileTab[] = [
  {
    id: 'personal',
    label: 'Personal Info',
    icon: '👤',
    component: () => import('../../components/Profile/components/PersonalInfoTab')
  },
  {
    id: 'addresses',
    label: 'Delivery Addresses',
    icon: '📍',
    component: () => import('../../components/Profile/components/DeliveryAddressTab')
  },
  {
    id: 'preferences',
    label: 'Food Preferences',
    icon: '🍽️',
    component: () => import('../../components/Profile/components/FoodPreferenceTab')
  },
  {
    id: 'payment',
    label: 'Payment Methods',
    icon: '💳',
    component: () => import('../../components/Profile/components/PaymentMethodsTab')
  },
  {
    id: 'notifications',
    label: 'Notifications',
    icon: '🔔',
    component: () => import('../../components/Profile/config/NotificationSettingsTab')
  }
];

// ============================================================================
// PROFILE PAGE FUNCTIONS
// ============================================================================

/**
 * Get user initials for avatar display
 */
export const getUserInitials = (user: any): string => {
  if (!user?.username) return 'U';
  return user.username.charAt(0).toUpperCase();
};

/**
 * Get user display name
 */
export const getUserDisplayName = (user: any): string => {
  return user?.username || user?.name || 'User';
};

/**
 * Get user email
 */
export const getUserEmail = (user: any): string => {
  return user?.email || '';
};

/**
 * Check if user is verified
 */
export const isUserVerified = (user: any): boolean => {
  return user?.emailVerified || false;
};

/**
 * Get user membership level based on total spent
 */
export const getUserMembershipLevel = (totalSpent: number): {
  level: string;
  color: string;
  bgColor: string;
  borderColor: string;
  icon: string;
} => {
  if (totalSpent >= 10000) {
    return {
      level: 'Diamond',
      color: 'text-blue-400',
      bgColor: 'bg-blue-500/20',
      borderColor: 'border-blue-500/30',
      icon: '💎'
    };
  } else if (totalSpent >= 5000) {
    return {
      level: 'Gold',
      color: 'text-yellow-400',
      bgColor: 'bg-yellow-500/20',
      borderColor: 'border-yellow-500/30',
      icon: '🥇'
    };
  } else if (totalSpent >= 2000) {
    return {
      level: 'Silver',
      color: 'text-gray-400',
      bgColor: 'bg-gray-500/20',
      borderColor: 'border-gray-500/30',
      icon: '🥈'
    };
  } else {
    return {
      level: 'Bronze',
      color: 'text-orange-400',
      bgColor: 'bg-orange-500/20',
      borderColor: 'border-orange-500/30',
      icon: '🥉'
    };
  }
};

/**
 * Format currency amount
 */
export const formatCurrency = (amount: number): string => {
  return `₹${amount.toLocaleString()}`;
};

/**
 * Get tab content component
 */
export const getTabContent = (activeTab: TabType, tabs: ProfileTab[]): React.ReactElement | null => {
  const tab = tabs.find(t => t.id === activeTab);
  if (!tab) return null;
  
  const Component = React.lazy(tab.component);
  return React.createElement(
    React.Suspense,
    { fallback: React.createElement('div', { className: 'text-center text-white' }, 'Loading...') },
    React.createElement(Component)
  );
};

/**
 * Get tab button classes based on active state
 */
export const getTabButtonClasses = (isActive: boolean): string => {
  const baseClasses = "flex items-center justify-center space-x-2 px-4 sm:px-6 lg:px-8 py-4 text-xs sm:text-sm font-medium whitespace-nowrap transition-all duration-300 flex-1 min-w-0 relative";
  
  if (isActive) {
    return `${baseClasses} text-sera-orange border-b-2 border-sera-orange bg-gradient-to-r from-sera-orange/10 to-orange-500/10`;
  }
  
  return `${baseClasses} text-gray-400 hover:text-white hover:bg-white/5`;
};

/**
 * Get profile overview classes
 */
export const getProfileOverviewClasses = (): string => {
  return "bg-gradient-to-br from-dark-800 to-dark-700 rounded-2xl p-4 sm:p-6 mb-6 sm:mb-8 border border-dark-600 shadow-2xl";
};

/**
 * Get avatar classes
 */
export const getAvatarClasses = (): string => {
  return "w-20 h-20 sm:w-24 sm:h-24 bg-gradient-to-br from-sera-blue to-blue-500 rounded-full flex items-center justify-center text-white text-2xl sm:text-3xl font-bold shadow-lg border-4 border-sera-blue/30";
};

/**
 * Get online indicator classes
 */
export const getOnlineIndicatorClasses = (): string => {
  return "absolute -bottom-1 -right-1 w-6 h-6 bg-green-400 rounded-full border-2 border-dark-800";
};

/**
 * Get status badge classes
 */
export const getStatusBadgeClasses = (type: 'verified' | 'membership'): string => {
  const baseClasses = "inline-flex items-center px-3 py-1 rounded-full text-xs font-medium";
  
  if (type === 'verified') {
    return `${baseClasses} bg-green-500/20 text-green-400 border border-green-500/30`;
  }
  
  return `${baseClasses} bg-yellow-500/20 text-yellow-400 border border-yellow-500/30`;
};