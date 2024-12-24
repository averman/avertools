import React, { useState, useEffect } from 'react';
import { Note } from '../../../shared/types/notes';
import styles from './NoteEditor.module.css';

interface NoteEditorProps {
  note: Note | null;
  onSave: (title: string, content: string) => void;
}

export function NoteEditor({ note, onSave }: NoteEditorProps) {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');

  useEffect(() => {
    if (note) {
      setTitle(note.title);
      setContent(note.content);
    } else {
      setTitle('');
      setContent('');
    }
  }, [note]);

  const handleSave = () => {
    onSave(title, content);
  };

  return (
    <div className={styles.noteEditor}>
      <div className={styles.editorContent}>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Note Title"
          className={styles.titleInput}
        />
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Note Content"
          className={styles.contentInput}
        />
        <button onClick={handleSave} className={styles.saveButton}>
          Save
        </button>
      </div>
    </div>
  );
} 