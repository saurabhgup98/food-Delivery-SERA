import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';


// Gender Dropdown Component
interface GenderDropdownProps {
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
}

const GenderDropdown: React.FC<GenderDropdownProps> = ({ value, onChange, disabled = false }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const options = [
    { value: '', label: 'Select gender', icon: '👤' },
    { value: 'male', label: 'Male', icon: '👨' },
    { value: 'female', label: 'Female', icon: '👩' },
    { value: 'other', label: 'Other', icon: '🌈' },
    { value: 'prefer-not-to-say', label: 'Prefer not to say', icon: '🤐' }
  ];

  const selectedOption = options.find(option => option.value === value) || options[0];

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
    <div className="relative" ref={dropdownRef}>
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
            <span className="text-lg">{selectedOption.icon}</span>
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

      {/* Dropdown Menu */}
      <div className={`
        absolute top-full left-0 right-0 mt-1 bg-dark-700 border border-dark-600 rounded-xl shadow-2xl
        transition-all duration-300 ease-out z-50
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
                w-full px-4 py-3 flex items-center justify-between
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
              <div className="flex items-center space-x-3">
                <span className="text-lg">{option.icon}</span>
                <span className="text-sm font-medium">{option.label}</span>
              </div>
              {value === option.value && (
                <svg className="w-4 h-4 text-sera-orange" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
          className="fixed inset-0 z-40"
          onClick={() => setIsOpen(false)}
        />
      )}
    </div>
  );
};

const PersonalInfo: React.FC = () => {
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: '',
    dateOfBirth: '',
    gender: '',
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSave = () => {
    // TODO: Implement save functionality
    console.log('Saving personal info:', formData);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setFormData({
      name: user?.name || '',
      email: user?.email || '',
      phone: '',
      dateOfBirth: '',
      gender: '',
    });
    setIsEditing(false);
  };

  return (
    <div className="space-y-3 sm:space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0">
        <div>
          <h3 className="text-lg sm:text-xl font-semibold text-white">Personal Information</h3>
          <p className="text-gray-400 text-sm">Update your personal details and contact information</p>
        </div>
        <button
          onClick={() => setIsEditing(!isEditing)}
          className="w-full sm:w-auto px-3 sm:px-4 py-2 bg-sera-orange text-white rounded-lg hover:bg-orange-600 transition-colors duration-200 text-sm sm:text-base"
        >
          {isEditing ? 'Cancel' : 'Edit'}
        </button>
      </div>

      {/* Profile Picture Section */}
      <div className="bg-dark-700 rounded-lg p-3 sm:p-6">
        <div className="flex flex-col sm:flex-row sm:items-center space-y-3 sm:space-y-0 sm:space-x-4">
          <div className="relative self-center sm:self-auto">
            <div className="w-16 h-16 sm:w-24 sm:h-24 bg-gradient-to-r from-sera-blue to-blue-600 rounded-full flex items-center justify-center text-white text-xl sm:text-3xl font-bold">
              {user?.name?.charAt(0).toUpperCase() || 'U'}
            </div>
            {isEditing && (
              <button className="absolute -bottom-1 -right-1 sm:-bottom-2 sm:-right-2 w-6 h-6 sm:w-8 sm:h-8 bg-sera-orange text-white rounded-full flex items-center justify-center hover:bg-orange-600 transition-colors duration-200 text-xs sm:text-sm">
                📷
              </button>
            )}
          </div>
          <div className="text-center sm:text-left">
            <h4 className="text-white font-medium text-sm sm:text-base">Profile Picture</h4>
            <p className="text-gray-400 text-xs sm:text-sm">Upload a new profile picture</p>
          </div>
        </div>
      </div>

      {/* Form Fields */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-6">
        {/* Name */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1 sm:mb-2">
            Full Name
          </label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            disabled={!isEditing}
            className="w-full px-2 sm:px-4 py-2 sm:py-3 bg-dark-700 border border-dark-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-sera-orange focus:border-transparent disabled:opacity-50 text-sm sm:text-base"
            placeholder="Enter your full name"
          />
        </div>

        {/* Email */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1 sm:mb-2">
            Email Address
          </label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            disabled={!isEditing}
            className="w-full px-2 sm:px-4 py-2 sm:py-3 bg-dark-700 border border-dark-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-sera-orange focus:border-transparent disabled:opacity-50 text-sm sm:text-base"
            placeholder="Enter your email"
          />
        </div>

        {/* Phone */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1 sm:mb-2">
            Phone Number
          </label>
          <input
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handleInputChange}
            disabled={!isEditing}
            className="w-full px-2 sm:px-4 py-2 sm:py-3 bg-dark-700 border border-dark-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-sera-orange focus:border-transparent disabled:opacity-50 text-sm sm:text-base"
            placeholder="Enter your phone number"
          />
        </div>

        {/* Date of Birth */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1 sm:mb-2">
            Date of Birth
          </label>
          <input
            type="date"
            name="dateOfBirth"
            value={formData.dateOfBirth}
            onChange={handleInputChange}
            disabled={!isEditing}
            className="w-full px-2 sm:px-4 py-2 sm:py-3 bg-dark-700 border border-dark-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-sera-orange focus:border-transparent disabled:opacity-50 text-sm sm:text-base"
            placeholder="Select your date of birth"
          />
        </div>

        {/* Gender */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1 sm:mb-2">
            Gender
          </label>
          <GenderDropdown
            value={formData.gender}
            onChange={(value) => setFormData(prev => ({ ...prev, gender: value }))}
            disabled={!isEditing}
          />
        </div>
      </div>

      {/* Account Security */}
      <div className="bg-dark-700 rounded-lg p-3 sm:p-6">
        <h4 className="text-white font-medium mb-2 sm:mb-4 text-sm sm:text-base">Account Security</h4>
        <div className="space-y-2 sm:space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-1 sm:space-y-0">
            <div>
              <p className="text-white text-sm sm:text-base">Password</p>
              <p className="text-gray-400 text-xs sm:text-sm">Last changed 30 days ago</p>
            </div>
            <button className="w-full sm:w-auto px-2 sm:px-4 py-1.5 sm:py-2 bg-dark-600 text-white rounded-lg hover:bg-dark-500 transition-colors duration-200 text-xs sm:text-sm">
              Change
            </button>
          </div>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-1 sm:space-y-0">
            <div>
              <p className="text-white text-sm sm:text-base">Two-Factor Authentication</p>
              <p className="text-gray-400 text-xs sm:text-sm">Add an extra layer of security</p>
            </div>
            <button className="w-full sm:w-auto px-2 sm:px-4 py-1.5 sm:py-2 bg-dark-600 text-white rounded-lg hover:bg-dark-500 transition-colors duration-200 text-xs sm:text-sm">
              Enable
            </button>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      {isEditing && (
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-end space-y-2 sm:space-y-0 sm:space-x-3 pt-3 sm:pt-6 border-t border-dark-700">
          <button
            onClick={handleCancel}
            className="w-full sm:w-auto px-3 sm:px-6 py-2 bg-dark-600 text-white rounded-lg hover:bg-dark-500 transition-colors duration-200 text-sm sm:text-base"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="w-full sm:w-auto px-3 sm:px-6 py-2 bg-sera-orange text-white rounded-lg hover:bg-orange-600 transition-colors duration-200 text-sm sm:text-base"
          >
            Save Changes
          </button>
        </div>
      )}
    </div>
  );
};

export default PersonalInfo;
