import React, { useState } from 'react';
import PrimaryInput from './PrimaryInput';
import ValidationModal from './ValidationModal';
import { apiService } from '../../services/api';

interface ChangePasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const ChangePasswordModal: React.FC<ChangePasswordModalProps> = ({ isOpen, onClose }) => {
  const [formData, setFormData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [showValidationModal, setShowValidationModal] = useState(false);
  const [missingFields, setMissingFields] = useState<string[]>([]);
  const [error, setError] = useState('');

  const handleSave = async () => {
    try {
      setIsLoading(true);
      setError('');

      // Validate required fields
      const requiredFields: string[] = [];
      if (!formData.currentPassword) requiredFields.push('Current Password');
      if (!formData.newPassword) requiredFields.push('New Password');
      if (!formData.confirmPassword) requiredFields.push('Confirm Password');

      if (requiredFields.length > 0) {
        setMissingFields(requiredFields);
        setShowValidationModal(true);
        return;
      }

      // Validate password match
      if (formData.newPassword !== formData.confirmPassword) {
        setError('New passwords do not match');
        return;
      }

      // Validate password strength
      if (formData.newPassword.length < 6) {
        setError('New password must be at least 6 characters long');
        return;
      }

      // Call API to change password
      const response = await apiService.changePassword({
        currentPassword: formData.currentPassword,
        newPassword: formData.newPassword
      });
      
      if (response.success) {
        alert('Password changed successfully! Please log in again with your new password.');
        // Clear any stored auth tokens to force re-login
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '/login';
      } else {
        setError(response.message || 'Failed to change password');
      }
    } catch (error) {
      console.error('Error changing password:', error);
      setError('Failed to change password. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    setFormData({ currentPassword: '', newPassword: '', confirmPassword: '' });
    setError('');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
        {/* Backdrop */}
        <div 
          className="absolute inset-0 bg-black/50 backdrop-blur-sm"
          onClick={handleCancel}
        />
        
        {/* Modal */}
        <div className="relative bg-dark-800 rounded-2xl shadow-2xl border border-dark-700 max-w-md w-full mx-4 animate-fade-in">
          {/* Header */}
          <div className="p-6 border-b border-dark-600">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-sera-orange/20 rounded-full flex items-center justify-center">
                <svg className="w-5 h-5 text-sera-orange" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                </svg>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white">Change Password</h3>
                <p className="text-sm text-gray-400">Update your account password</p>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="p-6 space-y-4">
            {error && (
              <div className="p-3 bg-red-500/20 border border-red-500/30 rounded-lg">
                <p className="text-sm text-red-400">{error}</p>
              </div>
            )}

            <PrimaryInput
              type="password"
              value={formData.currentPassword}
              onChange={(value) => setFormData(prev => ({ ...prev, currentPassword: value }))}
              placeholder="Enter current password"
              label="Current Password"
              required
            />

            <PrimaryInput
              type="password"
              value={formData.newPassword}
              onChange={(value) => setFormData(prev => ({ ...prev, newPassword: value }))}
              placeholder="Enter new password"
              label="New Password"
              required
            />

            <PrimaryInput
              type="password"
              value={formData.confirmPassword}
              onChange={(value) => setFormData(prev => ({ ...prev, confirmPassword: value }))}
              placeholder="Confirm new password"
              label="Confirm New Password"
              required
            />

            <div className="p-3 bg-blue-500/10 border border-blue-500/30 rounded-lg">
              <p className="text-sm text-blue-400">
                <strong>Password Requirements:</strong>
                <br />• At least 8 characters long
                <br />• Include uppercase and lowercase letters
                <br />• Include numbers and special characters
              </p>
            </div>
          </div>

          {/* Footer */}
          <div className="p-6 border-t border-dark-600 flex justify-end space-x-3">
            <button
              onClick={handleCancel}
              disabled={isLoading}
              className="px-4 py-2 bg-dark-600 text-white rounded-lg hover:bg-dark-500 transition-colors duration-200 disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={isLoading}
              className="px-4 py-2 bg-sera-orange text-white rounded-lg hover:bg-sera-orange/90 transition-colors duration-200 disabled:opacity-50 flex items-center space-x-2"
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Changing...</span>
                </>
              ) : (
                <span>Change Password</span>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Validation Modal */}
      <ValidationModal
        isOpen={showValidationModal}
        onClose={() => setShowValidationModal(false)}
        missingFields={missingFields}
        title="Required Fields Missing"
      />
    </>
  );
};

export default ChangePasswordModal;
