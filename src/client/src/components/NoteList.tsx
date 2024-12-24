import React from 'react';
import { Note } from '../../../shared/types/notes';
import styles from './NoteList.module.css';

interface NoteListProps {
  notes: Note[];
  selectedNote: Note | null;
  onSelectNote: (note: Note | null) => void;
  onDeleteNote: (id: string) => Promise<void>;
}

export function NoteList({ notes, selectedNote, onSelectNote, onDeleteNote }: NoteListProps) {
  return (
    <div className={styles.noteList}>
      {notes.map(note => (
        <div
          key={note.id}
          className={`${styles.noteItem} ${selectedNote?.id === note.id ? styles.selected : ''}`}
        >
          <div
            className={styles.noteTitle}
            onClick={() => onSelectNote(note)}
          >
            {note.title}
          </div>
          <button
            className={styles.deleteButton}
            onClick={() => onDeleteNote(note.id)}
          >
            Delete
          </button>
        </div>
      ))}
    </div>
  );
} 