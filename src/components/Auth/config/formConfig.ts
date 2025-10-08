import { FormConfig, OAuthProviderConfig } from '../interfaces/authInterfaces';

export const OAUTH_PROVIDERS: OAuthProviderConfig[] = [
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

// Form Divider Configuration
export const FORM_DIVIDER_CONFIG = {
  text: "Or continue with",
  className: "",
  lineClassName: "border-gray-600",
  textClassName: "text-gray-400"
};

// Form Mode Switch Configuration
export const FORM_MODE_SWITCH_CONFIG = {
  login: {
    question: "Don't have an account?",
    actionText: "Sign up here",
    actionColor: "text-sera-pink hover:text-sera-pink/80"
  },
  signup: {
    question: "Already have an account?",
    actionText: "Sign in here",
    actionColor: "text-sera-blue hover:text-sera-blue/80"
  }
};

export const AUTH_FORM_CONFIG: { login: FormConfig; signup: FormConfig } = {
  login: {
    header: {
      title: "Welcome Back",
      description: "Sign in to your SERA account",
      gradientClass: "bg-gradient-to-r from-sera-pink to-sera-orange"
    },
    inputs: [
      {
        type: 'email' as const,
        name: 'email',
        placeholder: 'Enter your email',
        label: 'Email Address',
        required: true,
        autoComplete: 'email',
        className: 'w-full'
      },
      {
        type: 'password' as const,
        name: 'password',
        placeholder: 'Enter your password',
        label: 'Password',
        required: true,
        autoComplete: 'current-password',
        showDataToggle: true,
        className: 'w-full'
      }
    ],
    button: {
      text: "Sign In",
      loading: "Signing in..."
    },
    initialState: {
      email: '',
      password: ''
    }
  },
  signup: {
    header: {
      title: "Join SERA",
      description: "Create your account to get started",
      gradientClass: "bg-gradient-to-r from-sera-blue to-sera-darkBlue"
    },
    inputs: [
      {
        type: 'text' as const,
        name: 'name',
        placeholder: 'Enter your full name',
        label: 'Full Name',
        required: true,
        autoComplete: 'name',
        className: 'w-full'
      },
      {
        type: 'email' as const,
        name: 'email',
        placeholder: 'Enter your email',
        label: 'Email Address',
        required: true,
        autoComplete: 'email',
        className: 'w-full'
      },
      {
        type: 'password' as const,
        name: 'password',
        placeholder: 'Create a password',
        label: 'Password',
        required: true,
        autoComplete: 'new-password',
        showDataToggle: true,
        className: 'w-full'
      },
      {
        type: 'password' as const,
        name: 'confirmPassword',
        placeholder: 'Confirm your password',
        label: 'Confirm Password',
        required: true,
        autoComplete: 'new-password',
        showDataToggle: true,
        className: 'w-full'
      }
    ],
    button: {
      text: "Create Account",
      loading: "Creating account..."
    },
    initialState: {
      name: '',
      email: '',
      password: '',
      confirmPassword: ''
    }
  }
};