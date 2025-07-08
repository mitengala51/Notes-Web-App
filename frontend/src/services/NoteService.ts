const API_BASE_URL = 'https://notes-web-app-ol6z.onrender.com/api';

export interface CreateNoteData {
  title: string;
  content: string;
}

export interface Note {
  id: string;
  title: string;
  content: string;
  createdAt: string;
  userId: string;
}

class NoteServiceClass {
  private getAuthHeaders() {
    const token = localStorage.getItem('token');
    return {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    };
  }

  async getAllNotes(): Promise<Note[]> {
    const response = await fetch(`${API_BASE_URL}/notes`, {
      headers: this.getAuthHeaders(),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to fetch notes');
    }

    return response.json();
  }

  async createNote(data: CreateNoteData): Promise<Note> {
    const response = await fetch(`${API_BASE_URL}/notes`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to create note');
    }

    return response.json();
  }

  async deleteNote(id: string): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/notes/${id}`, {
      method: 'DELETE',
      headers: this.getAuthHeaders(),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to delete note');
    }
  }

  async updateNote(id: string, data: Partial<CreateNoteData>): Promise<Note> {
    const response = await fetch(`${API_BASE_URL}/notes/${id}`, {
      method: 'PUT',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to update note');
    }

    return response.json();
  }
}

export const NoteService = new NoteServiceClass();

// src/utils/auth.ts
export const redirectToAuth = () => {
  window.location.href = '/auth';
};

export const redirectToDashboard = () => {
  window.location.href = '/dashboard';
};

export const isAuthenticated = (): boolean => {
  const token = localStorage.getItem('token');
  const user = localStorage.getItem('user');
  
  return !!(token && user);
};

export const getStoredUser = () => {
  const userData = localStorage.getItem('user');
  return userData ? JSON.parse(userData) : null;
};

export const clearAuthData = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
};
