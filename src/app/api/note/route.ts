import connectDB from "@/config/db.config";
import { CategoryModel } from "@/models/category.model";
import { NoteModel } from "@/models/note.model";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req:NextRequest) {
  try {
    await connectDB();
    const uniqueId = req.nextUrl.searchParams.get('uniqueId');
    const note = await NoteModel.findOne({uniqueId});
    return NextResponse.json({ success: true, note },{ status: 200 });
  } catch (error) {
    console.log(error)
    return NextResponse.json({ success: false, message: "Failed to fetch MCQ lists" },{ status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    await connectDB();
    const body = await req.json();
    const {title,subject,content,depthLevel,noteType,userId,uniqueId}=body;
    if(!title || !subject || !content || !depthLevel || !noteType || !userId || !uniqueId){
      return NextResponse.json({ success: false, message: "Missing required fields" },{ status: 400 });
    }
    const noteExists=await NoteModel.findOne({uniqueId});
    if(noteExists){
      return NextResponse.json({ success: true },{ status: 200 });
    }
    const note=await NoteModel.create(body);
    const category=await CategoryModel.findOneAndUpdate(
      {topic: { $regex: `^${body.subject}$`, $options: "i" },type : "note"},
      {$addToSet: { mcqIds: note._id },
    }
  );
    if(!category){
      await CategoryModel.create({topic:subject, type : "MCQ", mcqIds:[note._id]});
    }
    return NextResponse.json({ success: true },{ status: 201 });
  } catch (error) {
    console.log(error)
    return NextResponse.json({ success: false, message: "Failed to save MCQ list" },{ status: 500 });
  }
}
