import React, { useState } from 'react';
import PrimaryInput from '../Common/PrimaryInput';
import AuthHeader from './components/AuthHeader';
import FormDivider from './components/FormDivider';
import FormModeSwitch from './components/FormModeSwitch';
import OAuthSection from './components/OAuthSection';
import { AuthFormProps } from './interfaces/authInterfaces';
import { FORM_DIVIDER_CONFIG, FORM_MODE_SWITCH_CONFIG } from './config/formConfig';

const AuthForm: React.FC<AuthFormProps> = ({
  isOpen,
  onClose,
  mode,
  config,
  onSubmit,
  onModeSwitch,
  isLoading,
  error
}) => {
  const [formData, setFormData] = useState(config.initialState);

  // Auth header configuration - declared at top, fetches data from config
  const authHeaderConfig = {
    title: config.header.title,
    description: config.header.description,
    gradientClass: config.header.gradientClass,
    onClose
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await onSubmit(formData);
    } catch (error) {
      // Error is handled by the AuthContext
      console.error('Form submission error:', error);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-fade-in"
        onClick={onClose} />

      <div className="relative w-full max-w-md h-[80vh] animate-slide-up">
        <div className="bg-dark-800 rounded-2xl shadow-2xl border border-dark-700 overflow-hidden h-full flex flex-col">
          <AuthHeader {...authHeaderConfig} />

          <div className="flex-1 overflow-y-auto">
            <form onSubmit={handleSubmit} className="p-6 space-y-6">
            {error && (
              <div className="bg-red-900/20 border border-red-500/30 rounded-lg p-3">
                <p className="text-red-300 text-sm">{error}</p>
              </div>
            )}

            {/* Dynamic Form Fields */}
            {config.inputs.map((input) => (
              <PrimaryInput
                key={input.name}
                {...input}
                value={formData[input.name as keyof typeof formData]}
                onChange={(value) => handleInputChange(input.name!, value)}
              />
            ))}

            <button
              type="submit"
              disabled={isLoading}
              className={`w-full py-3 text-lg font-semibold ${mode === 'login' ? 'btn-primary' : 'btn-secondary'
                }`}
            >
              {isLoading ? config.button.loading : config.button.text}
            </button>

            <FormDivider {...FORM_DIVIDER_CONFIG} />

            <OAuthSection disabled={isLoading} />

            <FormModeSwitch
              mode={mode}
              onSwitch={onModeSwitch}
              config={FORM_MODE_SWITCH_CONFIG}
            />
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthForm;