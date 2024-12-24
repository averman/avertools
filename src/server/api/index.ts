import { Router } from 'express';
import notesRouter from './notes';

export const apiRouter = Router();

apiRouter.use('/notes', notesRouter);

// Health check endpoint
apiRouter.get('/health', (_, res) => {
  res.json({ status: 'ok' });
}); 