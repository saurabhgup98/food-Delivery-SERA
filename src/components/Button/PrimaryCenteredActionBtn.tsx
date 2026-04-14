import React from 'react';

interface PrimaryCenteredActionBtnProps {
  onClick?: () => void;
  leftIcon?: React.ComponentType<{ className?: string }>;
  rightIcon?: React.ComponentType<{ className?: string }>;
  leftIconNode?: React.ReactNode;
  rightIconNode?: React.ReactNode;
  text?: string;
  className?: string;
  disabled?: boolean;
  type?: 'button' | 'submit' | 'reset';
  // Individual styling props (optional - defaults to orange button style)
  textColor?: string;
  textHoverColor?: string;
  bgColor?: string;
  hoverBgColor?: string;
  border?: string;
  hoverBorderColor?: string;
  hoverGrow?: boolean;
  size?: 'sm' | 'md' | 'lg';
  textSize?: 'sm' | 'md' | 'lg' | 'xl';
  shape?: 'rectangle' | 'circular';
}

const PrimaryCenteredActionBtn: React.FC<PrimaryCenteredActionBtnProps> = ({
  onClick,
  leftIcon: LeftIcon,
  rightIcon: RightIcon,
  leftIconNode,
  rightIconNode,
  text = 'Continue',
  className = '',
  disabled = false,
  type = 'button',
  // Default to orange button style (like the image)
  textColor = 'text-white',
  textHoverColor = 'hover:text-white',
  bgColor = 'bg-orange-500',
  hoverBgColor = 'hover:bg-orange-600',
  border = 'border-none',
  hoverBorderColor = '',
  hoverGrow = true,
  size = 'md',
  textSize = 'md',
  shape = 'rectangle'
}) => {
  const sizeClasses = {
    sm: shape === 'circular' ? 'w-8 h-8' : 'px-4 py-2',
    md: shape === 'circular' ? 'w-10 h-10' : 'px-6 py-3',
    lg: shape === 'circular' ? 'w-12 h-12' : 'px-8 py-4'
  };

  const textSizeClasses = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg',
    xl: 'text-xl'
  };

  const shapeClasses = shape === 'circular' ? 'rounded-full' : 'rounded-lg';

  const baseClasses = `
    relative flex items-center justify-center ${shapeClasses}
    transition-all duration-300 ease-in-out
    focus:outline-none focus:ring-2 focus:ring-white/20
    disabled:opacity-50 disabled:cursor-not-allowed
    group overflow-hidden font-semibold
    ${sizeClasses[size]}
    ${textSizeClasses[textSize]}
    ${bgColor}
    ${textColor}
    ${hoverBgColor}
    ${textHoverColor}
    ${border}
    ${hoverBorderColor}
    ${hoverGrow ? 'hover:scale-[1.03]' : ''}
    ${className}
  `.trim();

  // Handle icon content
  const leftIconContent = leftIconNode ?? (LeftIcon ? <LeftIcon className="w-4 h-4" /> : null);
  const rightIconContent = rightIconNode ?? (RightIcon ? <RightIcon className="w-4 h-4" /> : null);

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={baseClasses}
    >
      {/* Hover effect background */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-500"></div>

      {/* Content */}
      <div className="relative z-10 flex items-center justify-center w-full space-x-2">
        {leftIconContent}
        {text && <span className="text-center">{text}</span>}
        {rightIconContent}
      </div>
    </button>
  );
};

export default PrimaryCenteredActionBtn;