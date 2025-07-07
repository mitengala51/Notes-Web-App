import React, { useState, useEffect } from 'react';
import { DashboardHeader } from '../components/dashboard/DashboardHeader';
import { WelcomeCard } from '../components/dashboard/WelcomeCard';
import { CreateNoteButton } from '../components/dashboard/CreateNoteButton';
import { NotesSection } from '../components/dashboard/NotesSection';
import { CreateNoteModal } from '../components/dashboard/CreateNoteModal';
import { NoteService } from '../services/NoteService';
import { AuthService } from '../services/AuthService';

interface Note {
  id: string;
  title: string;
  content: string;
  createdAt: Date;
}

interface User {
  id: string;
  name: string;
  email: string;
}

const Dashboard: React.FC = () => {
  const [notes, setNotes] = useState<Note[]>([]);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    // Check authentication and load user data
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    
    if (!token || !userData) {
      // window.location.href = '/auth';
      return;
    }

    setUser(JSON.parse(userData));
    loadNotes();
  }, []);

  const loadNotes = async () => {
    try {
      const notesData = await NoteService.getAllNotes();
      setNotes(notesData.map((note: any) => ({
        ...note,
        createdAt: new Date(note.createdAt)
      })));
    } catch (error) {
      console.error('Failed to load notes:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = () => {
    AuthService.signOut();
    window.location.href = '/auth';
  };

  const handleCreateNote = async (title: string, content: string) => {
    try {
      const newNote = await NoteService.createNote({ title, content });
      setNotes(prev => [...prev, {
        ...newNote,
        createdAt: new Date(newNote.createdAt)
      }]);
    } catch (error) {
      throw error;
    }
  };

  const handleDeleteNote = async (id: string) => {
    try {
      await NoteService.deleteNote(id);
      setNotes(prev => prev.filter(note => note.id !== id));
    } catch (error) {
      console.error('Failed to delete note:', error);
    }
  };

  if (!loading || !user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile View */}
      <div className="lg:hidden">
        <div className="bg-white">
          <DashboardHeader onSignOut={handleSignOut} isMobile={true} />

          <div className="px-4 py-4">
            <WelcomeCard name={user.name} email={user.email} isMobile={true} />
          </div>

          <div className="px-4 pb-4">
            <CreateNoteButton onClick={() => setShowCreateForm(true)} isMobile={true} />
          </div>

          <NotesSection notes={notes} onDeleteNote={handleDeleteNote} isMobile={true} />
        </div>
      </div>

      {/* Desktop View */}
      <div className="hidden lg:block">
        <div className="max-w-7xl mx-auto">
          <DashboardHeader onSignOut={handleSignOut} />

          <div className="px-8 py-8">
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
              {/* Left Column - Welcome & Create */}
              <div className="xl:col-span-1">
                <WelcomeCard name={user.name} email={user.email} />
                <CreateNoteButton onClick={() => setShowCreateForm(true)} />
              </div>

              {/* Right Column - Notes */}
              <div className="xl:col-span-2">
                <NotesSection notes={notes} onDeleteNote={handleDeleteNote} />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Create Note Modal */}
      <CreateNoteModal
        isOpen={showCreateForm}
        onClose={() => setShowCreateForm(false)}
        onCreateNote={handleCreateNote}
      />
    </div>
  );
};

export default Dashboard;