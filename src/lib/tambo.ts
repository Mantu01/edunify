import type { TamboComponent } from "@tambo-ai/react";
import { emptyPropsSchema, MCQListPropsSchema, notePropsSchema } from "./schema";
import MCQGeneratorForm from "@/components/gen-ui/mcq/mcq-form";
import MCQRequst from "@/components/gen-ui/mcq/mcq-req";
import NoteGeneratorForm from "@/components/gen-ui/notes/note-generation-form";
import NoteRequst from "@/components/gen-ui/notes/note-req";

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
  }
  
];
