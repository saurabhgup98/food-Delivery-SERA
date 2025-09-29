import React, { useState } from "react";
import { useAuth } from "../../contexts/AuthContext";
import PrimaryInput from "../Common/PrimaryInput";

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
  
  const { login } = useAuth();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
    // Clear error when user starts typing
    if (error) setError("");
  };


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const success = await login(formData.email, formData.password);
      if (!success) {
        setError("Invalid email or password. Please try again.");
      }
    } catch (err) {
      setError("Login failed. Please try again.");
    } finally {
      setIsLoading(false);
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
