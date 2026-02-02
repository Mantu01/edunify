import {z} from 'zod';

export const emptyPropsSchema = z.object({});

const loginSchema=z.object({
  email:z.string().email({ message: "Please enter a valid email address" }),
  password:z.string().min(8,{ message: "Password must be at least 8 characters long" }),
  role:z.enum(['student', 'teacher', 'founder'])
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

const mcqItemSchema = z.object({
  question: z.string(),
  options: z.array(z.string()).min(2),
  correctAnswer: z.number(),
});

const assignmentItemSchema = z.object({
  title: z.string(),
  description: z.string(),
  dueDate: z.string(), 
});

const notesItemSchema = z.object({
  title: z.string(),
  content: z.string(),
});

export const contentSchema = z.discriminatedUnion("contentType", [
  z.object({
    contentType: z.literal("default"),
    data: z.string(),
  }),
  z.object({
    contentType: z.literal("mcq"),
    data: z.array(mcqItemSchema),
  }),
  z.object({
    contentType: z.literal("assignment"),
    data: z.array(assignmentItemSchema),
  }),
  z.object({
    contentType: z.literal("notes"),
    data: z.array(notesItemSchema),
  }),
]);

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
  timer: z.number().positive()
});

export type MCQListProps = z.infer<typeof MCQListPropsSchema>;
export type Content = z.infer<typeof contentSchema>;
export type LoginSchemaType=z.infer<typeof loginSchema>;
export type SignupSchemaType=z.infer<typeof signupSchema>;

export {
  loginSchema,
  signupSchema
}