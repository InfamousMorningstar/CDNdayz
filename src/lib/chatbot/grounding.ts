import { FALLBACK_NOT_FOUND_MESSAGE, GROUNDING_MIN_COVERAGE } from '@/lib/chatbot/config';
import { RetrievedChunk } from '@/lib/chatbot/types';

function normalizeText(value: string): string {
  return value
    .toLowerCase()
    .replace(/https?:\/\/\S+/g, ' ')
    .replace(/[^a-z0-9\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function tokenize(value: string): string[] {
  return normalizeText(value)
    .split(' ')
    .filter((token) => token.length >= 3);
}

function sentenceCoverage(sentence: string, chunks: RetrievedChunk[]): number {
  const sentenceTokens = new Set(tokenize(sentence));
  if (sentenceTokens.size === 0) {
    return 1;
  }

  const corpusTokens = new Set<string>();
  chunks.forEach((chunk) => {
    tokenize(`${chunk.title} ${chunk.content}`).forEach((token) => corpusTokens.add(token));
  });

  let overlap = 0;
  sentenceTokens.forEach((token) => {
    if (corpusTokens.has(token)) {
      overlap += 1;
    }
  });

  return overlap / sentenceTokens.size;
}

export function validateGroundedAnswer(answer: string, chunks: RetrievedChunk[]): {
  accepted: boolean;
  minCoverage: number;
  weakSentences: string[];
} {
  const trimmed = answer.trim();
  if (!trimmed || trimmed === FALLBACK_NOT_FOUND_MESSAGE) {
    return { accepted: true, minCoverage: 1, weakSentences: [] };
  }

  const sentences = trimmed
    .split(/(?<=[.!?])\s+/)
    .map((item) => item.trim())
    .filter((item) => item.length >= 8);

  if (sentences.length === 0) {
    return { accepted: false, minCoverage: 0, weakSentences: [trimmed] };
  }

  let minCoverage = 1;
  const weakSentences: string[] = [];

  for (const sentence of sentences) {
    const coverage = sentenceCoverage(sentence, chunks);
    minCoverage = Math.min(minCoverage, coverage);

    if (coverage < GROUNDING_MIN_COVERAGE) {
      weakSentences.push(sentence);
    }
  }

  return {
    accepted: weakSentences.length === 0,
    minCoverage,
    weakSentences
  };
}
