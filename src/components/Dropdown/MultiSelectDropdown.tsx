import React, { useState, useRef, useEffect } from 'react';
import XIcon from '../Icon/XIcon';
import ArrowDownIcon from '../Icon/Arrows/ArrowDownIcon';

export interface MultiSelectOption {
  value: string;
  label: string;
  icon?: string;
  iconNode?: React.ReactNode;
}

export interface MultiSelectDropdownProps {
  // Core functionality
  options: MultiSelectOption[];
  value: string[];
  onChange: (values: string[]) => void;
  placeholder?: string;
  disabled?: boolean;
  
  // Styling - Container
  containerBg?: string;
  containerBorder?: string;
  containerRounded?: string;
  containerPadding?: string;
  containerShadow?: string;
  containerHoverBg?: string;
  containerHoverBorder?: string;
  
  // Styling - Dropdown Button
  buttonBg?: string;
  buttonTextColor?: string;
  buttonTextSize?: string;
  buttonFontWeight?: string;
  buttonPadding?: string;
  buttonRounded?: string;
  buttonTransition?: string;
  
  // Styling - Dropdown Panel
  panelBg?: string;
  panelBorder?: string;
  panelRounded?: string;
  panelShadow?: string;
  panelMaxHeight?: string;
  
  // Styling - Options
  optionPadding?: string;
  optionTextColor?: string;
  optionTextSize?: string;
  optionHoverBg?: string;
  optionHoverTextColor?: string;
  optionSelectedBg?: string;
  optionSelectedTextColor?: string;
  optionTransition?: string;
  
  // Styling - Checkbox
  checkboxSize?: string;
  checkboxColor?: string;
  checkboxSelectedColor?: string;
  
  // Styling - Tags (Selected items)
  tagBg?: string;
  tagTextColor?: string;
  tagBorder?: string;
  tagRounded?: string;
  tagPadding?: string;
  tagTextSize?: string;
  tagCloseColor?: string;
  tagCloseHoverColor?: string;
  
  // Behavior
  maxSelections?: number;
  showSelectedCount?: boolean;
  searchable?: boolean;
  clearable?: boolean;
  closeOnSelect?: boolean;
  
  // Size presets
  size?: 'sm' | 'md' | 'lg';
  
  // Custom classes
  className?: string;
  buttonClassName?: string;
  panelClassName?: string;
  optionClassName?: string;
  tagClassName?: string;
}

