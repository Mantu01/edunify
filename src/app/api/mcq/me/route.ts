import connectDB from "@/config/db.config";
import { MCQListModel } from "@/models/mcq.model";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req:NextRequest) {
  try {
    await connectDB();
    const uniqueId = req.nextUrl.searchParams.get('uniqueId');
    const mcqLists = await MCQListModel.findOne({uniqueId});
    return NextResponse.json({ success: true, mcqLists },{ status: 200 });
  } catch (error) {
    console.log(error)
    return NextResponse.json({ success: false, message: "Failed to fetch MCQ lists" },{ status: 500 });
  }
}