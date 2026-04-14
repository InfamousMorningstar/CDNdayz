import 'server-only';

type QuestionStat = {
  text: string;
  count: number;
  lastSeenAt: string;
};

type RetrievalStats = {
  hits: number;
  misses: number;
};

const questionCounts = new Map<string, QuestionStat>();
const retrievalByIntent = new Map<string, RetrievalStats>();
let totalQuestions = 0;

function normalizeQuestion(input: string): string {
  return input
    .toLowerCase()
    .replace(/\s+/g, ' ')
    .replace(/[^a-z0-9 ?!:/.-]/g, '')
    .trim()
    .slice(0, 140);
}

export function recordQuestion(question: string): void {
  const normalized = normalizeQuestion(question);
  if (!normalized) {
    return;
  }

  totalQuestions += 1;

  const current = questionCounts.get(normalized);
  if (current) {
    current.count += 1;
    current.lastSeenAt = new Date().toISOString();
  } else {
    questionCounts.set(normalized, {
      text: normalized,
      count: 1,
      lastSeenAt: new Date().toISOString()
    });
  }

  if (totalQuestions % 20 === 0) {
    const top = getTopQuestions(5);
    console.info('[chatbot.analytics] top_questions', top);
  }
}

export function getTopQuestions(limit = 20): QuestionStat[] {
  return Array.from(questionCounts.values())
    .sort((a, b) => b.count - a.count)
    .slice(0, limit);
}

export function recordRetrievalOutcome(intent: string, hit: boolean): void {
  const key = intent || 'general';
  const existing = retrievalByIntent.get(key) || { hits: 0, misses: 0 };

  if (hit) {
    existing.hits += 1;
  } else {
    existing.misses += 1;
  }

  retrievalByIntent.set(key, existing);
}

export function getAnalyticsSummary() {
  return {
    totalQuestions,
    uniqueQuestions: questionCounts.size,
    topQuestions: getTopQuestions(10),
    retrievalByIntent: Array.from(retrievalByIntent.entries()).map(([intent, stats]) => ({
      intent,
      ...stats
    }))
  };
}
