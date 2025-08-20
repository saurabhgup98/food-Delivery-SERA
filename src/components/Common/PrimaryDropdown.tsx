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
  const [searchQuery, setSearchQuery] = useState('');
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const optionsRef = useRef<HTMLDivElement>(null);

  const selectedOption = options.find(option => option.value === value) || 
    { value: '', label: placeholder, icon: '🔽' };

  // Filter options based on search query
  const filteredOptions = options.filter(option =>
    option.label.toLowerCase().includes(searchQuery.toLowerCase())
  );

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setSearchQuery('');
        setHighlightedIndex(-1);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (!isOpen) return;

      switch (event.key) {
        case 'ArrowDown':
          event.preventDefault();
          setHighlightedIndex(prev => 
            prev < filteredOptions.length - 1 ? prev + 1 : 0
          );
          break;
        case 'ArrowUp':
          event.preventDefault();
          setHighlightedIndex(prev => 
            prev > 0 ? prev - 1 : filteredOptions.length - 1
          );
          break;
        case 'Enter':
          event.preventDefault();
          if (highlightedIndex >= 0 && filteredOptions[highlightedIndex]) {
            handleSelect(filteredOptions[highlightedIndex].value);
          }
          break;
        case 'Escape':
          event.preventDefault();
          setIsOpen(false);
          setSearchQuery('');
          setHighlightedIndex(-1);
          break;
        default:
          // Handle typing for search
          if (event.key.length === 1) {
            setSearchQuery(prev => prev + event.key);
            setHighlightedIndex(-1);
          }
          break;
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, filteredOptions, highlightedIndex]);

  // Scroll highlighted option into view
  useEffect(() => {
    if (highlightedIndex >= 0 && optionsRef.current) {
      const highlightedElement = optionsRef.current.children[highlightedIndex] as HTMLElement;
      if (highlightedElement) {
        highlightedElement.scrollIntoView({
          block: 'nearest',
          behavior: 'smooth'
        });
      }
    }
  }, [highlightedIndex]);

  // Clear search when dropdown closes
  useEffect(() => {
    if (!isOpen) {
      setSearchQuery('');
      setHighlightedIndex(-1);
    }
  }, [isOpen]);

  const handleSelect = (optionValue: string) => {
    onChange(optionValue);
    setIsOpen(false);
    setSearchQuery('');
    setHighlightedIndex(-1);
  };

  const handleToggle = () => {
    if (disabled) return;
    
    const newIsOpen = !isOpen;
    setIsOpen(newIsOpen);
    
    if (newIsOpen) {
      // Focus the input when opening
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    setHighlightedIndex(-1);
  };

  const handleInputClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!isOpen) {
      setIsOpen(true);
    }
  };

  // Calculate dropdown position - prefer bottom, only use top if absolutely necessary
  const getDropdownPosition = () => {
    if (!dropdownRef.current) return 'bottom';
    
    const rect = dropdownRef.current.getBoundingClientRect();
    const viewportHeight = window.innerHeight;
    const dropdownHeight = Math.min(filteredOptions.length * 48 + 120, 300); // Approximate height
    
    // Only use top if there's absolutely no space below
    if (rect.bottom + dropdownHeight > viewportHeight && rect.top > dropdownHeight) {
      return 'top';
    }
    return 'bottom';
  };

  const dropdownPosition = getDropdownPosition();

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      {/* Main Button/Input */}
      <div
        onClick={handleToggle}
        className={`
          w-full px-4 py-3 bg-dark-700 border border-dark-600 rounded-xl text-left
          transition-all duration-300 ease-out cursor-pointer
          ${disabled 
            ? 'opacity-50 cursor-not-allowed' 
            : 'hover:border-dark-500 hover:bg-dark-650 focus-within:border-sera-orange focus-within:bg-dark-650'
          }
          ${isOpen 
            ? 'border-sera-orange bg-dark-650 shadow-lg shadow-sera-orange/20' 
            : ''
          }
        `}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3 flex-1 min-w-0">
            {selectedOption.icon && (
              <span className="text-lg flex-shrink-0">{selectedOption.icon}</span>
            )}
            {isOpen ? (
              <input
                ref={inputRef}
                type="text"
                value={searchQuery}
                onChange={handleInputChange}
                onClick={handleInputClick}
                placeholder="Type to search..."
                className="flex-1 bg-transparent text-white text-sm outline-none placeholder-gray-400"
                autoComplete="off"
              />
            ) : (
              <span className={`text-sm truncate ${value ? 'text-white' : 'text-gray-400'}`}>
                {selectedOption.label}
              </span>
            )}
          </div>
          <svg 
            className={`w-4 h-4 text-gray-400 transition-transform duration-300 ease-out flex-shrink-0 ${
              isOpen ? 'rotate-180 text-sera-orange' : ''
            }`}
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>

      {/* Dropdown Menu - Fixed Positioning */}
      {isOpen && (
        <div 
          className="fixed z-[9999] bg-dark-700 border border-dark-600 rounded-xl shadow-2xl max-w-sm"
          style={{
            left: dropdownRef.current?.getBoundingClientRect().left || 0,
            width: Math.min(dropdownRef.current?.getBoundingClientRect().width || 300, 300),
            [dropdownPosition === 'top' ? 'bottom' : 'top']: 
              dropdownPosition === 'top' 
                ? (window.innerHeight - (dropdownRef.current?.getBoundingClientRect().top || 0) + 8)
                : (dropdownRef.current?.getBoundingClientRect().bottom || 0) + 8
          }}
        >
          {/* Search Results Info */}
          {searchQuery && (
            <div className="px-4 py-2 border-b border-dark-600 bg-dark-650">
              <div className="text-xs text-gray-400">
                {filteredOptions.length === 0 
                  ? 'No matches found' 
                  : `${filteredOptions.length} of ${options.length} options`
                }
              </div>
            </div>
          )}

          {/* Options List */}
          <div 
            ref={optionsRef}
            className="max-h-[300px] overflow-y-auto custom-scrollbar overflow-x-hidden"
            style={{ contain: 'layout style paint' }}
          >
            {filteredOptions.length === 0 ? (
              <div className="px-4 py-3 text-gray-400 text-sm text-center">
                No options found
              </div>
            ) : (
              filteredOptions.map((option, index) => (
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
                    ${highlightedIndex === index 
                      ? 'bg-dark-600 text-white' 
                      : ''
                    }
                    ${index === 0 ? 'rounded-t-xl' : ''}
                    ${index === filteredOptions.length - 1 ? 'rounded-b-xl' : ''}
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
              ))
            )}
          </div>

          {/* Keyboard Navigation Hint */}
          <div className="px-4 py-2 border-t border-dark-600 bg-dark-650">
            <div className="text-xs text-gray-400 flex items-center justify-between">
              <span>Use ↑↓ to navigate, Enter to select</span>
              <span>ESC to close</span>
            </div>
          </div>
        </div>
      )}

      {/* Backdrop for mobile */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-[9998]"
          onClick={() => {
            setIsOpen(false);
            setSearchQuery('');
            setHighlightedIndex(-1);
          }}
        />
      )}
    </div>
  );
};

export default PrimaryDropdown;
