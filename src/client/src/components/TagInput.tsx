import React, { useState } from 'react';
import styles from './TagInput.module.css';

interface TagInputProps {
  tags: string[];
  onChange: (tags: string[]) => void;
  className?: string;
  placeholder?: string;
}

export const TagInput: React.FC<TagInputProps> = ({ tags, onChange, className, placeholder }) => {
  const [inputValue, setInputValue] = useState('');

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && inputValue.trim()) {
      e.preventDefault();
      const newTag = inputValue.trim();
      if (!tags.includes(newTag)) {
        onChange([...tags, newTag]);
      }
      setInputValue('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    onChange(tags.filter(tag => tag !== tagToRemove));
  };

  return (
    <div className={`${styles.tagInput} ${className || ''}`}>
      <div className={styles.tags}>
        {tags.map(tag => (
          <span key={tag} className={styles.tag}>
            {tag}
            <button 
              type="button" 
              onClick={() => removeTag(tag)}
              className={styles.removeButton}
            >
              ×
            </button>
          </span>
        ))}
      </div>
      <input
        type="text"
        value={inputValue}
        onChange={e => setInputValue(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={placeholder || "Add tags... (press Enter)"}
        className={styles.input}
      />
    </div>
  );
}; 