export interface Feature {
  icon: string;
  text: string;
}

export interface Stat {
  value: string;
  label: string;
  color: string;
}

export interface FloatingElement {
  emoji: string;
  position: string;
  size: string;
  bgColor: string;
  animationDelay: string;
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
  ] as Feature[],

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
  ] as Stat[],

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
      position: 'top-40 right-20',
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
    {
      emoji: '🍣',
      position: 'bottom-20 right-10',
      size: 'w-10 h-10',
      bgColor: 'bg-sera-yellow/20',
      animationDelay: '0.5s'
    }
  ] as FloatingElement[]
};