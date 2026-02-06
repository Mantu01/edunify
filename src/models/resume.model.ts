import { Schema, model, Document, models } from "mongoose";

export type TipType = "good" | "improve";

export interface ITip {
  type: TipType;
  explanation: string;
  tip: string;
}

export interface ISection {
  score: number;
  tips: ITip[];
}

export interface IResumeAnalysis extends Document {
  uniqueId: string;
  userId: string;
  ats: ISection;
  content: ISection;
  skills: ISection;
  structure: ISection;
  toneStyle: ISection;
  overallScore: number;
}

const TipSchema = new Schema<ITip>({
  type: { type: String, enum: ["good", "improve"], required: true },
  explanation: { type: String, required: true },
  tip: { type: String, required: true }
});

const SectionSchema = new Schema<ISection>({
  score: { type: Number, required: true },
  tips: { type: [TipSchema], required: true }
});

const ResumeAnalysisSchema = new Schema<IResumeAnalysis>({
  uniqueId: { type: String, required: true, unique: true },
  userId: { type: String, required: true, },
  ats: { type: SectionSchema, required: true },
  content: { type: SectionSchema, required: true },
  skills: { type: SectionSchema, required: true },
  structure: { type: SectionSchema, required: true },
  toneStyle: { type: SectionSchema, required: true },
  overallScore: { type: Number, required: true }
},{timestamps: true});

export const ResumeAnalysisModel = models.ResumeAnalysis || model<IResumeAnalysis>("ResumeAnalysis", ResumeAnalysisSchema);
