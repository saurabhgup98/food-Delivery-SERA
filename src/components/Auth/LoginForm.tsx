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
  const [connectionStatus, setConnectionStatus] = useState("");
  const [isTestingConnection, setIsTestingConnection] = useState(false);

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
    // Clear error when user starts typing
    if (error) setError("");
  };

  const testDatabaseConnection = async () => {
    setIsTestingConnection(true);
    setConnectionStatus("");
    setError("");

    try {
      const response = await fetch('https://food-delivery-backend-sera.vercel.app/api/restaurants', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();

      if (data.success) {
        setConnectionStatus(`✅ Connection successful - Found ${data.data.pagination.totalCount} restaurants in database`);
      } else {
        setConnectionStatus(`❌ Connection failed`);
        setError(data.message || 'Database connection failed');
      }
    } catch (err) {
      setConnectionStatus("❌ Connection test failed");
      setError("Failed to test database connection");
    } finally {
      setIsTestingConnection(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    setConnectionStatus("");

    try {
      // First save test data to database
      const testDataResponse = await fetch('https://food-delivery-backend-sera.vercel.app/api/test-data', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          type: 'login',
          data: {
            email: formData.email,
            loginAttempt: new Date().toISOString(),
            randomId: Math.random().toString(36).substr(2, 9),
            randomNumber: Math.floor(Math.random() * 1000),
            message: `Login attempt for ${formData.email} at ${new Date().toLocaleString()}`
          }
        })
      });

      const testData = await testDataResponse.json();
      
      if (testData.success) {
        // Show alert with saved data
        alert(`✅ Data saved successfully!\n\nDetails stored in database:\n- ID: ${testData.data.id}\n- Type: ${testData.data.type}\n- Random ID: ${testData.data.data.randomId}\n- Random Number: ${testData.data.data.randomNumber}\n- Timestamp: ${testData.data.data.timestamp}\n- Message: ${testData.data.data.message}`);
      }

      // Then proceed with actual login
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

            {connectionStatus && (
              <div className="bg-green-900/20 border border-green-500/30 rounded-lg p-3">
                <p className="text-green-300 text-sm">{connectionStatus}</p>
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
              type="button"
              onClick={testDatabaseConnection}
              disabled={isTestingConnection}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white py-3 px-4 rounded-lg font-semibold transition-colors"
            >
              {isTestingConnection ? "Testing Connection..." : "Test Database Connection"}
            </button>

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
