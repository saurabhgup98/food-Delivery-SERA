import React from 'react';
import SettingsIcon from '../../Icon/SettingsIcon';
import { getDietaryIcon, formatDietaryText, getSpiceLevelIcons, getSpiceLevelText } from '../../../utils/restaurantUtils';
import { ItemContainerProps } from '../../common/ItemContainer';

export type RestaurantMenuBadgeType = 'settings' | 'dishType' | 'spiceLevel';

interface RestaurantMenuBadgeConfig {
  settings: (icon?: React.ReactNode) => Partial<ItemContainerProps>;
  dishType: (dietary: string) => Partial<ItemContainerProps>;
  spiceLevel: (spiceLevel?: string) => Partial<ItemContainerProps>;
}

const RESTAURANT_MENU_BADGE_CONFIG: RestaurantMenuBadgeConfig = {
  settings: (icon) => ({
    bgColor: 'bg-red-600/90',
    borderColor: 'border-red-500/50',
    size: 'w-6 h-6',
    shape: 'circular',
    center: {
      content: icon || React.createElement(SettingsIcon, { className: 'w-3 h-3', color: 'white' })
    },
    centered: true,
  }),

  dishType: (dietary: string) => ({
    bgColor: 'bg-white/90',
    border: 'border-none',
    shape: 'rectangle',
    className: 'px-2 py-1 text-xs font-medium rounded',
    center: {
      content: [
        React.createElement('span', { key: 'dietary-icon', className: 'text-xs' }, getDietaryIcon(dietary)),
        React.createElement('span', { key: 'dietary-text', className: 'text-dark-900' }, formatDietaryText(dietary))
      ]
    },
    centered: true,
  }),

  spiceLevel: (spiceLevel?: string) => ({
    bgColor: 'bg-red-500/90',
    border: 'border-none',
    shape: 'rectangle',
    className: 'px-2 py-1 rounded text-xs font-medium',
    center: spiceLevel ? {
      content: [
        ...getSpiceLevelIcons(spiceLevel),
        React.createElement('span', { key: 'spice-text', className: 'text-white ml-2' }, getSpiceLevelText(spiceLevel))
      ]
    } : null,
    centered: true,
  }),
};


export const getRestaurantMenuBadgeProps = (
  type: RestaurantMenuBadgeType,
  ...args: any[]
): Partial<ItemContainerProps> => {
  switch (type) {
    case 'settings':
      return RESTAURANT_MENU_BADGE_CONFIG.settings(args[0]);
    case 'dishType':
      return RESTAURANT_MENU_BADGE_CONFIG.dishType(args[0]);
    case 'spiceLevel':
      return RESTAURANT_MENU_BADGE_CONFIG.spiceLevel(args[0]);
    default:
      return {};
  }
};