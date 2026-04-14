import React from 'react';
import { BtnConfig } from "../../Style";
import SecondaryContentContainer from '../Container/SecondaryContentContainer';
import BellIcon from '../Icon/BellIcon';
import CartIcon from '../Icon/CartIcon';

export const getUserInitial = (name: string | undefined): string => {
  if (!name) return 'U';
  return name.charAt(0).toUpperCase();
};

export const getNotificationButtonProps = (onClick: () => void) => ({
  onClick,
  width: 'w-10',
  height: 'h-full',
  bgColor: 'transparent',
  bgHoverColor: 'hover:bg-white/20', 
  radius: 'rounded-lg',
  content: React.createElement(SecondaryContentContainer, {
    rows: [
      {
        components: {
          content: React.createElement(BellIcon, { className: 'w-5 h-5', color: 'white', hoverColor: 'white' }),
          marginRight: 'mr-0',
        },
        align: 'center',
        justify: 'center',
        className: 'w-fit h-full',
      },
    ],
    className: 'w-fit h-full',
  }),
  badge: {
    content: React.createElement('span', { className: 'text-xs font-bold' }, HEADER_CONFIG.notification.badgeCount),
    width: 'w-4',
    height: 'h-4',
    backgroundColor: 'bg-sera-yellow',
    color: 'text-dark-900',
    position: 'top-right' as const,
  },
});

export const getCartButtonProps = (onClick: () => void, badgeCount: number) => ({
  onClick,
  width: 'w-10',
  height: 'h-full',
  bgColor: 'transparent',
  bgHoverColor: 'hover:bg-white/20', 
  radius: 'rounded-lg',
  content: React.createElement(SecondaryContentContainer, {
    rows: [
      {
        components: {
          content: React.createElement(CartIcon, { className: 'w-5 h-5', color: 'white', hoverColor: 'white' }),
          marginRight: 'mr-0',
        },
        align: 'center',
        justify: 'center',
        className: 'w-fit h-full',
      },
    ],
    className: 'w-fit h-full',
  }),
  badge: badgeCount > 0 ? {
    content: React.createElement('span', { className: 'text-xs font-bold' }, badgeCount > 99 ? '99+' : badgeCount),
    width: 'w-4',
    height: 'h-4',
    backgroundColor: 'bg-sera-yellow',
    color: 'text-dark-900',
    position: 'top-right' as const,
    className: 'animate-bounce-gentle',
  } : undefined,
});

export const getUserProfileButtonProps = (onClick: () => void, userInitial: string, username?: string) => ({
  onClick,
  width: 'w-fit',
  height: 'h-full',
  bgColor: 'transparent',
  bgHoverColor: 'hover:bg-white/20',
  border: 'border',
  borderColor: 'border-white',
  borderHoverColor: 'border-white', // Border stays white on hover
  radius: 'rounded-lg',
  content: React.createElement(SecondaryContentContainer, {
    rows: [
      {
        components: [
          {
            content: React.createElement('div', {
              className: 'w-6 h-6 mr-2 rounded-full border border-white bg-transparent hover:bg-white/20 flex items-center justify-center transition-colors',
            }, React.createElement('span', { 
              className: 'text-sm font-bold text-black/60' 
            }, userInitial)),
          },
          ...(username ? [{
            content: React.createElement('span', { 
              className: 'text-sm text-white' 
            }, username),
          }] : []),
        ],
        gap: '2',
        align: 'center',
        justify: 'start',
        className: 'w-fit h-full px-3',
      },
    ],
    className: 'w-fit h-full',
  }),
});

export const getFavoriteButtonProps = (
  onClick: () => void, 
  isSelected: boolean,
  size: 'sm' | 'md' | 'lg' = 'sm'
) => {
  const sizeMap = { sm: 'w-8 h-8', md: 'w-10 h-10', lg: 'w-12 h-12' };
  return {
  onClick,
    width: sizeMap[size],
    height: sizeMap[size],
    bgColor: isSelected ? 'bg-red-500' : 'bg-dark-800/80',
    bgHoverColor: isSelected ? 'hover:bg-red-500' : 'hover:bg-dark-700',
    radius: 'rounded-full',
  };
};

/**
 * Get search bar props
 */
export const getHeaderSearchBarProps = (handleSearch: (query: string) => void) => ({
  onSearch: handleSearch,
  placeholder: "Search restaurants, dishes...",
  showActionButtons: true, // Enable dual action buttons (X and ->)
  showEnterIcon: false, // Disable the old enter icon behavior
  leftIcon: null // No left icon initially
});

/**
 * Button configuration array
 */
export const getAuthButtonConfigs = (onLogin: () => void, onSignup: () => void) => [
  {
    onClick: onLogin,
    text: "Login",
    size: "sm" as const,
    className: "h-8 px-3 text-sm", // 50-60% of header height, larger text
    ...BtnConfig.OAuth
  },
  {
    onClick: onSignup,
    text: "Register",
    size: "sm" as const,
    className: "h-8 px-3 text-sm", // 50-60% of header height, larger text
    ...BtnConfig.Transparent
  }
];

/**
 * Header configuration constants
 */
export const HEADER_CONFIG = {
  // Logo and brand settings (80% of header height - larger size)
  logo: {
    size: 'w-8 h-8', // Increased to 80% of header height
    iconSize: 'w-5 h-5', // Increased icon size proportionally
    trailSize: 'w-1.5 h-1.5' // Slightly larger trail
  },
  
  // Brand name settings
  brand: {
    title: 'SERA',
    subtitle: 'FOOD',
    tagline: 'DELIVERY',
    titleSize: 'text-sm', // Further reduced to fit within header
    taglineSize: 'text-xs',
    taglineWeight: 'font-bold' // Much bolder for DELIVERY
  },
  
  // Notification settings
  notification: {
    badgeCount: 3,
    badgeSize: 'w-3 h-3',
    badgeTextSize: 'text-xs'
  },
  
  // Profile dropdown settings
  profile: {
    dropdownWidth: 'w-64',
    avatarSize: 'w-8 h-8',
    largeAvatarSize: 'w-12 h-12'
  }
} as const;
