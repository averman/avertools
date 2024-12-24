import { Router } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { Note, CreateNoteRequest, UpdateNoteRequest } from '../../shared/types/notes';
import { FileStorage } from '../storage/file-storage';
import { authMiddleware } from '../middleware/auth';

const router = Router();
const noteStorage = new FileStorage<Note>('notes');

// Apply auth middleware to all routes
router.use(authMiddleware);

router.get('/notes', async (req, res) => {
  const notes = await noteStorage.query(note => note.userId === req.user!.id);
  res.json({ notes });
});

router.get('/notes/:id', async (req, res) => {
  const note = await noteStorage.get(req.params.id);
  
  if (!note || note.userId !== req.user!.id) {
    return res.status(404).json({ error: 'Note not found' });
  }
  
  res.json({ note });
});

router.post('/notes', async (req, res) => {
  const { title, content } = req.body as CreateNoteRequest;
  const now = new Date().toISOString();
  
  const newNote: Note = {
    id: uuidv4(),
    title,
    content,
    createdAt: now,
    updatedAt: now,
    userId: req.user!.id
  };
  
  await noteStorage.set(newNote.id, newNote);
  res.status(201).json({ note: newNote });
});

router.put('/notes/:id', async (req, res) => {
  const { title, content } = req.body as UpdateNoteRequest;
  const note = await noteStorage.get(req.params.id);
  
  if (!note || note.userId !== req.user!.id) {
    return res.status(404).json({ error: 'Note not found' });
  }
  
  const updatedNote: Note = {
    ...note,
    ...(title && { title }),
    ...(content && { content }),
    updatedAt: new Date().toISOString()
  };
  
  await noteStorage.set(req.params.id, updatedNote);
  res.json({ note: updatedNote });
});

router.delete('/notes/:id', async (req, res) => {
  const note = await noteStorage.get(req.params.id);
  
  if (!note || note.userId !== req.user!.id) {
    return res.status(404).json({ error: 'Note not found' });
  }
  
  await noteStorage.delete(req.params.id);
  res.status(204).send();
});

export default router; 