"use client";

import { useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { useRoom } from "@/contexts/room-context";
import NoteDisplay from "@/components/gen-ui/notes/note-preview";
import { Loader2 } from "lucide-react";

function NoteContent() {
  const searchParams = useSearchParams();
  const id = searchParams.get("id");
  const { fetchNoteById, note, isLoading } = useRoom();

  useEffect(() => {
    if (id) fetchNoteById(id,true);
  }, [id, fetchNoteById]);

  if (!id) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-amber-50/50">
        <p className="text-amber-800">Missing Note ID. Please use a valid link.</p>
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

  if (!note) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-amber-50/50">
        <p className="text-amber-800">Note not found.</p>
      </div>
    );
  }

  return <NoteDisplay />;
}

export default function NotePage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center p-10 bg-amber-50/50">
          <Loader2 className="h-8 w-8 animate-spin text-amber-600" />
        </div>
      }
    >
      <NoteContent />
    </Suspense>
  );
}
