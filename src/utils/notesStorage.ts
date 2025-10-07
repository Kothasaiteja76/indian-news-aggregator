import { Note } from '../types';

const NOTES_STORAGE_KEY = 'news-automata-notes';

export const loadNotes = (): Note[] => {
  try {
    const notes = localStorage.getItem(NOTES_STORAGE_KEY);
    return notes ? JSON.parse(notes) : [];
  } catch (error) {
    console.error('Error loading notes:', error);
    return [];
  }
};

export const saveNotes = (notes: Note[]): void => {
  try {
    localStorage.setItem(NOTES_STORAGE_KEY, JSON.stringify(notes));
  } catch (error) {
    console.error('Error saving notes:', error);
  }
};

export const addNote = (note: Omit<Note, 'id' | 'createdAt'>): Note => {
  const notes = loadNotes();
  const newNote: Note = {
    ...note,
    id: crypto.randomUUID(),
    createdAt: new Date().toISOString(),
  };
  notes.unshift(newNote);
  saveNotes(notes);
  return newNote;
};

export const deleteNote = (id: string): void => {
  const notes = loadNotes();
  const filteredNotes = notes.filter((note) => note.id !== id);
  saveNotes(filteredNotes);
};

// Add this function to update existing notes
export const updateNote = (id: string, content: string): void => {
  const notes = loadNotes();
  const updatedNotes = notes.map(note =>
    note.id === id ? { ...note, content } : note
  );
  saveNotes(updatedNotes);
};