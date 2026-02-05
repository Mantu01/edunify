import { LessonPlanType, MCQListProps, NoteProps } from "@/lib/schema";
import axios from "axios";
import { createContext, ReactNode, useContext, useState } from "react";
import { toast } from "sonner";

type InitializePayload =
  | {contentType: "mcq";data: MCQProps;}
  | {contentType: "note";data: NoteProp;}
  | {contentType: "lession_plan";data: LessionPlanProp;};

type ContentType = 'default' | 'mcq' | 'note' | 'resume' | 'study_plan' | 'chat' | 'lession_plan' | 'assignment';
type MCQProps = MCQListProps & {uniqueId:string} | undefined;
type NoteProp = NoteProps & {uniqueId:string} | undefined;
type LessionPlanProp=LessonPlanType & {uniqueId:string} | undefined;

interface RoomContextType{
  currentState: ContentType;
  isLoading:boolean;
  mcqs:MCQProps;
  note:NoteProp;
  lessionPlan:LessionPlanProp;

  handleRoomIntialize:(promps: InitializePayload)=>void;
  setCurrentState:(value:ContentType)=>void;
  fetchMcqById:(uniqueId:string)=>void;
  fetchNoteById:(uniqueId:string)=>void;
  fetchLessionById:(uniqueId:string)=>void;
}

const RoomContext=createContext<RoomContextType|undefined>(undefined);

export const RoomProvider=({ children }: { children: ReactNode }) => {
  const [currentState,setCurrentState]=useState<ContentType>('assignment');
  const [isLoading,setIsLoading]=useState<boolean>(false);
  const [mcqs,setMcqs]=useState<MCQProps>();
  const [note,setNote]=useState<NoteProp>();
  const [lessionPlan,setLessionPlan]=useState<LessionPlanProp>();

  const handleRoomIntialize=({ contentType, data }: InitializePayload)=>{
    setCurrentState(contentType);
    if(contentType==='mcq'){
      setMcqs(data);
    }else if(contentType==='note'){
      setNote(data)
    }else if(contentType==='lession_plan'){
      setLessionPlan(data);
    }
  };

  const fetchNoteById=async(uniqueId:string)=>{
    if(uniqueId===mcqs?.uniqueId)  return;
    setIsLoading(true);
    try {
      if (!uniqueId) {
        toast.error('Invalid MCQ ID');
        return;
      }
      const { data } = await axios.get(`/api/note?uniqueId=${uniqueId}`);
      setCurrentState('note');
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

  const fetchMcqById = async (uniqueId: string) => {
    if(uniqueId===mcqs?.uniqueId)  return;
    setIsLoading(true);
    try {
      if (!uniqueId) {
        toast.error('Invalid MCQ ID');
        return;
      }
      const { data } = await axios.get(`/api/mcq/me?uniqueId=${uniqueId}`);
      setCurrentState('mcq');
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

  const fetchLessionById = async (uniqueId: string) => {
    if(uniqueId===lessionPlan?.uniqueId)  return;
    setIsLoading(true);
    try {
      if (!uniqueId) {
        toast.error('Invalid MCQ ID');
        return;
      }
      const { data } = await axios.get(`/api/lession?uniqueId=${uniqueId}`);
      setCurrentState('lession_plan');
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

  return (
    <RoomContext.Provider value={{
      currentState,
      setCurrentState,
      isLoading,
      mcqs,
      note,
      lessionPlan,
      handleRoomIntialize,
      fetchMcqById,
      fetchNoteById,
      fetchLessionById
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