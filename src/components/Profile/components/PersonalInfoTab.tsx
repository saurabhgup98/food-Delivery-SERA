import React, { useState, useEffect } from 'react';

import {
  getEditPersonalInfoBtn,
  getAccountSecuritySectionProps,
  getButtonProps,
  getInitialFormData,
  savePersonalInfoToLocalStorage,
  loadPersonalInfoFromLocalStorage,
  getFormFieldsConfig,
} from '../config/PersonalInfoConfig';
import { useAuth } from '../../../contexts';
import { PersonalInfoFormDataI } from '../ProfilePageInterfaces';
import { PrimaryCenteredActionBtn } from '../../buttons';
import { PrimaryForm } from '../../Form';
import ChangePasswordModal from '../../Auth/components/ChangePasswordModal';

const PersonalInfo: React.FC = () => {
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [showChangePasswordModal, setShowChangePasswordModal] = useState(false);
  const [formData, setFormData] = useState<PersonalInfoFormDataI>(getInitialFormData(user));

  const securitySection = getAccountSecuritySectionProps(
    () => setShowChangePasswordModal(true),
    () => console.log('Toggle 2FA')
  );

  // Get form fields configuration
  const formFieldsConfig = getFormFieldsConfig(formData, setFormData, isEditing);

  // Load saved data from localStorage on component mount
  useEffect(() => {
    const loadedData = loadPersonalInfoFromLocalStorage(user);
    setFormData(loadedData);
  }, [user]);

  const handleSave = () => {
    savePersonalInfoToLocalStorage(formData);
    console.log('Saving personal info:', formData);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setFormData(getInitialFormData(user));
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
        <PrimaryCenteredActionBtn
          onClick={() => setIsEditing(!isEditing)}
          text={isEditing ? 'Cancel' : 'Edit'}
          size="md"
          className="w-full sm:w-auto px-3 sm:px-4 py-2"
        />
      </div>

      {/* Profile Picture Section */}
      <div className="bg-dark-700 rounded-lg p-3 sm:p-6">
        <div className="flex flex-col items-center space-y-4">
          <div className="relative">
            <div className="w-20 h-20 sm:w-24 sm:h-24 bg-gradient-to-r from-sera-blue to-blue-600 rounded-full flex items-center justify-center text-white text-2xl sm:text-3xl font-bold shadow-lg border-4 border-sera-blue/30">
              {user?.username?.charAt(0).toUpperCase() || 'U'}
            </div>
            {isEditing && (
              <button
                className="absolute -bottom-2 -right-2 w-8 h-8 bg-sera-orange text-white rounded-full flex items-center justify-center hover:bg-orange-600 transition-colors duration-200 text-sm shadow-lg"
                onClick={() => console.log('Change profile picture')}
              >
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
      <PrimaryForm 
        columns={2}
        fields={formFieldsConfig}
        className={isEditing ? 'opacity-100' : 'opacity-75'}
      />

      {/* Action Buttons */}
      {isEditing && (
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-end space-y-2 sm:space-y-0 sm:space-x-3 pt-3 sm:pt-6 border-t border-dark-700">
          {getEditPersonalInfoBtn(handleSave, handleCancel).map((button, index) => (
            <PrimaryCenteredActionBtn
              key={index}
              {...getButtonProps(button)}
            />
          ))}
        </div>
      )}

      {/* Account Security */}
      <div className="bg-dark-700 rounded-lg p-3 sm:p-6">
        <h4 className="text-white font-medium mb-2 sm:mb-4 text-sm sm:text-base">{securitySection.title}</h4>
        <div className="space-y-2 sm:space-y-3">
          {securitySection.items.map((item, index) => (
            <div key={index} className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-1 sm:space-y-0">
              <div>
                <p className="text-white text-sm sm:text-base">{item.title}</p>
                <p className="text-gray-400 text-xs sm:text-sm">{item.description}</p>
              </div>
              <PrimaryCenteredActionBtn
                {...getButtonProps(item.button)}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Change Password Modal */}
      <ChangePasswordModal
        isOpen={showChangePasswordModal}
        onClose={() => setShowChangePasswordModal(false)}
      />
    </div>
  );
};

export default PersonalInfo;