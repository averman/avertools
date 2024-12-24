import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LoginRequest } from '../../../shared/types/auth';
import styles from '../styles/Auth.module.css';

export function LoginPage() {
  const [credentials, setCredentials] = useState<LoginRequest>({
    username: '',
    password: '',
  });
  const [error, setError] = useState<string>('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await login(credentials);
      navigate('/tools');
    } catch (error) {
      setError('Invalid username or password');
    }
  };

  return (
    <div className={styles.authContainer}>
      <div className={styles.authCard}>
        <h2 className={styles.title}>Login</h2>
        <form className={styles.form} onSubmit={handleSubmit}>
          {error && <div className={styles.error}>{error}</div>}
          <div className={styles.inputGroup}>
            <label className={styles.label}>Username</label>
            <input
              className={styles.input}
              type="text"
              value={credentials.username}
              onChange={(e) => setCredentials(prev => ({
                ...prev,
                username: e.target.value
              }))}
            />
          </div>
          <div className={styles.inputGroup}>
            <label className={styles.label}>Password</label>
            <input
              className={styles.input}
              type="password"
              value={credentials.password}
              onChange={(e) => setCredentials(prev => ({
                ...prev,
                password: e.target.value
              }))}
            />
          </div>
          <button type="submit" className={styles.button}>
            Login
          </button>
        </form>
        <div className={styles.switchText}>
          Don't have an account? <Link to="/register" className={styles.link}>Register</Link>
        </div>
      </div>
    </div>
  );
} 