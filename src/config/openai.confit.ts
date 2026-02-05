import OpenAI from "openai";

type Provider = "openai" | "gemini";

export default function CreateAIModel(provider: Provider) {
  if (provider === "gemini") {
    return new OpenAI({
      apiKey: process.env.GEMINI_API_KEY,
      baseURL: "https://generativelanguage.googleapis.com/v1beta/openai"
    });
  };

  if (provider === "openai") {
    return new OpenAI({
      apiKey: process.env.OPENAI_API_KEY
    });
  };

  throw new Error("Unsupported provider");
}

export const geminiModel = CreateAIModel("gemini");