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

type TrafficCompareRow = {
  serverId: string;
  serverName: string;
  avgPlayers: number;
  peakPlayers: number;
  reliabilityScore: number;
  trendDirection: 'up' | 'down' | 'stable' | 'insufficient';
};

type RealtimeIntent = 'top_server_population' | 'top_server_traffic_over_time' | 'none';

function isMostActiveServerQuestion(message: string): boolean {
  const normalized = message.toLowerCase().replace(/[^a-z0-9\s]/g, ' ');
  const hasRankingWord = /\b(most|highest|top|busiest)\b/.test(normalized);
  const hasPopulationWord = /\b(active|population|populated|players|people|full|fullest)\b/.test(normalized);
  const hasServerWord = /\b(server|servers)\b/.test(normalized);

  return hasRankingWord && hasPopulationWord && hasServerWord;
}

function isPotentialTopPopulationQuestion(message: string): boolean {
  const normalized = message.toLowerCase().replace(/[^a-z0-9\s]/g, ' ');
  const hasRankingWord = /\b(most|highest|top|busiest|fullest|max)\b/.test(normalized);
  const hasPopulationWord =
    /\b(active|activity|population|populated|players|people|online|full|popular|traffic)\b/.test(normalized);
  const hasServerContext = /\b(server|servers|which one|which|right now|currently|at the moment)\b/.test(normalized);

  return (hasRankingWord && hasPopulationWord) || (hasPopulationWord && hasServerContext);
}

function isTopTrafficOverTimeQuestion(message: string): boolean {
  const normalized = message.toLowerCase().replace(/[^a-z0-9\s]/g, ' ');
  const hasRankingWord = /\b(most|highest|top|best|busiest)\b/.test(normalized);
  const hasTrafficWord = /\b(popular|traffic|overall|throughout|over\s+time|trend|historical)\b/.test(normalized);
  const hasServerWord = /\b(server|servers)\b/.test(normalized);

  return hasRankingWord && hasTrafficWord && hasServerWord;
}

async function detectRealtimeIntent(message: string): Promise<RealtimeIntent> {
  if (isMostActiveServerQuestion(message)) {
    return 'top_server_population';
  }

  if (isTopTrafficOverTimeQuestion(message)) {
    return 'top_server_traffic_over_time';
  }

  if (!isPotentialTopPopulationQuestion(message)) {
    return 'none';
  }

  let client;
  try {
    client = getOpenAIClient();
  } catch {
    return 'none';
  }

  const modelCandidates = getChatModelCandidates();
  const classifierSystemPrompt = [
    'Classify the user request into one label for CDN server activity questions.',
    'Return exactly one token: TOP_SERVER_POPULATION, TOP_SERVER_TRAFFIC_OVER_TIME, or NONE.',
    'Use TOP_SERVER_POPULATION for phrasings like most populated server, most active server, highest players, busiest server now, which one has most people online.',
    'Use TOP_SERVER_TRAFFIC_OVER_TIME for phrasings like most popular server, highest traffic, best traffic throughout, most active over time, busiest overall.',
    'Return NONE for all other intents.'
  ].join('\n');

  for (const model of modelCandidates) {
    try {
      const completion = await client.chat.completions.create({
        model,
        temperature: 0,
        max_tokens: 8,
        messages: [
          {
            role: 'system',
            content: classifierSystemPrompt
          },
          {
            role: 'user',
            content: message
          }
        ]
      });

      const label = completion.choices[0]?.message?.content?.trim().toUpperCase();
      if (label === 'TOP_SERVER_POPULATION') {
        return 'top_server_population';
      }

      if (label === 'TOP_SERVER_TRAFFIC_OVER_TIME') {
        return 'top_server_traffic_over_time';
      }

      if (label === 'NONE') {
        return 'none';
      }
    } catch {
      // Try next model candidate if classifier call fails.
    }
  }

  return 'none';
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

async function resolveTopTrafficServerAnswer(origin: string) {
  const response = await fetch(`${origin}/api/population/intelligence?range=7d`, {
    headers: {
      'User-Agent': 'CDN-AI-Concierge/1.0'
    },
    cache: 'no-store'
  });

  if (!response.ok) {
    throw new Error(`Population intelligence lookup failed with ${response.status}`);
  }

  const payload = (await response.json()) as {
    compareRows?: TrafficCompareRow[];
    generatedAt?: number;
  };

  const rows = Array.isArray(payload.compareRows) ? payload.compareRows : [];
  if (rows.length === 0) {
    return {
      answer: FALLBACK_NOT_FOUND_MESSAGE,
      sources: [],
      confidence: 0
    };
  }

  const ranked = [...rows].sort((a, b) => {
    if (b.avgPlayers !== a.avgPlayers) return b.avgPlayers - a.avgPlayers;
    if (b.peakPlayers !== a.peakPlayers) return b.peakPlayers - a.peakPlayers;
    if (b.reliabilityScore !== a.reliabilityScore) return b.reliabilityScore - a.reliabilityScore;
    return a.serverName.localeCompare(b.serverName);
  });

  const top = ranked[0];
  if (!top) {
    return {
      answer: FALLBACK_NOT_FOUND_MESSAGE,
      sources: [],
      confidence: 0
    };
  }

  const generatedAtText = payload.generatedAt
    ? new Date(payload.generatedAt).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })
    : null;

  const answer = generatedAtText
    ? `${top.serverName} has the highest overall traffic across the last 7 days with an average of ${top.avgPlayers} players (peak ${top.peakPlayers}, snapshot ${generatedAtText}).`
    : `${top.serverName} has the highest overall traffic across the last 7 days with an average of ${top.avgPlayers} players (peak ${top.peakPlayers}).`;

  return {
    answer,
    sources: [
      {
        title: 'Servers & Analytics',
        url: `${origin}/servers`,
        path: '/servers'
      }
    ],
    confidence: 0.96
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
    const realtimeIntent = await detectRealtimeIntent(message);
    if (realtimeIntent === 'top_server_population') {
      const realtime = await resolveMostActiveServerAnswer(request.nextUrl.origin);
      return NextResponse.json({
        ...realtime,
        routeIntent: 'status'
      });
    }

    if (realtimeIntent === 'top_server_traffic_over_time') {
      const traffic = await resolveTopTrafficServerAnswer(request.nextUrl.origin);
      return NextResponse.json({
        ...traffic,
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
