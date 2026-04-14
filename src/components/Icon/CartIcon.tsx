import React from 'react';

interface CartIconProps {
  className?: string;
  color?: string;
  hoverColor?: string;
}

const CartIcon: React.FC<CartIconProps> = ({ 
  className = "w-5 h-5", 
  color = "white",
  hoverColor
}) => {
  return (
    <svg 
      className={`${className} transition-colors duration-200`}
      style={{ color }}
      fill="none" 
      stroke="currentColor" 
      viewBox="0 0 24 24"
      onMouseEnter={(e) => {
        if (hoverColor && hoverColor !== color) {
          e.currentTarget.style.color = hoverColor;
        }
      }}
      onMouseLeave={(e) => {
        if (hoverColor && hoverColor !== color) {
          e.currentTarget.style.color = color;
        }
      }}
    >
      <path 
        strokeLinecap="round" 
        strokeLinejoin="round" 
        strokeWidth={2} 
        d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 5M7 13l2.5 5m0 0h6M17 18a2 2 0 100 4 2 2 0 000-4zM9 18a2 2 0 100 4 2 2 0 000-4z" 
      />
    </svg>
  );
};

export default CartIcon;
