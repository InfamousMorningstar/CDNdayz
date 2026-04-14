import { NextRequest, NextResponse } from 'next/server';
import {
  FALLBACK_NOT_FOUND_MESSAGE,
  MAX_USER_MESSAGE_LENGTH,
  MIN_USER_MESSAGE_LENGTH,
  buildSnippetContext,
  buildStrictSystemPrompt,
  checkRateLimit,
  getChatModelCandidates,
  getClientIp,
  getEmbeddingModel,
  getOpenAIClient,
  loadWebsiteIndex,
  recordQuestion,
  recordRetrievalOutcome,
  rewriteQueryForRetrieval,
  retrieveRelevantChunks
} from '@/lib/chatbot';
import { validateGroundedAnswer } from '@/lib/chatbot';

export const runtime = 'nodejs';

type ChatRequestBody = {
  message?: unknown;
};

type LiveServerStatus = {
  id: string;
  name: string;
  players: number;
  maxPlayers: number;
  status: 'online' | 'offline' | 'restarting';
};

function isMostActiveServerQuestion(message: string): boolean {
  const normalized = message.toLowerCase();

  return (
    (normalized.includes('most') || normalized.includes('highest') || normalized.includes('top')) &&
    (normalized.includes('active') || normalized.includes('population') || normalized.includes('players') || normalized.includes('people')) &&
    normalized.includes('server')
  );
}

async function resolveMostActiveServerAnswer(origin: string) {
  const response = await fetch(`${origin}/api/servers`, {
    headers: {
      'User-Agent': 'CDN-AI-Concierge/1.0'
    },
    cache: 'no-store'
  });

  if (!response.ok) {
    throw new Error(`Server status lookup failed with ${response.status}`);
  }

  const payload = (await response.json()) as LiveServerStatus[];
  if (!Array.isArray(payload) || payload.length === 0) {
    return {
      answer: FALLBACK_NOT_FOUND_MESSAGE,
      sources: [],
      confidence: 0
    };
  }

  const online = payload.filter((server) => server.status === 'online');
  const candidates = online.length > 0 ? online : payload;

  const ranked = [...candidates].sort((a, b) => {
    if (b.players !== a.players) return b.players - a.players;
    if (b.maxPlayers !== a.maxPlayers) return b.maxPlayers - a.maxPlayers;
    return a.name.localeCompare(b.name);
  });

  const top = ranked[0];
  if (!top) {
    return {
      answer: FALLBACK_NOT_FOUND_MESSAGE,
      sources: [],
      confidence: 0
    };
  }

  const fetchedAtHeader = response.headers.get('x-server-fetched-at');
  const fetchedAtText = fetchedAtHeader
    ? new Date(Number(fetchedAtHeader)).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })
    : null;

  const answer = fetchedAtText
    ? `${top.name} currently has the most active players right now at ${top.players}/${top.maxPlayers} (snapshot ${fetchedAtText}).`
    : `${top.name} currently has the most active players right now at ${top.players}/${top.maxPlayers}.`;

  return {
    answer,
    sources: [
      {
        title: 'Servers & Analytics',
        url: `${origin}/servers`,
        path: '/servers'
      }
    ],
    confidence: 0.99
  };
}

function normalizeUserMessage(raw: unknown): string {
  if (typeof raw !== 'string') {
    return '';
  }

  return raw.trim().replace(/\s+/g, ' ');
}

