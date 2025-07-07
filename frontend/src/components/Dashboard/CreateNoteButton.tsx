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