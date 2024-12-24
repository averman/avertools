export interface User {
  id: string;
  username: string;
  passwordHash: string;
  role: 'admin' | 'user';
}

export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  user: Omit<User, 'passwordHash'>;
}

// Update Note type to include ownership
export interface Note {
  id: string;
  title: string;
  content: string;
  createdAt: string;
  updatedAt: string;
  userId: string; // Add this field
} 