export async function POST(request: NextRequest) {
  const ip = getClientIp(request.headers);
  const limiter = checkRateLimit(`chatbot:${ip}`);

  if (!limiter.allowed) {
    return NextResponse.json(
      {
        error: 'Too many requests. Please slow down.',
        retryAfterSeconds: limiter.retryAfterSeconds
      },
      {
        status: 429,
        headers: {
          'Retry-After': String(limiter.retryAfterSeconds)
        }
      }
    );
  }

  let body: ChatRequestBody;
  try {
    body = (await request.json()) as ChatRequestBody;
  } catch {
    return NextResponse.json({ error: 'Invalid JSON payload.' }, { status: 400 });
  }

  const message = normalizeUserMessage(body.message);
  if (message.length < MIN_USER_MESSAGE_LENGTH || message.length > MAX_USER_MESSAGE_LENGTH) {
    return NextResponse.json(
      {
        error: `Message must be between ${MIN_USER_MESSAGE_LENGTH} and ${MAX_USER_MESSAGE_LENGTH} characters.`
      },
      { status: 400 }
    );
  }

  recordQuestion(message);

  try {
    if (isMostActiveServerQuestion(message)) {
      const realtime = await resolveMostActiveServerAnswer(request.nextUrl.origin);
      return NextResponse.json({
        ...realtime,
        routeIntent: 'status'
      });
    }

    const index = await loadWebsiteIndex();
    const client = getOpenAIClient();
    const rewrittenQuery = rewriteQueryForRetrieval(message);
    let queryEmbedding: number[] | undefined;

    try {
      const embeddingResponse = await client.embeddings.create({
        model: getEmbeddingModel(),
        input: rewrittenQuery
      });
      queryEmbedding = embeddingResponse.data[0]?.embedding;
    } catch (embeddingError) {
      console.warn('[chatbot.retrieval] embedding fallback to lexical', embeddingError);
    }

    const retrieval = retrieveRelevantChunks({
      query: message,
      rewrittenQuery,
      queryEmbedding,
      index
    });

    if (retrieval.shouldFallback) {
      recordRetrievalOutcome(retrieval.routeIntent, false);
      console.info('[chatbot.retrieval] miss', {
        query: message,
        rewrittenQuery,
        routeIntent: retrieval.routeIntent,
        topScore: retrieval.topScore,
        strongMatchCount: retrieval.strongMatchCount
      });

      return NextResponse.json({
        answer: FALLBACK_NOT_FOUND_MESSAGE,
        sources: [],
        routeIntent: retrieval.routeIntent,
        confidence: retrieval.topScore
      });
    }

    const context = buildSnippetContext(retrieval.chunks);

    let completion: Awaited<ReturnType<typeof client.chat.completions.create>> | null = null;
    let completionError: unknown = null;

    const modelCandidates = getChatModelCandidates();
    const requestedModel = modelCandidates[0];

    for (const model of modelCandidates) {
      try {
        completion = await client.chat.completions.create({
          model,
          temperature: 0,
          max_tokens: 320,
          messages: [
            {
              role: 'system',
              content: buildStrictSystemPrompt()
            },
            {
              role: 'user',
              content: `QUESTION:\n${message}\n\nWEBSITE_SNIPPETS:\n${context}`
            }
          ]
        });

        if (model !== requestedModel) {
          console.warn('[chatbot.api] fallback model used', { requested: requestedModel, selected: model });
        }
        break;
      } catch (error) {
        completionError = error;
      }
    }

    if (!completion) {
      throw completionError instanceof Error ? completionError : new Error('Failed to generate chat completion.');
    }

    const answer = completion.choices[0]?.message?.content?.trim() || FALLBACK_NOT_FOUND_MESSAGE;
    const safeAnswer = answer.length > 1200 ? `${answer.slice(0, 1200)}...` : answer;
    const grounding = validateGroundedAnswer(safeAnswer, retrieval.chunks);

    const sources = Array.from(
      new Map(
        retrieval.chunks.map((chunk) => [chunk.url, { title: chunk.title, url: chunk.url, path: chunk.path }])
      ).values()
    ).slice(0, 4);

    console.info('[chatbot.retrieval] hit', {
      query: message,
      rewrittenQuery,
      routeIntent: retrieval.routeIntent,
      topScore: retrieval.topScore,
      sourceCount: sources.length,
      sources: sources.map((source) => source.path)
    });

    if (!grounding.accepted) {
      recordRetrievalOutcome(retrieval.routeIntent, false);
      console.info('[chatbot.grounding] rejected', {
        query: message,
        minCoverage: grounding.minCoverage,
        weakSentenceCount: grounding.weakSentences.length
      });

      return NextResponse.json({
        answer: FALLBACK_NOT_FOUND_MESSAGE,
        sources: [],
        routeIntent: retrieval.routeIntent,
        confidence: retrieval.topScore
      });
    }

    recordRetrievalOutcome(retrieval.routeIntent, true);

    if (safeAnswer === FALLBACK_NOT_FOUND_MESSAGE) {
      return NextResponse.json({
        answer: FALLBACK_NOT_FOUND_MESSAGE,
        sources: [],
        routeIntent: retrieval.routeIntent,
        confidence: retrieval.topScore
      });
    }

    return NextResponse.json({
      answer: safeAnswer,
      sources,
      routeIntent: retrieval.routeIntent,
      confidence: retrieval.topScore
    });
  } catch (error) {
    console.error('[chatbot.api] failed', error);

    const errorCode = (error as { code?: string } | null)?.code;
    const isQuotaError = errorCode === 'insufficient_quota';

    return NextResponse.json(
      {
        error: isQuotaError
          ? 'Chatbot is temporarily unavailable because the AI API quota is exhausted.'
          : 'Chatbot is temporarily unavailable.',
        answer: FALLBACK_NOT_FOUND_MESSAGE,
        sources: []
      },
      { status: 500 }
    );
  }
}
