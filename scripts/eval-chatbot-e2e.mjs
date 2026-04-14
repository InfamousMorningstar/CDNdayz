import { promises as fs } from 'node:fs';
import path from 'node:path';

const FALLBACK = "I couldn't find that on the website.";
const evalSetPath = path.join(process.cwd(), 'data/chatbot/e2e-eval-set.json');

function normalizeBaseUrl(input) {
  return input.trim().replace(/\/$/, '');
}

function normalizeAnswer(input) {
  return typeof input === 'string' ? input.toLowerCase().replace(/\s+/g, ' ').trim() : '';
}

function hasExpectedSource(sources, expectedPaths) {
  if (!Array.isArray(expectedPaths) || expectedPaths.length === 0) {
    return true;
  }

  return sources.some((source) => {
    const pathValue = typeof source.path === 'string' ? source.path : '';
    return expectedPaths.some((expected) => pathValue === expected || pathValue.startsWith(`${expected}/`));
  });
}

function includesAny(answer, expected) {
  if (!Array.isArray(expected) || expected.length === 0) {
    return true;
  }

  return expected.some((item) => answer.includes(String(item).toLowerCase()));
}

function includesAll(answer, expected) {
  if (!Array.isArray(expected) || expected.length === 0) {
    return true;
  }

  return expected.every((item) => answer.includes(String(item).toLowerCase()));
}

function excludesAll(answer, rejected) {
  if (!Array.isArray(rejected) || rejected.length === 0) {
    return true;
  }

  return rejected.every((item) => !answer.includes(String(item).toLowerCase()));
}

async function askChatbot(baseUrl, question, requestId) {
  const start = Date.now();
  const response = await fetch(`${baseUrl}/api/chatbot`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Forwarded-For': `198.51.100.${(requestId % 200) + 1}`
    },
    body: JSON.stringify({ message: question })
  });

  const latencyMs = Date.now() - start;
  const payload = await response.json();

  return { response, payload, latencyMs };
}

async function main() {
  const baseUrlRaw = process.env.CHATBOT_EVAL_BASE_URL || process.env.WEBSITE_BASE_URL;
  if (!baseUrlRaw) {
    throw new Error('CHATBOT_EVAL_BASE_URL (or WEBSITE_BASE_URL) is required for e2e chatbot evaluation.');
  }

  const baseUrl = normalizeBaseUrl(baseUrlRaw);
  const evalSet = JSON.parse(await fs.readFile(evalSetPath, 'utf8'));

  let passes = 0;
  let fails = 0;
  let totalLatency = 0;

  for (let index = 0; index < evalSet.length; index += 1) {
    const testCase = evalSet[index];
    const { response, payload, latencyMs } = await askChatbot(baseUrl, testCase.question, index + 1);
    totalLatency += latencyMs;

    const answer = typeof payload.answer === 'string' ? payload.answer.trim() : '';
    const normalizedAnswer = normalizeAnswer(answer);
    const sources = Array.isArray(payload.sources) ? payload.sources : [];

    let passed = true;
    const reasons = [];

    if (!response.ok) {
      passed = false;
      reasons.push(`http_${response.status}`);
    }

    if (testCase.shouldFallback) {
      if (answer !== FALLBACK) {
        passed = false;
        reasons.push('expected_fallback_answer');
      }
      if (sources.length > 0) {
        passed = false;
        reasons.push('fallback_should_not_have_sources');
      }
    } else {
      if (!answer || answer === FALLBACK) {
        passed = false;
        reasons.push('unexpected_fallback');
      }
      if (sources.length === 0) {
        passed = false;
        reasons.push('missing_sources');
      }
      if (!hasExpectedSource(sources, testCase.expectedSourcePaths)) {
        passed = false;
        reasons.push(`missing_expected_source:${(testCase.expectedSourcePaths || []).join('|')}`);
      }
      if (!includesAny(normalizedAnswer, testCase.answerMustIncludeAny)) {
        passed = false;
        reasons.push(`missing_answer_any:${(testCase.answerMustIncludeAny || []).join('|')}`);
      }
      if (!includesAll(normalizedAnswer, testCase.answerMustIncludeAll)) {
        passed = false;
        reasons.push(`missing_answer_all:${(testCase.answerMustIncludeAll || []).join('|')}`);
      }
      if (!excludesAll(normalizedAnswer, testCase.answerMustExclude)) {
        passed = false;
        reasons.push(`contains_rejected_answer_text:${(testCase.answerMustExclude || []).join('|')}`);
      }
    }

    if (passed) {
      passes += 1;
      console.info(`PASS ${testCase.id} | ${latencyMs}ms | sources=${sources.length}`);
    } else {
      fails += 1;
      console.error(
        `FAIL ${testCase.id} | ${latencyMs}ms | reasons=${reasons.join(',')} | answer=${JSON.stringify(answer).slice(0, 220)}`
      );
    }
  }

  const total = passes + fails;
  const passRate = total === 0 ? 0 : (passes / total) * 100;
  const avgLatency = total === 0 ? 0 : totalLatency / total;

  console.info(`\nE2E eval result: ${passes}/${total} passed (${passRate.toFixed(1)}%), avg latency ${avgLatency.toFixed(0)}ms`);

  if (fails > 0) {
    process.exitCode = 1;
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
