import { geminiModel } from "@/config/openai.confit";
import connectDB from "@/config/db.config";
import { Chat, IMessage, Role } from "@/models/chat.model";
import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import {SYSTEM_PROMPT,INITIALIZATION_RESPONSE,getHeaderGenerationPrompt,getInitializationPrompt,} from "@/lib/prompts";

function toProviderRole(role: Role): "user" | "assistant" | "system" {
  if (role === Role.USER) return "user";
  if (role === Role.ASSISTANT) return "assistant";
  return "system";
}

export async function GET(req: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    await connectDB();

    const { searchParams } = new URL(req.url);
    const chatId = searchParams.get("chat");

    if (chatId) {
      const chat = await Chat.findOne({ _id: chatId, userId }).lean();
      if (!chat) {
        return new NextResponse("Not Found", { status: 404 });
      }
      return NextResponse.json({ chat });
    }

    const chats = await Chat.find({ userId })
      .sort({ updatedAt: -1 })
      .select("_id header createdAt updatedAt")
      .lean();

    const items = chats.map((c) => ({
      id: c._id.toString(),
      header: c.header,
      createdAt: c.createdAt,
      updatedAt: c.updatedAt,
    }));

    return NextResponse.json({ chats: items });
  } catch (error) {
    console.log(error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const chatIdFromQuery = searchParams.get("chat");

    const body = await req.json();
    const content = typeof body.content === "string" ? body.content : "";
    const topic = typeof body.topic === "string" ? body.topic : "";
    const knowledgeLevel = typeof body.knowledgeLevel === "string" ? body.knowledgeLevel : "";
    const category = typeof body.category === "string" ? body.category : "";
    const details = typeof body.details === "string" ? body.details : "";

    const isInitialization = !chatIdFromQuery && topic && knowledgeLevel && category;

    if (!content.trim() && !isInitialization) {
      return new NextResponse("Bad Request", { status: 400 });
    }

    await connectDB();

    let chat = null as any;

    if (isInitialization) {
      const headerPrompt = getHeaderGenerationPrompt(topic, knowledgeLevel, category);
      const headerResponse = await geminiModel.chat.completions.create({
        model: "gemini-2.5-flash",
        messages: [{ role: "user", content: headerPrompt }],
        stream: false,
      });

      const generatedHeader =
        headerResponse.choices?.[0]?.message?.content?.trim() ||
        topic.slice(0, 60) ||
        "Untitled";

      const systemMessage: IMessage = {
        role: Role.SYSTEM,
        content: SYSTEM_PROMPT + "\n\n" + getInitializationPrompt(topic, knowledgeLevel, category, details),
      };

      const assistantMessage: IMessage = {
        role: Role.ASSISTANT,
        content: INITIALIZATION_RESPONSE,
      };

      chat = await Chat.create({
        header: generatedHeader,
        userId,
        messages: [systemMessage, assistantMessage],
      });

      const encoder = new TextEncoder();
      const stream = new ReadableStream({
        start(controller) {
          controller.enqueue(encoder.encode(INITIALIZATION_RESPONSE));
          controller.close();
        },
      });

      return new NextResponse(stream, {
        headers: {
          "Content-Type": "text/plain; charset=utf-8",
          "X-Chat-Id": chat._id.toString(),
        },
      });
    }

    if (!chatIdFromQuery) {
      const userMessage: IMessage = {
        role: Role.USER,
        content,
      };

      chat = await Chat.create({
        header: content.length > 60 ? content.slice(0, 57) + "..." : content || "Untitled",
        userId,
        messages: [userMessage],
      });
    } else {
      chat = await Chat.findOne({ _id: chatIdFromQuery, userId });
      if (!chat) {
        return new NextResponse("Not Found", { status: 404 });
      }

      chat.messages.push({
        role: Role.USER,
        content,
      } as IMessage);

      await chat.save();
    }

    const history = (chat.messages as IMessage[]).map((m) => ({
      role: toProviderRole(m.role),
      content: m.content,
    }));

    const aiStream = await geminiModel.chat.completions.create({
      model: "gemini-2.5-flash",
      messages: history,
      stream: true,
    });

    const encoder = new TextEncoder();
    let accumulated = "";

    const stream = new ReadableStream({
      async start(controller) {
        try {
          // @ts-ignore
          for await (const chunk of aiStream) {
            const delta = chunk.choices?.[0]?.delta?.content || "";
            if (delta) {
              accumulated += delta;
              controller.enqueue(encoder.encode(delta));
            }
          }

          chat.messages.push({
            role: Role.ASSISTANT,
            content: accumulated,
          } as IMessage);

          await chat.save();

          controller.close();
        } catch (err) {
          controller.error(err);
        }
      },
    });

    return new NextResponse(stream, {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "X-Chat-Id": chat._id.toString(),
      },
    });
  } catch (error) {
    console.log(error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}