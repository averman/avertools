import { useAuth } from '../context/AuthContext';

export function useApi() {
  const { token } = useAuth();

  const fetchWithAuth = async (endpoint: string, options: RequestInit = {}) => {
    const headers = {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    };

    const response = await fetch(`/api${endpoint}`, {
      ...options,
      headers,
    });

    if (!response.ok) {
      throw new Error('API request failed');
    }

    return response.json();
  };

  return { fetchWithAuth };
} 