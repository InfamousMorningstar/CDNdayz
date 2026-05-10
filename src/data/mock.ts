// Mock Data for CDN Website
// Replace these with API calls or CMS data later

import { DISCORD_INVITE_URL } from '@/lib/links';

export interface Server {
  id: string;
  name: string;
  map: string;
  ip: string;
  port: number;
  discord: string;
  playersOnline: number;
  maxPlayers: number;
  status: 'online' | 'offline' | 'restarting' | 'maintenance';
  wipeDate: string;
  description: string;
}

export const servers: Server[] = [
  {
    id: 'deer-isle',
    name: 'CDN Deer Isle PvE',
    map: 'Deer Isle',
    ip: '127.0.0.1', // Placeholder
    port: 2302,
    discord: DISCORD_INVITE_URL,
    playersOnline: 42,
    maxPlayers: 100,
    status: 'online',
    wipeDate: '2023-11-20',
    description: 'Explore the vast mysteries of Deer Isle with cryptic quests and custom traders.',
  },
  {
    id: 'namalsk',
    name: 'CDN Namalsk Hardcore PvE',
    map: 'Namalsk',
    ip: '127.0.0.1', // Placeholder
    port: 2402,
    discord: DISCORD_INVITE_URL,
    playersOnline: 88,
    maxPlayers: 100,
    status: 'online',
    wipeDate: '2023-12-01',
    description: 'Survive the harsh cold of Namalsk. Hardcore survival mechanics enabled.',
  },
  {
    id: 'chernarus',
    name: 'CDN Chernarus Classic PvE',
    map: 'Chernarus',
    ip: '127.0.0.1', // Placeholder
    port: 2502,
    discord: DISCORD_INVITE_URL,
    playersOnline: 12,
    maxPlayers: 60,
    status: 'restarting',
    wipeDate: '2023-10-15',
    description: 'The classic experience with quality of life mods and base building focus.',
  },
];

export interface Event {
  id: string;
  title: string;
  map?: string;
  date: string;
  startsAtUtc?: string;
  duration?: string;
  description: string;
  status: 'upcoming' | 'active' | 'completed';
  rewards?: string;
  type: 'PvE' | 'PvP Zone' | 'Race' | 'Roleplay';
}

export const events: Event[] = [
  {
    id: 'deer-isle-search-seizure',
    title: 'Search and Seizure',
    map: 'Deer Isle',
    date: '09 MAY 26 // 0100 UTC',
    startsAtUtc: '2026-05-09T19:00:00-06:00',
    duration: '3 hours',
    description: 'Deer Isle. Sweep, seize, extract with high-value loot.',
    status: 'upcoming',
    rewards: 'Rare loot, including Ant Miner, 5-time loot-saving armbands, safehouse keycards (10 uses), Donation Gear/Items, and much more. High-risk toxic zone operation.',
    type: 'PvE',
  },
  {
    id: 'noob-chernarus-rify-search-seizure',
    title: 'Search and Seizure',
    map: 'Noob Chernarus',
    date: '02 MAY 26 // 20:00 UTC',
    startsAtUtc: '2026-05-02T20:00:00Z',
    duration: '3 hours',
    description: 'Noob Chernarus. Sweep, seize, extract with high-value loot.',
    status: 'completed',
    rewards: 'Rare loot, including Ant Miner, 5-time loot-saving armbands, safehouse keycards (10 uses), Donation Gear/Items, and much more. High-risk toxic zone operation.',
    type: 'PvE',
  },
];

export interface RuleSection {
  title: string;
  rules: string[];
}

export const rulesData: RuleSection[] = [
  {
    title: 'General Conduct',
    rules: [
      'Be respectful to all survivors and staff.',
      'No hate speech, racism, or harassment of any kind.',
      'English only in global comms.',
      'No advertising other servers or networks.',
    ],
  },
  {
    title: 'PvE Rules',
    rules: [
      'No killing other survivors (except in designated PvP zones).',
      'No stealing from survivor bases or vehicles.',
      'No griefing or intentionally destroying survivor property.',
      'Loot cycling is prohibited.',
    ],
  },
  {
    title: 'Base Building',
    rules: [
      'Do not build within 1000m of military zones.',
      'Do not block roads or important loot spawns.',
      'Keep base complexity reasonable to prevent server lag.',
      'One base per group/clan.',
    ],
  },
];
