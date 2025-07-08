import React, { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';
import { AuthService } from '../../services/AuthService';
import "react-datepicker/dist/react-datepicker.css";

interface AuthFormProps {
  isSignUp: boolean;
  onToggleMode: () => void;
  onAuthSuccess: (token: string, user: any) => void;
}

export const AuthForm: React.FC<AuthFormProps> = ({
  isSignUp,
  onToggleMode,
  onAuthSuccess,
}) => {
  const [formData, setFormData] = useState({
    name: '',
    dateOfBirth: '',
    email: '',
    otp: ''
  });
  
  const [showOtp, setShowOtp] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [keepLoggedIn, setKeepLoggedIn] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{[key: string]: string}>({});

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors: {[key: string]: string} = {};
    
    if (isSignUp) {
      if (!formData.name.trim()) {
        newErrors.name = 'Name is required';
      }
      if (!formData.dateOfBirth.trim()) {
        newErrors.dateOfBirth = 'Date of birth is required';
      }
    }
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }
    
    // OTP validation - required when OTP field is visible
    if (showOtp) {
      if (!formData.otp.trim()) {
        newErrors.otp = 'OTP is required';
      } else if (formData.otp.length !== 6) {
        newErrors.otp = 'OTP must be 6 digits';
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleGetOTP = async () => {
    // For Sign Up: validate name, email, and dateOfBirth
    // For Sign In: validate only email
    const newErrors: {[key: string]: string} = {};
    
    if (isSignUp) {
      if (!formData.name.trim()) {
        newErrors.name = 'Name is required';
      }
      if (!formData.dateOfBirth.trim()) {
        newErrors.dateOfBirth = 'Date of birth is required';
      }
    }
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }
    
    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;
    
    setLoading(true);
    try {
      await AuthService.requestOTP(formData.email);
      setShowOtp(true);
      // Clear any previous general errors
      setErrors({});
    } catch (error: any) {
      console.error('OTP request error:', error);
      setErrors({ general: error.message || 'Failed to send OTP' });
    } finally {
      setLoading(false);
    }
  };

  const handleResendOTP = async () => {
    setLoading(true);
    try {
      await AuthService.requestOTP(formData.email);
      // Clear any previous general errors
      setErrors({});
    } catch (error: any) {
      console.error('OTP resend error:', error);
      setErrors({ general: error.message || 'Failed to resend OTP' });
    } finally {
      setLoading(false);
    }
  };

  const handleSignUp = async () => {
    if (!validateForm()) return;
    
    setLoading(true);
    try {
      const response = await AuthService.signUp({
        name: formData.name,
        email: formData.email,
        dateOfBirth: formData.dateOfBirth,
        otp: formData.otp
      });
      
      // Store JWT token in localStorage if keepLoggedIn is checked
      if (keepLoggedIn && response.token) {
        localStorage.setItem('authToken', response.token);
        localStorage.setItem('user', JSON.stringify(response.user));
      }
      
      onAuthSuccess(response.token, response.user);
    } catch (error: any) {
      console.error('Sign up error:', error);
      setErrors({ general: error.message || 'Signup failed' });
    } finally {
      setLoading(false);
    }
  };

  const handleSignIn = async () => {
    if (!validateForm()) return;
    
    setLoading(true);
    try {
      const response = await AuthService.signIn({
        email: formData.email,
        otp: formData.otp
      });
      
      // Store JWT token in localStorage if keepLoggedIn is checked
      if (keepLoggedIn && response.token) {
        localStorage.setItem('authToken', response.token);
        localStorage.setItem('user', JSON.stringify(response.user));
      }
      
      onAuthSuccess(response.token, response.user);
    } catch (error: any) {
      console.error('Sign in error:', error);
      setErrors({ general: error.message || 'Sign in failed' });
    } finally {
      setLoading(false);
    }
  };

  const switchMode = () => {
    setShowOtp(false);
    setKeepLoggedIn(false);
    setErrors({});
    setFormData({
      name: '',
      dateOfBirth: '',
      email: '',
      otp: ''
    });
    onToggleMode();
  };

  // Determine what the main button should do and display
  const getMainButtonConfig = () => {
    if (isSignUp) {
      if (showOtp) {
        return {
          onClick: handleSignUp,
          text: loading ? 'Creating Account...' : 'Sign Up'
        };
      } else {
        return {
          onClick: handleGetOTP,
          text: loading ? 'Sending OTP...' : 'Get OTP'
        };
      }
    } else {
      // Sign In mode
      if (showOtp) {
        return {
          onClick: handleSignIn,
          text: loading ? 'Signing In...' : 'Sign In'
        };
      } else {
        return {
          onClick: handleGetOTP,
          text: loading ? 'Sending OTP...' : 'Get OTP'
        };
      }
    }
  };

  const mainButtonConfig = getMainButtonConfig();

  return (
    <div className="space-y-5 lg:space-y-6">
      {/* General Error Message */}
      {errors.general && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          {errors.general}
        </div>
      )}

      {/* Name Field - Only show in Sign Up mode */}
      {isSignUp && (
        <Input
          label="Your Name"
          value={formData.name}
          onChange={(e) => handleInputChange('name', e.target.value)}
          placeholder="Enter your name"
          error={errors.name}
          autoComplete="name"
        />
      )}

      {/* Date of Birth - Only show in Sign Up mode */}
      {isSignUp && (
        <Input
          label="Date of Birth"
          type="date"
          value={formData.dateOfBirth}
          onChange={(e) => handleInputChange('dateOfBirth', e.target.value)}
          placeholder="Select date"
          // icon={<Calendar className="w-5 h-5" />}
          error={errors.dateOfBirth}
          autoComplete="bday"
        />
      )}

      {/* Email Field - Always show */}
      <Input
        label="Email"
        type="email"
        value={formData.email}
        onChange={(e) => handleInputChange('email', e.target.value)}
        placeholder="Enter your email"
        focused={true}
        error={errors.email}
        disabled={showOtp}
        autoComplete="email"
      />

      {/* OTP Field - Show only after OTP is requested */}
      {showOtp && (
        <Input
          label="OTP"
          type={showPassword ? "text" : "password"}
          value={formData.otp}
          onChange={(e) => handleInputChange('otp', e.target.value)}
          placeholder="Enter 6-digit OTP"
          maxLength={6}
          inputMode="numeric"
          pattern="[0-9]*"
          autoComplete="one-time-code"
          icon={
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          }
          error={errors.otp}
        />
      )}

      {/* Resend OTP - Show only when OTP field is visible */}
      {showOtp && (
        <div className="text-left">
          <button
            onClick={handleResendOTP}
            disabled={loading}
            className="text-blue-500 hover:text-blue-600 font-medium transition-colors text-sm disabled:opacity-50"
          >
            {loading ? 'Sending...' : 'Resend OTP'}
          </button>
        </div>
      )}

      {/* Keep me logged in - Show only when OTP field is visible */}
      {showOtp && (
        <div className="flex items-center">
          <input
            type="checkbox"
            id="keepLoggedIn"
            checked={keepLoggedIn}
            onChange={(e) => setKeepLoggedIn(e.target.checked)}
            className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
          />
          <label htmlFor="keepLoggedIn" className="ml-2 text-sm text-gray-700">
            Keep me logged in
          </label>
        </div>
      )}

      {/* Main Button */}
      <div className="pt-2 lg:pt-0">
        <Button
          onClick={mainButtonConfig.onClick}
          disabled={loading}
          fullWidth
          size="lg"
        >
          {mainButtonConfig.text}
        </Button>
      </div>

      {/* Toggle between Sign In/Sign Up */}
      <div className="pt-4 lg:pt-2">
        <p className="text-center text-gray-600 text-base">
          {isSignUp ? (
            <>
              Already have an account?{' '}
              <button 
                onClick={switchMode}
                className="text-blue-500 hover:text-blue-600 font-medium transition-colors"
              >
                Sign in
              </button>
            </>
          ) : (
            <>
              Need an account?{' '}
              <button 
                onClick={switchMode}
                className="text-blue-500 hover:text-blue-600 font-medium transition-colors"
              >
                Create one
              </button>
            </>
          )}
        </p>
      </div>
    </div>
  );
};