/**
 * population-analytics.ts
 *
 * Pure, side-effect-free functions for computing Server Intelligence analytics
 * from raw PopulationSnapshot arrays.
 *
 * All computation happens client-side so the API layer stays thin.
 * Every function is safe to call with empty or incomplete data.
 */

import {
  ForecastPoint,
  PopulationSnapshot,
  ServerAnalytics,
  TimeRange,
} from '@/types/intelligence';

// ── Constants ──────────────────────────────────────────────────────────────

export const HOUR_LABELS = [
  '12am','1am','2am','3am','4am','5am','6am','7am',
  '8am','9am','10am','11am',
  '12pm','1pm','2pm','3pm','4pm','5pm','6pm','7pm',
  '8pm','9pm','10pm','11pm',
];

export const DAY_NAMES = [
  'Sunday','Monday','Tuesday','Wednesday',
  'Thursday','Friday','Saturday',
];

/** Minimum online snapshots required before we trust the computed analytics. */
const MIN_DATA_POINTS = 5;

/** Minimum online snapshots required for trend calculation. */
const MIN_TREND_SNAPSHOTS = 10;

/** Relative percent threshold for trend direction. */
const TREND_THRESHOLD_PERCENT = 8;

/**
 * Minimum samples required in a single hour-bucket before we treat that
 * hour's average as reliable.
 */
const MIN_HOURLY_SAMPLES = 2;

/** Minimum number of reliable hour buckets before hour insights are shown. */
const MIN_RELIABLE_HOUR_BUCKETS = 3;

/** Minimum samples per weekday bucket before it is considered reliable. */
const MIN_WEEKDAY_SAMPLES = 2;
const FORECAST_HOURS = 6;

// ── Helpers ────────────────────────────────────────────────────────────────

/** Return only snapshots where the server was reachable and reporting players. */
function onlineOnly(snapshots: PopulationSnapshot[]): PopulationSnapshot[] {
  return snapshots.filter((s) => s.status === 'online' || s.playerCount > 0);
}

function mean(values: number[]): number {
  if (values.length === 0) return 0;
  return Math.round(values.reduce((a, b) => a + b, 0) / values.length);
}

/**
 * Compare average player count in the first half of the window vs the second
 * to determine whether population is growing, shrinking, or stable.
 */
function calcTrend(snapshots: PopulationSnapshot[]): {
  direction: 'up' | 'down' | 'stable' | 'insufficient';
  percent: number;
} {
  const online = onlineOnly(snapshots);
  if (online.length < MIN_TREND_SNAPSHOTS) {
    return { direction: 'insufficient', percent: 0 };
  }

  const mid = Math.floor(online.length / 2);
  const firstAvg = mean(online.slice(0, mid).map((s) => s.playerCount));
  const secondAvg = mean(online.slice(mid).map((s) => s.playerCount));

  if (firstAvg === 0) return { direction: 'stable', percent: 0 };

  const pct = ((secondAvg - firstAvg) / firstAvg) * 100;
  if (pct > TREND_THRESHOLD_PERCENT) {
    return { direction: 'up', percent: Math.round(pct) };
  }
  if (pct < -TREND_THRESHOLD_PERCENT) {
    return { direction: 'down', percent: Math.round(Math.abs(pct)) };
  }
  return { direction: 'stable', percent: Math.round(Math.abs(pct)) };
}

/**
 * Group snapshots by local hour of day, return a map of hour → average players.
 * Hours with fewer than MIN_HOURLY_SAMPLES are excluded.
 */
function hourlyAverages(snapshots: PopulationSnapshot[]): Map<number, number> {
  const buckets = new Map<number, number[]>();

  for (const s of onlineOnly(snapshots)) {
    const h = new Date(s.timestamp).getHours();
    const bucket = buckets.get(h) ?? [];
    bucket.push(s.playerCount);
    buckets.set(h, bucket);
  }

  const result = new Map<number, number>();
  for (const [h, counts] of buckets) {
    if (counts.length >= MIN_HOURLY_SAMPLES) {
      result.set(h, mean(counts));
    }
  }
  return result;
}

/**
 * Group snapshots by local day-of-week, return a map of weekday → average players.
 */
function weekdayAverages(snapshots: PopulationSnapshot[]): Map<number, number> {
  const buckets = new Map<number, number[]>();

  for (const s of onlineOnly(snapshots)) {
    const d = new Date(s.timestamp).getDay();
    const bucket = buckets.get(d) ?? [];
    bucket.push(s.playerCount);
    buckets.set(d, bucket);
  }

  const result = new Map<number, number>();
  for (const [d, counts] of buckets) {
    if (counts.length >= MIN_WEEKDAY_SAMPLES) {
      result.set(d, mean(counts));
    }
  }
  return result;
}

/**
 * Return descriptive time-of-day label for an hour (0-23).
 */
function timeOfDayLabel(hour: number): string {
  if (hour >= 20 || hour < 4)  return 'late night';
  if (hour >= 17)              return 'evening';
  if (hour >= 12)              return 'afternoon';
  if (hour >= 6)               return 'morning';
  return 'early hours';
}

