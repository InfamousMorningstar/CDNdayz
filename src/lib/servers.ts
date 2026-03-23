// src/lib/servers.ts

export interface ServerConfig {
  id: string;
  name: string;
  map: string;
  host: string;
  port: number; // Query Port (Game Port + 1)
  gamePort: number; // Game Port (for connection)
  type: string; // e.g. 'dayz'
}

export interface ServerStatus {
  id: string;
  name: string;
  map: string;
  players: number;
  maxPlayers: number;
  ping: number;
  connect: string;
  status: 'online' | 'offline';
}

export const servers: ServerConfig[] = [
  {
    id: "banov-scifi",
    name: "CDN Banov SciFi",
    map: "Banov",
    host: "65.7.2.44",
    port: 2534,
    gamePort: 2533,
    type: "dayz"
  },
  {
    id: "chernarus-hardcore",
    name: "CDN Chernarus Hardcore",
    map: "Chernarus",
    host: "65.7.2.44",
    port: 2433,
    gamePort: 2432,
    type: "dayz"
  },
  {
    id: "livonia-snow",
    name: "CDN Livonia Snow Hardcore",
    map: "Livonia",
    host: "65.7.2.44",
    port: 2423,
    gamePort: 2422,
    type: "dayz"
  },
  {
    id: "banov-modded",
    name: "CDN Banov Modded",
    map: "Banov",
    host: "99.199.82.20",
    port: 2423,
    gamePort: 2422,
    type: "dayz"
  },
  {
    id: "bitterroot",
    name: "CDN Bitterroot Modded",
    map: "Bitterroot",
    host: "99.199.82.20",
    port: 2433,
    gamePort: 2432,
    type: "dayz"
  },
  {
    id: "chernarus-modded",
    name: "CDN Chernarus Modded",
    map: "Chernarus",
    host: "99.199.82.20",
    port: 2567,
    gamePort: 2566,
    type: "dayz"
  },
  {
    id: "chernarus-noob",
    name: "CDN Chernarus Noob Friendly",
    map: "Chernarus",
    host: "99.199.82.20",
    port: 2493,
    gamePort: 2492,
    type: "dayz"
  },
  {
    id: "deerisle",
    name: "CDN Deer Isle Modded",
    map: "Deer Isle",
    host: "99.199.82.20",
    port: 2453,
    gamePort: 2452,
    type: "dayz"
  },
  {
    id: "livonia-modded",
    name: "CDN Livonia Modded",
    map: "Livonia",
    host: "99.199.82.20",
    port: 2483,
    gamePort: 2482,
    type: "dayz"
  },
  {
    id: "sakhal",
    name: "CDN Sakhal Modded",
    map: "Sakhal",
    host: "99.199.82.20",
    port: 2513,
    gamePort: 2512,
    type: "dayz"
  },
  {
    id: "namalsk",
    name: "CDN Namalsk Modded",
    map: "Namalsk",
    host: "99.199.82.20",
    port: 2523,
    gamePort: 2522,
    type: "dayz"
  },
  {
    id: "walking-dead",
    name: "CDN Walking Dead Hardcore",
    map: "Chernarus",
    host: "99.199.82.20",
    port: 2534,
    gamePort: 2533,
    type: "dayz"
  }
];
