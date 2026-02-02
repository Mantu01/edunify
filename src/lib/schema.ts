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

export type NoteProps = z.infer<typeof notePropsSchema>;

export type MCQListProps = z.infer<typeof MCQListPropsSchema>;
export type LoginSchemaType=z.infer<typeof loginSchema>;
export type SignupSchemaType=z.infer<typeof signupSchema>;

export {
  loginSchema,
  signupSchema
}