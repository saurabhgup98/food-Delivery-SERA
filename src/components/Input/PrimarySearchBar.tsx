import React, { useState } from 'react';
import { Search } from 'lucide-react';
import PrimaryActionBtn from '../Button/PrimaryActionBtn';
import { 
  PrimarySearchBarProps, 
  handleSearchBarValueChange,
  handleSearchBarSearch,
  handleSearchBarSubmit,
  handleSearchBarKeyPress,
  getSearchBarActionButtonProps
} from './PrimarySearchBarUtils';

const PrimarySearchBar: React.FC<PrimarySearchBarProps> = ({
  // Core functionality
  onSearch,
  value: controlledValue,
  onChange,
  
  // Optional UI elements
  leftIcon: LeftIcon = null,
  rightIcon: RightIcon = Search,
  btn: BtnComponent = null,
  btnProps,
  onClickBtn,
  
  // Text and behavior
  placeholder = "Type to search",
  clearOnSearch = false,
  persistText = true,
  
  // Styling - Container (Main Header defaults)
  containerBg = '',
  containerBorder = '',
  containerBackdrop = 'backdrop-blur-sm',
  
  // Styling - Input (Main Header defaults)
  inputBg = 'bg-white/10',
  inputBorder = 'border-white/20',
  inputTextColor = 'text-white',
  inputPlaceholderColor = 'placeholder-white/60',
  inputFocusRing = 'focus:ring-2 focus:ring-white/50',
  inputFocusBorder = 'focus:border-transparent',
  
  // Styling - Icons (Main Header defaults)
  leftIconColor = 'text-white/60',
  leftIconSize = 'w-5 h-5',
  rightIconColor = 'text-white',
  rightIconSize = 'w-4 h-4',
  rightIconBg = 'bg-white/20',
  rightIconBgHover = 'hover:bg-white/30',
  
  // Behavior
  showEnterIcon = true,
  showActionButtons = false, // New prop for dual action buttons
  disabled = false,
  className = ''
}) => {
  const [internalValue, setInternalValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  
  // Use controlled or uncontrolled value
  const value = controlledValue !== undefined ? controlledValue : internalValue;
  
  // Handle value changes
  const handleValueChange = (newValue: string) => {
    handleSearchBarValueChange(
      newValue,
      controlledValue,
      setInternalValue,
      onChange,
      setIsTyping
    );
  };
  
  // Handle search
  const handleSearch = () => {
    handleSearchBarSearch(
      value,
      disabled,
      onSearch,
      clearOnSearch,
      handleValueChange,
      setIsTyping
    );
  };

  // Handle clear
  const handleClear = () => {
    handleValueChange('');
  };
  
  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    handleSearchBarSubmit(e, handleSearch);
  };
  
  // Handle enter key
  const handleKeyPress = (e: React.KeyboardEvent) => {
    handleSearchBarKeyPress(e, handleSearch);
  };
  
  // Dynamic left icon - show search icon when typing if showActionButtons is true
  const DynamicLeftIcon = showActionButtons && isTyping ? Search : LeftIcon;
  
  // Container classes
  const containerClasses = `
    relative w-full ${containerBg} ${containerBorder} ${containerBackdrop}
    ${className}
  `.trim();
  
  // Input classes - adjust padding based on action buttons and left icon
  const hasLeftIcon = DynamicLeftIcon || (showActionButtons && isTyping);
  const leftPadding = hasLeftIcon ? 'pl-10' : 'pl-4'; // pl-10 for icon, pl-4 for no icon
  const rightPadding = showActionButtons && isTyping ? 'pr-20' : 'pr-12';
  const inputPadding = `${leftPadding} ${rightPadding}`;
  const inputClasses = `
    w-full px-4 py-2 ${inputPadding} ${inputBorder} rounded-lg ${inputBg} ${inputTextColor} ${inputPlaceholderColor}
    focus:outline-none ${inputFocusRing} ${inputFocusBorder} transition-all duration-200
    ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
  `.trim();
  
  // Left icon classes
  const leftIconClasses = `
    absolute left-3 top-1/2 transform -translate-y-1/2 ${leftIconSize} ${leftIconColor}
    pointer-events-none
  `.trim();
  
  // Right icon classes
  const rightIconClasses = `
    absolute right-3 top-1/2 transform -translate-y-1/2 w-8 h-8 ${rightIconBg} rounded-full
    flex items-center justify-center ${rightIconBgHover} transition-colors duration-200
    ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
  `.trim();
  
  
  return (
    <div className={containerClasses}>
      <form onSubmit={handleSubmit} className="relative">
        {/* Left Icon */}
        {DynamicLeftIcon && (
          <div className={leftIconClasses}>
            <DynamicLeftIcon className={`${leftIconSize} ${leftIconColor}`} />
          </div>
        )}
        
        {/* Input Field */}
        <input
          type="text"
          value={value}
          onChange={(e) => handleValueChange(e.target.value)}
          onKeyPress={handleKeyPress}
          className={inputClasses}
          placeholder={placeholder}
          disabled={disabled}
        />
        
        {/* Action Buttons - Show when typing and showActionButtons is true */}
        {showActionButtons && isTyping ? (
          <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex items-center space-x-1">
            {/* Get button props from utility function */}
            {(() => {
              const buttonProps = getSearchBarActionButtonProps(handleClear, handleSearch, disabled);
              return (
                <>
                  {/* Clear Button (X) */}
                  <PrimaryActionBtn
                    {...buttonProps.clearButton}
                  />
                  
                  {/* Search Button (Arrow Right) */}
                  <PrimaryActionBtn
                    {...buttonProps.searchButton}
                  />
                </>
              );
            })()}
          </div>
        ) : (
          /* Default Right Icon Button */
          RightIcon && (
            <button
              type="button"
              onClick={handleSearch}
              disabled={disabled}
              className={rightIconClasses}
            >
              <RightIcon className={`${rightIconSize} ${rightIconColor}`} />
            </button>
          )
        )}
      </form>
      
       {/* Optional Button Component */}
       {BtnComponent && (
         <BtnComponent
           {...btnProps}
           onClick={onClickBtn || handleSearch}
           disabled={disabled}
         />
       )}
    </div>
  );
};

export default PrimarySearchBar;