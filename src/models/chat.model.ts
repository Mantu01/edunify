import { Schema, model, Document, models } from "mongoose";

export enum Role {
  USER = "USER",
  ASSISTANT = "ASSISTANT",
  SYSTEM = "SYSTEM"
}

export interface IMessage {
  role: Role
  content: string
}

export interface IChat extends Document {
  header: string
  userId?: string
  messages: IMessage[]
  createdAt: Date
  updatedAt: Date
}

const MessageSchema = new Schema<IMessage>(
  {
    role: {
      type: String,
      enum: Object.values(Role),
      required: true
    },
    content: {
      type: String,
      required: true
    }
  }
)

const ChatSchema = new Schema<IChat>(
  {
    header: {
      type: String,
      default: "Untitled"
    },
    userId: {
      type: String,
      ref: "User",
      required: false
    },
    messages: {
      type: [MessageSchema],
      default: []
    }
  },
  {
    timestamps: true
  }
)

export const Chat = models.Chat || model<IChat>("Chat", ChatSchema)