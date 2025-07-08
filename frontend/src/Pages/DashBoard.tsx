import React, { useState, useEffect } from 'react';
import { DashboardHeader } from '../components/dashboard/DashboardHeader';
import { WelcomeCard } from '../components/dashboard/WelcomeCard';
import { CreateNoteButton } from '../components/dashboard/CreateNoteButton';
import { NotesSection } from '../components/dashboard/NotesSection';
import { CreateNoteModal } from '../components/dashboard/CreateNoteModal';
import { NoteService } from '../services/NoteService';
import { AuthService } from '../services/AuthService';
import { Link } from 'react-router';

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
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    initializeDashboard();
  }, []);

  const initializeDashboard = async () => {
    try {
      // Check authentication and load user data
      const token = localStorage.getItem('token');
      const userData = localStorage.getItem('user');
      
      if (!token || !userData) {
        window.location.href = '/auth';
        return;
      }

      // Parse and set user data
      const parsedUser = JSON.parse(userData);
      setUser(parsedUser);
      
      // Load notes
      await loadNotes();
    } catch (err) {
      console.error('Dashboard initialization failed:', err);
      setError('Failed to initialize dashboard');
      setLoading(false);
    }
  };

  const loadNotes = async () => {
    try {
      setError(null);
      const notesData: any = await NoteService.getAllNotes();
      console.log('Loaded notes:', notesData);
      
      // Defensive check to ensure notesData is an array
      if (Array.isArray(notesData.notes)) {
        setNotes(notesData.notes.map((note: any) => ({
          ...note,
          createdAt: new Date(note.createdAt)
        })));
      } else {
        // Handle case where backend returns non-array data
        console.warn('Notes data is not an array:', notesData);
        setNotes([]);
      }
    } catch (error) {
      console.error('Failed to load notes:', error);
      setError('Failed to load notes');
      setNotes([]); // Set empty array on error
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = () => {
    AuthService.signOut();
    window.location.href = '/';
  };

  const handleCreateNote = async (title: string, content: string) => {
    try {
      const newNote: any = await NoteService.createNote({ title, content });
      console.log('Created note response:', newNote.note.createdAt);
  
      // Validate and ensure all required fields are present
      const validatedNote = {
        id: newNote.note.id || 'unknown-id',
        title: newNote.note.title || 'Untitled',
        content: newNote.note.content || 'No content available',
        createdAt: newNote.note.createdAt ? new Date(newNote.note.createdAt) : new Date(),
      };
  
      // Update the notes state
      setNotes((prev) => [...prev, validatedNote]);
    } catch (error) {
      console.error('Failed to create note:', error);
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

  // Show loading spinner while initializing
  if (loading || !user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // Show error state if there's an error
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 mb-4">
            <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Something went wrong</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={() => {
              setError(null);
              setLoading(true);
              loadNotes();
            }}
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
          >
            Try Again
          </button>
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