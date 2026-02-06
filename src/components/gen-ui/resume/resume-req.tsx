'use client'
import { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Loader2 } from "lucide-react";
import axios from'axios';
import { useTamboCurrentMessage, useTamboThread } from "@tambo-ai/react";
import { useRoom } from "@/contexts/room-context";
import { ResumeAnalysisType } from "@/lib/schema";

const ResumeAnalticsRequst: React.FC<ResumeAnalysisType> = ({ats,content,overallScore,skills,structure,toneStyle}) => {
  const [shouldMakeReq,setShouldMakeReq]=useState(false);

  const {fetchResumeAnalysisById,isLoading,handleRoomIntialize}=useRoom();
  const { generationStage } = useTamboThread();
  const message = useTamboCurrentMessage()
  console.log({content})

  const postResumeAnaltics = async () => {
    handleRoomIntialize({contentType:'resume',data:{ats,content,overallScore,skills,structure,toneStyle,uniqueId:message.id}});
    await axios.post("/api/resume", {ats,content,overallScore,skills,structure,toneStyle,uniqueId:message.id},{withCredentials:true});
  };
  useEffect(() => {
    if(generationStage!=='COMPLETE'){
      setShouldMakeReq(true);
    }
    if(generationStage==='COMPLETE' && shouldMakeReq){
      postResumeAnaltics();
    }
  }, [generationStage]);

  

  return (
    <div className="h-6 w-40 rounded-2xl cursor-pointer">
      <Badge onClick={()=>{
        if(!isLoading || generationStage=='COMPLETE')  fetchResumeAnalysisById(message.id);
      }} variant='destructive' className="h-full px-4 py-1 bg-linear-to-r from-amber-500/20 to-orange-500/20 text-amber-800 border border-amber-300/50  font-medium flex items-center gap-2">
        {(isLoading || generationStage!=='COMPLETE') ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Please wait
          </>
        ) : (
          <>
            Resume Analytics <ArrowRight className="w-3 h-3" />
          </>
        )}
       </Badge> </div>
  );
};


export default ResumeAnalticsRequst;
