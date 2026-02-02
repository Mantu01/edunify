import { Schema, model, Types, models } from "mongoose";

export interface ICategory {
  _id: Types.ObjectId;
  topic: string;
  type: "mcq"| "note";
  mcqIds: Types.ObjectId[];
  assignmentIds: Types.ObjectId[];
  teachingPlanIds: Types.ObjectId[];
}

const categorySchema = new Schema<ICategory>(
  {
    topic: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },

    type: {
      type: String,
      enum:["mcq", "note"],
      required: true,
    },

    mcqIds: [
      {
        type: Schema.Types.ObjectId,
        ref: "MCQ",
      },
    ],

    assignmentIds: [
      {
        type: Schema.Types.ObjectId,
        ref: "Assignment",
      },
    ],

    teachingPlanIds: [
      {
        type: Schema.Types.ObjectId,
        ref: "TeachingPlan",
      },
    ],
  },
  { timestamps: true }
);

export const CategoryModel =
  models.Category || model<ICategory>("Category", categorySchema);
