"use client";
import { Card } from "@/components/ui/card";
import { AnalysisSection } from "./analysis-interface";
import { Sidebar } from "./resume-sidebar";
import { roleColors } from "@/lib/constants";
import { useAuth } from "@clerk/nextjs";


export default function ResumePage() {
  const {sessionClaims}=useAuth();
  
  const role = sessionClaims?.role as keyof typeof roleColors;
  return (
    <div className="h-175 bg-linear-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-950">
      <Card className="h-full overflow-hidden border shadow-lg">
        <div className="flex h-full">
          <div className="w-1/5 h-full">
            <Sidebar />
          </div>
          <div className="w-4/5 h-full border-l">
            <AnalysisSection userRole={role}/>
          </div>
        </div>
      </Card>
    </div>
  );
}