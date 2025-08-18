import React from 'react';

interface AnimatedLoaderProps {
  type?: 'restaurant' | 'dish' | 'general';
  size?: 'small' | 'medium' | 'large';
  className?: string;
}

const AnimatedLoader: React.FC<AnimatedLoaderProps> = ({ 
  type = 'general', 
  size = 'medium',
  className = ''
}) => {
  const sizeClasses = {
    small: 'w-8 h-8',
    medium: 'w-12 h-12',
    large: 'w-16 h-16'
  };

  const renderRestaurantLoader = () => (
    <div className={`relative ${sizeClasses[size]} ${className}`}>
      {/* Main restaurant building */}
      <div className="absolute inset-0 bg-gradient-to-br from-sera-blue to-sera-blue/80 rounded-lg animate-pulse">
        <div className="absolute top-1 left-1 right-1 h-1 bg-white/30 rounded-sm"></div>
        <div className="absolute top-3 left-1 right-1 h-1 bg-white/20 rounded-sm"></div>
        <div className="absolute top-5 left-1 right-1 h-1 bg-white/20 rounded-sm"></div>
      </div>
      
      {/* Animated delivery scooter */}
      <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-sera-yellow rounded-full animate-bounce">
        <div className="absolute top-0 left-0 w-2 h-2 bg-sera-orange rounded-full animate-ping"></div>
      </div>
      
      {/* Floating food particles */}
      <div className="absolute -top-1 left-1 w-2 h-2 bg-sera-pink rounded-full animate-ping" style={{ animationDelay: '0.5s' }}></div>
      <div className="absolute top-2 -right-1 w-1.5 h-1.5 bg-sera-orange rounded-full animate-ping" style={{ animationDelay: '1s' }}></div>
    </div>
  );

  const renderDishLoader = () => (
    <div className={`relative ${sizeClasses[size]} ${className}`}>
      {/* Plate */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-200 to-gray-300 rounded-full animate-pulse">
        <div className="absolute inset-1 bg-white rounded-full"></div>
      </div>
      
      {/* Food items */}
      <div className="absolute inset-2 bg-gradient-to-br from-sera-orange to-sera-pink rounded-full animate-pulse">
        <div className="absolute top-1 left-1 right-1 h-0.5 bg-white/40 rounded-sm"></div>
        <div className="absolute top-2.5 left-1 right-1 h-0.5 bg-white/30 rounded-sm"></div>
      </div>
      
      {/* Steam effect */}
      <div className="absolute -top-1 left-1/2 transform -translate-x-1/2 w-1 h-2 bg-white/60 rounded-full animate-ping"></div>
      <div className="absolute -top-0.5 left-1/3 w-0.5 h-1.5 bg-white/40 rounded-full animate-ping" style={{ animationDelay: '0.3s' }}></div>
      <div className="absolute -top-0.5 right-1/3 w-0.5 h-1.5 bg-white/40 rounded-full animate-ping" style={{ animationDelay: '0.6s' }}></div>
    </div>
  );

  const renderGeneralLoader = () => (
    <div className={`relative ${sizeClasses[size]} ${className}`}>
      {/* Spinning ring */}
      <div className="absolute inset-0 border-4 border-sera-blue/20 border-t-sera-blue rounded-full animate-spin"></div>
      
      {/* Inner pulse */}
      <div className="absolute inset-2 bg-gradient-to-br from-sera-blue to-sera-blue/60 rounded-full animate-pulse"></div>
      
      {/* Floating dots */}
      <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-sera-yellow rounded-full animate-bounce"></div>
      <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-sera-orange rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
      <div className="absolute left-0 top-1/2 transform -translate-y-1/2 w-1 h-1 bg-sera-pink rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
      <div className="absolute right-0 top-1/2 transform -translate-y-1/2 w-1 h-1 bg-sera-yellow rounded-full animate-bounce" style={{ animationDelay: '0.6s' }}></div>
    </div>
  );

  const renderLoader = () => {
    switch (type) {
      case 'restaurant':
        return renderRestaurantLoader();
      case 'dish':
        return renderDishLoader();
      default:
        return renderGeneralLoader();
    }
  };

  return (
    <div className="flex items-center justify-center">
      {renderLoader()}
    </div>
  );
};

export default AnimatedLoader;
