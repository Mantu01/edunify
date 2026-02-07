"use client";

import { useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { useRoom } from "@/contexts/room-context";
import MCQList from "@/components/gen-ui/mcq/mcq-list";
import { Loader2 } from "lucide-react";

function MCQContent() {
  const searchParams = useSearchParams();
  const id = searchParams.get("id");
  const { fetchMcqById, mcqs, isLoading } = useRoom();

  useEffect(() => {
    if (id) fetchMcqById(id,true);
  }, [id, fetchMcqById]);

  if (!id) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-amber-50/50">
        <p className="text-amber-800">Missing MCQ ID. Please use a valid link.</p>
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

  if (!mcqs) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-amber-50/50">
        <p className="text-amber-800">MCQ not found.</p>
      </div>
    );
  }

  return <MCQList />;
}

export default function MCQPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-amber-50/50">
          <Loader2 className="h-8 w-8 animate-spin text-amber-600" />
        </div>
      }
    >
      <MCQContent />
    </Suspense>
  );
}
