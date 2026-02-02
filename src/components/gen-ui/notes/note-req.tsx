'use client'
import { useEffect, useState } from "react";
import { NoteProps } from "@/lib/schema";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Loader2 } from "lucide-react";
import axios from'axios';
import { useUser } from "@clerk/nextjs";
import { useTamboCurrentMessage, useTamboThread } from "@tambo-ai/react";
import { useRoom } from "@/contexts/room-context";

const NoteRequst: React.FC<NoteProps> = ({title,subject,content,depthLevel,noteType}) => {
  const [shouldMakeReq,setShouldMakeReq]=useState(false);

  const {fetchNoteById,isLoading,handleRoomIntialize}=useRoom();
  const {user}=useUser();
  const { generationStage } = useTamboThread();
  const message = useTamboCurrentMessage()
  console.log({content})

  const postNotes = async () => {
    handleRoomIntialize({contentType:'note',data:{content,depthLevel,noteType,subject,title,uniqueId:message.id}});
    await axios.post("/api/note", {title,subject,content,depthLevel,noteType,userId:user?.id,uniqueId:message.id},{withCredentials:true});
  };
  useEffect(() => {
    if(generationStage!=='COMPLETE'){
      setShouldMakeReq(true);
    }
    if(generationStage==='COMPLETE' && shouldMakeReq){
      postNotes();
    }
  }, [generationStage]);

  

  return (
    <div className="h-6 w-40 rounded-2xl cursor-pointer">
      <Badge onClick={()=>{
        if(!isLoading || generationStage=='COMPLETE')  fetchNoteById(message.id);
      }} variant='destructive' className="h-full px-4 py-1 bg-linear-to-r from-amber-500/20 to-orange-500/20 text-amber-800 border border-amber-300/50  font-medium flex items-center gap-2">
        {(isLoading || generationStage!=='COMPLETE') ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Please wait
          </>
        ) : (
          <>
            Your Note <ArrowRight className="w-3 h-3" />
          </>
        )}
       </Badge> </div>
  );
};


export default NoteRequst;
