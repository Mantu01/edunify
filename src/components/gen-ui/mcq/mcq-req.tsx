'use client'
import { useEffect, useState } from "react";
import { MCQListProps } from "@/lib/schema";
import { Badge } from "@/components/ui/badge";
import { ArrowRight } from "lucide-react";
import axios from'axios';
import { useUser } from "@clerk/nextjs";
import { useTamboCurrentMessage, useTamboThread } from "@tambo-ai/react";

const MCQRequst: React.FC<MCQListProps> = ({questionsLists,topic,difficulty,numberOfQuestions,timer}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [shouldMakeReq,setShouldMakeReq]=useState(false);
  const {user}=useUser();
  const { generationStage,thread } = useTamboThread();
  const message = useTamboCurrentMessage()

  useEffect(() => {
    const postMCQs = async () => {
      await axios.post("/api/mcq", {questionsLists,topic,difficulty,numberOfQuestions,timer,userId:user?.id},{withCredentials:true});
      setIsLoading(true);
    };
    if(generationStage!=='COMPLETE'){
      setShouldMakeReq(true);
    }
    if(generationStage==='COMPLETE' && shouldMakeReq){
      postMCQs();
    }
  }, [generationStage]);

  

  return (
    <div className="h-6 w-40 rounded-2xl cursor-pointer">
      <Badge variant='destructive' className="h-full px-4 py-1 bg-linear-to-r from-amber-500/20 to-orange-500/20 text-amber-800 border border-amber-300/50  font-medium flex items-center gap-2">
        Start Your MCQ <ArrowRight className="w-3 h-3" />
       </Badge> </div>
  );
};


export default MCQRequst;
