import React from 'react';
import { X } from 'lucide-react';
import ArrowRightIcon from '../Icon/Arrows/ArrowRightIcon';
import { PrimaryActionBtnProps } from '../Button/PrimaryActionBtn';
import SecondaryContentContainer from '../Container/SecondaryContentContainer';

export interface PrimarySearchBarProps {
  // Core functionality
  onSearch: (query: string) => void;
  value?: string;
  onChange?: (value: string) => void;
  
  // Optional UI elements
  leftIcon?: React.ComponentType<{ className?: string }> | null;
  rightIcon?: React.ComponentType<{ className?: string }>;
  btn?: React.ComponentType<any> | null; // Component that will receive its own props
  btnProps?: any; // Props to pass to the btn component
  onClickBtn?: () => void;
  
  // Text and behavior
  placeholder?: string;
  clearOnSearch?: boolean;
  persistText?: boolean;
  
  // Styling - Container
  containerBg?: string;
  containerBorder?: string;
  containerBackdrop?: string;
  
  // Styling - Input
  inputBg?: string;
  inputBorder?: string;
  inputTextColor?: string;
  inputPlaceholderColor?: string;
  inputFocusRing?: string;
  inputFocusBorder?: string;
  
  // Styling - Icons
  leftIconColor?: string;
  leftIconSize?: string;
  rightIconColor?: string;
  rightIconSize?: string;
  rightIconBg?: string;
  rightIconBgHover?: string;
  
  // Behavior
  showEnterIcon?: boolean;
  showActionButtons?: boolean; // New prop to show X and -> buttons when typing
  disabled?: boolean;
  className?: string;
}

// Utility functions for PrimarySearchBar
export const handleSearchBarValueChange = (
  newValue: string,
  controlledValue: string | undefined,
  setInternalValue: (value: string) => void,
  onChange: ((value: string) => void) | undefined,
  setIsTyping: (typing: boolean) => void
) => {
  if (controlledValue === undefined) {
    setInternalValue(newValue);
  }
  onChange?.(newValue);
  setIsTyping(newValue.trim().length > 0);
};

export const handleSearchBarSearch = (
  value: string,
  disabled: boolean,
  onSearch: (query: string) => void,
  clearOnSearch: boolean,
  handleValueChange: (value: string) => void,
  setIsTyping: (typing: boolean) => void
) => {
  if (value.trim() && !disabled) {
    onSearch(value.trim());
    if (clearOnSearch) {
      handleValueChange('');
      setIsTyping(false);
    }
  }
};

export const handleSearchBarSubmit = (
  e: React.FormEvent,
  handleSearch: () => void
) => {
  e.preventDefault();
  handleSearch();
};

export const handleSearchBarKeyPress = (
  e: React.KeyboardEvent,
  handleSearch: () => void
) => {
  if (e.key === 'Enter') {
    e.preventDefault();
    handleSearch();
  }
};

// Button props interface for both action buttons
export interface SearchBarButtonProps {
  clearButton: PrimaryActionBtnProps;
  searchButton: PrimaryActionBtnProps;
}

// Utility function to get action button props
export const getSearchBarActionButtonProps = (
  onClear: () => void,
  onSearch: () => void,
  disabled: boolean = false
): SearchBarButtonProps => ({
  clearButton: {
    onClick: onClear,
    disabled,
    width: 'w-8',
    height: 'h-8',
    bgColor: 'bg-white/15',
    bgHoverColor: 'hover:bg-white/25',
    radius: 'rounded-full',
    content: React.createElement(SecondaryContentContainer, {
      rows: [
        {
          components: {
            content: React.createElement(X, { className: "w-5 h-5 text-white/70" }),
            marginRight: 'mr-0',
          },
          className: 'w-fit h-full',
        },
      ],
      className: 'w-fit h-full',
    }),
  },
  searchButton: {
    onClick: onSearch,
    disabled,
    width: 'w-8',
    height: 'h-8',
    bgColor: 'bg-white/90',
    bgHoverColor: 'hover:bg-white',
    radius: 'rounded-full',
    content: React.createElement(SecondaryContentContainer, {
      rows: [
        {
          components: {
            content: React.createElement(ArrowRightIcon, { className: "w-4 h-4 text-black/60" }),
            marginRight: 'mr-0',
          },
          className: 'w-fit h-full',
        },
      ],
      className: 'w-fit h-full',
    }),
  },
});