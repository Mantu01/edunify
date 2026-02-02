import { Schema, model, models } from "mongoose";

export interface MCQ {
  id: string;
  question: string;
  options: [string, string, string, string];
  correctAnswer: number;
}

export interface MCQList {
  uniqueId:string;
  userId: string;
  questionsLists: MCQ[];
  topic: string;
  difficulty: "easy" | "medium" | "hard";
  numberOfQuestions: number;
  timer: number;
}

const MCQQuestionSchema = new Schema<MCQ>({
  id: {
    type: String,
    required: true
  },
  question: { type: String, required: true },
  options: {
    type: [String],
    required: true,
    validate: {
      validator: (v: string[]) => v.length === 4
    }
  },
  correctAnswer: {
    type: Number,
    required: true,
    min: 0,
    max: 3
  }
});

const MCQListSchema = new Schema<MCQList>({
  uniqueId:{
    type:String,
    required:true,
    unique:true,
  },
  userId:{
    type:String,
    required:true,
  },
  questionsLists: {
    type: [MCQQuestionSchema],
    required: true
  },
  topic: {
    type: String,
    required: true
  },
  difficulty: {
    type: String,
    enum: ["easy", "medium", "hard"],
    required: true
  },
  numberOfQuestions: {
    type: Number,
    required: true,
    positive: true
  },
  timer: {
    type: Number,
    required: true,
    positive: true
  }
});

export const MCQListModel = models.MCQList || model<MCQList>("MCQList", MCQListSchema);
