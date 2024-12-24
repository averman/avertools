import { Router } from 'express';
import { Tool } from '../../shared/types/tools';

const router = Router();

const tools: Tool[] = [
  {
    id: 'notes',
    name: 'Notes App',
    description: 'Simple note-taking application',
    icon: '📝',
    path: '/notes'
  }
];

router.get('/tools', (req, res) => {
  res.json({ tools });
});

export default router; 