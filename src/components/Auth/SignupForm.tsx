import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import PrimaryInput from '../Common/PrimaryInput';

interface SignupFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSwitchToLogin: () => void;
}

const SignupForm: React.FC<SignupFormProps> = ({ isOpen, onClose, onSwitchToLogin }) => {
  const { register } = useAuth();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    // Clear error when user starts typing
    if (error) setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    // Validate passwords match
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      setIsLoading(false);
      return;
    }

    // Validate password length
    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters long');
      setIsLoading(false);
      return;
    }
    
    try {
      const success = await register(formData.name, formData.email, formData.password);
      if (!success) {
        setError('Registration failed. Please try again.');
      }
    } catch (err) {
      setError('Registration failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-fade-in" onClick={onClose} />
      
      <div className="relative w-full max-w-md animate-slide-up">
        <div className="bg-dark-800 rounded-2xl shadow-2xl border border-dark-700 overflow-hidden">
          <div className="relative p-6 bg-gradient-to-r from-sera-blue to-sera-darkBlue">
            <button onClick={onClose} className="absolute top-4 right-4 text-white/80 hover:text-white transition-colors">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            
            <div className="text-center">
              <h2 className="text-2xl font-bold text-white mb-2">Join SERA</h2>
              <p className="text-white/80">Create your account to get started</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            {error && (
              <div className="bg-red-900/20 border border-red-500/30 rounded-lg p-3">
                <p className="text-red-300 text-sm">{error}</p>
              </div>
            )}

            <PrimaryInput
              type="text"
              label="Full Name"
              value={formData.name}
              onChange={(value) => handleInputChange('name', value)}
              placeholder="Enter your full name"
              required
              name="name"
              autoComplete="name"
            />

            <PrimaryInput
              type="email"
              label="Email Address"
              value={formData.email}
              onChange={(value) => handleInputChange('email', value)}
              placeholder="Enter your email"
              required
              name="email"
              autoComplete="email"
            />

            <PrimaryInput
              type="password"
              label="Password"
              value={formData.password}
              onChange={(value) => handleInputChange('password', value)}
              placeholder="Create a password"
              required
              name="password"
              autoComplete="new-password"
              showDataToggle={true}
            />

            <PrimaryInput
              type="password"
              label="Confirm Password"
              value={formData.confirmPassword}
              onChange={(value) => handleInputChange('confirmPassword', value)}
              placeholder="Confirm your password"
              required
              name="confirmPassword"
              autoComplete="new-password"
              showDataToggle={true}
            />

            <button
              type="submit"
              disabled={isLoading}
              className="w-full btn-secondary py-3 text-lg font-semibold"
            >
              {isLoading ? 'Creating account...' : 'Create Account'}
            </button>

            <div className="text-center">
              <p className="text-gray-400">
                Already have an account?{' '}
                <button
                  type="button"
                  onClick={onSwitchToLogin}
                  className="text-sera-blue hover:text-sera-blue/80 font-medium"
                >
                  Sign in here
                </button>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SignupForm;
