import React, { useState, useEffect } from 'react';
import { Note, CreateNoteRequest, SearchNotesQuery } from '../../../shared/types/notes';
import styles from './NotesApp.module.css';
import { NoteEditor } from '../components/NoteEditor';
import { NoteList } from '../components/NoteList';
import { useApi } from '../utils/api';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { TagInput } from '../components/TagInput';

export function NotesApp() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [newNote, setNewNote] = useState({ title: '', content: '', tags: [] as string[] });
  const [selectedNote, setSelectedNote] = useState<Note | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { fetchWithAuth } = useApi();
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);

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

  const handleSearch = async () => {
    try {
      const queryParams = new URLSearchParams();
      if (searchQuery) {
        queryParams.set('query', searchQuery);
      }
      if (selectedTags.length > 0) {
        queryParams.set('tags', JSON.stringify(selectedTags));
      }
      
      const response = await fetchWithAuth(`/notes/search?${queryParams}`);
      setNotes(response.notes);
    } catch (error) {
      console.error('Failed to search notes:', error);
      setError('Failed to search notes');
    }
  };

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (searchQuery || selectedTags.length > 0) {
        handleSearch();
      } else {
        fetchNotes();
      }
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [searchQuery, selectedTags]);

  const createNote = async (title: string, content: string, tags: string[] = []) => {
    try {
      const response = await fetchWithAuth('/notes', {
        method: 'POST',
        body: JSON.stringify({ title, content, tags })
      });
      setNotes([...notes, response.note]);
      setSelectedNote(null);
    } catch (err) {
      setError('Failed to create note');
    }
  };

  const updateNote = async (id: string, title: string, content: string, tags: string[] = []) => {
    try {
      const response = await fetchWithAuth(`/notes/${id}`, {
        method: 'PUT',
        body: JSON.stringify({ title, content, tags })
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

  const handleSaveNote = async (updatedNote: Note) => {
    try {
      const response = await fetch(`/api/notes/${updatedNote.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedNote),
      });

      if (!response.ok) {
        if (response.status === 409) {
          throw new Error('version conflict');
        }
        throw new Error('Failed to save note');
      }

      const savedNote = await response.json();
      setNotes(notes.map(note => 
        note.id === savedNote.id ? savedNote : note
      ));
      setSelectedNote(savedNote);
    } catch (error) {
      throw error; // Let NoteEditor handle the error
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
        
        <div className={styles.searchSection}>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search notes..."
            className={styles.searchInput}
          />
          <TagInput
            tags={selectedTags}
            onChange={setSelectedTags}
            className={styles.searchTags}
            placeholder="Search by tag..."
          />
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
          onSave={handleSaveNote}
        />
      </div>
    </div>
  );
} 