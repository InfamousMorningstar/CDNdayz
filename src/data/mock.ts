// Mock Data for CDN Website
// Replace these with API calls or CMS data later

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
    discord: '#',
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
    discord: '#',
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
    discord: '#',
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
  date: string;
  description: string;
  status: 'upcoming' | 'active' | 'completed';
  rewards?: string;
  type: 'PvE' | 'PvP Zone' | 'Race' | 'Roleplay';
}

export const events: Event[] = [
  {
    id: 'supply-drop-alpha',
    title: 'Operation Supply Drop',
    date: 'March 25, 2026 - 18:00 EST',
    description: 'A massive supply drop is inbound at NWAF. Secure the area from AI guards and claim high-tier loot.',
    status: 'upcoming',
    rewards: 'Class 4 Armor, Custom Vehicles',
    type: 'PvE',
  },
  {
    id: 'bounty-hunt',
    title: 'The Bear Hunt',
    date: 'March 22, 2026 - 20:00 EST',
    description: 'Increased bear spawns in the south. Collect pelts for double trader value.',
    status: 'active',
    rewards: 'Double Rubles',
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
      'Be respectful to all players and staff.',
      'No hate speech, racism, or harassment of any kind.',
      'English only in global chat.',
      'No advertising other servers or networks.',
    ],
  },
  {
    title: 'PvE Rules',
    rules: [
      'No killing other players (except in designated PvP zones).',
      'No stealing from player bases or vehicles.',
      'No griefing or intentionally destroying player property.',
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
