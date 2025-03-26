import { Router } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { Note, CreateNoteRequest, UpdateNoteRequest } from '../../shared/types/notes';
import { FileStorage } from '../storage/file-storage';
import { authMiddleware } from '../middleware/auth';

const router = Router();
const noteStorage = new FileStorage<Note>('notes');

// Apply auth middleware to all routes
router.use(authMiddleware);

// Fix route paths - remove '/notes' prefix since it's already handled in the main router
router.get('/', async (req, res) => {
  try {
    const notes = await noteStorage.query(note => note.userId === req.user!.id);
    res.json({ notes });
  } catch (error) {
    console.error('Error fetching notes:', error);
    res.status(500).json({ error: 'Failed to fetch notes' });
  }
});

router.get('/search', async (req, res) => {
  try {
    const userId = req.user!.id;
    const query = req.query.query as string;
    const tags = req.query.tags ? JSON.parse(req.query.tags as string) : [];
    
    const userNotes = await noteStorage.query((note: Note) => note.userId === userId);
    let filteredNotes = userNotes;
    
    if (query) {
      const searchTerm = query.toLowerCase();
      filteredNotes = filteredNotes.filter(note => 
        note.title.toLowerCase().includes(searchTerm) ||
        note.content.toLowerCase().includes(searchTerm)
      );
    }
    
    if (tags && tags.length > 0) {
      filteredNotes = filteredNotes.filter(note => 
        tags.some((tag: string) => note.tags?.includes(tag))
      );
    }
    
    res.json({ notes: filteredNotes });
  } catch (error) {
    console.error('Search error:', error);
    res.status(500).json({ error: 'Failed to search notes' });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const note = await noteStorage.get(req.params.id);
    
    if (!note || note.userId !== req.user!.id) {
      return res.status(404).json({ error: 'Note not found' });
    }
    
    res.json({ note });
  } catch (error) {
    console.error('Error fetching note:', error);
    res.status(500).json({ error: 'Failed to fetch note' });
  }
});

router.post('/', async (req, res) => {
  try {
    const { title, content, tags = [], version } = req.body as CreateNoteRequest;
    const now = new Date().toISOString();
    
    const newNote: Note = {
      id: uuidv4(),
      title,
      content,
      tags,
      version: version || 'default',
      createdAt: now,
      updatedAt: now,
      userId: req.user!.id
    };
    
    await noteStorage.set(newNote.id, newNote);
    res.status(201).json({ note: newNote });
  } catch (error) {
    console.error('Error creating note:', error);
    res.status(500).json({ error: 'Failed to create note' });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const { title, content, tags, version } = req.body as UpdateNoteRequest;
    const note = await noteStorage.get(req.params.id);
    
    if (!note || note.userId !== req.user!.id) {
      return res.status(404).json({ error: 'Note not found' });
    }
    
    const updatedNote: Note = {
      ...note,
      ...(title && { title }),
      ...(content && { content }),
      ...(tags && { tags }),
      version: version || note.version || 'default',
      updatedAt: new Date().toISOString()
    };
    
    await noteStorage.set(req.params.id, updatedNote);
    res.json({ note: updatedNote });
  } catch (error) {
    console.error('Error updating note:', error);
    res.status(500).json({ error: 'Failed to update note' });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const note = await noteStorage.get(req.params.id);
    
    if (!note || note.userId !== req.user!.id) {
      return res.status(404).json({ error: 'Note not found' });
    }
    
    await noteStorage.delete(req.params.id);
    res.status(204).send();
  } catch (error) {
    console.error('Error deleting note:', error);
    res.status(500).json({ error: 'Failed to delete note' });
  }
});

export default router; 