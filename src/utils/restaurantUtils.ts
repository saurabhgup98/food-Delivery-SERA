/**
 * Restaurant utility functions
 */

import React from 'react';

/**
 * Render star rating component
 */
export const renderStars = (rating: number): React.ReactElement[] => {
  const stars: React.ReactElement[] = [];
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 !== 0;

  for (let i = 0; i < fullStars; i++) {
    stars.push(
      React.createElement('span', { key: i, className: 'text-yellow-400 text-xs' }, '⭐')
    );
  }

  if (hasHalfStar) {
    stars.push(
      React.createElement('span', { key: 'half', className: 'text-yellow-400 text-xs' }, '⭐')
    );
  }

  const emptyStars = 5 - Math.ceil(rating);
  for (let i = 0; i < emptyStars; i++) {
    stars.push(
      React.createElement('span', { key: `empty-${i}`, className: 'text-gray-500 text-xs' }, '☆')
    );
  }

  return stars;
};

/**
 * Get dietary icon based on dietary type
 */
export const getDietaryIcon = (dietary: string): string => {
  switch (dietary.toLowerCase()) {
    case 'veg':
      return '🌿';
    case 'non-veg':
      return '🍖';
    case 'vegan':
      return '🌱';
    case 'jain':
      return '🕉️';
    default:
      return '🍽️';
  }
};

/**
 * Get spice level display
 */
export const getSpiceLevelDisplay = (spiceLevel?: string): string => {
  if (!spiceLevel) return '';
  
  switch (spiceLevel.toLowerCase()) {
    case 'mild':
      return '🌶️ Mild';
    case 'medium':
      return '🌶️🌶️ Medium';
    case 'hot':
      return '🌶️🌶️🌶️ Hot';
    case 'extra-hot':
      return '🌶️🌶️🌶️🌶️ Extra Hot';
    default:
      return `🌶️ ${spiceLevel}`;
  }
};

/**
 * Get spice level icons as an array
 */
export const getSpiceLevelIcons = (spiceLevel?: string): React.ReactNode[] => {
  if (!spiceLevel) return [];
  
  const icons: React.ReactNode[] = [];
  let count = 1;
  
  switch (spiceLevel.toLowerCase()) {
    case 'mild':
      count = 1;
      break;
    case 'medium':
      count = 2;
      break;
    case 'hot':
      count = 3;
      break;
    case 'extra-hot':
      count = 4;
      break;
    default:
      count = 1;
  }
  
  for (let i = 0; i < count; i++) {
    icons.push(
      React.createElement('span', { key: i, className: 'text-xs' }, '🌶️')
    );
  }
  
  return icons;
};

/**
 * Get spice level text (without icons)
 */
export const getSpiceLevelText = (spiceLevel?: string): string => {
  if (!spiceLevel) return '';
  
  switch (spiceLevel.toLowerCase()) {
    case 'mild':
      return 'Mild';
    case 'medium':
      return 'Medium';
    case 'hot':
      return 'Hot';
    case 'extra-hot':
      return 'Extra Hot';
    default:
      return spiceLevel;
  }
};

/**
 * Format dietary text for display
 */
export const formatDietaryText = (dietary: string): string => {
  switch (dietary.toLowerCase()) {
    case 'veg':
      return 'Veg';
    case 'non-veg':
      return 'Non-Veg';
    case 'vegan':
      return 'Vegan';
    case 'jain':
      return 'Jain';
    default:
      return dietary.toUpperCase();
  }
};
