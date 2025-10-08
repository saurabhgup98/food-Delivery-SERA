import React from 'react';

interface IconBtnPrimaryProps {
  onClick: () => void;
  icon: React.ReactNode;
  className?: string;
  disabled?: boolean;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'primary' | 'secondary' | 'danger';
}

const IconBtnPrimary: React.FC<IconBtnPrimaryProps> = ({
  onClick,
  icon,
  className = '',
  disabled = false,
  size = 'md',
  variant = 'primary'
}) => {

  const sizeClasses = {
    sm: 'w-6 h-6 p-1',
    md: 'w-8 h-8 p-1.5',
    lg: 'w-10 h-10 p-2'
  };

  const variantClasses = {
    primary: 'text-white/80 hover:text-white bg-transparent hover:bg-white/10',
    secondary: 'text-gray-400 hover:text-gray-200 bg-transparent hover:bg-gray-800/50',
    danger: 'text-red-400 hover:text-red-200 bg-transparent hover:bg-red-900/20'
  };

  const baseClasses = `
    relative flex items-center justify-center rounded-lg
    transition-all duration-300 ease-in-out
    focus:outline-none focus:ring-2 focus:ring-white/20
    disabled:opacity-50 disabled:cursor-not-allowed
    group overflow-hidden
  `;

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`
        ${baseClasses}
        ${sizeClasses[size]}
        ${variantClasses[variant]}
        ${className}
      `.trim()}
    >
      {/* Hover effect background */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-500"></div>

      {/* Icon content */}
      <div className="relative z-10 flex items-center justify-center">
        {icon}
      </div>
    </button>
  );
};

export default IconBtnPrimary;