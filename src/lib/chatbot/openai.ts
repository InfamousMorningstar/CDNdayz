import 'server-only';

import OpenAI from 'openai';
import { DEFAULT_CHAT_MODEL, DEFAULT_EMBEDDING_MODEL } from '@/lib/chatbot/config';

let client: OpenAI | null = null;

export function getOpenAIClient(): OpenAI {
  if (client) {
    return client;
  }

  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    throw new Error('OPENAI_API_KEY is missing. Add it to your server environment variables.');
  }

  client = new OpenAI({ apiKey });
  return client;
}

export function getChatModel(): string {
  return process.env.OPENAI_CHAT_MODEL || DEFAULT_CHAT_MODEL;
}

export function getEmbeddingModel(): string {
  return process.env.OPENAI_EMBEDDING_MODEL || DEFAULT_EMBEDDING_MODEL;
}
