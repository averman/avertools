import { useAuth } from '../context/AuthContext';

interface ApiError extends Error {
  status?: number;
}

export function useApi() {
  const { token } = useAuth();
  const apiBaseUrl = import.meta.env.VITE_API_URL || '';

  const fetchWithAuth = async (endpoint: string, options: RequestInit = {}) => {
    console.log('apiBaseUrl', apiBaseUrl);
    try {
      const headers = {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...options.headers,
      };

      const response = await fetch(`${apiBaseUrl}/api${endpoint}`, {
        ...options,
        headers,
        credentials: 'include', // This enables sending cookies in cross-origin requests
      });

      if (!response.ok) {
        const error = new Error('API request failed') as ApiError;
        error.status = response.status;
        throw error;
      }

      // Only try to parse JSON if there's content
      if (response.status === 204) {
        return null;
      }

      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        return response.json();
      }

      return null;
    } catch (error) {
      if (error instanceof Error) {
        console.error(`API Error (${endpoint}):`, error);
        throw error;
      }
      
      const genericError = new Error('Unknown API error') as ApiError;
      throw genericError;
    }
  };

  return { fetchWithAuth };
} 