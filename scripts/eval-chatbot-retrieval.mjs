import { promises as fs } from 'node:fs';
import path from 'node:path';

const indexPath = path.join(process.cwd(), 'data/chatbot/site-index.json');
const evalSetPath = path.join(process.cwd(), 'data/chatbot/eval-set.json');

const routePriority = {
  status: ['/status', '/servers'],
  wipes: ['/wipes', '/wipe-info'],
  errors: ['/dayz-error-codes'],
  join: ['/join'],
  rules_building: ['/rules/building', '/rules', '/faq'],
  rules_general: ['/rules', '/faq', '/rules/building'],
  general: []
};

const stopWords = new Set([
  'the', 'and', 'for', 'with', 'that', 'this', 'from', 'your', 'what', 'when', 'where', 'how', 'are', 'was',
  'were', 'will', 'about', 'into', 'have', 'has', 'had', 'not', 'but', 'you', 'our', 'can', 'all', 'any', 'too',
  'use', 'using', 'get', 'got', 'who', 'why', 'is', 'it', 'its', 'on', 'in', 'at', 'to', 'of', 'as', 'by', 'or'
]);

const retrievalMinScore = 0.32;
const retrievalMinStrongMatches = 1;

function detectRouteIntent(query) {
  const q = query.toLowerCase();
  if (/status|online|offline|population|server up|server down|ping/.test(q)) return 'status';
  if (/wipe|wipes|reset|next wipe|wipe date/.test(q)) return 'wipes';
  if (/error|code|0x|kick|battleye|verification/.test(q)) return 'errors';
  if (/join|mods|launcher|dzsa|install|connect/.test(q)) return 'join';
  if (/build my base|build a base|base building|trader|territory|ai mission|military area|namalsk|how close can i build/.test(q)) return 'rules_building';
  if (/rules|faq|pvp|ticket|support|dm admin|dm admins|something breaks|report something broken|who do i contact/.test(q)) return 'rules_general';
  return 'general';
}

function rewriteQuery(query, intent) {
  const normalized = query.toLowerCase().trim();
  const expanded = new Set(normalized.split(/\s+/).filter(Boolean));

  if (intent === 'wipes') {
    expanded.add('wipe-info');
    expanded.add('next');
    expanded.add('projected');
    expanded.add('wipe');
    expanded.add('window');
  }

  if (intent === 'status') {
    expanded.add('servers');
    expanded.add('live');
    expanded.add('status');
  }

  if (intent === 'errors') {
    expanded.add('dayz-error-codes');
    expanded.add('ve_data');
    expanded.add('0x00040093');
    expanded.add('pbo');
    expanded.add('verification');
  }

  if (intent === 'join') {
    expanded.add('join');
    expanded.add('guide');
    expanded.add('launcher');
    expanded.add('mods');
  }

  if (intent === 'rules_building') {
    expanded.add('building');
    expanded.add('rules');
    expanded.add('trader');
    expanded.add('distance');
    expanded.add('territory');
    expanded.add('ai');
    expanded.add('mission');
  }

  if (intent === 'rules_general') {
    expanded.add('rules');
    expanded.add('faq');
    expanded.add('discord');
    expanded.add('ticket');
    expanded.add('support');
    expanded.add('pvp');
  }

  return Array.from(expanded).join(' ');
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

function tokenOverlapCount(query, text) {
  const queryTokens = new Set(tokenize(query));
  if (queryTokens.size === 0) return 0;

  const textTokens = new Set(tokenize(text));
  let overlap = 0;
  queryTokens.forEach((token) => {
    if (textTokens.has(token)) overlap += 1;
  });

  return overlap;
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
    const rewrittenQuery = rewriteQuery(testCase.question, intent);

    const ranked = index.chunks
      .map((chunk) => {
        const score = lexicalScore(rewrittenQuery, `${chunk.title}\n${chunk.content}`) + routeBoost(chunk.path, intent);
        return { ...chunk, score };
      })
      .sort((a, b) => b.score - a.score)
      .slice(0, 5);

    const topScore = ranked[0]?.score || 0;
    const topOverlap = ranked[0] ? tokenOverlapCount(rewrittenQuery, `${ranked[0].title}\n${ranked[0].content}`) : 0;
    const strongMatchCount = ranked.filter((chunk) => chunk.score >= retrievalMinScore).length;
    const queryTokenCount = tokenize(rewrittenQuery).length;
    const matchedExpected = testCase.expectedPaths.length
      ? ranked.some((chunk) => testCase.expectedPaths.some((expectedPath) => chunk.path.startsWith(expectedPath)))
      : false;

    const shouldFallback =
      topScore < retrievalMinScore ||
      strongMatchCount < retrievalMinStrongMatches ||
      (queryTokenCount >= 3 && topOverlap < 2);
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