const MultiSelectDropdown: React.FC<MultiSelectDropdownProps> = ({
  options,
  value = [],
  onChange,
  placeholder = "Select options...",
  disabled = false,
  
  // Container styling with defaults
  containerBg = 'bg-slate-700',
  containerBorder = 'border border-slate-600',
  containerRounded = 'rounded-lg',
  containerPadding = 'p-0',
  containerShadow = 'shadow-sm',
  containerHoverBg = 'hover:bg-slate-600',
  containerHoverBorder = 'hover:border-slate-500',
  
  // Button styling with defaults
  buttonBg = 'bg-transparent',
  buttonTextColor = 'text-gray-300',
  buttonTextSize = 'text-sm',
  buttonFontWeight = 'font-medium',
  buttonPadding = 'px-3 py-2',
  buttonRounded = 'rounded-lg',
  buttonTransition = 'transition-all duration-200',
  
  // Panel styling with defaults
  panelBg = 'bg-slate-800',
  panelBorder = 'border border-slate-600',
  panelRounded = 'rounded-lg',
  panelShadow = 'shadow-lg',
  panelMaxHeight = 'max-h-60',
  
  // Option styling with defaults
  optionPadding = 'px-3 py-2',
  optionTextColor = 'text-gray-300',
  optionTextSize = 'text-sm',
  optionHoverBg = 'hover:bg-slate-700',
  optionHoverTextColor = 'hover:text-white',
  optionSelectedBg = 'bg-blue-600/20',
  optionSelectedTextColor = 'text-blue-400',
  optionTransition = 'transition-all duration-150',
  
  // Checkbox styling with defaults
  checkboxSize = 'w-4 h-4',
  checkboxColor = 'text-gray-400',
  checkboxSelectedColor = 'text-blue-500',
  
  // Tag styling with defaults
  tagBg = 'bg-blue-600/20',
  tagTextColor = 'text-blue-400',
  tagBorder = 'border border-blue-500/30',
  tagRounded = 'rounded-md',
  tagPadding = 'px-2 py-1',
  tagTextSize = 'text-xs',
  tagCloseColor = 'text-blue-400',
  tagCloseHoverColor = 'hover:text-blue-300',
  
  // Behavior
  maxSelections,
  showSelectedCount = true,
  searchable = false,
  clearable = true,
  closeOnSelect = false,
  
  // Size presets
  size = 'md',
  
  // Custom classes
  className = '',
  buttonClassName = '',
  panelClassName = '',
  optionClassName = '',
  tagClassName = ''
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const dropdownRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);

  // Size presets that override defaults
  const sizePresets = {
    sm: {
      containerPadding: 'p-0',
      buttonPadding: 'px-2 py-1',
      buttonTextSize: 'text-xs',
      optionPadding: 'px-2 py-1',
      optionTextSize: 'text-xs',
      tagPadding: 'px-1.5 py-0.5',
      tagTextSize: 'text-xs',
      panelMaxHeight: 'max-h-48'
    },
    md: {
      containerPadding: 'p-0',
      buttonPadding: 'px-3 py-2',
      buttonTextSize: 'text-sm',
      optionPadding: 'px-3 py-2',
      optionTextSize: 'text-sm',
      tagPadding: 'px-2 py-1',
      tagTextSize: 'text-xs',
      panelMaxHeight: 'max-h-60'
    },
    lg: {
      containerPadding: 'p-0',
      buttonPadding: 'px-4 py-3',
      buttonTextSize: 'text-base',
      optionPadding: 'px-4 py-3',
      optionTextSize: 'text-base',
      tagPadding: 'px-3 py-1.5',
      tagTextSize: 'text-sm',
      panelMaxHeight: 'max-h-72'
    }
  };

  const currentSize = sizePresets[size];

  // Filter options based on search term
  const filteredOptions = searchable 
    ? options.filter(option => 
        option.label.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : options;

  // Handle option selection
  const handleOptionClick = (optionValue: string) => {
    if (disabled) return;
    
    const isSelected = value.includes(optionValue);
    let newValue: string[];
    
    if (isSelected) {
      newValue = value.filter(v => v !== optionValue);
    } else {
      if (maxSelections && value.length >= maxSelections) {
        return; // Don't add more if max reached
      }
      newValue = [...value, optionValue];
    }
    
    onChange(newValue);
    
    if (closeOnSelect) {
      setIsOpen(false);
      setSearchTerm('');
    }
  };

  // Handle tag removal
  const handleTagRemove = (tagValue: string) => {
    if (disabled) return;
    onChange(value.filter(v => v !== tagValue));
  };

  // Handle clear all
  const handleClearAll = () => {
    if (disabled) return;
    onChange([]);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setSearchTerm('');
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Focus search input when dropdown opens
  useEffect(() => {
    if (isOpen && searchable && searchRef.current) {
      searchRef.current.focus();
    }
  }, [isOpen, searchable]);

  // Container classes
  const containerClasses = `
    relative
    ${currentSize.containerPadding}
    ${containerBg}
    ${containerBorder}
    ${containerRounded}
    ${containerShadow}
    ${!disabled ? `${containerHoverBg} ${containerHoverBorder}` : 'opacity-50 cursor-not-allowed'}
    ${className}
  `.trim().replace(/\s+/g, ' ');

  // Button classes
  const buttonClasses = `
    w-full
    flex
    items-center
    justify-between
    ${currentSize.buttonPadding}
    ${currentSize.buttonTextSize}
    ${buttonFontWeight}
    ${buttonTransition}
    ${buttonBg}
    ${buttonTextColor}
    ${buttonRounded}
    ${buttonClassName}
  `.trim().replace(/\s+/g, ' ');

  // Panel classes
  const panelClasses = `
    absolute
    top-full
    left-0
    right-0
    z-50
    mt-1
    ${panelBg}
    ${panelBorder}
    ${panelRounded}
    ${panelShadow}
    ${currentSize.panelMaxHeight}
    overflow-hidden
    ${panelClassName}
  `.trim().replace(/\s+/g, ' ');

  // Option classes
  const getOptionClasses = (optionValue: string) => {
    const isSelected = value.includes(optionValue);
    return `
      flex
      items-center
      space-x-2
      ${currentSize.optionPadding}
      ${currentSize.optionTextSize}
      ${optionTransition}
      cursor-pointer
      ${isSelected ? `${optionSelectedBg} ${optionSelectedTextColor}` : `${optionTextColor} ${optionHoverBg} ${optionHoverTextColor}`}
      ${optionClassName}
    `.trim().replace(/\s+/g, ' ');
  };

  // Tag classes
  const tagClasses = `
    inline-flex
    items-center
    space-x-1
    ${currentSize.tagPadding}
    ${currentSize.tagTextSize}
    ${tagBg}
    ${tagTextColor}
    ${tagBorder}
    ${tagRounded}
    ${tagClassName}
  `.trim().replace(/\s+/g, ' ');

  // Get display text
  const getDisplayText = () => {
    if (value.length === 0) return placeholder;
    if (showSelectedCount && value.length > 1) {
      return `${value.length} selected`;
    }
    if (value.length === 1) {
      const selectedOption = options.find(opt => opt.value === value[0]);
      return selectedOption?.label || value[0];
    }
    return `${value.length} selected`;
  };

  return (
    <div ref={dropdownRef} className={containerClasses}>
      {/* Dropdown Button */}
      <button
        type="button"
        onClick={() => !disabled && setIsOpen(!isOpen)}
        disabled={disabled}
        className={buttonClasses}
      >
        <div className="flex items-center space-x-2 flex-1 min-w-0">
          {/* Selected Tags */}
          {value.length > 0 && !showSelectedCount && (
            <div className="flex flex-wrap gap-1 flex-1 min-w-0">
              {value.slice(0, 2).map(tagValue => {
                const option = options.find(opt => opt.value === tagValue);
                return (
                  <span key={tagValue} className={tagClasses}>
                    <span className="truncate">{option?.label || tagValue}</span>
                    {clearable && (
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleTagRemove(tagValue);
                        }}
                        className={`${tagCloseColor} ${tagCloseHoverColor} transition-colors`}
                      >
                        <XIcon className="w-3 h-3" />
                      </button>
                    )}
                  </span>
                );
              })}
              {value.length > 2 && (
                <span className={`${tagClasses} ${tagTextColor}`}>
                  +{value.length - 2} more
                </span>
              )}
            </div>
          )}
          
          {/* Display Text */}
          {(!value.length || showSelectedCount) && (
            <span className="truncate">{getDisplayText()}</span>
          )}
        </div>
        
        {/* Clear Button */}
        {clearable && value.length > 0 && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              handleClearAll();
            }}
            className={`${tagCloseColor} ${tagCloseHoverColor} transition-colors p-1`}
          >
            <XIcon className="w-4 h-4" />
          </button>
        )}
        
        {/* Dropdown Arrow */}
        <ArrowDownIcon 
          className={`w-4 h-4 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} 
        />
      </button>

      {/* Dropdown Panel */}
      {isOpen && (
        <div className={panelClasses}>
          {/* Search Input */}
          {searchable && (
            <div className="p-2 border-b border-slate-600">
              <input
                ref={searchRef}
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search options..."
                className="w-full px-2 py-1 text-sm bg-slate-700 text-gray-300 border border-slate-600 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          )}

          {/* Options List */}
          <div className="overflow-y-auto">
            {filteredOptions.length === 0 ? (
              <div className={`${currentSize.optionPadding} ${optionTextColor} ${currentSize.optionTextSize} text-center`}>
                {searchable && searchTerm ? 'No options found' : 'No options available'}
              </div>
            ) : (
              filteredOptions.map((option) => {
                const isSelected = value.includes(option.value);
                
                return (
                  <div
                    key={option.value}
                    onClick={() => handleOptionClick(option.value)}
                    className={getOptionClasses(option.value)}
                  >
                    {/* Checkbox */}
                    <div className={`${checkboxSize} flex items-center justify-center`}>
                      {isSelected ? (
                        <span className={`${checkboxSize} ${checkboxSelectedColor} flex items-center justify-center`}>✓</span>
                      ) : (
                        <div className={`${checkboxSize} border border-gray-400 rounded`} />
                      )}
                    </div>
                    
                    {/* Icon */}
                    {option.iconNode ?? (option.icon ? <span className="text-sm">{option.icon}</span> : null)}
                    
                    {/* Label */}
                    <span className="flex-1 truncate">{option.label}</span>
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default MultiSelectDropdown;