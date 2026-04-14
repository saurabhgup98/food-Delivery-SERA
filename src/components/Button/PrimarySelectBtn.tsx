import React from 'react';

interface PrimarySelectBtnProps {
  onClick?: () => void;
  icon?: React.ComponentType<{ className?: string }>;
  iconNode?: React.ReactNode;
  text?: string;
  className?: string;
  disabled?: boolean;
  type?: 'button' | 'submit' | 'reset';
  isSelected?: boolean;
  // Individual styling props with default values matching QuickFilter design
  textColor?: string;
  textHoverColor?: string;
  bgColor?: string;
  hoverBgColor?: string;
  border?: string;
  hoverBorderColor?: string;
  selectedBgColor?: string;
  selectedBorderColor?: string;
  selectedTextColor?: string;
  size?: 'sm' | 'md' | 'lg';
  textSize?: 'xs' | 'sm' | 'md' | 'lg';
  iconSize?: 'xs' | 'sm' | 'md' | 'lg';
}

const PrimarySelectBtn: React.FC<PrimarySelectBtnProps> = ({
  onClick,
  icon: Icon,
  iconNode,
  text = 'Filter',
  className = '',
  disabled = false,
  type = 'button',
  isSelected = false,
  // Default styles matching QuickFilter design
  textColor = 'text-white',
  textHoverColor = 'hover:text-white',
  bgColor = 'bg-slate-700/50',
  hoverBgColor = 'hover:bg-slate-600/50',
  border = 'border border-slate-600/50',
  hoverBorderColor = 'hover:border-slate-500/50',
  selectedBgColor = 'bg-blue-600/20',
  selectedBorderColor = 'border-blue-500/50',
  selectedTextColor = 'text-blue-400',
  size = 'sm',
  textSize = 'xs',
  iconSize = 'xs'
}) => {
  const sizeClasses = {
    sm: 'px-2.5 py-1',
    md: 'px-3 py-1.5',
    lg: 'px-4 py-2'
  };

  const textSizeClasses = {
    xs: 'text-xs',
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg'
  };

  const iconSizeClasses = {
    xs: 'w-3 h-3',
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6'
  };

  // Apply selected styles if isSelected is true
  const finalBgColor = isSelected ? selectedBgColor : bgColor;
  const finalBorderColor = isSelected ? selectedBorderColor : border;
  const finalTextColor = isSelected ? selectedTextColor : textColor;
  const finalHoverBgColor = isSelected ? selectedBgColor : hoverBgColor;
  const finalHoverBorderColor = isSelected ? selectedBorderColor : hoverBorderColor;

  const baseClasses = `
    flex items-center space-x-1 rounded-lg transition-all duration-200 font-medium
    focus:outline-none focus:ring-2 focus:ring-blue-500/20
    disabled:opacity-50 disabled:cursor-not-allowed
    ${sizeClasses[size]}
    ${textSizeClasses[textSize]}
    ${finalBgColor}
    ${finalTextColor}
    ${finalHoverBgColor}
    ${textHoverColor}
    ${finalBorderColor}
    ${finalHoverBorderColor}
    ${isSelected ? 'shadow-sm' : ''}
    ${className}
  `.trim();

  // Handle icon content
  const iconContent = iconNode ?? (Icon ? <Icon className={iconSizeClasses[iconSize]} /> : null);

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={baseClasses}
    >
      {iconContent}
      {text && <span>{text}</span>}
    </button>
  );
};

export default PrimarySelectBtn;