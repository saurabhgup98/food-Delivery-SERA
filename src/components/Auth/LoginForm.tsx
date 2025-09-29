import React, { useState } from "react";
import { useAuth } from "../../contexts/AuthContext";
import PrimaryInput from "../Common/PrimaryInput";
import { OAuthProvider } from "./components/OAuthProvider";
import { OAUTH_PROVIDERS } from "./constants/authConstants";
import { useOAuthAuth } from "./hooks/AuthFormHooks";

interface LoginFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSwitchToSignup: () => void;
}

const LoginForm: React.FC<LoginFormProps> = ({
  isOpen,
  onClose,
  onSwitchToSignup,
}) => {
  
  const { login, isLoading, error, clearError } = useAuth();
  const { handleOAuthLogin } = useOAuthAuth();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
    // Clear error when user starts typing
    if (error) clearError();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();

    try {
      await login({
        email: formData.email,
        password: formData.password,
        appEndpoint: window.location.origin,
      });
      onClose();
    } catch (err) {
      console.error('Login error:', err);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-fade-in"
        onClick={onClose}
      />

      <div className="relative w-full max-w-md animate-slide-up">
        <div className="bg-dark-800 rounded-2xl shadow-2xl border border-dark-700 overflow-hidden">
          <div className="relative p-6 bg-gradient-to-r from-sera-pink to-sera-orange">
            <button
              onClick={onClose}
              className="absolute top-4 right-4 text-white/80 hover:text-white transition-colors"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>

            <div className="text-center">
              <h2 className="text-2xl font-bold text-white mb-2">
                Welcome Back
              </h2>
              <p className="text-white/80">Sign in to your SERA account</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            {error && (
              <div className="bg-red-900/20 border border-red-500/30 rounded-lg p-3">
                <p className="text-red-300 text-sm">{error}</p>
              </div>
            )}


            <PrimaryInput
              type="email"
              label="Email Address"
              value={formData.email}
              onChange={(value) => handleInputChange("email", value)}
              placeholder="Enter your email"
              required
              name="email"
              autoComplete="email"
            />

            <PrimaryInput
              type="password"
              label="Password"
              value={formData.password}
              onChange={(value) => handleInputChange("password", value)}
              placeholder="Enter your password"
              required
              name="password"
              autoComplete="current-password"
              showDataToggle={true}
            />


            <button
              type="submit"
              disabled={isLoading}
              className="w-full btn-primary py-3 text-lg font-semibold"
            >
              {isLoading ? "Signing in..." : "Sign In"}
            </button>

            {/* OAuth Section */}
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-600"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-dark-800 text-gray-400">Or continue with</span>
              </div>
            </div>

            {/* OAuth Providers */}
            <div className="space-y-3">
              {OAUTH_PROVIDERS.map((provider) => (
                <OAuthProvider
                  key={provider.id}
                  provider={provider}
                  disabled={isLoading}
                />
              ))}
            </div>

            <div className="text-center">
              <p className="text-gray-400">
                Don't have an account?{" "}
                <button
                  type="button"
                  onClick={onSwitchToSignup}
                  className="text-sera-pink hover:text-sera-pink/80 font-medium"
                >
                  Sign up here
                </button>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;
