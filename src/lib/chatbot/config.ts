import { RouteIntent } from '@/lib/chatbot/types';

export const FALLBACK_NOT_FOUND_MESSAGE = "I couldn't find that on the website.";

export const MAX_USER_MESSAGE_LENGTH = 500;
export const MIN_USER_MESSAGE_LENGTH = 2;

export const RATE_LIMIT_WINDOW_MS = 60_000;
export const RATE_LIMIT_MAX_REQUESTS = 12;

export const RETRIEVAL_MIN_SCORE = 0.32;
export const RETRIEVAL_MIN_STRONG_MATCHES = 1;
export const RETRIEVAL_TOP_K = 6;
export const RETRIEVAL_CANDIDATE_POOL = 24;
export const GROUNDING_MIN_COVERAGE = 0.45;

export const DEFAULT_CHAT_MODEL = 'gpt-5.4-mini';
export const DEFAULT_EMBEDDING_MODEL = 'text-embedding-3-small';

export const ROUTE_PRIORITY: Record<RouteIntent, string[]> = {
  status: ['/status', '/servers'],
  wipes: ['/wipes', '/wipe-info'],
  errors: ['/dayz-error-codes'],
  join: ['/join'],
  rules_building: ['/rules/building', '/rules', '/faq'],
  rules_general: ['/rules', '/faq', '/rules/building'],
  general: []
};

const routeKeywords: Record<RouteIntent, string[]> = {
  status: ['status', 'online', 'offline', 'server up', 'server down', 'player count', 'ping', 'population'],
  wipes: ['wipe', 'wipes', 'reset', 'fresh wipe', 'wipe schedule', 'next wipe', 'wipe date'],
  errors: ['error', 'code', '0x', 'kick', 'battleye', 'battlEye', 'verification', 'data verification', 've_data', 'pbo', 'more recent version'],
  join: ['join', 'mods', 'launcher', 'install', 'connect', 'how to join', 'discord join', 'dzsa'],
  rules_building: [
    'building rules',
    'base building',
    'build my base',
    'build a base',
    'base 800m',
    'away from trader',
    'from trader',
    'trader distance',
    'trader radius',
    'build radius',
    'territory',
    'ai mission',
    'military area',
    'namalsk',
    'how close can i build'
  ],
  rules_general: [
    'rules',
    'faq',
    'pvp',
    'ticket',
    'support',
    'report something broken',
    'something breaks',
    'contact if something breaks',
    'dm admins',
    'dm admin',
    'open a ticket',
    'who do i contact',
    'something broke',
    'report something broken',
    'heli vanished'
  ],
  general: []
};

export function detectRouteIntent(query: string): RouteIntent {
  const normalized = query.toLowerCase();

  for (const intent of ['status', 'wipes', 'errors', 'join', 'rules_building', 'rules_general'] as const) {
    if (routeKeywords[intent].some((keyword) => normalized.includes(keyword.toLowerCase()))) {
      return intent;
    }
  }

  return 'general';
}
