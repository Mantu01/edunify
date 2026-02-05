'use client'
import { Badge } from "@/components/ui/badge";
import { useRoom } from "@/contexts/room-context";
import { useTamboThread } from "@tambo-ai/react";
import { ArrowRight } from "lucide-react";
import { useEffect } from "react";

const ChatRequst: React.FC = () => {
  const {setCurrentState}=useRoom();
  const {currentThread}=useTamboThread();
  useEffect(()=>{
    if(currentThread?.generationStage!=='COMPLETE'){
      setCurrentState('chat');
    }
  },[]);

  return (
    <div className="h-6 w-40 rounded-2xl cursor-pointer">
      <Badge onClick={()=>setCurrentState('chat')} variant='destructive' className="h-full px-4 py-1 bg-linear-to-r from-amber-500/20 to-orange-500/20 text-amber-800 border border-amber-300/50  font-medium flex items-center gap-2">
        start chatting <ArrowRight className="w-3 h-3" />
      </Badge>
    </div>
  );
};


export default ChatRequst; 