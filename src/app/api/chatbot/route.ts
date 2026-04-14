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
  retrieveRelevantChunks
} from '@/lib/chatbot';

export const runtime = 'nodejs';

type ChatRequestBody = {
  message?: unknown;
};

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
    const index = await loadWebsiteIndex();
    const client = getOpenAIClient();

    const embeddingResponse = await client.embeddings.create({
      model: getEmbeddingModel(),
      input: message
    });

    const queryEmbedding = embeddingResponse.data[0]?.embedding;
    if (!queryEmbedding) {
      throw new Error('Missing embedding result from OpenAI.');
    }

    const retrieval = retrieveRelevantChunks({
      query: message,
      queryEmbedding,
      index
    });

    if (retrieval.shouldFallback) {
      console.info('[chatbot.retrieval] miss', {
        query: message,
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

    const sources = Array.from(
      new Map(
        retrieval.chunks.map((chunk) => [chunk.url, { title: chunk.title, url: chunk.url, path: chunk.path }])
      ).values()
    ).slice(0, 4);

    console.info('[chatbot.retrieval] hit', {
      query: message,
      routeIntent: retrieval.routeIntent,
      topScore: retrieval.topScore,
      sourceCount: sources.length,
      sources: sources.map((source) => source.path)
    });

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

    return NextResponse.json(
      {
        error: 'Chatbot is temporarily unavailable.',
        answer: FALLBACK_NOT_FOUND_MESSAGE,
        sources: []
      },
      { status: 500 }
    );
  }
}
