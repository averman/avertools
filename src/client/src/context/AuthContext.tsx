import React, { createContext, useContext, useState, useCallback } from 'react';

interface AuthContextType {
  token: string | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  register: (email: string, password: string) => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [token, setToken] = useState<string | null>(localStorage.getItem('token'));
  const apiBaseUrl = import.meta.env.VITE_API_URL || '';

  const login = useCallback(async (username: string, password: string) => {
    console.log('apiBaseUrl', apiBaseUrl);
    try {
      const response = await fetch(`${apiBaseUrl}/api/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ username, password }),
      });

      if (!response.ok) {
        throw new Error('Login failed');
      }

      const data = await response.json();
      setToken(data.token);
      localStorage.setItem('token', data.token);
      return data;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  }, [apiBaseUrl]);

  const register = useCallback(async (email: string, password: string) => {
    try {
      const response = await fetch(`${apiBaseUrl}/api/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        throw new Error('Registration failed');
      }

      const data = await response.json();
      setToken(data.token);
      localStorage.setItem('token', data.token);
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    }
  }, [apiBaseUrl]);

  const resetPassword = useCallback(async (email: string) => {
    try {
      const response = await fetch(`${apiBaseUrl}/api/auth/reset-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ email }),
      });

      if (!response.ok) {
        throw new Error('Password reset request failed');
      }
    } catch (error) {
      console.error('Password reset error:', error);
      throw error;
    }
  }, [apiBaseUrl]);

  const logout = useCallback(() => {
    setToken(null);
    localStorage.removeItem('token');
  }, []);

  return (
    <AuthContext.Provider value={{ token, login, logout, register, resetPassword }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
} 