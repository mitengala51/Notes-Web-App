import React from 'react';

interface LogoProps {
  className?: string;
  showText?: boolean;
}

export const Logo: React.FC<LogoProps> = ({ className = '', showText = true }) => {
  return (
    <div className={`flex items-center ${className}`}>
      <img src='/icon.svg' alt='logo' className='mr-3'/>
      {showText && <span className="text-2xl font-bold text-gray-900">HD</span>}
    </div>
  );
};