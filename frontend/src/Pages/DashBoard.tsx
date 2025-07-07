import React, { useState } from 'react';
import { Trash2, X } from 'lucide-react';

interface Note {
  id: number;
  title: string;
  content: string;
  createdAt: Date;
}

const Dashboard: React.FC = () => {
  const [notes, setNotes] = useState<Note[]>([
    { id: 1, title: 'Note 1', content: 'Sample content for note 1', createdAt: new Date() },
    { id: 2, title: 'Note 2', content: 'Sample content for note 2', createdAt: new Date() },
  ]);
  
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newNoteTitle, setNewNoteTitle] = useState('');
  const [newNoteContent, setNewNoteContent] = useState('');

  const handleSignOut = () => {
    console.log('Signing out...');
  };

  const handleCreateNote = () => {
    if (newNoteTitle.trim()) {
      const newNote: Note = {
        id: Date.now(),
        title: newNoteTitle,
        content: newNoteContent,
        createdAt: new Date()
      };
      setNotes([...notes, newNote]);
      setNewNoteTitle('');
      setNewNoteContent('');
      setShowCreateForm(false);
    }
  };

  const handleDeleteNote = (id: number) => {
    setNotes(notes.filter(note => note.id !== id));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile View */}
      <div className="lg:hidden">
        <div className="bg-white">
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-4 border-b border-gray-100">
            <div className="flex items-center space-x-3">
            <img src='/public/icon.svg' alt='logo' className='mr-3'/>
              <h1 className="text-xl font-semibold text-gray-900">Dashboard</h1>
            </div>
            <button
              onClick={handleSignOut}
              className="text-blue-500 font-medium text-sm"
            >
              Sign Out
            </button>
          </div>

          {/* Welcome Card */}
          <div className="px-4 py-4">
            <div className="bg-gray-50 rounded-2xl p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Welcome, Jonas Kahnwald !
              </h2>
              <p className="text-gray-600 text-sm">
                Email: xxxxxx@xxxx.com
              </p>
            </div>
          </div>

          {/* Create Note Button */}
          <div className="px-4 pb-4">
            <button
              onClick={() => setShowCreateForm(true)}
              className="w-full bg-blue-500 text-white py-4 rounded-2xl font-medium text-base hover:bg-blue-600 transition-colors"
            >
              Create Note
            </button>
          </div>

          {/* Notes Section */}
          <div className="px-4 pb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Notes</h3>
            <div className="space-y-3">
              {notes.map((note) => (
                <div
                  key={note.id}
                  className="bg-white rounded-2xl p-4 border border-gray-100 flex items-center justify-between hover:shadow-sm transition-shadow"
                >
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900">{note.title}</h4>
                    <p className="text-sm text-gray-600 mt-1 truncate">{note.content}</p>
                  </div>
                  <button
                    onClick={() => handleDeleteNote(note.id)}
                    className="ml-4 p-2 text-gray-400 hover:text-red-500 transition-colors"
                  >
                    <Trash2 size={20} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Desktop View */}
      <div className="hidden lg:block">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="bg-white border-b border-gray-200">
            <div className="flex items-center justify-between px-8 py-6">
              <div className="flex items-center space-x-4">
                <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
                  <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
                    <div className="w-4 h-4 bg-blue-500 rounded-full animate-spin">
                      <div className="w-1 h-1 bg-white rounded-full"></div>
                    </div>
                  </div>
                </div>
                <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
              </div>
              <button
                onClick={handleSignOut}
                className="text-blue-500 font-medium hover:text-blue-600 transition-colors px-4 py-2 rounded-lg hover:bg-blue-50"
              >
                Sign Out
              </button>
            </div>
          </div>

          {/* Main Content */}
          <div className="px-8 py-8">
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
              {/* Left Column - Welcome & Create */}
              <div className="xl:col-span-1">
                {/* Welcome Card */}
                <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 mb-6">
                  <h2 className="text-3xl font-bold text-gray-900 mb-4">
                    Welcome, Jonas Kahnwald !
                  </h2>
                  <p className="text-gray-600">
                    Email: xxxxxx@xxxx.com
                  </p>
                </div>

                {/* Create Note Button */}
                <button
                  onClick={() => setShowCreateForm(true)}
                  className="w-full bg-blue-500 text-white py-6 rounded-3xl font-semibold text-lg hover:bg-blue-600 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
                >
                  Create Note
                </button>
              </div>

              {/* Right Column - Notes */}
              <div className="xl:col-span-2">
                <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 min-h-96">
                  <h3 className="text-2xl font-bold text-gray-900 mb-6">Notes</h3>
                  <div className="grid gap-4">
                    {notes.map((note) => (
                      <div
                        key={note.id}
                        className="bg-gray-50 rounded-2xl p-6 border border-gray-100 flex items-center justify-between hover:shadow-md transition-all duration-200 hover:bg-gray-100"
                      >
                        <div className="flex-1">
                          <h4 className="text-lg font-semibold text-gray-900">{note.title}</h4>
                          <p className="text-gray-600 mt-2">{note.content}</p>
                          <p className="text-sm text-gray-400 mt-3">
                            {note.createdAt.toLocaleDateString()}
                          </p>
                        </div>
                        <button
                          onClick={() => handleDeleteNote(note.id)}
                          className="ml-6 p-3 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all duration-200"
                        >
                          <Trash2 size={24} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Create Note Modal */}
      {showCreateForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl p-8 w-full max-w-md">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-900">Create New Note</h3>
              <button
                onClick={() => setShowCreateForm(false)}
                className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X size={24} />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Title
                </label>
                <input
                  type="text"
                  value={newNoteTitle}
                  onChange={(e) => setNewNoteTitle(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter note title"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Content
                </label>
                <textarea
                  value={newNoteContent}
                  onChange={(e) => setNewNoteContent(e.target.value)}
                  rows={4}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                  placeholder="Enter note content"
                />
              </div>
              <div className="flex space-x-3 pt-4">
                <button
                  onClick={() => setShowCreateForm(false)}
                  className="flex-1 py-3 px-4 border border-gray-300 rounded-xl text-gray-700 font-medium hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleCreateNote}
                  className="flex-1 py-3 px-4 bg-blue-500 text-white rounded-xl font-medium hover:bg-blue-600 transition-colors"
                >
                  Create
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;