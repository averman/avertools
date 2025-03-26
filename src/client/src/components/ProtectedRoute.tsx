import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { token } = useAuth();
  
  // Add some debugging
  console.log('Protected Route - token:', token);
  
  if (!token) {
    return <Navigate to="/login" />;
  }

  return <>{children}</>;
} 