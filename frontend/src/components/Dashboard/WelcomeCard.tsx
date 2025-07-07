interface WelcomeCardProps {
  name: string;
  email: string;
  isMobile?: boolean;
}

export const WelcomeCard: React.FC<WelcomeCardProps> = ({ 
  name, 
  email, 
  isMobile = false 
}) => {
  const cardClasses = isMobile 
    ? "bg-gray-50 rounded-2xl p-6"
    : "bg-white rounded-3xl p-8 shadow-sm border border-gray-100 mb-6";
  
  const titleClasses = isMobile 
    ? "text-2xl font-bold text-gray-900 mb-2"
    : "text-3xl font-bold text-gray-900 mb-4";
  
  const emailClasses = isMobile 
    ? "text-gray-600 text-sm"
    : "text-gray-600";

  return (
    <div className={cardClasses}>
      <h2 className={titleClasses}>
        Welcome, {name}!
      </h2>
      <p className={emailClasses}>
        Email: {email}
      </p>
    </div>
  );
};

// src/components/dashboard/CreateNoteButton.tsx
import React from 'react';
import { Button } from '../ui/Button';

interface CreateNoteButtonProps {
  onClick: () => void;
  isMobile?: boolean;
}

export const CreateNoteButton: React.FC<CreateNoteButtonProps> = ({ 
  onClick, 
  isMobile = false 
}) => {
  const buttonClasses = isMobile 
    ? "w-full bg-blue-500 text-white py-4 rounded-2xl font-medium text-base hover:bg-blue-600 transition-colors"
    : "w-full bg-blue-500 text-white py-6 rounded-3xl font-semibold text-lg hover:bg-blue-600 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-1";

  return (
    <Button
      onClick={onClick}
      className={buttonClasses}
    >
      Create Note
    </Button>
  );
};