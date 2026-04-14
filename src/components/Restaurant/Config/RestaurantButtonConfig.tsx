import React from 'react';
import CartIcon from '../../Icon/CartIcon';
import SettingsIcon from '../../Icon/SettingsIcon';
import HeartIcon from '../../Icon/HeartIcon';
import { ArrowLeftIcon } from '../../Icon/Arrows';
import FilterIcon from '../../Icon/FilterIcon';
import { createButtonProps, ButtonConfigItem } from '../../common/utils/ButtonConfigUtils';
import { PrimaryActionBtnProps } from '../../Button/PrimaryActionBtn';

export enum RestaurantButtonType {
  BACK_TO_RESTAURANT_BUTTON = 'back_to_restaurant_button',
  RESTAURANT_FAVORITES_BUTTON = 'restaurant_favorites_button',
  DISH_QUANTITY_DECREASE = 'dish_quantity_decrease',
  DISH_QUANTITY_INCREASE = 'dish_quantity_increase',
  DISH_MAIN_ACTION_QUICK_ADD = 'dish_main_action_quick_add',
  DISH_HOVER_CUSTOMIZE = 'dish_hover_customize',
  DISH_HOVER_QUICK_ADD = 'dish_hover_quick_add',
  MENU_FILTER_BUTTON_DETAIL = 'menu_filter_button_detail',
  MENU_FILTER_CANCEL = 'menu_filter_cancel',
  MENU_FILTER_APPLY = 'menu_filter_apply',
  MENU_FILTER_CLEAR = 'menu_filter_clear',

  RESTAURANT_FILTER_BUTTON = 'restaurant_filter_button',
  RESTAURANT_CLEAR_FILTERS = 'restaurant_clear_filters',
  RESTAURANT_FILTER_CLEAR_ALL = 'restaurant_filter_clear_all',
  RESTAURANT_FILTER_CANCEL = 'restaurant_filter_cancel',
  RESTAURANT_FILTER_APPLY = 'restaurant_filter_apply',
}

const ICONS = {
  settings: React.createElement(SettingsIcon, { className: 'w-4 h-4', color: 'white' }),
  cart: React.createElement(CartIcon, { className: 'w-4 h-4', color: 'white' }),
  heart: React.createElement(HeartIcon, { className: 'w-4 h-4', color: 'white' }),
  arrowLeft: React.createElement(ArrowLeftIcon, { className: 'w-4 h-4', color: 'white' }),
  filter: React.createElement(FilterIcon, { className: 'w-4 h-4', color: 'white' }),
};

