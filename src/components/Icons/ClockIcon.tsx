import React from 'react';

interface ClockIconProps {
  className?: string;
}

const ClockIcon: React.FC<ClockIconProps> = ({ className = "w-5 h-5" }) => {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <circle cx="12" cy="12" r="10"></circle>
      <polyline points="12,6 12,12 16,14"></polyline>
    </svg>
  );
};

export default ClockIcon;
