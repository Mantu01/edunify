'use client'

import { MCQListProps, NoteProps } from "@/lib/schema";
import axios from "axios";
import { createContext, ReactNode, useContext, useState } from "react";
import { toast } from "sonner";

type ContentType = 'default' | 'mcq' | 'note';
type MCQProps = MCQListProps & {uniqueId:string} | undefined;
type NoteProp = NoteProps & {uniqueId:string} | undefined;
type InitializePayload = | { contentType: 'mcq'; data: MCQProps } | { contentType: 'note'; data: NoteProp };

interface RoomContextType{
  currentState: ContentType;
  isLoading:boolean;
  mcqs:MCQProps;
  note:NoteProp;

  fetchMcqById:(uniqueId:string)=>void;
  fetchNoteById:(uniqueId:string)=>void;
  handleRoomIntialize:({ contentType, data }: InitializePayload)=>void;
}

const RoomContext=createContext<RoomContextType|undefined>(undefined);

export const RoomProvider=({ children }: { children: ReactNode }) => {
  const [currentState,setCurrentState]=useState<ContentType>('default');
  const [isLoading,setIsLoading]=useState<boolean>(false);
  const [mcqs,setMcqs]=useState<MCQProps>();
  const [note,setNote]=useState<NoteProp>();

  const handleRoomIntialize=({ contentType, data }: InitializePayload)=>{
    setCurrentState(contentType);
    if(contentType==='mcq'){
      setMcqs(data);
    }else if(contentType==='note'){
      setNote(data)
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

  return (
    <RoomContext.Provider value={{
      currentState,
      isLoading,
      mcqs,
      note,
      handleRoomIntialize,
      fetchMcqById,
      fetchNoteById
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