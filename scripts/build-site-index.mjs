import { promises as fs } from 'node:fs';
import path from 'node:path';
import nextEnv from '@next/env';
import { load } from 'cheerio';
import ts from 'typescript';

const { loadEnvConfig } = nextEnv;
loadEnvConfig(process.cwd());

const baseUrl = (process.env.WEBSITE_BASE_URL || '').trim().replace(/\/$/, '');
const outputPath = path.join(process.cwd(), 'data/chatbot/site-index.json');
const appDir = path.join(process.cwd(), 'src/app');
const componentsDir = path.join(process.cwd(), 'src/components');
const dataDir = path.join(process.cwd(), 'src/data');
const chunkSize = 1200;
const overlapSize = 220;
const sourceTextMinLength = 80;

if (!baseUrl) {
  throw new Error('WEBSITE_BASE_URL is required. Example: https://dayzcdn.com');
}

const routeAliasTargets = [
  { label: 'status', candidates: ['/status', '/servers'] },
  { label: 'wipes', candidates: ['/wipes', '/wipe-info'] },
  { label: 'faq', candidates: ['/faq', '/rules'] }
];

const componentFolderRouteMap = {
  admin: '/admin',
  'error-codes': '/dayz-error-codes',
  events: '/events',
  features: '/features',
  intelligence: '/servers',
  layout: '/',
  news: '/',
  rules: '/rules',
  sections: '/',
  server: '/servers',
  store: '/store',
  ui: '/'
};

const dataFileRouteMap = {
  'dayzErrorCodes.ts': '/dayz-error-codes',
  'dayzErrorReferences.ts': '/dayz-error-codes',
  'news-feed.json': '/',
  'wipe-dates.json': '/wipe-info'
};

function normalizeWhitespace(value) {
  return value.replace(/\s+/g, ' ').trim();
}

