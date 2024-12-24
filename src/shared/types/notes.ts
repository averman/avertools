export interface Note {
  id: string;
  title: string;
  content: string;
  createdAt: string;
  updatedAt: string;
  userId: string;
}

export interface CreateNoteRequest {
  title: string;
  content: string;
}

export interface UpdateNoteRequest {
  title?: string;
  content?: string;
}

export interface GetNotesResponse {
  notes: Note[];
}

export interface GetNoteResponse {
  note: Note;
} 