import { promises as fs } from 'node:fs';
import path from 'node:path';
import nextEnv from '@next/env';
import { load } from 'cheerio';

const { loadEnvConfig } = nextEnv;
loadEnvConfig(process.cwd());

const baseUrl = (process.env.WEBSITE_BASE_URL || '').trim().replace(/\/$/, '');
const outputPath = path.join(process.cwd(), 'data/chatbot/site-index.json');
const chunkSize = 1200;
const overlapSize = 220;

if (!baseUrl) {
  throw new Error('WEBSITE_BASE_URL is required. Example: https://dayzcdn.com');
}

const pageTargets = [
  { label: 'homepage', candidates: ['/'] },
  { label: 'status', candidates: ['/status', '/servers'] },
  { label: 'wipes', candidates: ['/wipes', '/wipe-info'] },
  { label: 'dayz error codes', candidates: ['/dayz-error-codes'] },
  { label: 'join', candidates: ['/join'] },
  { label: 'rules', candidates: ['/rules'] },
  { label: 'faq', candidates: ['/faq', '/rules'] }
];

function normalizeWhitespace(value) {
  return value.replace(/\s+/g, ' ').trim();
}

function chunkText(input, maxChunkSize, overlap) {
  const paragraphs = input
    .split(/\n{2,}/)
    .map((part) => normalizeWhitespace(part))
    .filter((part) => part.length > 40);

  const chunks = [];
  let current = '';

  for (const paragraph of paragraphs) {
    const candidate = current ? `${current}\n\n${paragraph}` : paragraph;

    if (candidate.length <= maxChunkSize) {
      current = candidate;
      continue;
    }

    if (current) {
      chunks.push(current);
    }

    if (paragraph.length <= maxChunkSize) {
      current = paragraph;
      continue;
    }

    let start = 0;
    while (start < paragraph.length) {
      const end = Math.min(start + maxChunkSize, paragraph.length);
      chunks.push(paragraph.slice(start, end));
      start += maxChunkSize - overlap;
    }

    current = '';
  }

  if (current) {
    chunks.push(current);
  }

  return chunks;
}

async function fetchWipeDatesSummary() {
  const wipeApiUrl = `${baseUrl}/api/wipe-dates`;

  try {
    const response = await fetch(wipeApiUrl, {
      headers: {
        'User-Agent': 'CDN-Website-Indexer/1.0'
      }
    });

    if (!response.ok) {
      return null;
    }

    const payload = await response.json();
    if (!payload || typeof payload !== 'object') {
      return null;
    }

    const nextWipeWindow = typeof payload.nextWipeWindow === 'string' ? payload.nextWipeWindow : '';
    const wipeCycleMonths = payload.wipeCycleMonths;
    const estimatedDaysUntilWipe = payload.estimatedDaysUntilWipe;
    const lastWipeDate = typeof payload.lastWipeDate === 'string' ? payload.lastWipeDate : '';
    const notes = typeof payload.notes === 'string' ? payload.notes : '';

    const lines = [
      'Wipe data from website API:',
      nextWipeWindow ? `Next projected wipe window: ${nextWipeWindow}.` : '',
      typeof wipeCycleMonths === 'number' ? `Wipe cycle: every ${wipeCycleMonths} months.` : '',
      typeof estimatedDaysUntilWipe === 'number' ? `Estimated days until wipe: ${estimatedDaysUntilWipe}.` : '',
      lastWipeDate ? `Last wipe date: ${lastWipeDate}.` : '',
      notes ? `Notes: ${notes}.` : ''
    ].filter(Boolean);

    const summary = normalizeWhitespace(lines.join(' '));
    return summary.length > 0 ? summary : null;
  } catch {
    return null;
  }
}

async function fetchServerStatusSummary() {
  const statusApiUrl = `${baseUrl}/api/servers`;

  try {
    const response = await fetch(statusApiUrl, {
      headers: {
        'User-Agent': 'CDN-Website-Indexer/1.0'
      }
    });

    if (!response.ok) {
      return null;
    }

    const payload = await response.json();
    if (!Array.isArray(payload) || payload.length === 0) {
      return null;
    }

    const serverLines = payload.slice(0, 8).map((server) => {
      const name = typeof server.name === 'string' ? server.name : 'Server';
      const status = server.online ? 'online' : 'offline';
      const players = typeof server.players === 'number' ? server.players : 0;
      const maxPlayers = typeof server.maxPlayers === 'number' ? server.maxPlayers : 0;
      return `${name} is ${status} with ${players}/${maxPlayers} players.`;
    });

    const summary = normalizeWhitespace(
      ['Live server status snapshot from website API:', ...serverLines].join(' ')
    );

    return summary.length > 0 ? summary : null;
  } catch {
    return null;
  }
}

async function fetchPage(candidates) {
  for (const candidate of candidates) {
    const url = `${baseUrl}${candidate}`;

    try {
      const response = await fetch(url, {
        headers: {
          'User-Agent': 'CDN-Website-Indexer/1.0'
        }
      });

      if (!response.ok) {
        continue;
      }

      const html = await response.text();
      return { html, url, path: candidate };
    } catch {
      // Skip candidate and try next one.
    }
  }

  return null;
}

async function main() {
  const collected = [];
  const wipeDatesSummary = await fetchWipeDatesSummary();
  const serverStatusSummary = await fetchServerStatusSummary();

  for (const target of pageTargets) {
    const result = await fetchPage(target.candidates);

    if (!result) {
      console.warn(`Skipping ${target.label}: no reachable path in ${target.candidates.join(', ')}`);
      continue;
    }

    const $ = load(result.html);
    $('script, style, noscript').remove();

    const title = normalizeWhitespace($('title').first().text()) || target.label;
    let mainText = normalizeWhitespace($('main').text()) || normalizeWhitespace($('body').text());

    if (target.label === 'wipes' && wipeDatesSummary) {
      mainText = normalizeWhitespace(`${mainText} ${wipeDatesSummary}`);
    }

    if (target.label === 'status' && serverStatusSummary) {
      mainText = normalizeWhitespace(`${mainText} ${serverStatusSummary}`);
    }

    if (!mainText || mainText.length < 120) {
      console.warn(`Skipping ${result.path}: content too short after parsing.`);
      continue;
    }

    const chunks = chunkText(mainText, chunkSize, overlapSize);

    chunks.forEach((content, index) => {
      collected.push({
        id: `${result.path === '/' ? 'home' : result.path.replace(/^\//, '').replace(/\//g, '-')}-${index + 1}`,
        title,
        url: result.url,
        path: result.path,
        content
      });
    });

    console.info(`Indexed ${result.path} -> ${chunks.length} chunks`);
  }

  if (collected.length === 0) {
    throw new Error('No website content was indexed. Check WEBSITE_BASE_URL and page availability.');
  }

  const output = {
    version: 1,
    builtAt: new Date().toISOString(),
    baseUrl,
    embeddingModel: null,
    chunkSize,
    overlapSize,
    chunks: collected
  };

  await fs.mkdir(path.dirname(outputPath), { recursive: true });
  await fs.writeFile(outputPath, JSON.stringify(output, null, 2), 'utf8');

  console.info(`Done. Wrote ${collected.length} chunks to ${outputPath}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
