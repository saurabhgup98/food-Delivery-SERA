import React from 'react';

export interface PrimaryCheckboxProps {
  // Core props
  checked: boolean;
  onChange: (checked: boolean) => void;
  label: string;
  id?: string;
  name?: string;
  disabled?: boolean;
  
  // Checkbox styling props
  shape?: 'circular' | 'rectangle';
  checkboxBorderColor?: string;
  hoverCheckboxBorderColor?: string;
  selectBorderColor?: string;
  selectBorderContent?: string;
  checkboxSize?: 'sm' | 'md' | 'lg';
  
  // Label styling props
  labelColor?: string;
  hoverLabelColor?: string;
  labelSize?: 'sm' | 'md' | 'lg';
  labelWeight?: 'normal' | 'medium' | 'semibold' | 'bold';
  
  // Layout props
  className?: string;
  labelClassName?: string;
  checkboxClassName?: string;
  
  // Accessibility
  ariaLabel?: string;
  ariaDescribedBy?: string;
}

const PrimaryCheckbox: React.FC<PrimaryCheckboxProps> = ({
  checked,
  onChange,
  label,
  id,
  name,
  disabled = false,
  
  // Checkbox styling with defaults
  shape = 'rectangle',
  checkboxBorderColor = 'border-white',
  hoverCheckboxBorderColor = 'hover:border-sera-orange',
  selectBorderColor = 'border-sera-orange',
  selectBorderContent = 'bg-sera-orange',
  checkboxSize = 'md',
  
  // Label styling with defaults
  labelColor = 'text-white',
  hoverLabelColor = 'hover:text-sera-orange',
  labelSize = 'md',
  labelWeight = 'medium',
  
  // Layout
  className = '',
  labelClassName = '',
  checkboxClassName = '',
  
  // Accessibility
  ariaLabel,
  ariaDescribedBy
}) => {
  // Size classes for checkbox
  const checkboxSizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6'
  };

  // Size classes for label
  const labelSizeClasses = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg'
  };

  // Shape classes
  const shapeClasses = {
    circular: 'rounded-full',
    rectangle: 'rounded'
  };

  // Checkbox classes
  const checkboxClasses = `
    ${checkboxSizeClasses[checkboxSize]}
    ${shapeClasses[shape]}
    ${checked ? selectBorderColor : checkboxBorderColor}
    ${checked ? selectBorderContent : 'bg-transparent'}
    border-2
    flex
    items-center
    justify-center
    transition-all
    duration-200
    cursor-pointer
    ${hoverCheckboxBorderColor}
    ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
    ${checkboxClassName}
  `.trim().replace(/\s+/g, ' ');

  // Label classes
  const labelClasses = `
    ${labelSizeClasses[labelSize]}
    ${labelWeight === 'normal' ? 'font-normal' : ''}
    ${labelWeight === 'medium' ? 'font-medium' : ''}
    ${labelWeight === 'semibold' ? 'font-semibold' : ''}
    ${labelWeight === 'bold' ? 'font-bold' : ''}
    ${labelColor}
    ${hoverLabelColor}
    cursor-pointer
    select-none
    transition-colors
    duration-200
    ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
    ${labelClassName}
  `.trim().replace(/\s+/g, ' ');

  // Container classes
  const containerClasses = `
    flex
    items-center
    space-x-3
    ${className}
  `.trim().replace(/\s+/g, ' ');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!disabled) {
      onChange(e.target.checked);
    }
  };

  const handleClick = () => {
    if (!disabled) {
      onChange(!checked);
    }
  };

  return (
    <div className={containerClasses}>
      {/* Hidden input for form handling */}
      <input
        type="checkbox"
        id={id}
        name={name}
        checked={checked}
        onChange={handleChange}
        disabled={disabled}
        className="sr-only"
        aria-label={ariaLabel || label}
        aria-describedby={ariaDescribedBy}
      />
      
      {/* Custom checkbox */}
      <div
        className={checkboxClasses}
        onClick={handleClick}
        role="checkbox"
        aria-checked={checked}
        tabIndex={disabled ? -1 : 0}
        onKeyDown={(e) => {
          if ((e.key === 'Enter' || e.key === ' ') && !disabled) {
            e.preventDefault();
            onChange(!checked);
          }
        }}
      >
        {/* Checkmark icon */}
        {checked && (
          <svg
            className={`${checkboxSize === 'sm' ? 'w-2.5 h-2.5' : checkboxSize === 'md' ? 'w-3 h-3' : 'w-4 h-4'} text-white`}
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              fillRule="evenodd"
              d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
              clipRule="evenodd"
            />
          </svg>
        )}
      </div>
      
      {/* Label */}
      <label
        htmlFor={id}
        className={labelClasses}
        onClick={handleClick}
      >
        {label}
      </label>
    </div>
  );
};

export default PrimaryCheckbox;