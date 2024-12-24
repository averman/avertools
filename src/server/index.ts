import express from 'express';
import cors from 'cors';
import authRoutes from './api/auth';
import notesRoutes from './api/notes';

const app = express();

app.use(cors());
app.use(express.json());

// Mount routes
app.use('/api', authRoutes);
app.use('/api', notesRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

export default app; 