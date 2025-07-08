import React from 'react';
import { NoteCard } from './NoteCard';

interface Note {
  id: string;
  title: string;
  content: string;
  createdAt: Date;
}

interface NotesSectionProps {
  notes: Note[];
  onDeleteNote: (id: string) => void;
  isMobile?: boolean;
}

export const NotesSection: React.FC<NotesSectionProps> = ({ 
  notes, 
  onDeleteNote, 
  isMobile = false 
}) => {
  // console.log('Rendering NotesSection with notes:', notes);
  if (isMobile) {
    return (
      <div className="px-4 pb-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Notes</h3>
        <div className="space-y-3">
          {notes.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <p>No notes yet. Create your first note!</p>
            </div>
          ) : (
            notes.map((note, index) => (
              <NoteCard
                key={note.id || index}
                note={note}
                onDelete={onDeleteNote}
                isMobile={true}
              />
            ))
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 min-h-96">
      <h3 className="text-2xl font-bold text-gray-900 mb-6">Notes</h3>
      <div className="grid gap-4">
        {notes.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            <p className="text-lg">No notes yet. Create your first note!</p>
          </div>
        ) : (
          notes.map((note) => (
            <NoteCard
              key={note.id}
              note={note}
              onDelete={onDeleteNote}
              isMobile={false}
            />
          ))
        )}
      </div>
    </div>
  );
};