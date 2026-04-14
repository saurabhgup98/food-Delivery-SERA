import React from 'react';

interface ClockIconProps {
  className?: string;
  color?: string;
  hoverColor?: string;
}

const ClockIcon: React.FC<ClockIconProps> = ({ 
  className = "w-5 h-5",
  color = "white",
  hoverColor
}) => {
  return (
    <svg 
      className={`${className} ${hoverColor ? `hover:${hoverColor}` : ''}`}
      fill="none" 
      stroke={color} 
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle cx="12" cy="12" r="10"></circle>
      <polyline points="12,6 12,12 16,14"></polyline>
    </svg>
  );
};

export default ClockIcon;
