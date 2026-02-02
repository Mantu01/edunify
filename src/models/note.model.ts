import { Schema, model, models } from "mongoose";

export interface Note {
  uniqueId: string;
  userId: string;
  title: string;
  content: string;
  subject: string;
  noteType: 'summary' | 'detailed' | 'concept_map' | 'flashcards' | 'cheat_sheet' | 'comparison' | 'timeline' | 'formula_sheet';
  depthLevel: 'basic' | 'intermediate' | 'advanced' | 'expert';
}

const NoteSchema = new Schema<Note>({
  uniqueId: {
    type: String,
    required: true,
    unique: true,
  },
  userId: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  subject: {
    type: String,
    required: true,
  },
  noteType: {
    type: String,
    enum: ['summary', 'detailed', 'concept_map', 'flashcards', 'cheat_sheet', 'comparison', 'timeline', 'formula_sheet'],
    required: true,
  },
  depthLevel: {
    type: String,
    enum: ['basic', 'intermediate', 'advanced', 'expert'],
    required: true,
  }
});

export const NoteModel = models.Note || model<Note>("Note", NoteSchema);
