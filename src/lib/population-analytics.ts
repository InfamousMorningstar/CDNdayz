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
  WeekdayTrafficPoint,
  ActivityHeatmapData,
  HeatmapCell,
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

function timeWeightedAverageInWindow(
  snapshots: PopulationSnapshot[],
  windowStart: number,
  windowEnd: number,
): number | null {
  if (snapshots.length === 0 || windowEnd <= windowStart) return null;

  let currentValue: number | null = null;
  let currentTs = windowStart;
  let weighted = 0;
  let coverageMs = 0;

  for (const s of snapshots) {
    if (s.timestamp <= windowStart) {
      currentValue = s.playerCount;
      currentTs = windowStart;
      continue;
    }

    if (s.timestamp >= windowEnd) break;

    if (currentValue === null) {
      currentValue = s.playerCount;
      currentTs = s.timestamp;
      continue;
    }

    if (s.timestamp > currentTs) {
      const duration = s.timestamp - currentTs;
      weighted += currentValue * duration;
      coverageMs += duration;
    }

    currentValue = s.playerCount;
    currentTs = s.timestamp;
  }

  if (currentValue !== null && currentTs < windowEnd) {
    const duration = windowEnd - currentTs;
    weighted += currentValue * duration;
    coverageMs += duration;
  }

  if (coverageMs <= 0) return null;
  return Math.round(weighted / coverageMs);
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

  const rangeStart = online[0]?.timestamp ?? 0;
  const rangeEnd = online[online.length - 1]?.timestamp ?? 0;
  if (rangeEnd <= rangeStart) {
    return { direction: 'insufficient', percent: 0 };
  }

  const midTs = rangeStart + Math.floor((rangeEnd - rangeStart) / 2);
  const firstAvg = timeWeightedAverageInWindow(online, rangeStart, midTs);
  const secondAvg = timeWeightedAverageInWindow(online, midTs, rangeEnd);

  if (firstAvg === null || secondAvg === null) {
    return { direction: 'insufficient', percent: 0 };
  }

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

function weekdayTrafficPoints(snapshots: PopulationSnapshot[]): WeekdayTrafficPoint[] {
  const buckets = new Map<number, number[]>();

  for (const s of onlineOnly(snapshots)) {
    const d = new Date(s.timestamp).getDay();
    const bucket = buckets.get(d) ?? [];
    bucket.push(s.playerCount);
    buckets.set(d, bucket);
  }

  return Array.from({ length: 7 }, (_, day) => {
    const counts = buckets.get(day) ?? [];
    return {
      day,
      avgPlayers: counts.length >= MIN_WEEKDAY_SAMPLES ? mean(counts) : null,
      sampleCount: counts.length,
    };
  });
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

function buildReliabilityScore(snapshots: PopulationSnapshot[]): number {
  if (snapshots.length === 0) return 0;

  const total = snapshots.length;
  const online = snapshots.filter((s) => s.status === 'online').length;
  // Reliability is an estimate, so we intentionally avoid ever showing 100%.
  return Math.min(99, Math.round((online / total) * 100));
}

/**
 * Build a 7x24 activity heatmap from snapshots.
 * Each cell contains average players, occupancy %, and sample count for that day+hour.
 * Cells with insufficient samples (< MIN_HOURLY_SAMPLES) are marked as null for avgPlayers/occupancy.
 */
function buildActivityHeatmap(snapshots: PopulationSnapshot[]): ActivityHeatmapData {
  const online = onlineOnly(snapshots);
  if (online.length === 0) {
    return {
      cells: Array.from({ length: 7 * 24 }, (_, idx) => ({
        day: Math.floor(idx / 24),
        hour: idx % 24,
        avgPlayers: null,
        avgOccupancyPercent: null,
        sampleCount: 0,
      })),
      maxOccupancyPercent: 0,
      minOccupancyPercent: 0,
      hasEnoughData: false,
    };
  }

  // Build buckets: [day][hour] -> { playerCounts, maxPlayersList }
  const buckets = new Map<string, { players: number[]; maxPlayers: number[] }>();

  for (const s of online) {
    const date = new Date(s.timestamp);
    const day = date.getDay();    // 0 = Sunday, 6 = Saturday
    const hour = date.getHours(); // 0–23
    const key = `${day}:${hour}`;

    if (!buckets.has(key)) {
      buckets.set(key, { players: [], maxPlayers: [] });
    }
    const bucket = buckets.get(key)!;
    bucket.players.push(s.playerCount);
    bucket.maxPlayers.push(s.maxPlayers);
  }

  // Compute cells and track occupancy percentages
  const cells: HeatmapCell[] = [];
  const occupancyValues: number[] = [];

  for (let day = 0; day < 7; day++) {
    for (let hour = 0; hour < 24; hour++) {
      const key = `${day}:${hour}`;
      const bucket = buckets.get(key);

      let avgPlayers: number | null = null;
      let avgOccupancyPercent: number | null = null;
      const sampleCount = bucket?.players.length ?? 0;

      if (bucket && bucket.players.length >= MIN_HOURLY_SAMPLES) {
        avgPlayers = mean(bucket.players);

        // Compute occupancy % using average maxPlayers for this cell
        const avgMaxPlayers = mean(bucket.maxPlayers);
        if (avgMaxPlayers > 0) {
          avgOccupancyPercent = Math.round(
            ((avgPlayers / avgMaxPlayers) * 100),
          );
          occupancyValues.push(avgOccupancyPercent);
        }
      }

      cells.push({
        day,
        hour,
        avgPlayers,
        avgOccupancyPercent,
        sampleCount,
      });
    }
  }

  // Determine thresholds for color scaling
  const validOccupancies = occupancyValues.filter((v) => v > 0);
  const maxOccupancyPercent = validOccupancies.length > 0 ? Math.max(...validOccupancies) : 0;
  const minOccupancyPercent = validOccupancies.length > 0 ? Math.min(...validOccupancies) : 0;

  // We consider a heatmap reliable if we have enough non-empty cells
  // (at least 10% coverage across 168 possible cells)
  const cellsCovered = cells.filter((c) => c.sampleCount > 0).length;
  const hasEnoughData = cellsCovered >= 17; // ~10% of 168 cells

  return {
    cells,
    maxOccupancyPercent,
    minOccupancyPercent,
    hasEnoughData,
  };
}

function buildAnomalySummary(snapshots: PopulationSnapshot[], hourly: Map<number, number>): string | null {
  const latest = [...snapshots].reverse().find((s) => s.status === 'online');
  if (!latest) return null;

  const h = new Date(latest.timestamp).getHours();
  const baseline = hourly.get(h);
  if (!baseline || baseline <= 0) return null;

  const diffPct = ((latest.playerCount - baseline) / baseline) * 100;
  if (diffPct > 0) {
    return `Current population is ${Math.round(diffPct)}% above the historical ${HOUR_LABELS[h]} average.`;
  }

  if (diffPct < 0) {
    return `Current population is ${Math.round(Math.abs(diffPct))}% below the historical ${HOUR_LABELS[h]} average.`;
  }

  return `Current population matches the historical ${HOUR_LABELS[h]} average.`;
}

function buildForecast(
  snapshots: PopulationSnapshot[],
  hourly: Map<number, number>,
): { forecast: ForecastPoint[]; confidence: 'low' | 'medium' | 'high' } {
  // Strictly data-derived: each next-hour value is the historical average
  // for that local hour when enough samples exist.
  const now = new Date();
  const points: ForecastPoint[] = [];

  for (let i = 1; i <= FORECAST_HOURS; i++) {
    const hour = (now.getHours() + i) % 24;
    const baseline = hourly.get(hour);
    if (typeof baseline !== 'number') continue;

    points.push({
      hourOffset: i,
      label: HOUR_LABELS[hour],
      predictedPlayers: baseline,
    });
  }

  let confidence: 'low' | 'medium' | 'high' = 'low';
  if (hourly.size >= 12) {
    confidence = 'high';
  } else if (hourly.size >= 6) {
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
  const rangeStart = online[0]?.timestamp ?? 0;
  const rangeEnd = online[online.length - 1]?.timestamp ?? 0;
  const avgPlayers =
    rangeEnd > rangeStart
      ? (timeWeightedAverageInWindow(online, rangeStart, rangeEnd) ?? mean(counts))
      : mean(counts);
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
  const weekdayTraffic = weekdayTrafficPoints(sorted);
  let busiestDayOfWeek: number | null = null;
  let quietestDayOfWeek: number | null = null;

  // Only trust weekday data if we have at least 3 reliable weekday buckets
  if (weekday.size >= 3) {
    const byValue = [...weekday.entries()].sort((a, b) => b[1] - a[1]);
    busiestDayOfWeek  = byValue[0][0];
    quietestDayOfWeek = byValue[byValue.length - 1][0];
  }

  const { forecast, confidence } = buildForecast(sorted, hourly);
  const reliabilityScore = buildReliabilityScore(sorted);
  const anomalySummary = buildAnomalySummary(sorted, hourly);
  const nextBestWindow = buildNextBestWindow(hourly);
  const heatmapData = buildActivityHeatmap(sorted);
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
    weekdayTraffic,
    heatmapData,
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
