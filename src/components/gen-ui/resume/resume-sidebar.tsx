import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { FileText, TrendingUp } from "lucide-react";
import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "sonner";
import { useRoom } from "@/contexts/room-context";

interface RecentProps {
  uniqueId:string;
  overallScore:number;
  createdAt:Date;
}

export function Sidebar() {
  const getScoreColor = (score: number) => {
    if (score >= 85) return "text-green-600";
    if (score >= 70) return "text-yellow-600";
    return "text-red-600";
  };

  useEffect(()=>{
    const fetchResume=async()=>{
      try {
        const {data}=await axios.get('/api/resume',{withCredentials:true});
        setRecentAnalytics(data);
      } catch (error) {
        toast.error('Something got wrong');
      }
    };
    fetchResume();
  },[]);

  const [recentAnalytics,setRecentAnalytics]=useState<RecentProps[]>([]);
  const {fetchResumeAnalysisById}=useRoom();

  return (
    <div className="h-full flex flex-col">
      <Card className="border-r-0 rounded-r-none h-full flex flex-col">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-lg">
            <TrendingUp className="h-5 w-5" />
            Recent Analytics
          </CardTitle>
        </CardHeader>
        <ScrollArea className="flex-1 px-4">
          <CardContent className="p-0 pb-4 space-y-4">
            {recentAnalytics?.map((analytic,idx) => (
              <Card key={analytic.uniqueId} className="cursor-pointer hover:shadow-md transition-shadow">
                <CardContent onClick={()=>fetchResumeAnalysisById(analytic.uniqueId)} className="p-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3">
                      <FileText className="h-5 w-5 text-gray-400 mt-0.5" />
                      <div className="space-y-1">
                        <p className="text-sm font-medium leading-none">Analytic - :{idx}</p>
                        <p className="text-xs text-gray-500">{new Date(analytic.createdAt).toDateString()}</p>
                      </div>
                    </div>
                    <Badge 
                      variant="secondary" 
                      className={`font-semibold ${getScoreColor(analytic.overallScore)}`}
                    >
                      {analytic.overallScore}%
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            ))}
          </CardContent>
        </ScrollArea>
      </Card>
    </div>
  );
}