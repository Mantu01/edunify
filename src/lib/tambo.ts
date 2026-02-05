import type { TamboComponent } from "@tambo-ai/react";
import { emptyPropsSchema, MCQListPropsSchema, notePropsSchema, LessonPlanSchema } from "./schema";
import MCQGeneratorForm from "@/components/gen-ui/mcq/mcq-form";
import MCQRequst from "@/components/gen-ui/mcq/mcq-req";
import NoteGeneratorForm from "@/components/gen-ui/notes/note-generation-form";
import NoteRequst from "@/components/gen-ui/notes/note-req";
import ResumeGeneratorForm from "@/components/gen-ui/resume/resume-form";
import ChatRequst from "@/components/gen-ui/chat/chat-req";
import LessonPlanForm from "@/components/gen-ui/lession-plan/lession-form";
import LessionRequst from "@/components/gen-ui/lession-plan/lession-req";
import AssignmentForm from "@/components/gen-ui/assignment/assignment-form";

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
    component:ResumeGeneratorForm,
    name:'Resume-generator-form',
    description:'A component to collect the user input to generate resume.',
    propsSchema:emptyPropsSchema
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
    description:"A component to collect user input to generate assignment for practicing.",
    propsSchema:emptyPropsSchema,
  }
];
