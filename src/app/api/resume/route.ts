import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { z } from "zod";
import mongoose from "mongoose";
import { ResumeAnalysisModel } from "@/models/resume.model";

const TipSchema = z.object({
  type: z.enum(["good", "improve"]),
  explanation: z.string(),
  tip: z.string()
});

const SectionSchema = z.object({
  score: z.number(),
  tips: z.array(TipSchema)
});

const ResumeAnalysisValidationSchema = z.object({
  uniqueId: z.string(),
  ats: SectionSchema,
  content: SectionSchema,
  skills: SectionSchema,
  structure: SectionSchema,
  toneStyle: SectionSchema,
  overallScore: z.number()
});

async function connectDB() {
  if (mongoose.connection.readyState === 0) {
    await mongoose.connect(process.env.MONGODB_URI as string);
  }
}

export async function GET(req: NextRequest) {
  try {
    await connectDB();
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const uniqueId = searchParams.get("uniqueId");

    if (uniqueId) {
      const analysis = await ResumeAnalysisModel.findOne({ uniqueId, userId });
      return NextResponse.json(analysis);
    }

    const analyses = await ResumeAnalysisModel.find({ userId }).select("uniqueId overallScore createdAt");
    return NextResponse.json(analyses);
  } catch (error) {
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const parsed = ResumeAnalysisValidationSchema.parse(body);

    const analysis = await ResumeAnalysisModel.create({
      ...parsed,
      userId
    });

    return NextResponse.json(analysis, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}
