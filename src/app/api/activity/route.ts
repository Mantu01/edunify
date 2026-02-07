import connectDB from "@/config/db.config";
import { AssignmentModel } from "@/models/assignment.model";
import { MCQListModel } from "@/models/mcq.model";
import { NoteModel } from "@/models/note.model";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }
    await connectDB();

    const [mcqs, assignments, notes] = await Promise.all([
      MCQListModel.find({ userId }).sort({ _id: -1 }).limit(20).lean(),
      AssignmentModel.find({ userId }).sort({ createdAt: -1 }).limit(20).lean(),
      NoteModel.find({ userId }).sort({ _id: -1 }).limit(20).lean()
    ]);

    const mapMcq = (m: { uniqueId: string; topic: string; difficulty: string; numberOfQuestions: number; _id: { getTimestamp: () => Date } }) => ({
      type: "mcq",
      id: m.uniqueId,
      title: m.topic,
      difficulty: m.difficulty,
      count: m.numberOfQuestions,
      date: m._id?.getTimestamp?.() || new Date()
    });

    const mapAssignment = (a: { uniqueId: string; topic: string; subject: string; difficultyLevel: string; questions?: unknown[]; createdAt?: Date }) => ({
      type: "assignment",
      id: a.uniqueId,
      title: a.topic,
      subject: a.subject,
      difficulty: a.difficultyLevel,
      count: Array.isArray(a.questions) ? a.questions.length : 0,
      date: a.createdAt || new Date()
    });

    const mapNote = (n: { uniqueId: string; title: string; subject: string; depthLevel: string; noteType: string; _id: { getTimestamp: () => Date } }) => ({
      type: "note",
      id: n.uniqueId,
      title: n.title,
      subject: n.subject,
      depthLevel: n.depthLevel,
      noteType: n.noteType,
      date: n._id?.getTimestamp?.() || new Date()
    });

    const activities = [
      ...mcqs.map(mapMcq),
      ...assignments.map(mapAssignment),
      ...notes.map(mapNote)
    ].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).slice(0, 30);

    return NextResponse.json({ success: true, activities }, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ success: false, message: "Failed to fetch activity" }, { status: 500 });
  }
}
