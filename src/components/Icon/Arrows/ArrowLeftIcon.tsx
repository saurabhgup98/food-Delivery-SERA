import React from 'react';

interface ArrowLeftIconProps {
  className?: string;
  color?: string;
  hoverColor?: string;
}

const ArrowLeftIcon: React.FC<ArrowLeftIconProps> = ({ 
  className = "w-5 h-5",
  color = "currentColor",
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
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M15 19l-7-7 7-7"
      />
    </svg>
  );
};

export default ArrowLeftIcon;
