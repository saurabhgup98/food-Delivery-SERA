import React, { useState, useEffect, useCallback } from 'react';
import { apiService } from '../../services/api';

interface CountryCode {
  name: string;
  code: string;
  phoneCode: string;
  flag: string;
}

interface PhoneInputProps {
  value: string;
  onChange: (value: string) => void;
  countryCode: string;
  onCountryCodeChange: (countryCode: string) => void;
  placeholder?: string;
  label?: string;
  disabled?: boolean;
  className?: string;
  required?: boolean;
  name?: string;
}

const PhoneInput: React.FC<PhoneInputProps> = ({ 
  value, 
  onChange, 
  countryCode,
  onCountryCodeChange,
  placeholder = "Enter phone number",
  label,
  disabled = false,
  className = "",
  required = false,
  name
}) => {
  const [countries, setCountries] = useState<CountryCode[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState<CountryCode | null>(null);



  useEffect(() => {
    if (countries.length > 0 && countryCode) {
      const country = countries.find(c => c.code === countryCode);
      if (country) {
        setSelectedCountry(country);
      }
    }
  }, [countries, countryCode]);

  const fetchCountryCodes = useCallback(async () => {
    try {
      setLoading(true);
      console.log('Fetching country codes...');
      const response = await apiService.getCountryCodes();
      console.log('Country codes response:', response);
      if (response.success) {
        // Transform Country[] to CountryCode[] by adding flag property
        const countryCodes = response.data.countries.map((country: any) => ({
          ...country,
          flag: `🇮🇳` // Default flag, should be mapped properly in real implementation
        }));
        setCountries(countryCodes);
        console.log('Countries set:', response.data.countries.length);
        // Set default to India if no country is selected
        if (!countryCode) {
          const india = countryCodes.find((c: CountryCode) => c.code === 'IN');
          if (india) {
            setSelectedCountry(india);
            onCountryCodeChange(india.code);
          }
        }
      }
    } catch (error) {
      console.error('Error fetching country codes:', error);
    } finally {
      setLoading(false);
    }
  }, [countryCode, onCountryCodeChange]); // Include dependencies

  useEffect(() => {
    // Only fetch once when component mounts
    if (countries.length === 0) {
      fetchCountryCodes();
    }
  }, [countries.length, fetchCountryCodes]); // Include dependencies

  const handleCountrySelect = (country: CountryCode) => {
    setSelectedCountry(country);
    onCountryCodeChange(country.code);
    setIsOpen(false);
  };

  const formatPhoneNumber = (value: string) => {
    // Remove all non-digit characters
    const digits = value.replace(/\D/g, '');
    
    // Format based on country
    if (selectedCountry?.code === 'IN') {
      // Indian format: XXX XXX XXXX
      if (digits.length <= 3) return digits;
      if (digits.length <= 6) return `${digits.slice(0, 3)} ${digits.slice(3)}`;
      return `${digits.slice(0, 3)} ${digits.slice(3, 6)} ${digits.slice(6, 10)}`;
    } else if (selectedCountry?.code === 'US' || selectedCountry?.code === 'CA') {
      // US/Canada format: (XXX) XXX-XXXX
      if (digits.length <= 3) return digits;
      if (digits.length <= 6) return `(${digits.slice(0, 3)}) ${digits.slice(3)}`;
      return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6, 10)}`;
    }
    
    // Default format: just digits
    return digits;
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatPhoneNumber(e.target.value);
    onChange(formatted);
  };

  return (
    <div className={className}>
      {label && (
        <label className="block text-sm font-medium text-gray-300 mb-1 sm:mb-2">
          {label}
          {required && <span className="text-red-400 ml-1">*</span>}
        </label>
      )}
      
             <div className="relative flex flex-col sm:flex-row">
         {/* Country Code Selector */}
         <div className="relative mb-2 sm:mb-0">
           <button
             type="button"
             onClick={() => !disabled && setIsOpen(!isOpen)}
             disabled={disabled}
             className={`
               flex items-center justify-center space-x-2 px-3 py-3 bg-dark-700 border border-dark-600 
               rounded-xl sm:rounded-l-xl sm:rounded-r-none transition-all duration-300 ease-out 
               min-w-[140px] sm:min-w-[120px] group relative overflow-hidden
               ${disabled 
                 ? 'opacity-50 cursor-not-allowed' 
                 : 'cursor-pointer hover:border-sera-orange hover:bg-dark-650 focus:border-sera-orange focus:bg-dark-650 hover:shadow-lg hover:shadow-sera-orange/20'
               }
               ${isOpen 
                 ? 'border-sera-orange bg-dark-650 shadow-lg shadow-sera-orange/20' 
                 : ''
               }
             `}
           >
             {/* Hover effect background */}
             <div className="absolute inset-0 bg-gradient-to-r from-sera-orange/10 to-sera-pink/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
             
             {loading ? (
               <div className="flex items-center space-x-2 relative z-10">
                 <div className="w-4 h-4 border-2 border-sera-orange border-t-transparent rounded-full animate-spin"></div>
                 <span className="text-sm text-gray-400">Loading...</span>
               </div>
             ) : selectedCountry ? (
               <div className="flex items-center space-x-2 relative z-10">
                 <img 
                   src={selectedCountry.flag} 
                   alt={selectedCountry.name}
                   className="w-4 h-4 rounded-sm shadow-sm ring-1 ring-white/20"
                 />
                 <span className="text-sm text-white font-medium">+{selectedCountry.phoneCode}</span>
                 <svg 
                   className={`w-3 h-3 text-gray-400 transition-all duration-300 ease-out group-hover:text-sera-orange ${
                     isOpen ? 'rotate-180 text-sera-orange' : ''
                   }`}
                   fill="none" 
                   stroke="currentColor" 
                   viewBox="0 0 24 24"
                 >
                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                 </svg>
               </div>
             ) : (
               <span className="text-sm text-gray-400 relative z-10">Select</span>
             )}
           </button>

                     {/* Country Dropdown */}
           {isOpen && (
             <div className="absolute top-full left-0 mt-1 bg-dark-700 border border-dark-600 rounded-xl shadow-2xl z-[9999] max-h-60 overflow-y-auto w-[280px] sm:w-[320px]">
               {countries.map((country) => (
                 <button
                   key={country.code}
                   onClick={() => handleCountrySelect(country)}
                   className={`
                     w-full flex items-center space-x-3 px-3 py-2 text-left 
                     transition-all duration-200 ease-out
                     hover:bg-dark-600 hover:scale-[1.02] hover:shadow-md
                     ${selectedCountry?.code === country.code 
                       ? 'bg-dark-600 text-white shadow-inner' 
                       : 'text-gray-300 hover:text-white'
                     }
                     ${country.code === 'IN' ? 'border-b border-dark-500' : ''}
                     first:rounded-t-xl last:rounded-b-xl
                   `}
                 >
                   <img 
                     src={country.flag} 
                     alt={country.name}
                     className="w-4 h-4 rounded-sm flex-shrink-0 shadow-sm"
                   />
                   <div className="flex-1 min-w-0">
                     <div className="text-sm font-medium truncate">{country.name}</div>
                     <div className="text-xs text-gray-400">+{country.phoneCode}</div>
                   </div>
                   {selectedCountry?.code === country.code && (
                     <svg className="w-4 h-4 text-sera-orange flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                     </svg>
                   )}
                 </button>
               ))}
             </div>
           )}
        </div>

                 {/* Phone Number Input */}
         <input
           type="tel"
           name={name}
           value={value}
           onChange={handlePhoneChange}
           placeholder={placeholder}
           disabled={disabled}
           required={required}
           className="flex-1 px-4 py-3 bg-dark-700 border border-dark-600 sm:border-l-0 rounded-xl sm:rounded-l-none sm:rounded-r-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-sera-orange focus:border-transparent disabled:opacity-50 text-sm transition-all duration-300 hover:border-dark-500"
         />
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

export default PhoneInput;
