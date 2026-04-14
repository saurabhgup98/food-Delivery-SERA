import React from 'react';

export interface ToggleOption {
  value: string;
  label: string;
  icon?: React.ComponentType<{ className?: string }>;
  iconNode?: React.ReactNode;
}

interface ToggleBtnPrimaryProps {
  options: ToggleOption[];
  value: string;
  onChange: (value: string) => void;
  className?: string;
  disabled?: boolean;
  // Container styling
  containerBg?: string;
  containerBorder?: string;
  containerPadding?: string;
  containerRounded?: string;
  // Button styling
  buttonPadding?: string;
  buttonRounded?: string;
  buttonTextSize?: string;
  buttonFontWeight?: string;
  buttonTransition?: string;
  // Active state styling
  activeBg?: string;
  activeTextColor?: string;
  activeShadow?: string;
  // Inactive state styling
  inactiveTextColor?: string;
  inactiveHoverTextColor?: string;
  // Size presets
  size?: 'sm' | 'md' | 'lg';
  // Individual button customization
  buttonClassName?: string;
  activeButtonClassName?: string;
  inactiveButtonClassName?: string;
}

const ToggleBtnPrimary: React.FC<ToggleBtnPrimaryProps> = ({
  options,
  value,
  onChange,
  className = '',
  disabled = false,
  // Container styling with defaults
  containerBg = 'bg-slate-700',
  containerBorder = 'border border-slate-600',
  containerPadding = 'p-1',
  containerRounded = 'rounded-xl',
  // Button styling with defaults
  buttonPadding = 'px-2.5 py-1.5',
  buttonRounded = 'rounded-lg',
  buttonTextSize = 'text-xs',
  buttonFontWeight = 'font-medium',
  buttonTransition = 'transition-all duration-200',
  // Active state styling with defaults
  activeBg = 'bg-blue-600',
  activeTextColor = 'text-white',
  activeShadow = 'shadow-sm',
  // Inactive state styling with defaults
  inactiveTextColor = 'text-gray-300',
  inactiveHoverTextColor = 'hover:text-white',
  // Size presets
  size = 'md',
  // Individual button customization
  buttonClassName = '',
  activeButtonClassName = '',
  inactiveButtonClassName = ''
}) => {
  // Size presets that override defaults
  const sizePresets = {
    sm: {
      containerPadding: 'p-0.5',
      buttonPadding: 'px-2 py-1',
      buttonTextSize: 'text-xs',
      containerRounded: 'rounded-lg',
      buttonRounded: 'rounded-md'
    },
    md: {
      containerPadding: 'p-1',
      buttonPadding: 'px-2.5 py-1.5',
      buttonTextSize: 'text-xs',
      containerRounded: 'rounded-xl',
      buttonRounded: 'rounded-lg'
    },
    lg: {
      containerPadding: 'p-1.5',
      buttonPadding: 'px-3 py-2',
      buttonTextSize: 'text-sm',
      containerRounded: 'rounded-2xl',
      buttonRounded: 'rounded-xl'
    }
  };

  const currentSize = sizePresets[size];

  const containerClasses = `
    flex ${currentSize.containerRounded} ${currentSize.containerPadding}
    ${containerBg} ${containerBorder}
    ${className}
  `.trim();

  const getButtonClasses = (optionValue: string) => {
    const isActive = value === optionValue;
    
    const baseClasses = `
      ${currentSize.buttonPadding} ${currentSize.buttonRounded}
      ${currentSize.buttonTextSize} ${buttonFontWeight}
      ${buttonTransition}
      ${buttonClassName}
    `.trim();

    if (isActive) {
      return `
        ${baseClasses}
        ${activeBg} ${activeTextColor} ${activeShadow}
        ${activeButtonClassName}
      `.trim();
    } else {
      return `
        ${baseClasses}
        ${inactiveTextColor} ${inactiveHoverTextColor}
        ${inactiveButtonClassName}
      `.trim();
    }
  };

  const handleOptionClick = (optionValue: string) => {
    if (!disabled && value !== optionValue) {
      onChange(optionValue);
    }
  };

  return (
    <div className={containerClasses}>
      {options.map((option) => {
        const isActive = value === option.value;
        const IconComponent = option.icon;
        
        return (
          <button
            key={option.value}
            onClick={() => handleOptionClick(option.value)}
            disabled={disabled}
            className={getButtonClasses(option.value)}
            type="button"
          >
            <div className="flex items-center space-x-1">
              {option.iconNode ?? (IconComponent ? <IconComponent className="w-3 h-3" /> : null)}
              <span>{option.label}</span>
            </div>
          </button>
        );
      })}
    </div>
  );
};

export default ToggleBtnPrimary;