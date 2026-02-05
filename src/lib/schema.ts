import {z} from 'zod';

export const emptyPropsSchema = z.object({});

const loginSchema=z.object({
  email:z.string().email({ message: "Please enter a valid email address" }),
  password:z.string().min(8,{ message: "Password must be at least 8 characters long" }),
});

const signupSchema=z.object({
  email:z.string().email({ message: "Please enter a valid email address" }),
  username:z.string().min(6, { message: "Username must be at least 6 characters long" }),
  password:z.string().min(8,{ message: "Password must be at least 8 characters long" }),
  confirmPassword:z.string(),
  role:z.enum(['student', 'teacher', 'founder'])
})
.refine((data)=>data.password===data.confirmPassword,{
  message:'Password do not match',
  path:['confirmPassword']
});


export const MCQListPropsSchema = z.object({
  questionsLists: z.array(z.object({
    id: z.string(),
    question: z.string(),
    options: z.array(z.string()).length(4),
    correctAnswer: z.number().min(0).max(3),
  })),
  topic: z.string(),
  difficulty: z.enum(['easy', 'medium', 'hard']),
  numberOfQuestions: z.number().positive(),
  timer: z.number().positive(),
});

export const notePropsSchema = z.object({
  title: z.string(),
  content: z.string().describe('The detailed content of the note.This can include text, bullet points, and other relevant information.'),
  subject: z.string(),
  noteType: z.enum(['summary', 'detailed', 'concept_map', 'flashcards', 'cheat_sheet', 'comparison', 'timeline', 'formula_sheet']),
  depthLevel: z.enum(['basic', 'intermediate', 'advanced', 'expert']),
});

export const LessonPlanSchema = z.object({
  overview: z.object({
    subject: z.string(),
    gradeLevel: z.string(),
    durationMinutes: z.number(),
    classType: z.enum(["online", "offline", "hybrid"]),
    studentLevel: z.enum(["beginner", "intermediate", "advanced", "mixed"]),
    lessonSummary: z.string(),
  }),

  learningObjectives: z.array(z.object({
    objective: z.string(),
    outcome: z.string(),
  })),

  keyTopics: z.array(z.string()),

  materialsAndResources: z.array(z.object({
    name: z.string(),
    purpose: z.string(),
  })),

  lessonFlow: z.array(z.object({
    phase: z.enum(["introduction","warmUp","instruction","guidedPractice","independentPractice","assessment","wrapUp",]),
    durationMinutes: z.number(),
    teacherActivities: z.string(),
    studentActivities: z.string(),
  })),

  assessment: z.object({
    method: z.enum(["quiz", "assignment", "presentation", "activity"]),
    description: z.string(),
    successCriteria: z.array(z.string()),
  }),

  homework: z.object({
    required: z.boolean(),
    description: z.string().optional(),
  }),

  differentiation: z.object({
    forBeginners: z.string(),
    forAdvancedStudents: z.string(),
    mixedAbilityStrategy: z.string(),
  }),

  specialInstructions: z.string().optional(),
});

export const assignmentSchema = z.object({
  subject: z.string().min(1),
  gradeLevel: z.string().min(1),
  topic: z.string().min(1),
  learningObjectives: z.array(z.string().min(1)).min(1),
  difficultyLevel: z.enum(["easy", "medium", "hard"]),
  questions: z.array(
    z.discriminatedUnion("questionType", [
      z.object({
        id: z.string(),
        questionType: z.literal("multiple_choice"),
        prompt: z.string().min(1),
        options: z.array(z.string().min(1)).min(2),
        correctAnswer: z.string().min(1),
        marks: z.number().int().min(1),
      }),
      z.object({
        id: z.string(),
        questionType: z.literal("short_answer"),
        prompt: z.string().min(1),
        correctAnswer: z.string().min(1),
        marks: z.number().int().min(1),
      }),
      z.object({
        id: z.string(),
        questionType: z.literal("long_answer"),
        prompt: z.string().min(1),
        evaluationGuidelines: z.string().min(1),
        marks: z.number().int().min(1),
      }),
      z.object({
        id: z.string(),
        questionType: z.literal("true_false"),
        prompt: z.string().min(1),
        correctAnswer: z.boolean(),
        marks: z.number().int().min(1),
      }),
      z.object({
        id: z.string(),
        questionType: z.literal("fill_in_the_blanks"),
        prompt: z.string().min(1),
        correctAnswers: z.array(z.string().min(1)).min(1),
        marks: z.number().int().min(1),
      }),
    ])
  ).min(1),
  lastSubmissionAt: z.date(),
});

export type AssignmentType = z.infer<typeof assignmentSchema>;
export type LessonPlanType = z.infer<typeof LessonPlanSchema>;
export type NoteProps = z.infer<typeof notePropsSchema>;
export type MCQListProps = z.infer<typeof MCQListPropsSchema>;
export type LoginSchemaType=z.infer<typeof loginSchema>;
export type SignupSchemaType=z.infer<typeof signupSchema>;

export {
  loginSchema,
  signupSchema
}