import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import PrimaryDropdown from '../Common/PrimaryDropdown';
import PrimaryInput from '../Common/PrimaryInput';
import DatePrimary from '../Common/DatePrimary';
import PhoneInput from '../Common/PhoneInput';
import ChangePasswordModal from '../Common/ChangePasswordModal';
import { genderOptions } from '../../data/dropdownOptions';




const PersonalInfo: React.FC = () => {
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [showChangePasswordModal, setShowChangePasswordModal] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: '',
    countryCode: 'IN',
    dateOfBirth: '',
    gender: '',
  });

  // Load saved data from localStorage on component mount
  useEffect(() => {
    const savedData = localStorage.getItem('personalInfo');
    if (savedData) {
      try {
        const parsed = JSON.parse(savedData);
        setFormData(prev => ({
          ...prev,
          ...parsed,
          name: parsed.name || user?.name || '',
          email: parsed.email || user?.email || '',
        }));
      } catch (error) {
        console.error('Error loading personal info:', error);
      }
    }
  }, [user]);



  const handleSave = () => {
    // Save to localStorage for now (can be replaced with API call later)
    localStorage.setItem('personalInfo', JSON.stringify(formData));
    console.log('Saving personal info:', formData);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setFormData({
      name: user?.name || '',
      email: user?.email || '',
      phone: '',
      countryCode: 'IN',
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
        <div className="flex flex-col items-center space-y-4">
          <div className="relative">
            <div className="w-20 h-20 sm:w-24 sm:h-24 bg-gradient-to-r from-sera-blue to-blue-600 rounded-full flex items-center justify-center text-white text-2xl sm:text-3xl font-bold shadow-lg border-4 border-sera-blue/30">
              {user?.name?.charAt(0).toUpperCase() || 'U'}
            </div>
            {isEditing && (
              <button className="absolute -bottom-2 -right-2 w-8 h-8 bg-sera-orange text-white rounded-full flex items-center justify-center hover:bg-orange-600 transition-colors duration-200 text-sm shadow-lg">
                📷
              </button>
            )}
          </div>
          <div className="text-center">
            <h4 className="text-white font-medium text-base">Profile Picture</h4>
            <p className="text-gray-400 text-sm">Upload a new profile picture</p>
          </div>
        </div>
      </div>

      {/* Form Fields */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-6">
        {/* Name */}
        <PrimaryInput
          type="text"
          value={formData.name}
          onChange={(value) => setFormData(prev => ({ ...prev, name: value }))}
          placeholder="Enter your full name"
          label="Full Name"
          disabled={!isEditing}
        />

        {/* Email */}
        <PrimaryInput
          type="email"
          value={formData.email}
          onChange={(value) => setFormData(prev => ({ ...prev, email: value }))}
          placeholder="Enter your email"
          label="Email Address"
          disabled={!isEditing}
        />

        {/* Phone */}
        <PhoneInput
          value={formData.phone}
          onChange={(value) => setFormData(prev => ({ ...prev, phone: value }))}
          countryCode={formData.countryCode}
          onCountryCodeChange={(value) => setFormData(prev => ({ ...prev, countryCode: value }))}
          placeholder="Enter your phone number"
          label="Phone Number"
          disabled={!isEditing}
        />

        {/* Date of Birth */}
        <DatePrimary
          value={formData.dateOfBirth}
          onChange={(value) => setFormData(prev => ({ ...prev, dateOfBirth: value }))}
          placeholder="Select your date of birth"
          label="Date of Birth"
          disabled={!isEditing}
        />

        {/* Gender */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1 sm:mb-2">
            Gender
          </label>
          <PrimaryDropdown
            value={formData.gender}
            onChange={(value) => setFormData(prev => ({ ...prev, gender: value }))}
            options={genderOptions}
            placeholder="Select gender"
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
            <button 
              onClick={() => setShowChangePasswordModal(true)}
              className="w-full sm:w-auto px-2 sm:px-4 py-1.5 sm:py-2 bg-dark-600 text-white rounded-lg hover:bg-dark-500 transition-colors duration-200 text-xs sm:text-sm"
            >
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

      {/* Change Password Modal */}
      <ChangePasswordModal
        isOpen={showChangePasswordModal}
        onClose={() => setShowChangePasswordModal(false)}
      />
    </div>
  );
};

export default PersonalInfo;
