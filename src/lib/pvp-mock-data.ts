import { PlayerStat } from './PvPScoreboard';

// Realistic DayZ player names
const PLAYER_NAMES = [
  'CombatMedic', 'SniperEagle', 'ZombieSlayer', 'SurvivalKing', 'HeadshotMaster',
  'ShadowReaper', 'IceBlood', 'TacticalOps', 'NorthernForce', 'GhostWalker',
  'VenomStrike', 'IronWill', 'NovaMind', 'EchoVoid', 'SilentAssassin',
  'PhantomBlade', 'ScarletFury', 'ThunderStrike', 'NightHunter', 'IceWolf',
  'StormBringer', 'DarkShade', 'VenomFang', 'NeonShadow', 'VortexKing',
  'CrimsonEdge', 'NovaForce', 'ShadowSmith', 'VenomClaw', 'IceMantis',
  'PhantomForce', 'CyberNinja', 'EchoStrike', 'NorthStar', 'DeathBringer',
];

export function generateMockPlayers(count: number = 30): PlayerStat[] {
  const players: PlayerStat[] = [];

  for (let i = 0; i < count; i++) {
    const baseKills = Math.floor(Math.random() * 200) + 20;
    const baseDeaths = Math.floor(baseKills * (Math.random() * 1.5 + 0.3));
    const headshots = Math.floor(baseKills * (Math.random() * 0.4 + 0.1));
    const playtime = Math.floor(Math.random() * 300) + 30; // 30 mins to 330 mins

    const trend = Math.random() > 0.5 ? 'up' : (Math.random() > 0.5 ? 'down' : 'stable');
    const trendValue = Math.floor(Math.random() * 8) + 1;

    const isOnline = Math.random() > 0.3; // 70% online

    players.push({
      rank: i + 1,
      playerId: `PLAYER_${Math.random().toString(36).substring(2, 10).toUpperCase()}`,
      playerName: PLAYER_NAMES[i % PLAYER_NAMES.length],
      kills: baseKills,
      deaths: baseDeaths,
      headshots: headshots,
      playtime: playtime,
      lastSeen: new Date(Date.now() - Math.random() * 3600000).toLocaleString(),
      isOnline,
      trend: trend as 'up' | 'down' | 'stable',
      trendValue,
    });
  }

  // Sort by kills to make it realistic
  players.sort((a, b) => b.kills - a.kills);

  // Re-rank based on kills
  return players.map((p, idx) => ({
    ...p,
    rank: idx + 1,
  }));
}