function slugify(input) {
  return input
    .replace(/[^a-zA-Z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .toLowerCase();
}

function dedupe(values) {
  return [...new Set(values)];
}

function formatRouteLabel(routePath) {
  if (routePath === '/') {
    return 'homepage';
  }

  return routePath
    .replace(/^\//, '')
    .split('/')
    .map((segment) => segment.replace(/[-_]/g, ' '))
    .join(' ');
}

function buildChunkId(prefix, index) {
  return `${prefix}-${index + 1}`;
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

function shouldSkipRouteSegment(segment) {
  return segment === 'api' || segment.startsWith('(') || segment.startsWith('_');
}

function toRoutePath(segments) {
  const routeSegments = segments.filter((segment) => !segment.startsWith('('));
  return routeSegments.length === 0 ? '/' : `/${routeSegments.join('/')}`;
}

async function discoverRouteTargets(dirPath = appDir, routeSegments = []) {
  const entries = await fs.readdir(dirPath, { withFileTypes: true });
  const targets = [];

  const hasPage = entries.some((entry) => entry.isFile() && entry.name === 'page.tsx');
  if (hasPage) {
    const routePath = toRoutePath(routeSegments);
    targets.push({
      label: formatRouteLabel(routePath),
      candidates: [routePath]
    });
  }

  for (const entry of entries) {
    if (!entry.isDirectory() || shouldSkipRouteSegment(entry.name)) {
      continue;
    }

    const nested = await discoverRouteTargets(path.join(dirPath, entry.name), [...routeSegments, entry.name]);
    targets.push(...nested);
  }

  return targets;
}

async function listFilesRecursive(dirPath) {
  const entries = await fs.readdir(dirPath, { withFileTypes: true });
  const files = [];

  for (const entry of entries) {
    const entryPath = path.join(dirPath, entry.name);

    if (entry.isDirectory()) {
      files.push(...await listFilesRecursive(entryPath));
      continue;
    }

    files.push(entryPath);
  }

  return files;
}

function getJsxAttributeName(name) {
  if (ts.isIdentifier(name)) {
    return name.text;
  }

  return name.getText();
}

function getPropertyNameText(name) {
  if (ts.isIdentifier(name) || ts.isStringLiteral(name) || ts.isNumericLiteral(name)) {
    return String(name.text);
  }

  return name.getText();
}

function isLikelyUtilityString(value) {
  return /(^[a-z]+:)|(^[a-z0-9-]+\/[a-z0-9-])|(^[./@])/.test(value) || /^[a-z0-9-_:./#]+$/i.test(value);
}

function isMeaningfulText(value) {
  const normalized = normalizeWhitespace(value);
  if (normalized.length < 2) {
    return false;
  }

  if (normalized === 'use client' || normalized === 'use server') {
    return false;
  }

  if (!/[a-zA-Z]/.test(normalized)) {
    return false;
  }

  if (normalized.length < 8 && !normalized.includes(' ')) {
    return false;
  }

  if (!normalized.includes(' ') && isLikelyUtilityString(normalized)) {
    return false;
  }

  return true;
}

function shouldIncludeStringLiteral(node) {
  const parent = node.parent;

  if (!parent) {
    return true;
  }

  if (ts.isImportDeclaration(parent) || ts.isExportDeclaration(parent)) {
    return false;
  }

  if (ts.isCallExpression(parent) && parent.expression.kind === ts.SyntaxKind.ImportKeyword) {
    return false;
  }

  if (ts.isJsxAttribute(parent)) {
    const attributeName = getJsxAttributeName(parent.name);
    return ['aria-label', 'title', 'placeholder', 'alt'].includes(attributeName);
  }

  if (ts.isPropertyAssignment(parent)) {
    const propertyName = getPropertyNameText(parent.name);
    if (['className', 'href', 'src', 'variant', 'type', 'name', 'icon', 'id', 'key'].includes(propertyName)) {
      return false;
    }
  }

  return true;
}

function extractTextFromTsSource(sourceText, filePath) {
  const sourceFile = ts.createSourceFile(filePath, sourceText, ts.ScriptTarget.Latest, true, filePath.endsWith('.tsx') ? ts.ScriptKind.TSX : ts.ScriptKind.TS);
  const extracted = [];

  function pushValue(value) {
    const normalized = normalizeWhitespace(value);
    if (isMeaningfulText(normalized)) {
      extracted.push(normalized);
    }
  }

  function visit(node) {
    if (ts.isJsxText(node)) {
      pushValue(node.getText(sourceFile));
    } else if (ts.isStringLiteral(node) || ts.isNoSubstitutionTemplateLiteral(node)) {
      if (shouldIncludeStringLiteral(node)) {
        pushValue(node.text);
      }
    }

    ts.forEachChild(node, visit);
  }

  visit(sourceFile);
  return dedupe(extracted);
}

function collectJsonStrings(value, results = []) {
  if (typeof value === 'string') {
    const normalized = normalizeWhitespace(value);
    if (isMeaningfulText(normalized)) {
      results.push(normalized);
    }
    return results;
  }

  if (Array.isArray(value)) {
    value.forEach((item) => collectJsonStrings(item, results));
    return results;
  }

  if (value && typeof value === 'object') {
    Object.values(value).forEach((item) => collectJsonStrings(item, results));
  }

  return results;
}

async function extractTextFromSourceFile(filePath) {
  const extension = path.extname(filePath).toLowerCase();
  const raw = await fs.readFile(filePath, 'utf8');

  if (extension === '.json') {
    try {
      return dedupe(collectJsonStrings(JSON.parse(raw)));
    } catch {
      return [];
    }
  }

  if (extension === '.ts' || extension === '.tsx') {
    return extractTextFromTsSource(raw, filePath);
  }

  return [];
}

function inferRoutePathFromSourceFile(filePath) {
  const relativeAppPath = path.relative(appDir, filePath);
  if (!relativeAppPath.startsWith('..')) {
    const parts = relativeAppPath.split(path.sep);
    const pageIndex = parts.findIndex((part) => part === 'page.tsx');
    if (pageIndex >= 0) {
      return toRoutePath(parts.slice(0, pageIndex));
    }

    const filtered = parts.filter((part) => !part.endsWith('.tsx') && !part.endsWith('.ts'));
    if (filtered.length > 0 && filtered[0] !== 'api') {
      return toRoutePath(filtered);
    }

    return '/';
  }

  const relativeComponentPath = path.relative(componentsDir, filePath);
  if (!relativeComponentPath.startsWith('..')) {
    const [folderName] = relativeComponentPath.split(path.sep);
    return componentFolderRouteMap[folderName] || '/';
  }

  const relativeDataPath = path.relative(dataDir, filePath);
  if (!relativeDataPath.startsWith('..')) {
    return dataFileRouteMap[path.basename(filePath)] || '/';
  }

  return '/';
}

async function buildSourceSupplementEntries() {
  const sourceDirectories = [appDir, componentsDir, dataDir];
  const candidateFiles = [];

  for (const directory of sourceDirectories) {
    try {
      candidateFiles.push(...await listFilesRecursive(directory));
    } catch {
      // Directory may not exist in all workspaces.
    }
  }

  const sourceFiles = candidateFiles.filter((filePath) => /\.(ts|tsx|json)$/i.test(filePath));
  const groupedByRoute = new Map();

  for (const filePath of sourceFiles) {
    const extracted = await extractTextFromSourceFile(filePath);
    if (extracted.length === 0) {
      continue;
    }

    const routePath = inferRoutePathFromSourceFile(filePath);
    const relativePath = path.relative(process.cwd(), filePath).replace(/\\/g, '/');
    const current = groupedByRoute.get(routePath) || [];
    current.push(`Source file: ${relativePath}`);
    current.push(...extracted);
    groupedByRoute.set(routePath, current);
  }

  const entries = [];

  for (const [routePath, fragments] of groupedByRoute.entries()) {
    const content = normalizeWhitespace(dedupe(fragments).join(' '));
    if (content.length < sourceTextMinLength) {
      continue;
    }

    entries.push({
      label: `${formatRouteLabel(routePath)} source`,
      title: `${formatRouteLabel(routePath)} source content`,
      url: `${baseUrl}${routePath === '/' ? '' : routePath}`,
      path: routePath,
      content,
      idPrefix: `${routePath === '/' ? 'home' : routePath.replace(/^\//, '').replace(/\//g, '-')}-source`
    });
  }

  return entries;
}

function addSupplementalApiSummaries(targetPath, mainText, wipeDatesSummary, serverStatusSummary) {
  let content = mainText;

  if ((targetPath === '/wipes' || targetPath === '/wipe-info') && wipeDatesSummary) {
    content = normalizeWhitespace(`${content} ${wipeDatesSummary}`);
  }

  if ((targetPath === '/status' || targetPath === '/servers') && serverStatusSummary) {
    content = normalizeWhitespace(`${content} ${serverStatusSummary}`);
  }

  return content;
}

function buildChunksForEntry(entry) {
  const chunks = chunkText(entry.content, chunkSize, overlapSize);

  return chunks.map((content, index) => ({
    id: buildChunkId(entry.idPrefix, index),
    title: entry.title,
    url: entry.url,
    path: entry.path,
    content
  }));
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
  const seenChunkKeys = new Set();
  const wipeDatesSummary = await fetchWipeDatesSummary();
  const serverStatusSummary = await fetchServerStatusSummary();
  const discoveredTargets = await discoverRouteTargets();
  const pageTargets = dedupe([
    ...discoveredTargets.map((target) => JSON.stringify(target)),
    ...routeAliasTargets.map((target) => JSON.stringify(target))
  ]).map((value) => JSON.parse(value));

  console.info(`Discovered ${discoveredTargets.length} page routes and ${routeAliasTargets.length} alias targets`);

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
    mainText = addSupplementalApiSummaries(result.path, mainText, wipeDatesSummary, serverStatusSummary);

    if (!mainText || mainText.length < 120) {
      console.warn(`Skipping ${result.path}: content too short after parsing.`);
      continue;
    }

    const renderedChunks = buildChunksForEntry({
      idPrefix: `${result.path === '/' ? 'home' : result.path.replace(/^\//, '').replace(/\//g, '-')}-rendered`,
      title,
      url: result.url,
      path: result.path,
      content: mainText
    });

    renderedChunks.forEach((chunk) => {
      const key = `${chunk.path}:${chunk.content}`;
      if (!seenChunkKeys.has(key)) {
        seenChunkKeys.add(key);
        collected.push(chunk);
      }
    });

    console.info(`Indexed rendered ${result.path} -> ${renderedChunks.length} chunks`);
  }

  const sourceEntries = await buildSourceSupplementEntries();
  for (const entry of sourceEntries) {
    const sourceChunks = buildChunksForEntry(entry);

    sourceChunks.forEach((chunk) => {
      const key = `${chunk.path}:${chunk.content}`;
      if (!seenChunkKeys.has(key)) {
        seenChunkKeys.add(key);
        collected.push(chunk);
      }
    });

    console.info(`Indexed source ${entry.path} -> ${sourceChunks.length} chunks`);
  }

  if (collected.length === 0) {
    throw new Error('No website content was indexed. Check WEBSITE_BASE_URL and page availability.');
  }

  const output = {
    version: 2,
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
