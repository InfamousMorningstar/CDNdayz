export type IndexedChunk = {
  id: string;
  title: string;
  url: string;
  path: string;
  content: string;
  embedding?: number[];
};

export type WebsiteIndex = {
  version: number;
  builtAt: string;
  baseUrl: string;
  embeddingModel: string;
  chunkSize: number;
  overlapSize: number;
  chunks: IndexedChunk[];
};

export type RetrievedChunk = IndexedChunk & {
  score: number;
  routeBoost: number;
};

export type RouteIntent =
  | 'status'
  | 'wipes'
  | 'errors'
  | 'join'
  | 'general';
