import OpenAI from 'openai';

export function getOpenAIClient(): OpenAI | null {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey || apiKey === 'your-openai-api-key') {
    return null;
  }
  return new OpenAI({ apiKey });
}
