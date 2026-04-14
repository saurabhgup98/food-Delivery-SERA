import React from 'react';

interface TimingIconProps {
  className?: string;
  color?: string;
  hoverColor?: string;
  size?: 'sm' | 'md' | 'lg';
}

const TimingIcon: React.FC<TimingIconProps> = ({
  className = '',
  color = 'currentColor',
  hoverColor,
  size = 'md'
}) => {
  const sizeClasses = {
    sm: 'w-3 h-3',
    md: 'w-4 h-4',
    lg: 'w-5 h-5'
  };

  const baseClasses = `${sizeClasses[size]} transition-colors duration-200 ${className}`;
  const hoverClass = hoverColor ? `hover:${hoverColor}` : '';

  return (
    <svg
      className={`${baseClasses} ${hoverClass}`}
      fill="none"
      stroke={color}
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle cx="12" cy="12" r="10" />
      <polyline points="12,6 12,12 16,14" />
    </svg>
  );
};

export default TimingIcon;
