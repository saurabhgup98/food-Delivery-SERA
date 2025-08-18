import React from 'react';

interface PrimaryInputProps {
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
  name
}) => {
  return (
    <div className={className}>
      {label && (
        <label className="block text-sm font-medium text-gray-300 mb-1 sm:mb-2">
          {label}
          {required && <span className="text-red-400 ml-1">*</span>}
        </label>
      )}
      <input
        type={type}
        name={name}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        disabled={disabled}
        maxLength={maxLength}
        required={required}
        className="w-full px-4 py-3 bg-dark-700 border border-dark-600 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-sera-orange focus:border-transparent disabled:opacity-50 text-sm transition-all duration-300 hover:border-dark-500"
      />
    </div>
  );
};

export default PrimaryInput;
