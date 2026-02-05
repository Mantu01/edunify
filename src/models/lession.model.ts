import { Schema, model, models } from "mongoose";

export interface ILessonPlan {
  uniqueId:string;
  userId: string;
  overview: {
    subject: string;
    gradeLevel: string;
    durationMinutes: number;
    classType: "online" | "offline" | "hybrid";
    studentLevel: "beginner" | "intermediate" | "advanced" | "mixed";
    lessonSummary: string;
  };
  learningObjectives: {
    objective: string;
    outcome: string;
  }[];
  keyTopics: string[];
  materialsAndResources: {
    name: string;
    purpose: string;
  }[];
  lessonFlow: {
    phase:| "introduction"| "warmUp"| "instruction"| "guidedPractice"| "independentPractice"| "assessment"| "wrapUp";
    durationMinutes: number;
    teacherActivities: string;
    studentActivities: string;
  }[];
  assessment: {
    method: "quiz" | "assignment" | "presentation" | "activity";
    description: string;
    successCriteria: string[];
  };
  homework: {
    required: boolean;
    description?: string;
  };
  differentiation: {
    forBeginners: string;
    forAdvancedStudents: string;
    mixedAbilityStrategy: string;
  };
  specialInstructions?: string;
}

const LessonPlanSchema = new Schema<ILessonPlan>({
  uniqueId:{
    type:String,
    required:true,
    unique:true,
  },
  userId:{
    type:String,
    required:true,
  },
  overview: {
    subject: { type: String, required: true },
    gradeLevel: { type: String, required: true },
    durationMinutes: { type: Number, required: true },
    classType: {
      type: String,
      enum: ["online", "offline", "hybrid"],
      required: true,
    },
    studentLevel: {
      type: String,
      enum: ["beginner", "intermediate", "advanced", "mixed"],
      required: true,
    },
    lessonSummary: { type: String, required: true },
  },
  learningObjectives: [
    {
      objective: { type: String, required: true },
      outcome: { type: String, required: true },
    },
  ],
  keyTopics: [{ type: String, required: true }],
  materialsAndResources: [
    {
      name: { type: String, required: true },
      purpose: { type: String, required: true },
    },
  ],
  lessonFlow: [
    {
      phase: {
        type: String,
        enum: ["introduction","warmUp","instruction","guidedPractice","independentPractice","assessment","wrapUp",],
        required: true,
      },
      durationMinutes: { type: Number, required: true },
      teacherActivities: { type: String, required: true },
      studentActivities: { type: String, required: true },
    },
  ],
  assessment: {
    method: {
      type: String,
      enum: ["quiz", "assignment", "presentation", "activity"],
      required: true,
    },
    description: { type: String, required: true },
    successCriteria: [{ type: String, required: true }],
  },
  homework: {
    required: { type: Boolean, required: true },
    description: { type: String },
  },
  differentiation: {
    forBeginners: { type: String, required: true },
    forAdvancedStudents: { type: String, required: true },
    mixedAbilityStrategy: { type: String, required: true },
  },
  specialInstructions: { type: String },
  },{ timestamps: true }
);

export const LessonPlanModel = models.LessonPlan || model<ILessonPlan>("LessonPlan",LessonPlanSchema);
