import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { LoginPage } from './components/LoginPage';
import { RegisterPage } from './components/RegisterPage';
import { ProtectedRoute } from './components/ProtectedRoute';
import { NotesApp } from './pages/NotesApp';
import { ToolPicker } from './pages/ToolPicker';
import React from 'react';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/" element={<Navigate to="/tools" replace />} />
          <Route
            path="/tools"
            element={
              <ProtectedRoute>
                <ToolPicker />
              </ProtectedRoute>
            }
          />
          <Route
            path="/notes/*"
            element={
              <ProtectedRoute>
                <NotesApp />
              </ProtectedRoute>
            }
          />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App; 