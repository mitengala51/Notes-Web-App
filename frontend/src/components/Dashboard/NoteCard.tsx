import React from 'react';
import { Trash2 } from 'lucide-react';

interface Note {
  id: string;
  title: string;
  content: string;
  createdAt: Date;
}

interface NoteCardProps {
  note: Note;
  onDelete: (id: string) => void;
  isMobile?: boolean;
}

export const NoteCard: React.FC<NoteCardProps> = ({ 
  note, 
  onDelete, 
  isMobile = false 
}) => {
  const cardClasses = isMobile 
    ? "bg-white rounded-2xl p-4 border border-gray-100 flex items-center justify-between hover:shadow-sm transition-shadow"
    : "bg-gray-50 rounded-2xl p-6 border border-gray-100 flex items-center justify-between hover:shadow-md transition-all duration-200 hover:bg-gray-100";
  
  const titleClasses = isMobile 
    ? "font-medium text-gray-900"
    : "text-lg font-semibold text-gray-900";
  
  const contentClasses = isMobile 
    ? "text-sm text-gray-600 mt-1 truncate"
    : "text-gray-600 mt-2";

  return (
    <div className={cardClasses}>
      <div className="flex-1">
        <h4 className={titleClasses}>{note.title}</h4>
        <p className={contentClasses}>{note.content}</p>
        {!isMobile && (
          <p className="text-sm text-gray-400 mt-3">
            {note.createdAt.toLocaleDateString()}
          </p>
        )}
      </div>
      <button
        onClick={() => onDelete(note.id)}
        className={`${isMobile ? 'ml-4 p-2' : 'ml-6 p-3'} text-gray-400 hover:text-red-500 ${isMobile ? '' : 'hover:bg-red-50 rounded-xl'} transition-all duration-200`}
      >
        <Trash2 size={isMobile ? 20 : 24} />
      </button>
    </div>
  );
};