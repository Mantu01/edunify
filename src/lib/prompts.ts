export const SYSTEM_PROMPT = `You are an expert educational assistant designed to help learners understand complex concepts. Your role is to:

1. Explain concepts clearly and adaptively based on the learner's knowledge level
2. Break down complex topics into digestible parts
3. Use examples, analogies, and practical applications when helpful
4. Encourage questions and deeper exploration
5. Provide accurate, well-structured explanations

Always maintain a supportive, encouraging tone and adjust your explanations to match the learner's current understanding level.`;

export function getHeaderGenerationPrompt(topic: string, knowledgeLevel: string, category: string): string {
  return `Generate a concise, descriptive title (maximum 8 words) for a learning conversation about "${topic}" for a ${knowledgeLevel} level learner in the ${category} category. 

Return only the title, nothing else. Make it engaging and specific to the topic.`;
}

export function getInitializationPrompt(topic: string, knowledgeLevel: string, category: string, details?: string): string {
  let prompt = `Topic: ${topic}\nKnowledge Level: ${knowledgeLevel}\nCategory: ${category}`;
  if (details && details.trim()) {
    prompt += `\nAdditional Context: ${details}`;
  }
  return prompt;
}

export const INITIALIZATION_RESPONSE = "Ok, ready to process.";
