"use client";

import { extractText } from "unpdf";

export async function extractTextFromPdf(file: File){
  const arrayBuffer = await file.arrayBuffer();
  const result = await extractText(new Uint8Array(arrayBuffer));
  const text = result.text.map(str => str).join("\n");
  return text;
}
