import React from 'react';
import { Logo } from '../ui/Logo';

interface AuthHeaderProps {
  title: string;
  subtitle: string;
}

export const AuthHeader: React.FC<AuthHeaderProps> = ({ title, subtitle }) => {
  return (
    <>
      {/* Logo */}
      <div className="flex items-center justify-center lg:justify-start mb-8 lg:mb-12">
        <Logo />
      </div>

      {/* Title */}
      <div className="text-center lg:text-left mb-8 lg:mb-8">
        <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-2">
          {title}
        </h1>
        <p className="text-gray-500 text-base lg:text-base">
          {subtitle}
        </p>
      </div>
    </>
  );
};