import { useState } from 'react';
import { Calendar, Eye, EyeOff } from 'lucide-react';

export default function AuthPage() {
  const [isSignUp, setIsSignUp] = useState(true); // true for Sign Up, false for Sign In
  const [formData, setFormData] = useState({
    name: 'Jonas Khanwald',
    dateOfBirth: '11 December 1997',
    email: 'jonas_kahnwald@gmail.com',
    otp: ''
  });
  
  const [showOtp, setShowOtp] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [keepLoggedIn, setKeepLoggedIn] = useState(false);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleGetOTP = () => {
    setShowOtp(true);
  };

  const handleResendOTP = () => {
    console.log('Resending OTP to:', formData.email);
  };

  const handleSignUp = () => {
    console.log('Sign up with:', formData);
  };

  const handleSignIn = () => {
    console.log('Sign in with:', formData);
  };

  const switchToSignIn = () => {
    setIsSignUp(false);
    setShowOtp(false);
    setKeepLoggedIn(false);
  };

  const switchToSignUp = () => {
    setIsSignUp(true);
    setShowOtp(false);
    setKeepLoggedIn(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Left side - Form (Full width on mobile) */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-4 lg:p-8">
        <div className="w-full max-w-md lg:max-w-lg">
          {/* Logo */}
          <div className="flex items-center justify-center lg:justify-start mb-8 lg:mb-12">
            <img src='/public/icon.svg' alt='logo' className='mr-3'/>
            <span className="text-2xl font-bold text-gray-900">HD</span>
          </div>

          {/* Title */}
          <div className="text-center lg:text-left mb-8 lg:mb-8">
            <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-2">
              {isSignUp ? 'Sign up' : 'Sign In'}
            </h1>
            <p className="text-gray-500 text-base lg:text-base">
              {isSignUp ? 'Sign up to enjoy the feature of HD' : 'Please login to continue to your account.'}
            </p>
          </div>

          {/* Form */}
          <div className="space-y-5 lg:space-y-6">
            {/* Name Field - Only show in Sign Up mode */}
            {isSignUp && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Your Name
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  className="w-full px-4 py-3.5 lg:py-3 border border-gray-300 rounded-xl lg:rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-200 text-base bg-gray-50 lg:bg-white"
                  placeholder="Enter your name"
                />
              </div>
            )}

            {/* Date of Birth - Only show in Sign Up mode */}
            {isSignUp && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Date of Birth
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={formData.dateOfBirth}
                    onChange={(e) => handleInputChange('dateOfBirth', e.target.value)}
                    className="w-full px-4 py-3.5 lg:py-3 border border-gray-300 rounded-xl lg:rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-200 pr-12 text-base bg-gray-50 lg:bg-white"
                    placeholder="Select date"
                  />
                  <Calendar className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                </div>
              </div>
            )}

            {/* Email Field */}
            <div>
              <label className="block text-sm font-medium text-blue-500 mb-2">
                Email
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                className="w-full px-4 py-3.5 lg:py-3 border-2 border-blue-500 rounded-xl lg:rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all duration-200 text-base bg-white"
                placeholder="Enter your email"
              />
            </div>

            {/* OTP Field - Show based on conditions */}
            {(isSignUp && showOtp) || (!isSignUp) ? (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  OTP
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={formData.otp}
                    onChange={(e) => handleInputChange('otp', e.target.value)}
                    className="w-full px-4 py-3.5 lg:py-3 border border-gray-300 rounded-xl lg:rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-200 pr-12 text-base bg-gray-50 lg:bg-white"
                    placeholder="Enter OTP"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>
            ) : null}

            {/* Resend OTP - Show in Sign In mode or when OTP is visible in Sign Up */}
            {((isSignUp && showOtp) || (!isSignUp)) && (
              <div className="text-left">
                <button
                  onClick={handleResendOTP}
                  className="text-blue-500 hover:text-blue-600 font-medium transition-colors text-sm"
                >
                  Resend OTP
                </button>
              </div>
            )}

            {/* Keep me logged in - Show in Sign In mode or when OTP is visible in Sign Up */}
            {((isSignUp && showOtp) || (!isSignUp)) && (
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
              <button
                onClick={isSignUp ? (showOtp ? handleSignUp : handleGetOTP) : handleSignIn}
                className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-4 lg:py-3 px-4 rounded-xl lg:rounded-lg transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] text-base lg:text-base shadow-lg lg:shadow-md"
              >
                {isSignUp ? (showOtp ? 'Sign up' : 'Get OTP') : 'Sign In'}
              </button>
            </div>

            {/* Toggle between Sign In/Sign Up */}
            <div className="pt-4 lg:pt-2">
              <p className="text-center text-gray-600 text-base">
                {isSignUp ? (
                  <>
                    Already have an account?{' '}
                    <button 
                      onClick={switchToSignIn}
                      className="text-blue-500 hover:text-blue-600 font-medium transition-colors"
                    >
                      Sign in
                    </button>
                  </>
                ) : (
                  <>
                    Need an account?{' '}
                    <button 
                      onClick={switchToSignUp}
                      className="text-blue-500 hover:text-blue-600 font-medium transition-colors"
                    >
                      Create one
                    </button>
                  </>
                )}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Right side - 3D Wave Background (Hidden on mobile) */}
      <div className="hidden lg:block lg:w-1/2 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
          {/* 3D Wave Effect */}
          <div className="absolute inset-0 opacity-90">
            <img src='../../public/container.png' alt='container-img' />
          </div>
          
          {/* Additional 3D effect layers */}
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 via-transparent to-blue-800/20"></div>
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-blue-500/10 to-transparent"></div>
          
          {/* Floating elements for extra depth */}
          <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-blue-400/20 rounded-full blur-xl animate-pulse"></div>
          <div className="absolute bottom-1/4 right-1/4 w-24 h-24 bg-cyan-400/20 rounded-full blur-xl animate-pulse" style={{ animationDelay: '2s' }}></div>
          <div className="absolute top-1/2 right-1/3 w-16 h-16 bg-blue-300/20 rounded-full blur-xl animate-pulse" style={{ animationDelay: '4s' }}></div>
        </div>
      </div>

      {/* Mobile Home Indicator */}
      <div className="fixed bottom-0 left-1/2 transform -translate-x-1/2 lg:hidden">
        <div className="w-32 h-1 bg-black rounded-full mb-2"></div>
      </div>
    </div>
  );
}