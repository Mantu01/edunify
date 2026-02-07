"use client";

import { useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { useRoom } from "@/contexts/room-context";
import { Assignment } from "@/components/gen-ui/assignment/assignment";
import { Loader2 } from "lucide-react";

function AssignmentContent() {
  const searchParams = useSearchParams();
  const id = searchParams.get("id");
  const { fetchAssignmentById, assignment, isLoading } = useRoom();

  useEffect(() => {
    if (id) fetchAssignmentById(id,true);
  }, [id, fetchAssignmentById]);

  if (!id) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-amber-50/50">
        <p className="text-amber-800">Missing Assignment ID. Please use a valid link.</p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-amber-50/50">
        <Loader2 className="h-8 w-8 animate-spin text-amber-600" />
      </div>
    );
  }

  if (!assignment) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-amber-50/50">
        <p className="text-amber-800">Assignment not found.</p>
      </div>
    );
  }

  return <Assignment />;
}

export default function AssignmentPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-amber-50/50">
          <Loader2 className="h-8 w-8 animate-spin text-amber-600" />
        </div>
      }
    >
      <AssignmentContent />
    </Suspense>
  );
}
