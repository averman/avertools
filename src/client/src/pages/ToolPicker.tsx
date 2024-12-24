import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import styles from './ToolPicker.module.css';

export function ToolPicker() {
  const { logout } = useAuth();

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1>AverTools</h1>
        <button onClick={logout} className={styles.logoutButton}>Logout</button>
      </div>
      <div className={styles.toolGrid}>
        <Link to="/notes" className={styles.toolCard}>
          <div className={styles.toolIcon}>📝</div>
          <h2>Notes</h2>
          <p>Create and manage your notes</p>
        </Link>
        {/* Add more tools here */}
      </div>
    </div>
  );
} 