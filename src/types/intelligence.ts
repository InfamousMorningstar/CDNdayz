// Types for the Server Intelligence feature

export interface PopulationSnapshot {
  serverId: string;
  serverName: string;
  /** Unix timestamp in milliseconds */
  timestamp: number;
  playerCount: number;
  maxPlayers: number;
  status: 'online' | 'offline' | 'restarting';
}

export interface ForecastPoint {
  hourOffset: number;
  label: string;
  predictedPlayers: number;
}

export type TimeRange = '7d' | '30d' | '90d' | '6m' | '1y';

export interface TimeRangeOption {
  label: string;
  value: TimeRange;
  days: number;
}

export const TIME_RANGE_OPTIONS: TimeRangeOption[] = [
  { label: '7D',  value: '7d',  days: 7 },
  { label: '30D', value: '30d', days: 30 },
  { label: '90D', value: '90d', days: 90 },
  { label: '6M',  value: '6m',  days: 182 },
  { label: '1Y',  value: '1y',  days: 365 },
];

export interface ServerAnalytics {
  serverId: string;
  serverName: string;
  timeRange: TimeRange;
  /** Online-only, sorted snapshots used to compute these stats */
  snapshots: PopulationSnapshot[];
  avgPlayers: number;
  peakPlayers: number;
  lowestPlayers: number;
  /** Trend based on first-half vs second-half average comparison */
  trendDirection: 'up' | 'down' | 'stable' | 'insufficient';
  trendPercent: number;
  peakTime: string | null;       // ISO string (serialisable)
  quietestTime: string | null;   // ISO string (serialisable)
  /** 0–23, local time */
  busiestHour: number | null;
  quietestHour: number | null;
  /** 0 = Sunday, 6 = Saturday */
  busiestDayOfWeek: number | null;
  quietestDayOfWeek: number | null;
  insightSummary: string;
  bestTimeToPlay: string | null;
  nextBestWindow: string | null;
  reliabilityScore: number;
  anomalySummary: string | null;
  forecast: ForecastPoint[];
  forecastConfidence: 'low' | 'medium' | 'high';
  lastSnapshotTime: string | null;
  hasEnoughData: boolean;
  dataPointCount: number;
}
