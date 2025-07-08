import React from 'react';
import { Button } from '../ui/Button';
import { Logo } from '../ui/Logo';

interface DashboardHeaderProps {
  onSignOut: () => void;
  isMobile?: boolean;
}

export const DashboardHeader: React.FC<DashboardHeaderProps> = ({ 
  onSignOut, 
  isMobile = false 
}) => {
  if (isMobile) {
    return (
      <div className="flex items-center justify-between px-4 py-4 border-b border-gray-100">
        <div className="flex items-center space-x-3">
          <img src='/icon.svg' alt='logo' className='mr-3'/>
          <h1 className="text-xl font-semibold text-gray-900">Dashboard</h1>
        </div>
        <button
          onClick={onSignOut}
          className="text-blue-500 font-medium text-sm"
        >
          Sign Out
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white border-b border-gray-200">
      <div className="flex items-center justify-between px-8 py-6">
        <div className="flex items-center space-x-4">
          <Logo />
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        </div>
        <Button
          onClick={onSignOut}
          variant="secondary"
          className="hover:bg-blue-50 hover:text-blue-600"
        >
          Sign Out
        </Button>
      </div>
    </div>
  );
};