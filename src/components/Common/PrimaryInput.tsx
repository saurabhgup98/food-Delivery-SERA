import React, { useState } from 'react';

export interface PrimaryInputProps {
  type?: 'text' | 'email' | 'tel' | 'password' | 'number';
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  label?: string;
  disabled?: boolean;
  className?: string;
  maxLength?: number;
  required?: boolean;
  name?: string;
  id?: string;
  showDataToggle?: boolean;
  error?: string;
  autoComplete?: string;
}

const PrimaryInput: React.FC<PrimaryInputProps> = ({ 
  type = 'text',
  value, 
  onChange, 
  placeholder = "",
  label,
  disabled = false,
  className = "",
  maxLength,
  required = false,
  name,
  id,
  showDataToggle = false,
  error,
  autoComplete
}) => {
  const [showData, setShowData] = useState(false);
  
  // Determine the actual input type
  const inputType = type === 'password' && showDataToggle && showData ? 'text' : type;
  
  // Generate unique ID if not provided
  const inputId = id || name || `input-${Math.random().toString(36).substr(2, 9)}`;

  return (
    <div className={`space-y-2 ${className}`}>
      {label && (
        <label htmlFor={inputId} className="block text-sm font-medium text-gray-300">
          {label}
          {required && <span className="text-red-400 ml-1">*</span>}
        </label>
      )}
      
      <div className="relative">
        <input
          type={inputType}
          id={inputId}
          name={name}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          disabled={disabled}
          maxLength={maxLength}
          required={required}
          autoComplete={autoComplete}
          className={`w-full px-4 py-3 bg-dark-700 border border-dark-600 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-sera-orange focus:border-transparent disabled:opacity-50 text-sm transition-all duration-300 hover:border-dark-500 ${showDataToggle ? 'pr-10' : ''} ${error ? 'border-red-500 focus:ring-red-500' : ''}`}
        />
        
        {showDataToggle && type === 'password' && (
          <button
            type="button"
            onClick={() => setShowData(!showData)}
            className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-300 transition-colors"
            tabIndex={-1}
          >
            {showData ? 'Hide' : 'Show'}
          </button>
        )}
      </div>
      
      {error && (
        <p className="text-red-300 text-sm">{error}</p>
      )}
    </div>
  );
};

export default PrimaryInput;
