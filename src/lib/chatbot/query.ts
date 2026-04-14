import { detectRouteIntent } from '@/lib/chatbot/config';

const synonymExpansions: Record<string, string[]> = {
  wipe: ['reset', 'wipe schedule', 'next projected wipe window'],
  wipes: ['reset', 'wipe schedule', 'next projected wipe window'],
  status: ['server status', 'online', 'population'],
  errors: ['error codes', 'warning codes', 'troubleshooting'],
  join: ['how to join', 'launcher', 'mods'],
  mods: ['mods', 'launcher', 'workshop'],
  dzsa: ['launcher', 'mods', 'join'],
  trader: ['trader distance', 'trader radius', 'building rules'],
  base: ['base building', 'building rules', 'territory'],
  build: ['build radius', 'building rules', 'base building'],
  territory: ['base building', 'building rules', 'flag kit'],
  broken: ['discord', 'ticket', 'support'],
  breaks: ['discord', 'ticket', 'support'],
  admins: ['ticket system', 'do not dm admins', 'discord'],
  admin: ['ticket system', 'do not dm admins', 'discord'],
  pbo: ['ve_data', 'mods', 'verification', 'more recent version'],
  've_data': ['0x00040093', 'mods', 'verification', 'pbo']
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

  if (routeIntent === 'rules_building') {
    expanded.add('rules faq');
    expanded.add('building rules');
    expanded.add('base building');
    expanded.add('trader distance');
    expanded.add('trader radius');
    expanded.add('military distances');
    expanded.add('territory setup');
    expanded.add('ticket system');
    expanded.add('discord support');
    expanded.add('do not dm admins');
    expanded.add('rules/building');
  }

  if (routeIntent === 'rules_general') {
    expanded.add('rules faq');
    expanded.add('community standards');
    expanded.add('ticket system');
    expanded.add('discord support');
    expanded.add('do not dm admins');
    expanded.add('who do i contact if something breaks');
    expanded.add('pvp allowed');
  }

  if (routeIntent === 'errors') {
    expanded.add('ve_data');
    expanded.add('0x00040093');
    expanded.add('pbo');
    expanded.add('more recent version');
    expanded.add('mod verification');
  }

  return Array.from(expanded).join(' ');
}