// Single unified config map (arranged in same order as enum)
const RestaurantButtonConfigMap: Record<RestaurantButtonType, ButtonConfigItem> = {
  [RestaurantButtonType.BACK_TO_RESTAURANT_BUTTON]: {
    text: 'Back',
    variant: 'Danger',
    icon: ICONS.arrowLeft,
    className: 'px-4 py-2 rounded-lg font-medium backdrop-blur-sm',
  },
  [RestaurantButtonType.RESTAURANT_FAVORITES_BUTTON]: {
    text: '',
    variant: 'Transparent',
    icon: ICONS.heart,
    className: 'backdrop-blur-sm flex items-center justify-center',
    width: 'w-10',
    height: 'h-10',
    radius: 'rounded-full',
  },
  [RestaurantButtonType.DISH_QUANTITY_DECREASE]: {
    text: '-',
    variant: 'Transparent',
    className: 'text-sm font-bold hover:text-sera-orange transition-colors p-1',
    width: 'w-fit',
    height: 'h-fit',
  },
  [RestaurantButtonType.DISH_QUANTITY_INCREASE]: {
    text: '+',
    variant: 'Transparent',
    className: 'text-sm font-bold hover:text-sera-orange transition-colors p-1',
    width: 'w-fit',
    height: 'h-fit',
  },
  [RestaurantButtonType.DISH_MAIN_ACTION_QUICK_ADD]: {
    text: 'Quick Add',
    variant: 'OAuth',
    className: 'flex-1 py-2 px-3 rounded-lg font-semibold hover:scale-105 active:scale-95 shadow-lg hover:shadow-xl border border-blue-500/30 text-sm',
  },
  [RestaurantButtonType.DISH_HOVER_CUSTOMIZE]: {
    text: 'Customize',
    variant: 'Danger',
    icon: ICONS.settings,
    className: 'px-4 py-2 rounded-lg font-semibold text-sm',
  },
  [RestaurantButtonType.DISH_HOVER_QUICK_ADD]: {
    text: 'Quick Add',
    variant: 'Primary',
    icon: ICONS.cart,
    className: 'px-4 py-2 rounded-lg font-semibold text-sm',
  },
  [RestaurantButtonType.MENU_FILTER_BUTTON_DETAIL]: {
    text: 'Filters',
    variant: 'Secondary',
    icon: ICONS.filter,
    className: 'px-4 py-2 rounded-lg font-medium',
  },
  [RestaurantButtonType.MENU_FILTER_CANCEL]: {
    text: 'Cancel',
    variant: 'Secondary',
    className: 'px-3 sm:px-5 py-2 rounded-lg text-sm sm:text-base',
  },
  [RestaurantButtonType.MENU_FILTER_APPLY]: {
    text: 'Apply',
    variant: 'Primary',
    className: 'px-3 sm:px-5 py-2 rounded-lg text-sm sm:text-base',
  },
  [RestaurantButtonType.MENU_FILTER_CLEAR]: {
    text: 'Clear All',
    variant: 'Ghost',
    className: 'px-4 py-2 text-gray-300 hover:text-white text-sm sm:text-base',
  },
  [RestaurantButtonType.RESTAURANT_FILTER_BUTTON]: {
    text: 'Filters',
    variant: 'OAuth',
    icon: ICONS.filter,
    className: 'px-4 py-2 rounded-lg font-medium transition-all duration-200 shadow-sm hover:shadow-md',
  },
  [RestaurantButtonType.RESTAURANT_CLEAR_FILTERS]: {
    text: 'Clear Filters',
    variant: 'Primary',
    className: 'px-6 py-3 rounded-lg font-semibold hover:scale-105 active:scale-95 transition-all',
  },
  [RestaurantButtonType.RESTAURANT_FILTER_CLEAR_ALL]: {
    text: 'Clear All',
    variant: 'Secondary',
    className: 'flex-1 px-4 py-2 rounded-lg font-medium',
  },
  [RestaurantButtonType.RESTAURANT_FILTER_CANCEL]: {
    text: 'Cancel',
    variant: 'Secondary',
    className: 'flex-1 px-4 py-2 rounded-lg font-medium',
  },
  [RestaurantButtonType.RESTAURANT_FILTER_APPLY]: {
    text: 'Apply Filters',
    variant: 'Primary',
    className: 'flex-1 px-4 py-2 rounded-lg font-medium',
  },
} as const;

// Single unified function
export function getRestaurantButtonProps(
  type: RestaurantButtonType,
  onClick: () => void,
  options?: {
    customText?: string;
    isFavorite?: boolean;
    isLoading?: boolean;
  }
): PrimaryActionBtnProps {
  const config = RestaurantButtonConfigMap[type];

  // Special handling for favorites button
  if (type === RestaurantButtonType.RESTAURANT_FAVORITES_BUTTON) {
    const isFavorite = options?.isFavorite || false;
    const favoriteConfig: ButtonConfigItem = {
      ...config,
      icon: React.createElement(HeartIcon, {
        className: 'w-5 h-5',
        color: isFavorite ? 'red-500' : 'white',
        filled: isFavorite
      }),
    };
    
    const baseProps = createButtonProps(favoriteConfig, onClick, options);
    return {
      ...baseProps,
      bgColor: isFavorite ? 'bg-red-500/80' : 'bg-dark-800/80',
      bgHoverColor: isFavorite ? 'hover:bg-red-600/80' : 'hover:bg-dark-700/80',
    };
  }

  return createButtonProps(config, onClick, options);
}