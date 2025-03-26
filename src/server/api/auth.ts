import { Router } from 'express';
import { v4 as uuidv4 } from 'uuid';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { FileStorage } from '../storage/file-storage';
import { User, LoginRequest } from '../../shared/types/auth';

const router = Router();
const userStorage = new FileStorage<User>('users');
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

// Public routes - no authorization required
router.post('/auth/register', async (req, res) => {
  try {
    const { email, password } = req.body;
    const username = email; // Use email as username
    
    // Check if username already exists
    const existingUsers = await userStorage.query(user => user.username === username);
    if (existingUsers.length > 0) {
      return res.status(400).json({ error: 'Username already exists' });
    }

    // Hash password and create new user
    const passwordHash = await bcrypt.hash(password, 10);
    const user: User = {
      id: uuidv4(),
      username,
      passwordHash,
      role: 'user'
    };

    // Save user
    await userStorage.set(user.id, user);
    
    // Generate JWT token
    const token = jwt.sign(
      { id: user.id, username: user.username, role: user.role },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    // Return user info and token (excluding password hash)
    res.status(201).json({
      token,
      user: {
        id: user.id,
        username: user.username,
        role: user.role
      }
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Public route - no authorization required
router.post('/auth/login', async (req, res) => {
  try {
    console.log('Login attempt:', req.body);
    const { username, password } = req.body;
    
    // Find user by username/email\
    const users = await userStorage.query(user => user.username === username);
    const user = users[0];

    console.log('Login attempt:', { username, userFound: !!user });

    // Check if user exists and password is correct
    if (!user || !(await bcrypt.compare(password, user.passwordHash))) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Generate JWT token
    const token = jwt.sign(
      { id: user.id, username: user.username, role: user.role },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    // Return user info and token (excluding password hash)
    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 24 * 60 * 60 * 1000 // 24 hours
    });

    res.json({
      token,
      user: {
        id: user.id,
        username: user.username,
        role: user.role
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router; 