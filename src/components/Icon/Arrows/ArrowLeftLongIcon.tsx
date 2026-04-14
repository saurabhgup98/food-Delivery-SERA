import React from 'react';

interface ArrowLeftLongIconProps {
  className?: string;
  color?: string;
  hoverColor?: string;
}

const ArrowLeftLongIcon: React.FC<ArrowLeftLongIconProps> = ({ 
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
        d="M19 12H5m7-7l-7 7 7 7"
      />
    </svg>
  );
};

export default ArrowLeftLongIcon;
