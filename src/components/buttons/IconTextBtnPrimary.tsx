import React from 'react';

interface IconTextBtnPrimaryProps {
  onClick?: () => void;
  icon?: React.ReactNode;
  text: string;
  className?: string;
  disabled?: boolean;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'primary' | 'secondary' | 'danger';
  textSize?: 'sm' | 'md' | 'lg' | 'xl';
  bgColor?: string;
  textColor?: string;
  hoverBgColor?: string;
  hoverTextColor?: string;
  type?: 'button' | 'submit' | 'reset';
}

const IconTextBtnPrimary: React.FC<IconTextBtnPrimaryProps> = ({
  onClick,
  icon,
  text,
  className = '',
  disabled = false,
  size = 'md',
  variant = 'primary',
  textSize = 'md',
  bgColor,
  textColor,
  hoverBgColor,
  hoverTextColor,
  type = 'button'
}) => {
  const sizeClasses = {
    sm: 'px-4 py-2',
    md: 'px-6 py-3',
    lg: 'px-8 py-4'
  };

  const textSizeClasses = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg',
    xl: 'text-xl'
  };

  const variantClasses = {
    primary: {
      bg: bgColor || 'bg-sera-pink',
      text: textColor || 'text-white',
      hoverBg: hoverBgColor || 'hover:bg-sera-pink/90',
      hoverText: hoverTextColor || 'hover:text-white'
    },
    secondary: {
      bg: bgColor || 'bg-transparent',
      text: textColor || 'text-white',
      hoverBg: hoverBgColor || 'hover:bg-white/10',
      hoverText: hoverTextColor || 'hover:text-white'
    },
    danger: {
      bg: bgColor || 'bg-red-600',
      text: textColor || 'text-white',
      hoverBg: hoverBgColor || 'hover:bg-red-700',
      hoverText: hoverTextColor || 'hover:text-white'
    }
  };

  const baseClasses = `
    relative flex items-center justify-center space-x-2 rounded-lg
    transition-all duration-300 ease-in-out
    focus:outline-none focus:ring-2 focus:ring-white/20
    disabled:opacity-50 disabled:cursor-not-allowed
    group overflow-hidden font-semibold
  `;

  const currentVariant = variantClasses[variant];

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`
        ${baseClasses}
        ${sizeClasses[size]}
        ${textSizeClasses[textSize]}
        ${currentVariant.bg}
        ${currentVariant.text}
        ${currentVariant.hoverBg}
        ${currentVariant.hoverText}
        ${className}
      `.trim()}
    >
      {/* Hover effect background */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-500"></div>

      {/* Content */}
      <div className="relative z-10 flex items-center space-x-2">
        {icon && <span className="flex items-center">{icon}</span>}
        <span>{text}</span>
      </div>
    </button>
  );
};

export default IconTextBtnPrimary;
