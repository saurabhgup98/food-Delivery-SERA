import React, { useState, useRef, useEffect } from 'react';
import { DropdownOption } from '../../data/dropdownOptions';

interface PrimaryDropdownProps {
  value: string;
  onChange: (value: string) => void;
  options: DropdownOption[];
  placeholder?: string;
  disabled?: boolean;
  className?: string;
}

const PrimaryDropdown: React.FC<PrimaryDropdownProps> = ({ 
  value, 
  onChange, 
  options, 
  placeholder = "Select an option",
  disabled = false,
  className = ""
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const selectedOption = options.find(option => option.value === value) || 
    { value: '', label: placeholder, icon: '🔽' };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (optionValue: string) => {
    onChange(optionValue);
    setIsOpen(false);
  };

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      <button
        type="button"
        onClick={() => !disabled && setIsOpen(!isOpen)}
        disabled={disabled}
        className={`
          w-full px-4 py-3 bg-dark-700 border border-dark-600 rounded-xl text-left
          transition-all duration-300 ease-out
          ${disabled 
            ? 'opacity-50 cursor-not-allowed' 
            : 'cursor-pointer hover:border-dark-500 hover:bg-dark-650 focus:border-sera-orange focus:bg-dark-650'
          }
          ${isOpen 
            ? 'border-sera-orange bg-dark-650 shadow-lg shadow-sera-orange/20' 
            : ''
          }
        `}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            {selectedOption.icon && (
              <span className="text-lg">{selectedOption.icon}</span>
            )}
            <span className={`text-sm ${value ? 'text-white' : 'text-gray-400'}`}>
              {selectedOption.label}
            </span>
          </div>
          <svg 
            className={`w-4 h-4 text-gray-400 transition-transform duration-300 ease-out ${
              isOpen ? 'rotate-180 text-sera-orange' : ''
            }`}
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </button>

      {/* Dropdown Menu - Original Design */}
      <div className={`
        absolute top-full left-0 right-0 mt-1 bg-dark-700 border border-dark-600 rounded-xl shadow-2xl
        transition-all duration-300 ease-out z-[9999] max-h-[300px] overflow-y-auto overflow-x-hidden
        ${isOpen 
          ? 'opacity-100 scale-100 translate-y-0' 
          : 'opacity-0 scale-95 -translate-y-2 pointer-events-none'
        }
      `}>
        <div className="py-2">
          {options.map((option, index) => (
            <button
              key={option.value}
              type="button"
              onClick={() => handleSelect(option.value)}
              className={`
                w-full px-4 py-2.5 flex items-center justify-between
                transition-all duration-200 ease-out
                hover:bg-dark-600 hover:text-white
                ${value === option.value 
                  ? 'bg-dark-600 text-white' 
                  : 'text-gray-300'
                }
                ${index === 0 ? 'rounded-t-xl' : ''}
                ${index === options.length - 1 ? 'rounded-b-xl' : ''}
              `}
            >
              <div className="flex items-center space-x-3 min-w-0 flex-1">
                {option.icon && (
                  <span className="text-lg flex-shrink-0">{option.icon}</span>
                )}
                <span className="text-sm font-medium truncate">{option.label}</span>
              </div>
              {value === option.value && (
                <svg className="w-4 h-4 text-sera-orange flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Backdrop for mobile */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-[9998]"
          onClick={() => setIsOpen(false)}
        />
      )}
    </div>
  );
};

export default PrimaryDropdown;
