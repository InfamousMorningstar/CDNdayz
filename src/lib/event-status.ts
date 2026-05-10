import type { Event } from '@/data/mock';

export type EventStatus = Event['status'];

const MINUTE_MS = 60 * 1000;
const HOUR_MS = 60 * MINUTE_MS;
const DAY_MS = 24 * HOUR_MS;

function toUnitMs(unit: string): number | null {
  const normalized = unit.toLowerCase();

  if (normalized.startsWith('day')) return DAY_MS;
  if (normalized.startsWith('hour') || normalized === 'hr' || normalized === 'hrs' || normalized === 'h') return HOUR_MS;
  if (normalized.startsWith('minute') || normalized === 'min' || normalized === 'mins' || normalized === 'm') return MINUTE_MS;

  return null;
}

export function parseDurationToMs(duration?: string): number | null {
  if (!duration || duration === 'TBA') {
    return null;
  }

  const regex = /(\d+(?:\.\d+)?)\s*([a-zA-Z]+)/g;
  let totalMs = 0;
  let hadMatch = false;

  for (const match of duration.matchAll(regex)) {
    const amount = Number.parseFloat(match[1]);
    const unitMs = toUnitMs(match[2]);

    if (!Number.isFinite(amount) || unitMs === null) {
      continue;
    }

    totalMs += amount * unitMs;
    hadMatch = true;
  }

  return hadMatch ? totalMs : null;
}

export function getComputedEventStatus(event: Event, nowMs: number = Date.now()): EventStatus {
  if (event.status === 'completed') {
    return 'completed';
  }

  if (!event.startsAtUtc) {
    return event.status;
  }

  const startMs = Date.parse(event.startsAtUtc);
  if (Number.isNaN(startMs)) {
    return event.status;
  }

  if (nowMs < startMs) {
    return 'upcoming';
  }

  const durationMs = parseDurationToMs(event.duration);
  if (durationMs !== null && nowMs >= startMs + durationMs) {
    return 'completed';
  }

  return 'active';
}
