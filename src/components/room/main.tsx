'use client'

import { useRoom } from "@/contexts/room-context";
import MCQList from "../gen-ui/mcq/mcq-list";
import RolePage from "./default";
import NoteDisplay from "../gen-ui/notes/note-preview";
import ResumePreview from "../gen-ui/resume/resume-preview";
import StudyPlanForm from "../gen-ui/study-plan/study-plan-form";
import Chat from "../gen-ui/chat/chat";
import LessonPlanComponent from "../gen-ui/lession-plan/lession-plan-info";
import { Assignment } from "../gen-ui/assignment/assignment";


export const RoomPage = () => {
  const {currentState}=useRoom();

  if (currentState === "mcq") return <MCQList/>;
  if(currentState==='note')   return <NoteDisplay/> ;
  if(currentState==='resume') return <ResumePreview content="sf" isLoading userRole="founder" />
  if(currentState==='study_plan') return <StudyPlanForm/>
  if(currentState==='chat')  return <Chat/>
  if(currentState==='lession_plan') return <LessonPlanComponent/>
  if(currentState==='assignment')  return <Assignment data={mockAssignment}  />

  return <RolePage/> ;
};

const mockAssignment = {
  id: "assignment_001",
  subject: "Mathematics",
  gradeLevel: "Grade 5",
  topic: "Fractions",
  learningObjectives: [
    "Understand the concept of fractions",
    "Add and subtract fractions",
    "Compare fractions"
  ],
  difficultyLevel: "medium",
  questions: [
    {
      id: "q1",
      questionType: "multiple_choice",
      prompt: "What is 1/2 + 1/3?",
      options: ["5/6", "2/5", "3/4", "1/5"],
      correctAnswer: "5/6",
      marks: 5
    },
    {
      id: "q2",
      questionType: "short_answer",
      prompt: "Write the fraction equivalent of 0.75",
      correctAnswer: "3/4",
      marks: 3
    },
    {
      id: "q3",
      questionType: "long_answer",
      prompt: "Explain how to compare fractions with different denominators",
      evaluationGuidelines: "Look for understanding of finding common denominators and reasoning correctly",
      marks: 10
    },
    {
      id: "q4",
      questionType: "true_false",
      prompt: "1/4 is greater than 1/3",
      correctAnswer: false,
      marks: 2
    },
    {
      id: "q5",
      questionType: "fill_in_the_blanks",
      prompt: "The numerator of 7/8 is __ and the denominator is __",
      correctAnswers: ["7", "8"],
      marks: 4
    }
  ],
  totalMarks: 24,
  lastSubmissionAt: new Date("2026-02-10T23:59:00Z"),
  specialInstructions: "Use a pencil for all calculations and show your work.",
  createdAt: new Date("2026-02-05T10:00:00Z")
};
