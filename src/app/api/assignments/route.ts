import connectDB from "@/config/db.config";
import { AssignmentModel } from "@/models/assignment.model";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    await connectDB();
    const uniqueId = req.nextUrl.searchParams.get("uniqueId");
    if (uniqueId) {
      const assignment = await AssignmentModel.findOne({ uniqueId });
      return NextResponse.json({ success: true, assignment }, { status: 200 });
    }
    const assignments = await AssignmentModel.find({}).sort({ createdAt: -1 });
    return NextResponse.json({ success: true, assignments }, { status: 200 });
  } catch {
    return NextResponse.json({ success: false, message: "Failed to fetch assignments" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    await connectDB();
    const body = await req.json();
    const { subject, gradeLevel, topic, learningObjectives, difficultyLevel, questions, lastSubmissionHours, userId, uniqueId } = body;
    if (!subject || !gradeLevel || !topic || !learningObjectives || !difficultyLevel || !questions || !lastSubmissionHours || !userId || !uniqueId) {
      return NextResponse.json({ success: false, message: "Missing required fields" }, { status: 400 });
    }
    const assignmentExists = await AssignmentModel.findOne({ uniqueId });
    if (assignmentExists) {
      return NextResponse.json({ success: true }, { status: 200 });
    }
    await AssignmentModel.create(body);
    return NextResponse.json({ success: true }, { status: 201 });
  } catch (err) {
    console.log(err)
    return NextResponse.json({ success: false, message: "Failed to save assignment" }, { status: 500 });
  }
}
