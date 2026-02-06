'use client'

import { useRoom } from "@/contexts/room-context";
import MCQList from "../gen-ui/mcq/mcq-list";
import RolePage from "./default";
import NoteDisplay from "../gen-ui/notes/note-preview";
import StudyPlanForm from "../gen-ui/study-plan/study-plan-form";
import Chat from "../gen-ui/chat/chat";
import LessonPlanComponent from "../gen-ui/lession-plan/lession-plan-info";
import { Assignment } from "../gen-ui/assignment/assignment";
import ResumePage from "../gen-ui/resume/resume-page";


export const RoomPage = () => {
  const {currentState}=useRoom();

  if (currentState === "mcq") return <MCQList/>;
  if(currentState==='note')   return <NoteDisplay/> ;
  if(currentState==='resume') return <ResumePage/>
  if(currentState==='study_plan') return <StudyPlanForm/>
  if(currentState==='chat')  return <Chat/>
  if(currentState==='lession_plan') return <LessonPlanComponent/>
  if(currentState==='assignment')  return <Assignment/>

  return <RolePage/> ;
};

export const MOCK_ANALYSIS_DATA = {
  overallScore: 78,
  ats: {
    score: 72,
    tips: [
      {
        type: "good",
        explanation: "Proper use of standard section headers",
        tip: "Your section headers like 'Experience', 'Education', and 'Skills' are ATS-friendly"
      },
      {
        type: "improve",
        explanation: "Missing keywords from job description",
        tip: "Incorporate specific job title keywords 3-4 times throughout the resume"
      },
      {
        type: "improve",
        explanation: "Complex formatting detected",
        tip: "Remove tables and columns as they can confuse ATS parsers"
      },
      {
        type: "good",
        explanation: "Clean bullet point structure",
        tip: "Current bullet format is easily parsed by most ATS systems"
      }
    ]
  },
  content: {
    score: 85,
    tips: [
      {
        type: "good",
        explanation: "Strong action-oriented language",
        tip: "Using verbs like 'orchestrated', 'engineered', and 'optimized' adds impact"
      },
      {
        type: "good",
        explanation: "Quantifiable achievements present",
        tip: "Metrics like 'increased efficiency by 30%' make your accomplishments credible"
      },
      {
        type: "improve",
        explanation: "Some sections lack depth",
        tip: "Expand on leadership roles with specific challenges and outcomes"
      },
      {
        type: "improve",
        explanation: "Recent experience gaps",
        tip: "Consider adding volunteer work or projects to fill employment gaps"
      }
    ]
  },
  skills: {
    score: 80,
    tips: [
      {
        type: "good",
        explanation: "Technical skills well-categorized",
        tip: "Grouping skills by proficiency level helps recruiters quickly assess capabilities"
      },
      {
        type: "good",
        explanation: "Relevant certifications included",
        tip: "Certifications validate your skills and show commitment to professional development"
      },
      {
        type: "improve",
        explanation: "Missing emerging technologies",
        tip: "Add skills in trending areas like AI/ML tools or cloud platforms to stay competitive"
      },
      {
        type: "improve",
        explanation: "Soft skills under-represented",
        tip: "Include leadership, communication, and problem-solving skills with specific examples"
      }
    ]
  },
  structure: {
    score: 75,
    tips: [
      {
        type: "good",
        explanation: "Logical chronological order",
        tip: "Reverse chronological format is industry standard and easy to follow"
      },
      {
        type: "good",
        explanation: "Appropriate length for experience level",
        tip: "Two-page resume is acceptable for 5+ years of experience"
      },
      {
        type: "improve",
        explanation: "Inconsistent spacing",
        tip: "Standardize margins and spacing between sections for better readability"
      },
      {
        type: "improve",
        explanation: "Education section placement",
        tip: "Move education to the end if you have 3+ years of professional experience"
      }
    ]
  },
  toneStyle: {
    score: 82,
    tips: [
      {
        type: "good",
        explanation: "Professional yet approachable tone",
        tip: "Balancing formal language with personal achievements creates a good impression"
      },
      {
        type: "good",
        explanation: "Consistent verb tense usage",
        tip: "Using past tense for previous roles and present tense for current role is correct"
      },
      {
        type: "improve",
        explanation: "Overuse of jargon",
        tip: "Replace technical jargon with accessible language for non-technical readers"
      },
      {
        type: "improve",
        explanation: "Passive voice in some descriptions",
        tip: "Convert 'was responsible for' to 'managed' or 'led' for stronger impact"
      }
    ]
  }
};