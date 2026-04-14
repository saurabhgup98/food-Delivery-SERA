// Button Configuration Types
export interface ButtonConfig {
  textColor: string;
  textHoverColor: string;
  bgColor: string;
  hoverBgColor: string;
  border: string;
  hoverBorderColor: string;
}

// Input Configuration Types
export interface InputConfig {
  bgColor: string;
  borderColor: string;
  focusBorderColor: string;
  textColor: string;
  placeholderColor: string;
  className?: string;
}

// Button Configurations
export const BtnConfig = {
  // Primary Button - Main CTAs (Explore Restaurants, Save, Submit)
  Primary: {
    textColor: 'text-white',
    textHoverColor: 'hover:text-white',
    bgColor: 'bg-sera-pink',
    hoverBgColor: 'hover:bg-sera-pink/90',
    border: 'border-none',
    hoverBorderColor: ''
  },

  // Secondary Button - Secondary actions (Login, Cancel, Previous)
  Secondary: {
    textColor: 'text-white',
    textHoverColor: 'hover:text-white',
    bgColor: 'bg-dark-700',
    hoverBgColor: 'hover:bg-dark-600',
    border: 'border border-white/20',
    hoverBorderColor: 'hover:border-white/40'
  },
  Transparent: {
    textColor: 'text-white',
    textHoverColor: 'hover:text-white',
    bgColor: 'bg-transparent',
    hoverBgColor: ' hover:bg-white/10',
    border: 'border border-white/20',
    hoverBorderColor: 'hover:border-white/40'
  },

  // OAuth Button - Social login buttons (Continue with Facebook, Google, GitHub)
  OAuth: {
    textColor: 'text-white',
    textHoverColor: 'hover:text-white',
    bgColor: 'bg-blue-600',
    hoverBgColor: 'hover:bg-blue-700',
    border: 'border-none',
    hoverBorderColor: ''
  },

  // White Button - Clean, minimal buttons (Close, Small actions)
  White: {
    textColor: 'text-gray-700',
    textHoverColor: 'hover:text-gray-900', 
    bgColor: 'bg-white',
    hoverBgColor: 'hover:bg-gray-100',
    border: 'border border-gray-300',
    hoverBorderColor: 'hover:border-gray-400'
  },

  // Danger Button - Destructive actions (Delete, Remove)
  Danger: {
    textColor: 'text-white',
    textHoverColor: 'hover:text-white',
    bgColor: 'bg-red-600',
    hoverBgColor: 'hover:bg-red-700',
    border: 'border-none',
    hoverBorderColor: ''
  },

  // Success Button - Positive actions (Confirm, Enable)
  Success: {
    textColor: 'text-white',
    textHoverColor: 'hover:text-white',
    bgColor: 'bg-green-600',
    hoverBgColor: 'hover:bg-green-700',
    border: 'border-none',
    hoverBorderColor: ''
  },

  // Ghost Button - Minimal, transparent buttons (Edit, Change)
  Ghost: {
    textColor: 'text-gray-400',
    textHoverColor: 'hover:text-gray-200',
    bgColor: 'bg-transparent',
    hoverBgColor: 'hover:bg-gray-800/50',
    border: 'border-none',
    hoverBorderColor: ''
  }
} as const;

// Input Configurations
export const InputConfig = {
  // Primary Input - Main form inputs (Login, Register forms) - Default styling
  Primary: {
    bgColor: 'bg-dark-700',
    borderColor: 'border-dark-600',
    focusBorderColor: 'focus:border-sera-pink',
    textColor: 'text-white',
    placeholderColor: 'placeholder-gray-400',
    labelColor: 'text-gray-300',
    errorColor: 'text-red-400',
    successColor: 'text-green-400',
    helperTextColor: 'text-gray-500'
  }
} as const;

// Common Style Classes
export const CommonStyles = {
  // Container styles
  container: 'max-w-7xl mx-auto px-4 sm:px-6 lg:px-8',
  containerSmall: 'max-w-4xl mx-auto px-4 sm:px-6 lg:px-8',
  containerLarge: 'max-w-8xl mx-auto px-4 sm:px-6 lg:px-8',

  // Card styles
  card: 'bg-white rounded-lg shadow-md border border-gray-200',
  cardDark: 'bg-dark-800 rounded-lg shadow-lg border border-dark-700',
  cardHover: 'hover:shadow-lg transition-shadow duration-300',

  // Text styles
  heading1: 'text-4xl md:text-6xl font-bold text-white',
  heading2: 'text-3xl md:text-4xl font-bold text-white',
  heading3: 'text-2xl md:text-3xl font-semibold text-white',
  body: 'text-gray-300 leading-relaxed',
  bodyDark: 'text-gray-600 leading-relaxed',

  // Spacing utilities
  section: 'py-16 md:py-24',
  sectionSmall: 'py-8 md:py-12',
  sectionLarge: 'py-20 md:py-32',

  // Animation classes
  fadeIn: 'animate-fade-in',
  slideUp: 'animate-slide-up',
  bounce: 'animate-bounce',
  pulse: 'animate-pulse',

  // Gradient backgrounds
  gradientPrimary: 'bg-gradient-to-r from-sera-pink to-pink-600',
  gradientSecondary: 'bg-gradient-to-r from-sera-blue to-blue-600',
  gradientDark: 'bg-gradient-to-br from-dark-800 to-dark-900',

  // Hover effects
  hoverScale: 'hover:scale-105 transition-transform duration-300',
  hoverLift: 'hover:-translate-y-1 transition-transform duration-300',
  hoverGlow: 'hover:shadow-lg hover:shadow-sera-pink/20 transition-all duration-300'
} as const;

// Size configurations for consistent spacing
export const SizeConfig = {
  button: {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3 text-base',
    lg: 'px-8 py-4 text-lg'
  },
  input: {
    sm: 'px-3 py-2 text-sm',
    md: 'px-4 py-3 text-base',
    lg: 'px-6 py-4 text-lg'
  },
  spacing: {
    xs: 'p-2',
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8',
    xl: 'p-12'
  }
} as const;

// Export all configurations
export default {
  BtnConfig,
  InputConfig,
  CommonStyles,
  SizeConfig
};
