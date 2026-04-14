import React, { useState, useEffect, useCallback } from 'react';
import { apiService } from '../../services/api';

interface LocationOption {
  name: string;
  code: string;
  flag?: string;
  population?: number;
}

interface LocationDropdownProps {
  type: 'country' | 'state' | 'city';
  value: string;
  onChange: (value: string) => void;
  countryCode?: string;
  stateCode?: string;
  placeholder?: string;
  label?: string;
  disabled?: boolean;
  className?: string;
  required?: boolean;
  name?: string;
}

const LocationDropdown: React.FC<LocationDropdownProps> = ({ 
  type,
  value, 
  onChange, 
  countryCode,
  stateCode,
  placeholder = "Select...",
  label,
  disabled = false,
  className = "",
  required = false,
  name
}) => {
  const [options, setOptions] = useState<LocationOption[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [selectedOption, setSelectedOption] = useState<LocationOption | null>(null);



  useEffect(() => {
    if (options.length > 0 && value) {
      const option = options.find(o => o.code === value);
      if (option) {
        setSelectedOption(option);
      }
    }
  }, [options, value]);

  const fetchOptions = useCallback(async () => {
    try {
      setLoading(true);
      let response;

      switch (type) {
        case 'country':
          response = await apiService.getCountries();
          break;
        case 'state':
          if (!countryCode) return;
          response = await apiService.getStates(countryCode);
          break;
        case 'city':
          if (!countryCode || !stateCode) return;
          response = await apiService.getCities(countryCode, stateCode);
          break;
        default:
          return;
      }

      if (response.success) {
        const data = response.data;
        let optionsData: LocationOption[] = [];

        switch (type) {
          case 'country':
            optionsData = data.countries.map((country: any) => ({
              name: country.name,
              code: country.code,
              flag: country.flag
            }));
            break;
          case 'state':
            optionsData = data.states.map((state: any) => ({
              name: state.name,
              code: state.code
            }));
            break;
          case 'city':
            optionsData = data.cities.map((city: any) => ({
              name: city.name,
              code: city.code,
              population: city.population
            }));
            break;
        }

        setOptions(optionsData);
      }
    } catch (error) {
      console.error(`Error fetching ${type}s:`, error);
    } finally {
      setLoading(false);
    }
  }, [type, countryCode, stateCode]);

  useEffect(() => {
    fetchOptions();
  }, [fetchOptions]);

  const handleOptionSelect = (option: LocationOption) => {
    setSelectedOption(option);
    onChange(option.code);
    setIsOpen(false);
    
    // Clear dependent fields when country changes
    if (type === 'country') {
      // This will trigger parent component to clear state and city
      onChange(option.code);
    }
  };

  const getDisplayText = () => {
    if (loading) return 'Loading...';
    if (selectedOption) {
      if (type === 'country' && selectedOption.flag) {
        return (
          <div className="flex items-center space-x-2">
            <img 
              src={selectedOption.flag} 
              alt={selectedOption.name}
              className="w-4 h-4 rounded-sm"
            />
            <span>{selectedOption.name}</span>
          </div>
        );
      }
      return selectedOption.name;
    }
    return placeholder;
  };

  return (
    <div className={`relative ${className}`}>
      {label && (
        <label className="block text-sm font-medium text-gray-300 mb-1 sm:mb-2">
          {label}
          {required && <span className="text-red-400 ml-1">*</span>}
        </label>
      )}
      
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
            <span className="text-lg">
              {type === 'country' && '🌍'}
              {type === 'state' && '🏛️'}
              {type === 'city' && '🏙️'}
            </span>
            <span className={`text-sm ${selectedOption ? 'text-white' : 'text-gray-400'}`}>
              {getDisplayText()}
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

      {/* Dropdown Options */}
      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-dark-700 border border-dark-600 rounded-xl shadow-2xl z-50 max-h-60 overflow-y-auto">
          {loading ? (
            <div className="p-4 text-center">
              <div className="w-6 h-6 border-2 border-sera-orange border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
              <span className="text-sm text-gray-400">Loading {type}s...</span>
            </div>
          ) : options.length === 0 ? (
            <div className="p-4 text-center">
              <span className="text-sm text-gray-400">No {type}s found</span>
            </div>
          ) : (
            options.map((option) => (
              <button
                key={option.code}
                onClick={() => handleOptionSelect(option)}
                className="w-full flex items-center space-x-3 px-4 py-2.5 text-left hover:bg-dark-600 transition-colors duration-200 first:rounded-t-xl last:rounded-b-xl"
              >
                {type === 'country' && option.flag && (
                  <img 
                    src={option.flag} 
                    alt={option.name}
                    className="w-4 h-4 rounded-sm flex-shrink-0"
                  />
                )}
                <div className="flex-1 min-w-0">
                  <div className="text-sm text-white font-medium truncate">{option.name}</div>
                  {type === 'city' && option.population && (
                    <div className="text-xs text-gray-400">
                      {option.population.toLocaleString()} people
                    </div>
                  )}
                </div>
                {selectedOption?.code === option.code && (
                  <svg className="w-4 h-4 text-sera-orange flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                )}
              </button>
            ))
          )}
        </div>
      )}

      {/* Backdrop for mobile */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-40"
          onClick={() => setIsOpen(false)}
        />
      )}
    </div>
  );
};

export default LocationDropdown;
