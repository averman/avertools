export interface Note {
  id: string;
  title: string;
  content: string;
  userId: string;
  tags: string[];
  createdAt: string;
  updatedAt: string;
  version: string;
}

export interface CreateNoteRequest {
  title: string;
  content: string;
  tags?: string[];
  version?: string;
}

export interface UpdateNoteRequest {
  title?: string;
  content?: string;
  tags?: string[];
  version?: string;
}

export interface SearchNotesQuery {
  query?: string;
  tags?: string[];
}

export interface GetNotesResponse {
  notes: Note[];
}

export interface GetNoteResponse {
  note: Note;
} 