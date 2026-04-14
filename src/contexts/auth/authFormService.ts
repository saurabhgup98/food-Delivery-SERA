// Auth Form Service - Form-related authentication operations

import { 
  FormValidationResult, 
  FormSubmissionResult,
  OAuthProviderConfig 
} from '../../components/Auth/authInterfaces';

export class AuthFormService {
  /**
   * Handle form submission
   */
  static submitForm(
    onSubmit: (data: any) => void, 
    formData: any
  ): FormSubmissionResult {
    try {
      onSubmit(formData);
      return {
        success: true,
        data: formData
      };
    } catch (error) {
      console.error('Form submission error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Form submission failed'
      };
    }
  }

  /**
   * Validate form data
   */
  static validateForm(
    formData: any, 
    mode: 'login' | 'signup'
  ): FormValidationResult {
    const errors: Record<string, string> = {};

    // Email validation
    if (!formData.email) {
      errors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = 'Please enter a valid email address';
    }

    // Password validation
    if (!formData.password) {
      errors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      errors.password = 'Password must be at least 6 characters long';
    }

    // Signup specific validations
    if (mode === 'signup') {
      // Name validation
      if (!formData.name || !formData.username) {
        const nameField = formData.name ? 'username' : 'name';
        errors[nameField] = 'Name is required';
      }

      // Confirm password validation
      if (!formData.confirmPassword) {
        errors.confirmPassword = 'Please confirm your password';
      } else if (formData.password !== formData.confirmPassword) {
        errors.confirmPassword = 'Passwords do not match';
      }
    }

    return {
      isValid: Object.keys(errors).length === 0,
      errors
    };
  }

  /**
   * Handle form errors
   */
  static handleFormErrors(error: any): string {
    if (typeof error === 'string') {
      return error;
    }
    
    if (error?.response?.data?.message) {
      return error.response.data.message;
    }
    
    if (error?.message) {
      return error.message;
    }
    
    return 'An unexpected error occurred';
  }

  /**
   * Get OAuth providers
   */
  static getOAuthProviders(): OAuthProviderConfig[] {
    return [
      {
        id: 'google',
        name: 'Google',
        label: 'Continue with Google',
        icon: 'google',
        redirectUrl: '/api/oauth/google',
        className: 'bg-gradient-to-r from-white to-gray-50 text-gray-800 border-2 border-gray-200 hover:from-gray-50 hover:to-gray-100 hover:border-gray-300 shadow-md hover:shadow-xl',
        hoverClassName: 'transform hover:scale-[1.02] transition-all duration-300'
      },
      {
        id: 'facebook',
        name: 'Facebook',
        label: 'Continue with Facebook',
        icon: 'facebook',
        redirectUrl: '/api/oauth/facebook',
        className: 'bg-gradient-to-r from-blue-600 to-blue-700 text-white border-2 border-blue-600 hover:from-blue-700 hover:to-blue-800 hover:border-blue-700 shadow-md hover:shadow-xl',
        hoverClassName: 'transform hover:scale-[1.02] transition-all duration-300'
      }
    ];
  }

  /**
   * Handle OAuth login redirect
   */
  static handleOAuthLogin(redirectUrl: string, isLoading: boolean): void {
    if (isLoading) return;
    window.location.href = redirectUrl;
  }

  /**
   * Format form data for submission
   */
  static formatFormData(formData: any, mode: 'login' | 'signup'): any {
    const baseData = {
      email: formData.email,
      password: formData.password,
      appEndpoint: 'http://127.0.0.1:3001'
    };

    if (mode === 'signup') {
      return {
        ...baseData,
        username: formData.name || formData.username,
      };
    }

    return baseData;
  }

  /**
   * Clear form data
   */
  static clearFormData(): Record<string, string> {
    return {
      name: '',
      username: '',
      email: '',
      password: '',
      confirmPassword: ''
    };
  }
}
