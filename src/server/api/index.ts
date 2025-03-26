import { Router } from 'express';
import notesRouter from './notes';
import authRouter from './auth';

const router = Router();

router.use('/notes', notesRouter);
router.use('/auth', authRouter);

export default router; 