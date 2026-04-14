import React, { useState } from 'react';

export interface PrimaryInputProps {
  // Core functionality (required)
  value: string;
  onChange: (value: string) => void;
  
  // Input behavior props (optional with defaults)
  type?: 'text' | 'email' | 'tel' | 'password' | 'number' | 'search' | 'url';
  placeholder?: string;
  label?: string;
  disabled?: boolean;
  required?: boolean;
  readOnly?: boolean;
  autoFocus?: boolean;
  autoComplete?: string;
  maxLength?: number;
  minLength?: number;
  pattern?: string;
  step?: number;
  min?: number;
  max?: number;
  
  // Form props
  name?: string;
  id?: string;
  
  // UI behavior props
  showDataToggle?: boolean;
  clearable?: boolean;
  error?: string;
  success?: string;
  helperText?: string;
  
  // Individual CSS props (optional - override defaults)
  bgColor?: string;
  borderColor?: string;
  focusBorderColor?: string;
  textColor?: string;
  placeholderColor?: string;
  labelColor?: string;
  errorColor?: string;
  successColor?: string;
  helperTextColor?: string;
  
  // Additional styling
  className?: string;
  inputClassName?: string;
  labelClassName?: string;
  errorClassName?: string;
}

const PrimaryInput: React.FC<PrimaryInputProps> = ({ 
  // Core functionality
  value,
  onChange,
  
  // Input behavior props
  type = 'text',
  placeholder = "",
  label,
  disabled = false,
  required = false,
  readOnly = false,
  autoFocus = false,
  autoComplete,
  maxLength,
  minLength,
  pattern,
  step,
  min,
  max,
  
  // Form props
  name,
  id,
  
  // UI behavior props
  showDataToggle = false,
  clearable = false,
  error,
  success,
  helperText,
  
  // Individual CSS props (defaults for login/register form styling)
  bgColor = 'bg-dark-700',
  borderColor = 'border-dark-600',
  focusBorderColor = 'focus:border-sera-pink',
  textColor = 'text-white',
  placeholderColor = 'placeholder-gray-400',
  labelColor = 'text-gray-300',
  errorColor = 'text-red-400',
  successColor = 'text-green-400',
  helperTextColor = 'text-gray-500',
  
  // Additional styling
  className = "",
  inputClassName = "",
  labelClassName = "",
  errorClassName = ""
}) => {
  const [showData, setShowData] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  
  // Determine the actual input type
  const inputType = type === 'password' && showDataToggle && showData ? 'text' : type;
  
  // Generate unique ID if not provided
  const inputId = id || name || `input-${Math.random().toString(36).substr(2, 9)}`;
  
  // Error and success states
  const hasError = !!error;
  const hasSuccess = !!success && !hasError;
  
  // Input classes - responsive sizing built-in
  const inputClasses = `
    w-full px-4 py-3 text-base rounded-xl
    sm:px-4 sm:py-3 sm:text-base
    md:px-4 md:py-3 md:text-base
    lg:px-4 lg:py-3 lg:text-base
    ${bgColor}
    ${hasError ? 'border-red-500' : hasSuccess ? 'border-green-500' : borderColor}
    ${hasError ? 'focus:ring-red-500' : hasSuccess ? 'focus:ring-green-500' : focusBorderColor}
    ${textColor}
    ${placeholderColor}
    focus:outline-none focus:ring-2 focus:border-transparent
    disabled:opacity-50 disabled:cursor-not-allowed
    read-only:bg-gray-100 read-only:cursor-default
    transition-all duration-300 ease-in-out
    hover:border-opacity-80
    ${showDataToggle || clearable ? 'pr-10' : ''}
    ${inputClassName}
  `.trim();
  
  // Label classes
  const labelClasses = `
    block text-sm font-medium ${labelColor}
    ${labelClassName}
  `.trim();
  
  // Error classes
  const errorClasses = `
    text-sm ${errorColor}
    ${errorClassName}
  `.trim();
  
  // Success classes
  const successClasses = `
    text-sm ${successColor}
  `.trim();
  
  // Helper text classes
  const helperClasses = `
    text-sm ${helperTextColor}
  `.trim();
  
  // Handle clear
  const handleClear = () => {
    onChange('');
  };
  
  // Handle focus
  const handleFocus = () => {
    setIsFocused(true);
  };
  
  const handleBlur = () => {
    setIsFocused(false);
  };

  return (
    <div className={`space-y-2 ${className}`}>
      {/* Label */}
      {label && (
        <label htmlFor={inputId} className={labelClasses}>
          {label}
          {required && <span className="text-red-400 ml-1">*</span>}
        </label>
      )}
      
      {/* Input Container */}
      <div className="relative">
        <input
          type={inputType}
          id={inputId}
          name={name}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={handleFocus}
          onBlur={handleBlur}
          placeholder={placeholder}
          disabled={disabled}
          readOnly={readOnly}
          autoFocus={autoFocus}
          autoComplete={autoComplete}
          maxLength={maxLength}
          minLength={minLength}
          pattern={pattern}
          step={step}
          min={min}
          max={max}
          required={required}
          className={inputClasses}
        />
        
        {/* Right side icons/buttons */}
        <div className="absolute inset-y-0 right-0 flex items-center pr-3 space-x-1">
          {/* Clear button */}
          {clearable && value && !disabled && !readOnly && (
            <button
              type="button"
              onClick={handleClear}
              className="text-gray-400 hover:text-gray-600 transition-colors"
              tabIndex={-1}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
          
          {/* Password toggle */}
          {showDataToggle && type === 'password' && (
            <button
              type="button"
              onClick={() => setShowData(!showData)}
              className="text-gray-400 hover:text-gray-300 transition-colors"
              tabIndex={-1}
            >
              {showData ? (
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
                </svg>
              ) : (
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              )}
            </button>
          )}
        </div>
      </div>
      
      {/* Messages */}
      {error && (
        <p className={errorClasses}>{error}</p>
      )}
      
      {success && !error && (
        <p className={successClasses}>{success}</p>
      )}
      
      {helperText && !error && !success && (
        <p className={helperClasses}>{helperText}</p>
      )}
    </div>
  );
};

export default PrimaryInput;