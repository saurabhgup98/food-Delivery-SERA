import { BtnConfig } from "../../Style";
import { FeatureDefinition, FloatingElementDefinition, StatDefinition } from "../types/home.types";
import type { ButtonDefinition } from "../../components/ui/types/btn.types";
import { ArrowRightIcon } from '../../components/Icon/Arrows';
import React from "react";


export interface ButtonConfig {
  text: string;
  size: 'sm' | 'md' | 'lg';
  textSize: 'sm' | 'md' | 'lg';
  variant: 'primary' | 'secondary';
  className?: string;
  icon?: React.ReactNode;
  onClick?: () => void;
}


export const HERO_SECTION_CONFIG = {
  background: {
    image: 'https://images.unsplash.com/photo-1504674900240-9f452e3e5b3a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80',
    gradient: 'bg-gradient-to-br from-dark-900/90 via-dark-800/80 to-sera-pink/20'
  },

  content: {
    title: {
      main: 'SERA',
      subtitle: 'FOOD DELIVERY'
    },
    description: 'Taste the Convenience: Food, Fast and Delivered to Your Doorstep'
  },

  features: [
    {
      icon: 'clock',
      text: 'Fast Delivery'
    },
    {
      icon: 'heart',
      text: 'Best Restaurants'
    },
    {
      icon: 'location',
      text: 'Wide Coverage'
    }
  ] as FeatureDefinition[],

  stats: [
    {
      value: '500+',
      label: 'Restaurants',
      color: 'text-sera-pink'
    },
    {
      value: '10K+',
      label: 'Happy Customers',
      color: 'text-sera-blue'
    },
    {
      value: '50K+',
      label: 'Orders Delivered',
      color: 'text-sera-orange'
    },
    {
      value: '4.8★',
      label: 'Average Rating',
      color: 'text-sera-yellow'
    }
  ] as StatDefinition[],

  floatingElements: [
    {
      emoji: '🍕',
      position: 'top-20 left-10',
      size: 'w-16 h-16',
      bgColor: 'bg-sera-pink/20',
      animationDelay: '0s'
    },
    {
      emoji: '🍔',
      position: 'top-80 right-5',
      size: 'w-12 h-12',
      bgColor: 'bg-sera-blue/20',
      animationDelay: '1s'
    },
    {
      emoji: '🍜',
      position: 'bottom-40 left-20',
      size: 'w-14 h-14',
      bgColor: 'bg-sera-orange/20',
      animationDelay: '2s'
    },
  ] as FloatingElementDefinition[],
};

type HeroButton = ButtonDefinition & { to?: string };

export const getHeroButtons = (onJoinClick: () => void): HeroButton[] => [
  // Button 1: Explore Restaurants
  {
    to: '/explore',
    center: { items: [{ type: 'text', text: 'Explore Restaurants', color: 'white', className: 'font-semibold text-lg' }], padding: 0 },
    right: { items: [{ type: 'icon', icon: React.createElement(ArrowRightIcon, { className: 'w-5 h-5 group-hover:translate-x-1 transition-transform' }), color: 'white', size: 20 }], padding: 0 },
    padding: '0.875rem 2rem',
    bgColor: '#ff6b9d',
    bgHoverColor: '#e55a8d',
    border: 'none',
    transitionVariant: 'expand',
    className: 'w-auto rounded-lg group',
  },
  // Button 2: Join SERA
  {
    theme: 'primary',
    center: { items: [{ type: 'text', text: 'Join SERA', color: 'white', className: 'font-semibold text-lg' }], padding: 0 },
    padding: '0.875rem 2rem',
    onClick: onJoinClick,
    transitionVariant: 'expand',
    className: 'w-auto rounded-lg',
  },
];