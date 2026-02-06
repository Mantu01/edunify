'use client'
import { useEffect, useRef } from "react";
import { AssignmentType } from "@/lib/schema";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Loader2 } from "lucide-react";
import axios from'axios';
import { useUser } from "@clerk/nextjs";
import { useTamboCurrentMessage, useTamboThread } from "@tambo-ai/react";
import { useRoom } from "@/contexts/room-context";

const AssignmentRequst: React.FC<AssignmentType> = ({subject, gradeLevel, topic, learningObjectives, difficultyLevel, questions,lastSubmissionHours}) => {
  const shouldMakeReq=useRef(false);

  const {fetchAssignmentById,isLoading,handleRoomIntialize}=useRoom();
  const {user}=useUser();
  const { generationStage } = useTamboThread();
  const message = useTamboCurrentMessage()

  useEffect(() => {
    const postAssignment = async () => {
      handleRoomIntialize({contentType:'assignment',data:{subject, gradeLevel, topic, learningObjectives, difficultyLevel, questions, lastSubmissionHours,uniqueId:message.id,createdAt:new Date(Date.now())}});
      await axios.post("/api/assignments", {subject, gradeLevel, topic, learningObjectives, difficultyLevel, questions, lastSubmissionHours,userId:user?.id,uniqueId:message.id},{withCredentials:true});
    };
    if(generationStage!=='COMPLETE'){
      shouldMakeReq.current=true;
    }
    if(generationStage==='COMPLETE' && shouldMakeReq.current){
      postAssignment();
    }
  }, [generationStage]);

  

  return (
    <div className="h-6 w-40 rounded-2xl cursor-pointer">
      <Badge onClick={()=>{
        if(!isLoading || generationStage=='COMPLETE')  fetchAssignmentById(message.id);
      }} variant='destructive' className="h-full px-4 py-1 bg-linear-to-r from-amber-500/20 to-orange-500/20 text-amber-800 border border-amber-300/50  font-medium flex items-center gap-2">
        {(isLoading || generationStage!=='COMPLETE')  ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Please wait
          </>
        ) : (
          <>
            Visit Assignment <ArrowRight className="w-3 h-3" />
          </>
        )}
       </Badge> </div>
  );
};


export default AssignmentRequst; 
