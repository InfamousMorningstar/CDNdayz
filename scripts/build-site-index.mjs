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

  for (const target of pageTargets) {
    const result = await fetchPage(target.candidates);

    if (!result) {
      console.warn(`Skipping ${target.label}: no reachable path in ${target.candidates.join(', ')}`);
      continue;
    }

    const $ = load(result.html);
    $('script, style, noscript').remove();

    const title = normalizeWhitespace($('title').first().text()) || target.label;
    const mainText = normalizeWhitespace($('main').text()) || normalizeWhitespace($('body').text());

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
