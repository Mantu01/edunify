import type { TamboComponent } from "@tambo-ai/react";
import { emptyPropsSchema, MCQListPropsSchema, notePropsSchema, LessonPlanSchema, assignmentSchema, ResumeAnalysisSchema } from "./schema";
import MCQGeneratorForm from "@/components/gen-ui/mcq/mcq-form";
import MCQRequst from "@/components/gen-ui/mcq/mcq-req";
import NoteGeneratorForm from "@/components/gen-ui/notes/note-generation-form";
import NoteRequst from "@/components/gen-ui/notes/note-req";
import ChatRequst from "@/components/gen-ui/chat/chat-req";
import LessonPlanForm from "@/components/gen-ui/lession-plan/lession-form";
import LessionRequst from "@/components/gen-ui/lession-plan/lession-req";
import AssignmentForm from "@/components/gen-ui/assignment/assignment-form";
import AssignmentRequst from "@/components/gen-ui/assignment/assignment-req";
import ResumeAnalyzerForm from "@/components/gen-ui/resume/resume-form";
import ResumeAnalticsRequst from "@/components/gen-ui/resume/resume-req";

export const components: TamboComponent[] = [
  {
    component:MCQGeneratorForm,
    name:'MCQ-generator-form',
    description:'A component to collect the user input to generate mcq questions for practicing.',
    propsSchema:emptyPropsSchema
  },
  {
    component:MCQRequst,
    name:'MCQ-test',
    description:'A component for listing all MCQs and user can take this MCQ.',
    propsSchema:MCQListPropsSchema
  },
  {
    component:NoteGeneratorForm,
    name:'Note-generator-form',
    description:'A component to collect the user input to generate notes for studying.',
    propsSchema:emptyPropsSchema
  },
  {
    component:NoteRequst,
    name:'Note-display',
    description:'A component for displaying generated notes to the user.',
    propsSchema:notePropsSchema
  },
  {
    component:ChatRequst,
    name:"chat-interface",
    description:"A component to engage with an AI assistant for chatting and solving queries efficiently.",
    propsSchema:emptyPropsSchema,
  },
  {
    component:LessonPlanForm,
    name:"lesson-plan-form",
    description:"A component to collect user input to generate lesson plans for studying.",
    propsSchema:emptyPropsSchema,
  },
  {
    component:LessionRequst,
    name:"lesson-plan-display",
    description:"A component for displaying generated lesson plans to the user.",
    propsSchema:LessonPlanSchema,
  },
  {
    component:AssignmentForm,
    name:"assignment-form",
    description:"A component to collect user input to generate assignment which contains questions for practicing.",
    propsSchema:emptyPropsSchema,
  },
  {
    component:AssignmentRequst,
    name:"assignment-display",
    description:"A component for displaying generated assignment which contains question for practing.",
    propsSchema:assignmentSchema,
  },
  {
    component:ResumeAnalyzerForm,
    name:"resume-analyzer-form",
    description:"A component to upload resume and job description for analysis.",
    propsSchema:emptyPropsSchema,
  },
  {
    component:ResumeAnalticsRequst,
    name:"resume-analysis-display",
    description:"A component for displaying resume analysis result.",
    propsSchema:ResumeAnalysisSchema,
  }
];
