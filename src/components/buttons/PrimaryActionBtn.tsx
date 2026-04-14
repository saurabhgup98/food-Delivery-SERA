import React from 'react';

// Badge interface
export interface BadgeProps {
  content: React.ReactNode; // Component aligned in center of badge
  className?: string;
  size?: 'sm' | 'md' | 'lg'; // Optional size preset (can be used for default width/height)
  width?: string;
  height?: string;
  radius?: string; // e.g., 'rounded-full' (circular:default), 'rounded-md', 'rounded-none'
  color?: string;
  backgroundColor?: string;
  bgHover?: string;
  position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left';
}

export interface PrimaryActionBtnProps {
  content?: React.ReactNode;
  badge?: BadgeProps;
  onClick?: () => void;
  disabled?: boolean;
  type?: 'button' | 'submit' | 'reset';
  width?: string;
  height?: string;

  // Button styling
  className?: string;
  bgColor?: string;
  bgHoverColor?: string;
  border?: string;
  borderColor?: string;
  borderHoverColor?: string;
  radius?: string;
  textColor?: string;
  textHoverColor?: string;
}

// Helper function to get badge position classes
const getBadgePositionClasses = (position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left'): string => {
  switch (position) {
    case 'top-left':
      return 'top-0 left-0 -translate-x-1/2 -translate-y-1/2';
    case 'bottom-left':
      return 'bottom-0 left-0 -translate-x-1/2 translate-y-1/2';
    case 'bottom-right':
      return 'bottom-0 right-0 translate-x-1/2 translate-y-1/2';
    case 'top-right':
    default:
      return 'top-0 right-0 translate-x-1/2 -translate-y-1/2';
  }
};

// Helper function to get badge size classes
const getBadgeSizeClasses = (size?: 'sm' | 'md' | 'lg'): { width: string; height: string } => {
  switch (size) {
    case 'sm':
      return { width: 'w-4', height: 'h-4' };
    case 'md':
      return { width: 'w-5', height: 'h-5' };
    case 'lg':
      return { width: 'w-6', height: 'h-6' };
    default:
      return { width: 'w-5', height: 'h-5' };
  }
};

const PrimaryActionBtn: React.FC<PrimaryActionBtnProps> = ({
  content,
  badge,
  onClick,
  disabled = false,
  type = 'button',
  width,
  height,
  className = '',
  bgColor = 'bg-orange-500',
  bgHoverColor = 'hover:bg-orange-600',
  border,
  borderColor,
  borderHoverColor,
  radius = 'rounded-full',
  textColor = 'text-white',
  textHoverColor = 'hover:text-white',

}) => {
  // Default content (Cart button with "T")
  const finalContent = content || <span className="text-white font-semibold">T</span>;

  const badgeSize = badge?.width && badge?.height
    ? { width: badge.width, height: badge.height }
    : getBadgeSizeClasses(badge?.size);

  const badgeRadius = badge?.radius || 'rounded-full';

  // Build button classes
  const buttonClasses = [
    'relative',
    'flex',
    'items-center',
    'justify-center',
    'transition-all',
    'duration-200',
    width,
    height,
    radius,
    bgColor,
    bgHoverColor,
    border,
    borderColor,
    borderHoverColor,
    disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={buttonClasses}
    >
      <div className="w-full h-full flex items-center justify-center">
        {finalContent}
      </div>

      {badge && (
        <span
          className={`
            absolute
            ${getBadgePositionClasses(badge.position)}
            ${badgeSize.width}
            ${badgeSize.height}
            ${badgeRadius}
            ${badge.backgroundColor || 'bg-sera-yellow'}
            ${badge.bgHover || ''}
            ${badge.color || 'text-dark-900'}
            flex
            items-center
            justify-center
            font-bold
            text-xs
            transition-colors
            duration-200
            ${badge.className || ''}
          `.trim()}
          style={{
            width: badge.width,
            height: badge.height,
          }}
        >
          {badge.content}
        </span>
      )}
    </button>
  );
};

export default PrimaryActionBtn;