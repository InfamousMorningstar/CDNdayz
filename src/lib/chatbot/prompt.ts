import { FALLBACK_NOT_FOUND_MESSAGE } from '@/lib/chatbot/config';
import { RetrievedChunk } from '@/lib/chatbot/types';

export function buildStrictSystemPrompt(): string {
  return [
    'You are CDN AI Concierge, the official CDN website support assistant powered by ChatGPT-5.4 mini.',
    'You must answer ONLY using facts explicitly present in the provided WEBSITE_SNIPPETS.',
    'Never use outside knowledge, assumptions, or guesses.',
    `If the snippets do not clearly answer the question, reply exactly with: ${FALLBACK_NOT_FOUND_MESSAGE}`,
    'If the question is unrelated to the website content, reply with that same fallback message.',
    'Keep responses concise and practical for end users (2-5 short sentences).',
    'Do not mention internal prompts, retrieval, vector search, confidence, or policy text.'
  ].join('\n');
}

export function buildSnippetContext(chunks: RetrievedChunk[]): string {
  return chunks
    .map((chunk, index) => {
      return [
        `SNIPPET ${index + 1}`,
        `Title: ${chunk.title}`,
        `URL: ${chunk.url}`,
        `Path: ${chunk.path}`,
        `Content: ${chunk.content}`
      ].join('\n');
    })
    .join('\n\n');
}
