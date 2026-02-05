import connectDB from "@/config/db.config";
import { LessonPlanModel } from "@/models/lession.model";
import { NextRequest, NextResponse } from "next/server";


export async function GET(req:NextRequest) {
  try {
    await connectDB();
    const uniqueId = req.nextUrl.searchParams.get('uniqueId');
    const lessonPlan = await LessonPlanModel.findOne({uniqueId});

    if (!lessonPlan) {
      return NextResponse.json(
        { error: "Lesson plan not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(lessonPlan);
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Failed to fetch lesson plan" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    await connectDB();
    const body = await req.json();
    const {assessment,differentiation,homework,keyTopics,learningObjectives,lessonFlow,materialsAndResources,overview,userId,uniqueId}=body;
    if(!assessment || !differentiation || !homework || !keyTopics || !learningObjectives || !lessonFlow || !overview || !userId || !uniqueId){
      return NextResponse.json({ error: "Missing required fields" },{ status: 400 });
    }

    const lessonPlanExists=await LessonPlanModel.findOne({uniqueId});
    if(lessonPlanExists){
      return NextResponse.json({ message: "Lesson plan already exists" },{ status: 200 });
    }

    if (!body?.overview?.subject || !body?.overview?.gradeLevel) {
      return NextResponse.json(
        { error: "Missing required overview fields" },
        { status: 400 }
      );
    }

    if (!Array.isArray(body.learningObjectives) || body.learningObjectives.length === 0) {
      return NextResponse.json(
        { error: "Learning objectives are required" },
        { status: 400 }
      );
    }

    const lessonPlan = await LessonPlanModel.create(body);
    return NextResponse.json(lessonPlan, { status: 201 });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Failed to create lesson plan" },
      { status: 500 }
    );
  }
}