// ── Human-readable summaries ────────────────────────────────────────────────

function buildInsightSummary(
  hasEnoughData: boolean,
  trendDirection: 'up' | 'down' | 'stable' | 'insufficient',
  trendPercent: number,
  busiestHour: number | null,
  quietestHour: number | null,
  busiestDayOfWeek: number | null,
  quietestDayOfWeek: number | null,
): string {
  if (!hasEnoughData) {
    return "Not enough data yet — keep checking back as more server activity is recorded.";
  }

  const parts: string[] = [];

  // Trend sentence
  if (trendDirection === 'insufficient') {
    parts.push('Trend: insufficient data in this range (need at least 10 online snapshots).');
  } else if (trendDirection === 'up') {
    parts.push(`Population has been growing over this period (up ~${trendPercent}%).`);
  } else if (trendDirection === 'down') {
    parts.push(`Population has been quieting down over this period (down ~${trendPercent}%).`);
  } else {
    parts.push('Population has been mostly stable over this period.');
  }

  // Busiest period
  if (busiestHour !== null) {
    parts.push(
      `This server is most active in the ${timeOfDayLabel(busiestHour)} (around ${HOUR_LABELS[busiestHour]}).`,
    );
  }

  // Quietest period
  if (quietestHour !== null) {
    parts.push(
      `Quietest time is around ${HOUR_LABELS[quietestHour]}.`,
    );
  }

  if (busiestDayOfWeek !== null && quietestDayOfWeek !== null) {
    parts.push(
      `${DAY_NAMES[busiestDayOfWeek]} tends to be the busiest day, while ${DAY_NAMES[quietestDayOfWeek]} is usually quieter.`,
    );
  }

  return parts.join(' ');
}

function buildBestTimeToPlay(
  quietestHour: number | null,
  quietestDay: number | null,
): string | null {
  if (quietestHour === null) return null;
  const dayPart = quietestDay !== null ? `${DAY_NAMES[quietestDay]}s, ` : '';
  return `Best for quiet looting: ${dayPart}around ${HOUR_LABELS[quietestHour]}`;
}

function buildNextBestWindow(hourly: Map<number, number>): string | null {
  if (hourly.size < MIN_RELIABLE_HOUR_BUCKETS) return null;

  const now = new Date();
  const currentHour = now.getHours();
  const candidates = Array.from({ length: 24 }, (_, i) => (currentHour + i) % 24)
    .map((hour) => ({ hour, avg: hourly.get(hour) }))
    .filter((x): x is { hour: number; avg: number } => typeof x.avg === 'number');

  if (candidates.length === 0) return null;

  candidates.sort((a, b) => a.avg - b.avg);
  const best = candidates[0];
  const nextHour = (best.hour + 1) % 24;
  return `Best quiet window in next 24h: ${HOUR_LABELS[best.hour]}-${HOUR_LABELS[nextHour]}`;
}

function buildReliabilityScore(snapshots: PopulationSnapshot[], hourly: Map<number, number>): number {
  if (snapshots.length === 0) return 0;

  const total = snapshots.length;
  const online = snapshots.filter((s) => s.status === 'online').length;
  const restarting = snapshots.filter((s) => s.status === 'restarting').length;
  const offline = snapshots.filter((s) => s.status === 'offline').length;

  const availabilityScore = (online / total) * 60;
  const restartPenalty = (restarting / total) * 20;
  const offlinePenalty = (offline / total) * 20;
  const coverageScore = Math.min(20, hourly.size * 2.5);

  const raw = availabilityScore + coverageScore - restartPenalty - offlinePenalty;
  return Math.max(0, Math.min(100, Math.round(raw)));
}

function buildAnomalySummary(snapshots: PopulationSnapshot[], hourly: Map<number, number>): string | null {
  const latest = [...snapshots].reverse().find((s) => s.status === 'online');
  if (!latest) return null;

  const h = new Date(latest.timestamp).getHours();
  const baseline = hourly.get(h);
  if (!baseline || baseline <= 0) return null;

  const diffPct = ((latest.playerCount - baseline) / baseline) * 100;
  if (Math.abs(diffPct) < 35 || Math.abs(latest.playerCount - baseline) < 5) {
    return null;
  }

  if (diffPct > 0) {
    return `Unusual surge: current players are ~${Math.round(diffPct)}% above the normal ${HOUR_LABELS[h]} baseline.`;
  }

  return `Unusual dip: current players are ~${Math.round(Math.abs(diffPct))}% below the normal ${HOUR_LABELS[h]} baseline.`;
}

