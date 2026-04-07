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

export interface WeekdayTrafficPoint {
  day: number;
  avgPlayers: number | null;
  sampleCount: number;
}

export interface HeatmapCell {
  /** Day of week: 0 = Sunday, 6 = Saturday */
  day: number;
  /** Hour of day: 0–23 */
  hour: number;
  /** Average player count for this cell */
  avgPlayers: number | null;
  /** Average occupancy % (0–100). null if maxPlayers unavailable */
  avgOccupancyPercent: number | null;
  /** Number of samples in this bucket */
  sampleCount: number;
}

export interface ActivityHeatmapData {
  /** 7x24 grid: [day][hour] */
  cells: HeatmapCell[];
  /** Maximum occupancy % in this heatmap (used for color scaling) */
  maxOccupancyPercent: number;
  /** Minimum occupancy % in this heatmap (for reference) */
  minOccupancyPercent: number;
  /** Whether enough data exists to show reliable patterns */
  hasEnoughData: boolean;
}

export type TimeRange = '6h' | '1d' | '7d' | '30d' | '90d' | '6m' | '1y';

export interface TimeRangeOption {
  label: string;
  value: TimeRange;
  days: number;
}

export const TIME_RANGE_OPTIONS: TimeRangeOption[] = [
  { label: '6H',  value: '6h',  days: 0.25 },
  { label: '1D',  value: '1d',  days: 1 },
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
  weekdayTraffic: WeekdayTrafficPoint[];
  heatmapData: ActivityHeatmapData;
  lastSnapshotTime: string | null;
  hasEnoughData: boolean;
  dataPointCount: number;
}
