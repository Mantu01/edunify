import connectDB from "@/config/db.config";
import { CategoryModel } from "@/models/category.model";
import { MCQListModel } from "@/models/mcq.model";
import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";


export async function GET(req:NextRequest) {
  try {
    await connectDB();
    const {userId}= await auth();
    const page = req.nextUrl.searchParams.get('page');
    const mcqLists = await MCQListModel.find({$not: {userId}}).sort({ createdAt: -1 }).limit(10).skip(page ? (parseInt(page)-1)*10 : 0);
    return NextResponse.json({ success: true, mcqLists },{ status: 200 });
  } catch (error) {
    return NextResponse.json({ success: false, message: "Failed to fetch MCQ lists" },{ status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    await connectDB();
    const body = await req.json();
    const {questionsLists,topic,difficulty,numberOfQuestions,timer,userId,uniqueId}=body;
    console.log({topic,difficulty,numberOfQuestions,timer,userId,uniqueId})
    if(!questionsLists || !topic || !difficulty || !numberOfQuestions || !timer || !userId || !uniqueId){
      return NextResponse.json({ success: false, message: "Missing required fields" },{ status: 400 });
    }
    const mcqListExists=await MCQListModel.findOne({uniqueId});
    if(mcqListExists){
      return NextResponse.json({ success: true },{ status: 200 });
    }
    const mcqList=await MCQListModel.create(body);
    const category=await CategoryModel.findOneAndUpdate(
      {topic: { $regex: `^${topic}$`, $options: "i" },type : "mcq"},
      {$addToSet: { mcqIds: mcqList._id },
    }
  );
    if(!category){
      await CategoryModel.create({topic, type : "MCQ", mcqIds:[mcqList._id]});
    }
    return NextResponse.json({ success: true },{ status: 201 });
  } catch (error) {
    console.log(error)
    return NextResponse.json({ success: false, message: "Failed to save MCQ list" },{ status: 500 });
  }
}
