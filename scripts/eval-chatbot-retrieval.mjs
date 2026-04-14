import { promises as fs } from 'node:fs';
import path from 'node:path';

const indexPath = path.join(process.cwd(), 'data/chatbot/site-index.json');
const evalSetPath = path.join(process.cwd(), 'data/chatbot/eval-set.json');

const routePriority = {
  status: ['/status', '/servers'],
  wipes: ['/wipes', '/wipe-info'],
  errors: ['/dayz-error-codes'],
  join: ['/join'],
  general: []
};

const stopWords = new Set([
  'the', 'and', 'for', 'with', 'that', 'this', 'from', 'your', 'what', 'when', 'where', 'how', 'are', 'was',
  'were', 'will', 'about', 'into', 'have', 'has', 'had', 'not', 'but', 'you', 'our', 'can', 'all', 'any', 'too',
  'use', 'using', 'get', 'got', 'who', 'why', 'is', 'it', 'its', 'on', 'in', 'at', 'to', 'of', 'as', 'by', 'or'
]);

function detectRouteIntent(query) {
  const q = query.toLowerCase();
  if (/status|online|offline|population|server up|server down|ping/.test(q)) return 'status';
  if (/wipe|wipes|reset|next wipe|wipe date/.test(q)) return 'wipes';
  if (/error|code|0x|kick|battleye|verification/.test(q)) return 'errors';
  if (/join|mods|launcher|dzsa|install|connect/.test(q)) return 'join';
  return 'general';
}

function tokenize(input) {
  return input
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, ' ')
    .split(/\s+/)
    .filter((token) => token.length >= 3 && !stopWords.has(token));
}

function lexicalScore(query, text) {
  const queryTokens = new Set(tokenize(query));
  if (queryTokens.size === 0) return 0;
  const textTokens = new Set(tokenize(text));
  let overlap = 0;
  queryTokens.forEach((token) => {
    if (textTokens.has(token)) overlap += 1;
  });
  return overlap / queryTokens.size;
}

function routeBoost(pathname, intent) {
  const priorities = routePriority[intent] || [];
  const p = pathname.toLowerCase();
  for (let i = 0; i < priorities.length; i += 1) {
    const target = priorities[i].toLowerCase();
    if (p === target || p.startsWith(`${target}/`)) {
      return i === 0 ? 0.18 : 0.12;
    }
  }
  return 0;
}

async function main() {
  const [indexRaw, evalRaw] = await Promise.all([
    fs.readFile(indexPath, 'utf8'),
    fs.readFile(evalSetPath, 'utf8')
  ]);

  const index = JSON.parse(indexRaw);
  const evalSet = JSON.parse(evalRaw);

  let passes = 0;
  let fails = 0;

  for (const testCase of evalSet) {
    const intent = detectRouteIntent(testCase.question);

    const ranked = index.chunks
      .map((chunk) => {
        const score = lexicalScore(testCase.question, `${chunk.title}\n${chunk.content}`) + routeBoost(chunk.path, intent);
        return { ...chunk, score };
      })
      .sort((a, b) => b.score - a.score)
      .slice(0, 5);

    const topScore = ranked[0]?.score || 0;
    const matchedExpected = testCase.expectedPaths.length
      ? ranked.some((chunk) => testCase.expectedPaths.some((expectedPath) => chunk.path.startsWith(expectedPath)))
      : false;

    const shouldFallback = topScore < 0.2;
    const passed = testCase.shouldFallback ? shouldFallback : matchedExpected && !shouldFallback;

    if (passed) {
      passes += 1;
      console.info(`PASS ${testCase.id} | topPath=${ranked[0]?.path || 'none'} | score=${topScore.toFixed(3)}`);
    } else {
      fails += 1;
      console.error(
        `FAIL ${testCase.id} | topPath=${ranked[0]?.path || 'none'} | score=${topScore.toFixed(3)} | expected=${testCase.expectedPaths.join(',') || 'fallback'}`
      );
    }
  }

  const total = passes + fails;
  const passRate = total === 0 ? 0 : (passes / total) * 100;

  console.info(`\nRetrieval eval result: ${passes}/${total} passed (${passRate.toFixed(1)}%)`);

  if (fails > 0) {
    process.exitCode = 1;
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
