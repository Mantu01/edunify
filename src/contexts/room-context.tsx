import { AssignmentType, LessonPlanType, MCQListProps, NoteProps, ResumeAnalysisType } from "@/lib/schema";
import axios from "axios";
import { createContext, ReactNode, useContext, useState } from "react";
import { toast } from "sonner";

type InitializePayload =
  | {contentType: "mcq";data: MCQProps;}
  | {contentType: "note";data: NoteProp;}
  | {contentType: "lession_plan";data: LessionPlanProp;}
  | {contentType: "assignment";data: AssignmentProp;}
  | {contentType:"resume" ; data:ResumeAnalysisProp}

type ContentType = 'default' | 'mcq' | 'note' | 'resume' | 'study_plan' | 'chat' | 'lession_plan' | 'assignment';
type MCQProps = MCQListProps & {uniqueId:string} | undefined;
type NoteProp = NoteProps & {uniqueId:string} | undefined;
type LessionPlanProp=LessonPlanType & {uniqueId:string} | undefined;
type AssignmentProp=AssignmentType & {uniqueId:string, createdAt?:Date} | undefined;
type ResumeAnalysisProp=ResumeAnalysisType & {uniqueId:string, createdAt?:Date} | undefined;

interface RoomContextType{
  currentState: ContentType;
  isLoading:boolean;
  mcqs:MCQProps;
  note:NoteProp;
  lessionPlan:LessionPlanProp;
  assignment:AssignmentProp;
  resumeAnalysis:ResumeAnalysisProp;

  handleRoomIntialize:(promps: InitializePayload)=>void;
  setCurrentState:(value:ContentType)=>void;
  fetchMcqById:(uniqueId:string,keepStateSame?:boolean)=>void;
  fetchNoteById:(uniqueId:string,keepStateSame?:boolean)=>void;
  fetchLessionById:(uniqueId:string,keepStateSame?:boolean)=>void;
  fetchAssignmentById:(uniqueId:string,keepStateSame?:boolean)=>void;
  fetchResumeAnalysisById:(uniqueId:string,keepStateSame?:boolean)=>void;
}

const RoomContext=createContext<RoomContextType|undefined>(undefined);

export const RoomProvider=({ children }: { children: ReactNode }) => {
  const [currentState,setCurrentState]=useState<ContentType>('default');
  const [isLoading,setIsLoading]=useState<boolean>(false);
  const [mcqs,setMcqs]=useState<MCQProps>();
  const [note,setNote]=useState<NoteProp>();
  const [lessionPlan,setLessionPlan]=useState<LessionPlanProp>();
  const [assignment,setAssignment]=useState<AssignmentProp>();
  const [resumeAnalysis,setResumeAnalysis]=useState<ResumeAnalysisProp>();

  const handleRoomIntialize=({ contentType, data }: InitializePayload)=>{
    setCurrentState(contentType);
    if(contentType==='mcq'){
      setMcqs(data);
    }else if(contentType==='note'){
      setNote(data)
    }else if(contentType==='lession_plan'){
      setLessionPlan(data);
    }else if(contentType==='assignment'){
      setAssignment(data);
    }else if (contentType==='resume'){
      setResumeAnalysis(data);
    }
  };

  const fetchNoteById=async(uniqueId:string,keepStateSame?:boolean)=>{
    if(!keepStateSame){
      setCurrentState('note');
    }
    if(uniqueId===note?.uniqueId)  return;
    setIsLoading(true);
    try {
      if (!uniqueId) {
        toast.error('Invalid MCQ ID');
        return;
      }
      const { data } = await axios.get(`/api/note?uniqueId=${uniqueId}`);
      setNote(data.note)
    } catch (error: any) {
      console.error('MCQ Fetch Error:', error);
      toast.error(
        error?.response?.data?.message || 'Failed to fetch MCQs',
        { id: 'mcq-fetch' }
      );
    }finally{
      setIsLoading(false);
    }
  };

  const fetchMcqById = async (uniqueId: string,keepStateSame?:boolean) => {
    if(!keepStateSame){
      setCurrentState('mcq');
    }
    if(uniqueId===mcqs?.uniqueId)  return;
    setIsLoading(true);
    try {
      if (!uniqueId) {
        toast.error('Invalid MCQ ID');
        return;
      }
      const { data } = await axios.get(`/api/mcq/me?uniqueId=${uniqueId}`);
      setMcqs(data.mcqLists)
    } catch (error: any) {
      console.error('MCQ Fetch Error:', error);
      toast.error(
        error?.response?.data?.message || 'Failed to fetch MCQs',
        { id: 'mcq-fetch' }
      );
    }finally{
      setIsLoading(false);
    }
  };

  const fetchLessionById = async (uniqueId: string,keepStateSame?:boolean) => {
    if(!keepStateSame){
      setCurrentState('lession_plan');
    }
    if(uniqueId===lessionPlan?.uniqueId)  return;
    setIsLoading(true);
    try {
      if (!uniqueId) {
        toast.error('Invalid MCQ ID');
        return;
      }
      const { data } = await axios.get(`/api/lession?uniqueId=${uniqueId}`);
      setLessionPlan(data)
    } catch (error: any) {
      console.error('Lession Fetch Error:', error);
      toast.error(
        error?.response?.data?.message || 'Failed to fetch lessions',
        { id: 'lession-fetch' }
      );
    }finally{
      setIsLoading(false);
    }
  };

  const fetchAssignmentById = async (uniqueId: string,keepStateSame?:boolean) => {
    if(!keepStateSame){
      setCurrentState('assignment');
    }
    if(uniqueId===assignment?.uniqueId)  return;
    setIsLoading(true);
    try {
      if (!uniqueId) {
        toast.error('Invalid Assignment ID');
        return;
      }
      const { data } = await axios.get(`/api/assignments?uniqueId=${uniqueId}`);
      setAssignment(data.assignment)
    } catch (error: any) {
      console.error('Assignment Fetch Error:', error);
      toast.error(
        error?.response?.data?.message || 'Failed to fetch assignments',
        { id: 'assignment-fetch' }
      );
    }finally{
      setIsLoading(false);
    }
  };

  const fetchResumeAnalysisById = async (uniqueId: string,keepStateSame?:boolean) => {
    if(!keepStateSame){
      setCurrentState('resume');
    }
    if(uniqueId===assignment?.uniqueId)  return;
    setIsLoading(true);
    try {
      if (!uniqueId) {
        toast.error('Invalid Resume ID');
        return;
      }
      const { data } = await axios.get(`/api/resume?uniqueId=${uniqueId}`);
      setResumeAnalysis(data)
    } catch (error: any) {
      console.error('Resume Fetch Error:', error);
      toast.error(
        error?.response?.data?.message || 'Failed to fetch Resumes',
        { id: 'resume-fetch' }
      );
    }finally{
      setIsLoading(false);
    }
  };

  return (
    <RoomContext.Provider value={{
      currentState,
      setCurrentState,
      isLoading,
      mcqs,
      note,
      lessionPlan,
      assignment,
      resumeAnalysis,
      handleRoomIntialize,
      fetchMcqById,
      fetchNoteById,
      fetchLessionById,
      fetchAssignmentById,
      fetchResumeAnalysisById
    }} >
      {children}
    </RoomContext.Provider>
  );
};

export function useRoom():RoomContextType{
  const context=useContext(RoomContext);
  if(!context){
    throw new Error("useRoom must be used within RoomProvider");
  }
  return context;
}