import { Schema, model, models } from "mongoose";

export type AssignmentQuestion =
  | {
      id: string;
      questionType: "multiple_choice";
      prompt: string;
      options: string[];
      correctAnswer: string;
    }
  | {
      id: string;
      questionType: "short_answer";
      prompt: string;
      correctAnswer: string;
    }
  | {
      id: string;
      questionType: "long_answer";
      prompt: string;
      evaluationGuidelines: string;
    }
  | {
      id: string;
      questionType: "true_false";
      prompt: string;
      correctAnswer: boolean;
    }
  | {
      id: string;
      questionType: "fill_in_the_blanks";
      prompt: string;
      correctAnswers: string[];
    };

export interface AssignmentDoc {
  uniqueId: string;
  userId: string;
  subject: string;
  gradeLevel: string;
  topic: string;
  learningObjectives: string[];
  difficultyLevel: "easy" | "medium" | "hard";
  questions: AssignmentQuestion[];
  lastSubmissionHours: number;
}

const AssignmentQuestionSchema = new Schema<AssignmentQuestion>(
  {
    id: { type: String, required: true },
    questionType: {
      type: String,
      enum: ["multiple_choice", "short_answer", "long_answer", "true_false", "fill_in_the_blanks"],
      required: true,
    },
    prompt: { type: String, required: true },
    options: { type: [String] },
    correctAnswer: { type: Schema.Types.Mixed },
    evaluationGuidelines: { type: String },
    correctAnswers: { type: [String] },
  },
  { _id: false }
);

const AssignmentSchema = new Schema<AssignmentDoc>(
  {
    uniqueId: { type: String, required: true, unique: true },
    userId: { type: String, required: true },
    subject: { type: String, required: true },
    gradeLevel: { type: String, required: true },
    topic: { type: String, required: true },
    learningObjectives: { type: [String], required: true },
    difficultyLevel: { type: String, enum: ["easy", "medium", "hard"], required: true },
    questions: { type: [AssignmentQuestionSchema], required: true },
    lastSubmissionHours: { type: Number, required: true, min: 1 },
  },
  { timestamps: true }
);

export const AssignmentModel = models.Assignment || model<AssignmentDoc>("Assignment", AssignmentSchema);
