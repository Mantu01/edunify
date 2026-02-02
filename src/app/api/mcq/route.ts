import connectDB from "@/config/db.config";
import { MCQListModel } from "@/models/mcq.model";
import { NextResponse } from "next/server";


export async function POST(req: Request) {
  try {
    await connectDB();
    const body = await req.json();
    await MCQListModel.create(body);
    return NextResponse.json({ success: true },{ status: 201 });
  } catch (error) {
    console.log(error)
    return NextResponse.json({ success: false, message: "Failed to save MCQ list" },{ status: 500 });
  }
}
