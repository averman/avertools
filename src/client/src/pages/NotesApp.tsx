import React from 'react';
import { useState, useEffect } from 'react';
import { Note } from '../../../shared/types/notes';
import styles from './NotesApp.module.css';
import { NoteEditor } from '../components/NoteEditor';
import { NoteList } from '../components/NoteList';
import { useApi } from '../utils/api';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

export function NotesApp() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [selectedNote, setSelectedNote] = useState<Note | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { fetchWithAuth } = useApi();
  const { logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    fetchNotes();
  }, []);

  const fetchNotes = async () => {
    try {
      const response = await fetchWithAuth('/notes');
      setNotes(response.notes);
    } catch (err) {
      setError('Failed to fetch notes');
      if ((err as any)?.status === 401) {
        logout();
        navigate('/login');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const createNote = async (title: string, content: string) => {
    try {
      const response = await fetchWithAuth('/notes', {
        method: 'POST',
        body: JSON.stringify({ title, content })
      });
      setNotes([...notes, response.note]);
      setSelectedNote(null);
    } catch (err) {
      setError('Failed to create note');
    }
  };

  const updateNote = async (id: string, title: string, content: string) => {
    try {
      const response = await fetchWithAuth(`/notes/${id}`, {
        method: 'PUT',
        body: JSON.stringify({ title, content })
      });
      setNotes(notes.map(note => note.id === id ? response.note : note));
      setSelectedNote(null);
    } catch (err) {
      setError('Failed to update note');
    }
  };

  const deleteNote = async (id: string) => {
    try {
      await fetchWithAuth(`/notes/${id}`, { method: 'DELETE' });
      setNotes(notes.filter(note => note.id !== id));
      if (selectedNote?.id === id) {
        setSelectedNote(null);
      }
    } catch (err) {
      setError('Failed to delete note');
    }
  };

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className={styles.container}>
      <div className={styles.sidebar}>
        <div className={styles.header}>
          <h1>Notes</h1>
          <button onClick={logout}>Logout</button>
        </div>
        <button 
          className={styles.newNoteButton}
          onClick={() => setSelectedNote(null)}
        >
          New Note
        </button>
        <NoteList 
          notes={notes}
          selectedNote={selectedNote}
          onSelectNote={setSelectedNote}
          onDeleteNote={deleteNote}
        />
      </div>
      <div className={styles.editor}>
        <NoteEditor
          note={selectedNote}
          onSave={(title, content) => {
            if (selectedNote) {
              updateNote(selectedNote.id, title, content);
            } else {
              createNote(title, content);
            }
          }}
        />
      </div>
    </div>
  );
} 