function buildForecast(
  snapshots: PopulationSnapshot[],
  hourly: Map<number, number>,
): { forecast: ForecastPoint[]; confidence: 'low' | 'medium' | 'high' } {
  const online = onlineOnly(snapshots);
  const recent = online.slice(-6);
  const recentAvg = mean(recent.map((s) => s.playerCount));
  const latest = online[online.length - 1]?.playerCount ?? recentAvg;
  const momentum = latest - recentAvg;

  const now = new Date();
  const points: ForecastPoint[] = [];

  for (let i = 1; i <= FORECAST_HOURS; i++) {
    const hour = (now.getHours() + i) % 24;
    const baseline = hourly.get(hour) ?? recentAvg;
    const momentumWeight = (i / FORECAST_HOURS) * 0.35;
    const predicted = Math.max(0, Math.round(baseline * 0.75 + recentAvg * 0.25 + momentum * momentumWeight));
    points.push({
      hourOffset: i,
      label: HOUR_LABELS[hour],
      predictedPlayers: predicted,
    });
  }

  let confidence: 'low' | 'medium' | 'high' = 'low';
  if (online.length >= 72 && hourly.size >= 8) {
    confidence = 'high';
  } else if (online.length >= 24 && hourly.size >= 4) {
    confidence = 'medium';
  }

  return { forecast: points, confidence };
}

// ── Main export ─────────────────────────────────────────────────────────────

/**
 * Compute a complete ServerAnalytics object from raw snapshots.
 * Safe to call with an empty `snapshots` array — returns a zero-state object
 * with `hasEnoughData: false`.
 */
export function computeAnalytics(
  serverId: string,
  serverName: string,
  snapshots: PopulationSnapshot[],
  timeRange: TimeRange,
): ServerAnalytics {
  // Ensure chronological order
  const sorted = [...snapshots].sort((a, b) => a.timestamp - b.timestamp);
  const online = onlineOnly(sorted);

  const hasEnoughData = online.length >= MIN_DATA_POINTS;
  const counts = online.map((s) => s.playerCount);

  const avgPlayers  = mean(counts);
  const peakPlayers = counts.length > 0 ? Math.max(...counts) : 0;
  const lowestPlayers = counts.length > 0 ? Math.min(...counts) : 0;

  // Timestamps for peak and quietest moments
  const peakSnap    = online.find((s) => s.playerCount === peakPlayers) ?? null;
  const quietSnap   = online.find((s) => s.playerCount === lowestPlayers) ?? null;

  const { direction, percent } = calcTrend(sorted);

  // Hourly + weekday patterns
  const hourly = hourlyAverages(sorted);
  let busiestHour: number | null = null;
  let quietestHour: number | null = null;

  if (hourly.size >= MIN_RELIABLE_HOUR_BUCKETS) {
    const byValue = [...hourly.entries()].sort((a, b) => b[1] - a[1]);
    busiestHour  = byValue[0][0];
    quietestHour = byValue[byValue.length - 1][0];
  }

  const weekday = weekdayAverages(sorted);
  let busiestDayOfWeek: number | null = null;
  let quietestDayOfWeek: number | null = null;

  // Only trust weekday data if we have at least 3 reliable weekday buckets
  if (weekday.size >= 3) {
    const byValue = [...weekday.entries()].sort((a, b) => b[1] - a[1]);
    busiestDayOfWeek  = byValue[0][0];
    quietestDayOfWeek = byValue[byValue.length - 1][0];
  }

  const { forecast, confidence } = buildForecast(sorted, hourly);
  const reliabilityScore = buildReliabilityScore(sorted, hourly);
  const anomalySummary = buildAnomalySummary(sorted, hourly);
  const nextBestWindow = buildNextBestWindow(hourly);
  const lastSnapshotTime = sorted.length > 0
    ? new Date(sorted[sorted.length - 1].timestamp).toISOString()
    : null;

  return {
    serverId,
    serverName,
    timeRange,
    snapshots: online,
    avgPlayers,
    peakPlayers,
    lowestPlayers,
    trendDirection: direction,
    trendPercent: percent,
    peakTime:     peakSnap  ? new Date(peakSnap.timestamp).toISOString()  : null,
    quietestTime: quietSnap ? new Date(quietSnap.timestamp).toISOString() : null,
    busiestHour,
    quietestHour,
    busiestDayOfWeek,
    quietestDayOfWeek,
    hasEnoughData,
    dataPointCount: online.length,
    insightSummary: buildInsightSummary(
      hasEnoughData,
      direction,
      percent,
      busiestHour,
      quietestHour,
      busiestDayOfWeek,
      quietestDayOfWeek,
    ),
    bestTimeToPlay: buildBestTimeToPlay(quietestHour, quietestDayOfWeek),
    nextBestWindow,
    reliabilityScore,
    anomalySummary,
    forecast,
    forecastConfidence: confidence,
    lastSnapshotTime,
  };
}

/**
 * Downsample a sorted snapshot array to at most `maxPoints` evenly-spaced entries.
 * Used to keep the chart readable when the time window is long.
 */
export function downsample(
  snapshots: PopulationSnapshot[],
  maxPoints: number,
): PopulationSnapshot[] {
  if (snapshots.length <= maxPoints) return snapshots;
  const step = (snapshots.length - 1) / (maxPoints - 1);
  return Array.from({ length: maxPoints }, (_, i) =>
    snapshots[Math.round(i * step)],
  );
}
