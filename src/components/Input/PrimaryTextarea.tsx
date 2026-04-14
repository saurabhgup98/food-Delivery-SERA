import React from 'react';

export interface PrimaryTextareaProps {
  // Core props
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  label?: string;
  
  // Styling props
  size?: 'sm' | 'md' | 'lg';
  variant?: 'default' | 'filled' | 'outlined';
  disabled?: boolean;
  error?: boolean;
  errorMessage?: string;
  
  // Textarea specific props
  rows?: number;
  maxLength?: number;
  resize?: 'none' | 'vertical' | 'horizontal' | 'both';
  
  // Layout props
  className?: string;
  labelClassName?: string;
  textareaClassName?: string;
  
  // Accessibility
  id?: string;
  name?: string;
  ariaLabel?: string;
  ariaDescribedBy?: string;
}

const PrimaryTextarea: React.FC<PrimaryTextareaProps> = ({
  value,
  onChange,
  placeholder,
  label,
  
  // Styling with defaults
  size = 'md',
  variant = 'default',
  disabled = false,
  error = false,
  errorMessage,
  
  // Textarea specific
  rows = 3,
  maxLength,
  resize = 'vertical',
  
  // Layout
  className = '',
  labelClassName = '',
  textareaClassName = '',
  
  // Accessibility
  id,
  name,
  ariaLabel,
  ariaDescribedBy
}) => {
  // Size classes
  const sizeClasses = {
    sm: {
      textarea: 'px-3 py-2 text-sm',
      label: 'text-sm'
    },
    md: {
      textarea: 'px-4 py-3 text-base',
      label: 'text-base'
    },
    lg: {
      textarea: 'px-5 py-4 text-lg',
      label: 'text-lg'
    }
  };

  // Variant classes
  const variantClasses = {
    default: 'bg-dark-600 border-dark-500 focus:border-sera-orange focus:ring-sera-orange/20',
    filled: 'bg-dark-700 border-dark-600 focus:border-sera-orange focus:ring-sera-orange/20',
    outlined: 'bg-transparent border-dark-500 focus:border-sera-orange focus:ring-sera-orange/20'
  };

  // Resize classes
  const resizeClasses = {
    none: 'resize-none',
    vertical: 'resize-y',
    horizontal: 'resize-x',
    both: 'resize'
  };

  // Textarea classes
  const textareaClasses = `
    w-full
    ${sizeClasses[size].textarea}
    ${variantClasses[variant]}
    ${resizeClasses[resize]}
    border-2
    rounded-lg
    text-white
    placeholder-gray-400
    focus:outline-none
    focus:ring-2
    transition-all
    duration-200
    ${error ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20' : ''}
    ${disabled ? 'opacity-50 cursor-not-allowed bg-dark-700' : 'cursor-text'}
    ${textareaClassName}
  `.trim().replace(/\s+/g, ' ');

  // Label classes
  const labelClasses = `
    block
    font-medium
    text-gray-300
    mb-2
    ${sizeClasses[size].label}
    ${error ? 'text-red-400' : ''}
    ${disabled ? 'opacity-50' : ''}
    ${labelClassName}
  `.trim().replace(/\s+/g, ' ');

  // Container classes
  const containerClasses = `
    ${className}
  `.trim();

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (!disabled) {
      onChange(e.target.value);
    }
  };

  return (
    <div className={containerClasses}>
      {/* Label */}
      {label && (
        <label
          htmlFor={id}
          className={labelClasses}
        >
          {label}
        </label>
      )}
      
      {/* Textarea */}
      <textarea
        id={id}
        name={name}
        value={value}
        onChange={handleChange}
        placeholder={placeholder}
        disabled={disabled}
        rows={rows}
        maxLength={maxLength}
        className={textareaClasses}
        aria-label={ariaLabel || label}
        aria-describedby={ariaDescribedBy}
      />
      
      {/* Error Message */}
      {error && errorMessage && (
        <p className="mt-1 text-sm text-red-400">
          {errorMessage}
        </p>
      )}
      
      {/* Character Count */}
      {maxLength && (
        <p className="mt-1 text-xs text-gray-400 text-right">
          {value.length}/{maxLength}
        </p>
      )}
    </div>
  );
};

export default PrimaryTextarea;
