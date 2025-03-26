import express from 'express';
import cors from 'cors';
import authRouter from './api/auth';
import apiRouter from './api';

const app = express();

// More specific CORS configuration
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  exposedHeaders: ['Content-Type', 'Authorization'],
  maxAge: 86400, // 24 hours in seconds
  preflightContinue: false,
  optionsSuccessStatus: 204
}));

app.use(express.json());

// Mount all API routes
app.use('/api', apiRouter);
app.use('/api', authRouter);

export default app; 