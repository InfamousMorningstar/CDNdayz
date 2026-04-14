import { detectRouteIntent } from '@/lib/chatbot/config';

const synonymExpansions: Record<string, string[]> = {
  wipe: ['reset', 'wipe schedule', 'next projected wipe window'],
  wipes: ['reset', 'wipe schedule', 'next projected wipe window'],
  status: ['server status', 'online', 'population'],
  errors: ['error codes', 'warning codes', 'troubleshooting'],
  join: ['how to join', 'launcher', 'mods'],
  mods: ['mods', 'launcher', 'workshop'],
  dzsa: ['launcher', 'mods', 'join']
};

export function rewriteQueryForRetrieval(query: string): string {
  const normalized = query.toLowerCase().trim();
  const tokens = normalized.split(/\s+/).filter(Boolean);
  const expanded = new Set<string>(tokens);

  tokens.forEach((token) => {
    const synonyms = synonymExpansions[token];
    if (synonyms) {
      synonyms.forEach((item) => expanded.add(item));
    }
  });

  const routeIntent = detectRouteIntent(query);
  if (routeIntent === 'wipes') {
    expanded.add('wipe-info');
    expanded.add('next projected wipe window');
  }

  if (routeIntent === 'status') {
    expanded.add('servers');
    expanded.add('live status');
  }

  if (routeIntent === 'errors') {
    expanded.add('dayz-error-codes');
  }

  if (routeIntent === 'join') {
    expanded.add('join guide');
  }

  return Array.from(expanded).join(' ');
}
