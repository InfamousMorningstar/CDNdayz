'use client';

import { Biohazard, MapPin, ShieldAlert } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';

type EventStatus = 'upcoming' | 'active' | 'completed';

interface TargetZoneStatusProps {
  targetZone: string;
  startsAtUtc?: string;
  fallbackStatus: EventStatus;
}

interface TimedAdvisoryBadgeProps {
  startsAtUtc?: string;
  fallbackStatus: EventStatus;
}

function formatRemaining(ms: number): string {
  const totalSeconds = Math.max(0, Math.floor(ms / 1000));
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  return `${String(hours).padStart(2, '0')}h ${String(minutes).padStart(2, '0')}m ${String(seconds).padStart(2, '0')}s`;
}

export function TargetZoneStatus({ targetZone, startsAtUtc, fallbackStatus }: TargetZoneStatusProps) {
  const [nowMs, setNowMs] = useState<number | null>(null);

  useEffect(() => {
    setNowMs(Date.now());
    const timerId = window.setInterval(() => {
      setNowMs(Date.now());
    }, 1000);

    return () => window.clearInterval(timerId);
  }, []);

  const startMs = useMemo(() => {
    if (!startsAtUtc) {
      return null;
    }

    const parsed = Date.parse(startsAtUtc);
    return Number.isNaN(parsed) ? null : parsed;
  }, [startsAtUtc]);

  const isActive = startMs !== null && nowMs !== null
    ? nowMs >= startMs
    : fallbackStatus === 'active' || fallbackStatus === 'completed';

  const remainingMs = startMs !== null && nowMs !== null ? Math.max(startMs - nowMs, 0) : null;

  return (
    <>
      <p className="font-semibold text-stone-100 flex items-center gap-2">
        <MapPin className="w-4 h-4 text-orange-400" /> {isActive ? targetZone : 'Classified until event start'}
      </p>
      {startMs !== null && nowMs !== null && !isActive ? (
        <p className="mt-2 text-[11px] font-mono uppercase tracking-[0.18em] text-orange-200/90">
          Unlocks in {formatRemaining(remainingMs ?? 0)} (20:00 UTC)
        </p>
      ) : (
        <p className="mt-2 text-[11px] font-mono uppercase tracking-[0.18em] text-emerald-300/90">
          Target Zone Intel Unlocked
        </p>
      )}
    </>
  );
}

export function TimedAdvisoryBadge({ startsAtUtc, fallbackStatus }: TimedAdvisoryBadgeProps) {
  const [nowMs, setNowMs] = useState<number | null>(null);

  useEffect(() => {
    setNowMs(Date.now());
    const timerId = window.setInterval(() => {
      setNowMs(Date.now());
    }, 1000);

    return () => window.clearInterval(timerId);
  }, []);

  const startMs = useMemo(() => {
    if (!startsAtUtc) {
      return null;
    }

    const parsed = Date.parse(startsAtUtc);
    return Number.isNaN(parsed) ? null : parsed;
  }, [startsAtUtc]);

  const isActive = startMs !== null && nowMs !== null
    ? nowMs >= startMs
    : fallbackStatus === 'active' || fallbackStatus === 'completed';

  if (isActive) {
    return (
      <div className="mb-5 rounded-xl border border-lime-700/50 bg-lime-950/25 p-4">
        <p className="text-[11px] font-mono uppercase tracking-[0.24em] text-lime-300 flex items-center gap-2">
          <Biohazard className="w-4 h-4" /> Contaminated Zone Advisory
        </p>
        <p className="text-[10px] font-mono uppercase tracking-[0.18em] text-lime-200/80 mt-2">
          Not your average zombies here
        </p>
      </div>
    );
  }

  return (
    <div className="mb-5 rounded-xl border border-stone-700/70 bg-stone-950/45 p-4">
      <p className="text-[11px] font-mono uppercase tracking-[0.24em] text-stone-300 flex items-center gap-2">
        <ShieldAlert className="w-4 h-4" /> Operational Advisory Locked
      </p>
    </div>
  );
}