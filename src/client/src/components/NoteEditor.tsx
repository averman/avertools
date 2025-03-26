import React, { useState, useEffect } from 'react';
import { Note } from '../../../shared/types/notes';
import { TagInput } from './TagInput';
import styles from './NoteEditor.module.css';

interface NoteEditorProps {
  note: Note | null;
  onSave: (note: Note) => Promise<void>;
  onClose: () => void;
}

export function NoteEditor({ note, onSave, onClose }: NoteEditorProps) {
  const [title, setTitle] = useState(note?.title || '');
  const [content, setContent] = useState(note?.content || '');
  const [tags, setTags] = useState<string[]>(note?.tags || []);
  const [version, setVersion] = useState(note?.version || 0);

  useEffect(() => {
    if (note) {
      setTitle(note.title);
      setContent(note.content);
      setTags(note.tags);
      setVersion(note.version);
    }
  }, [note]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!note) return;
    
    try {
      await onSave({
        ...note,
        title,
        content,
        tags,
        version,
      });
      onClose();
    } catch (error) {
      if (error instanceof Error && error.message.includes('version conflict')) {
        alert('This note has been modified by someone else. Please refresh and try again.');
      } else {
        alert('Failed to save note');
      }
    }
  };

  if (!note) {
    return <div className={styles.empty}>Select a note to edit</div>;
  }

  return (
    <form onSubmit={handleSubmit} className={styles.editor}>
      <div className={styles.header}>
        <input
          type="text"
          value={title}
          onChange={e => setTitle(e.target.value)}
          placeholder="Note title"
          required
          className={styles.titleInput}
        />
        <span className={styles.version}>Version: {version}</span>
      </div>
      <textarea
        value={content}
        onChange={e => setContent(e.target.value)}
        placeholder="Note content"
        required
        className={styles.contentInput}
      />
      <TagInput
        tags={tags}
        onChange={setTags}
        className={styles.tagInput}
      />
      <div className={styles.actions}>
        <button type="button" onClick={onClose} className={styles.cancelButton}>
          Cancel
        </button>
        <button type="submit" className={styles.submitButton}>
          Save Changes
        </button>
      </div>
    </form>
  );
} 