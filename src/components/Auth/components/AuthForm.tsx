import React, { useState } from 'react';
import { PrimaryContentContainer } from '../../Container';
import PrimaryActionBtn from '../../Button/PrimaryActionBtn';
import { AuthFormProps } from '../authInterfaces';
import { AuthFormService } from '../../../contexts/auth/authFormService';
import { AuthButtonType, getAuthButtonProps } from '../FormConfig';
import { getHeaderContainerProps } from '../../Header/CommonHeaderConfig';
import PrimaryInput from '../../Input/PrimaryInput';

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


  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    AuthFormService.submitForm(onSubmit, formData);
  };

  const handleOAuthClick = (redirectUrl: string) => {
    AuthFormService.handleOAuthLogin(redirectUrl, isLoading);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-fade-in"
        onClick={onClose} />

      <div className="relative w-full max-w-md h-[80vh] animate-slide-up">
        <div className="bg-dark-800 rounded-2xl shadow-2xl border border-dark-700 overflow-hidden h-full flex flex-col">
          <div className={`w-full p-4 ${config.header.gradientClass} min-h-[80px] relative`}>
            <PrimaryContentContainer
              {...getHeaderContainerProps('authForm', onClose)}
            />
          </div>

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

              <PrimaryActionBtn
                {...getAuthButtonProps(
                  mode === 'login' ? AuthButtonType.LOGIN_BUTTON : AuthButtonType.SIGNUP_BUTTON,
                  () => {}, // Form's onSubmit will handle submission
                  { isLoading }
                )}
              />

              {/* Form Divider */}
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-600"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-dark-800 text-gray-400">Or continue with</span>
                </div>
              </div>

               {/* OAuth Section */}
               <div className="space-y-3">
                 {AuthFormService.getOAuthProviders().map((provider) => {
                   const buttonType = provider.id === 'google' 
                     ? AuthButtonType.GOOGLE_OAUTH_BUTTON 
                     : AuthButtonType.FACEBOOK_OAUTH_BUTTON;
                   
                   return (
                     <PrimaryActionBtn
                       key={provider.id}
                       {...getAuthButtonProps(
                         buttonType,
                         () => handleOAuthClick(provider.redirectUrl),
                         { isLoading }
                       )}
                   />
                   );
                 })}
               </div>

              {/* Form Mode Switch */}
              <div className="text-center">
                <p className="text-gray-400">
                  {mode === 'login' ? "Don't have an account?" : "Already have an account?"}{" "}
                  <button
                    type="button"
                    onClick={onModeSwitch}
                    className={`font-semibold px-3 py-1.5 rounded-lg transition-all duration-200 ${mode === 'login'
                        ? "text-sera-blue bg-sera-blue/10 hover:bg-sera-blue/20 hover:text-sera-blue border border-sera-blue/30 hover:border-sera-blue/50"
                        : "text-sera-orange bg-sera-orange/10 hover:bg-sera-orange/20 hover:text-sera-orange border border-sera-orange/30 hover:border-sera-orange/50"
                      }`}
                  >
                    {mode === 'login' ? "Sign up here" : "Sign in here"}
                  </button>
                </p>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthForm;