import 'server-only';

import { promises as fs } from 'node:fs';
import path from 'node:path';
import {
  RETRIEVAL_MIN_SCORE,
  RETRIEVAL_MIN_STRONG_MATCHES,
  RETRIEVAL_TOP_K,
  ROUTE_PRIORITY,
  detectRouteIntent
} from '@/lib/chatbot/config';
import { RetrievedChunk, RouteIntent, WebsiteIndex } from '@/lib/chatbot/types';

let cachedIndex: WebsiteIndex | null = null;
let cachedIndexPath = '';

function tokenize(input: string): string[] {
  return input
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, ' ')
    .split(/\s+/)
    .filter((token) => token.length >= 3);
}

function lexicalScore(query: string, content: string): number {
  const queryTokens = new Set(tokenize(query));
  if (queryTokens.size === 0) {
    return 0;
  }

  const contentTokens = new Set(tokenize(content));
  let overlap = 0;
  queryTokens.forEach((token) => {
    if (contentTokens.has(token)) {
      overlap += 1;
    }
  });

  return overlap / queryTokens.size;
}

function cosineSimilarity(a: number[], b: number[]): number {
  if (a.length !== b.length || a.length === 0) {
    return 0;
  }

  let dot = 0;
  let normA = 0;
  let normB = 0;

  for (let i = 0; i < a.length; i += 1) {
    dot += a[i] * b[i];
    normA += a[i] * a[i];
    normB += b[i] * b[i];
  }

  if (normA === 0 || normB === 0) {
    return 0;
  }

  return dot / (Math.sqrt(normA) * Math.sqrt(normB));
}

function scoreRouteBoost(chunkPath: string, routeIntent: RouteIntent): number {
  const priorities = ROUTE_PRIORITY[routeIntent];
  if (!priorities || priorities.length === 0) {
    return 0;
  }

  const normalizedPath = chunkPath.toLowerCase();

  for (let index = 0; index < priorities.length; index += 1) {
    const candidate = priorities[index].toLowerCase();
    if (normalizedPath === candidate || normalizedPath.startsWith(`${candidate}/`)) {
      return index === 0 ? 0.18 : 0.12;
    }
  }

  return 0;
}

export async function loadWebsiteIndex(): Promise<WebsiteIndex> {
  const absolutePath = path.join(process.cwd(), 'data', 'chatbot', 'site-index.json');
  if (cachedIndex && cachedIndexPath === absolutePath) {
    return cachedIndex;
  }

  const file = await fs.readFile(absolutePath, 'utf8');
  const parsed = JSON.parse(file) as WebsiteIndex;

  if (!Array.isArray(parsed.chunks) || parsed.chunks.length === 0) {
    throw new Error('Website index exists but has no chunks. Rebuild the chatbot index.');
  }

  cachedIndex = parsed;
  cachedIndexPath = absolutePath;
  return parsed;
}

export function retrieveRelevantChunks(params: {
  query: string;
  queryEmbedding?: number[];
  index: WebsiteIndex;
  topK?: number;
}): {
  routeIntent: RouteIntent;
  chunks: RetrievedChunk[];
  topScore: number;
  strongMatchCount: number;
  shouldFallback: boolean;
} {
  const routeIntent = detectRouteIntent(params.query);

  const topK = params.topK ?? RETRIEVAL_TOP_K;
  const scored = params.index.chunks
    .map<RetrievedChunk>((chunk) => {
      const similarity =
        params.queryEmbedding && chunk.embedding
          ? cosineSimilarity(params.queryEmbedding, chunk.embedding)
          : lexicalScore(params.query, `${chunk.title}\n${chunk.content}`);
      const routeBoost = scoreRouteBoost(chunk.path, routeIntent);
      return {
        ...chunk,
        score: similarity + routeBoost,
        routeBoost
      };
    })
    .sort((a, b) => b.score - a.score)
    .slice(0, topK);

  const topScore = scored[0]?.score ?? 0;
  const strongMatchCount = scored.filter((item) => item.score >= RETRIEVAL_MIN_SCORE).length;
  const shouldFallback = topScore < RETRIEVAL_MIN_SCORE || strongMatchCount < RETRIEVAL_MIN_STRONG_MATCHES;

  return {
    routeIntent,
    chunks: scored,
    topScore,
    strongMatchCount,
    shouldFallback
  };
}
