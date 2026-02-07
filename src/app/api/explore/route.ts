import connectDB from "@/config/db.config";
import { AssignmentModel } from "@/models/assignment.model";
import { MCQListModel } from "@/models/mcq.model";
import { NoteModel } from "@/models/note.model";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    await connectDB();
    const type = req.nextUrl.searchParams.get("type");
    const difficulty = req.nextUrl.searchParams.get("difficulty");
    const subject = req.nextUrl.searchParams.get("subject");
    const search = req.nextUrl.searchParams.get("search");

    const typeFilter = type && ["mcq", "assignment", "note"].includes(type) ? type : null;
    const difficultyFilter = difficulty && ["easy", "medium", "hard"].includes(difficulty) ? difficulty : null;
    const subjectFilter = subject?.trim() || null;
    const searchFilter = search?.trim() || null;

    const buildMcqQuery = () => {
      const q: Record<string, unknown> = {};
      if (difficultyFilter) q.difficulty = difficultyFilter;
      if (subjectFilter) q.topic = { $regex: subjectFilter, $options: "i" };
      if (searchFilter) q.$or = [{ topic: { $regex: searchFilter, $options: "i" } }];
      return q;
    };

    const buildAssignmentQuery = () => {
      const q: Record<string, unknown> = {};
      if (difficultyFilter) q.difficultyLevel = difficultyFilter;
      if (subjectFilter) q.subject = { $regex: subjectFilter, $options: "i" };
      if (searchFilter) q.$or = [
        { subject: { $regex: searchFilter, $options: "i" } },
        { topic: { $regex: searchFilter, $options: "i" } }
      ];
      return q;
    };

    const buildNoteQuery = () => {
      const q: Record<string, unknown> = {};
      if (subjectFilter) q.subject = { $regex: subjectFilter, $options: "i" };
      if (searchFilter) q.$or = [
        { subject: { $regex: searchFilter, $options: "i" } },
        { title: { $regex: searchFilter, $options: "i" } }
      ];
      return q;
    };

    const fetchAll = !typeFilter;
    const fetchMcq = fetchAll || typeFilter === "mcq";
    const fetchAssignment = fetchAll || typeFilter === "assignment";
    const fetchNote = fetchAll || typeFilter === "note";

    const [mcqs, assignments, notes] = await Promise.all([
      fetchMcq ? MCQListModel.find(buildMcqQuery()).sort({ _id: -1 }).lean() : [],
      fetchAssignment ? AssignmentModel.find(buildAssignmentQuery()).sort({ createdAt: -1 }).lean() : [],
      fetchNote ? NoteModel.find(buildNoteQuery()).sort({ _id: -1 }).lean() : []
    ]);

    const mcqItems = mcqs.map((m: { uniqueId: string; topic: string; difficulty: string; numberOfQuestions: number }) => ({
      type: "mcq",
      id: m.uniqueId,
      title: m.topic,
      difficulty: m.difficulty,
      count: m.numberOfQuestions
    }));

    const assignmentItems = assignments.map((a: { uniqueId: string; topic: string; subject: string; difficultyLevel: string; questions?: unknown[] }) => ({
      type: "assignment",
      id: a.uniqueId,
      title: a.topic,
      subject: a.subject,
      difficulty: a.difficultyLevel,
      count: Array.isArray(a.questions) ? a.questions.length : 0
    }));

    const noteItems = notes.map((n: { uniqueId: string; title: string; subject: string; depthLevel: string; noteType: string }) => ({
      type: "note",
      id: n.uniqueId,
      title: n.title,
      subject: n.subject,
      depthLevel: n.depthLevel,
      noteType: n.noteType
    }));

    return NextResponse.json({
      success: true,
      mcqs: mcqItems,
      assignments: assignmentItems,
      notes: noteItems
    }, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ success: false, message: "Failed to fetch explore data" }, { status: 500 });
  }
}
