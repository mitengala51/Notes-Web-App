import  { useState } from 'react';
import { AuthHeader } from '../components/auth/AuthHeader';
import { AuthForm } from '../components/auth/AuthForm';
import { AuthBackground } from '../components/auth/AuthBackground';

export default function AuthPage() {
  const [isSignUp, setIsSignUp] = useState(true);

  const handleToggleMode = () => {
    setIsSignUp(!isSignUp);
  };

  const handleAuthSuccess = (token: string, user: any) => {
    // Store token and user data
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));
    
    // Redirect to dashboard
    // window.location.href = '/dashboard';
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Left side - Form (Full width on mobile) */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-4 lg:p-8">
        <div className="w-full max-w-md lg:max-w-lg">
          <AuthHeader
            title={isSignUp ? 'Sign up' : 'Sign In'}
            subtitle={isSignUp ? 'Sign up to enjoy the feature of HD' : 'Please login to continue to your account.'}
          />
          
          <AuthForm
            isSignUp={isSignUp}
            onToggleMode={handleToggleMode}
            onAuthSuccess={handleAuthSuccess}
          />
        </div>
      </div>

      {/* Right side - 3D Wave Background (Hidden on mobile) */}
      <AuthBackground />

      {/* Mobile Home Indicator */}
      <div className="fixed bottom-0 left-1/2 transform -translate-x-1/2 lg:hidden">
        <div className="w-32 h-1 bg-black rounded-full mb-2"></div>
      </div>
    </div>
  );
}