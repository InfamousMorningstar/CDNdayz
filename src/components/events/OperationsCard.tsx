"use client";

import { useEffect, useMemo, useState } from 'react';
import {
  Activity,
  ArrowRight,
  CalendarDays,
  Crosshair,
  FileLock2,
  MapPinned,
  ShieldAlert,
  TimerReset,
} from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { DiscordLink } from '@/components/ui/DiscordLink';
import type { Event } from '@/data/mock';
import { DISCORD_INVITE_URL } from '@/lib/links';

function useCountdown(targetDate: Date | null) {
  const compute = (date: Date | null) => {
    if (!date) {
      return { days: '--', hours: '--', mins: '--', secs: '--' };
    }

    const diff = date.getTime() - Date.now();
    if (diff <= 0) {
      return { days: '00', hours: '00', mins: '00', secs: '00' };
    }

    return {
      days: String(Math.floor(diff / 86400000)).padStart(2, '0'),
      hours: String(Math.floor((diff % 86400000) / 3600000)).padStart(2, '0'),
      mins: String(Math.floor((diff % 3600000) / 60000)).padStart(2, '0'),
      secs: String(Math.floor((diff % 60000) / 1000)).padStart(2, '0'),
    };
  };

  const [timeLeft, setTimeLeft] = useState(compute(targetDate));

  useEffect(() => {
    const intervalId = window.setInterval(() => {
      setTimeLeft(compute(targetDate));
    }, 1000);

    return () => window.clearInterval(intervalId);
  }, [targetDate]);

  return timeLeft;
}

function formatBriefingDate(targetDate: Date | null, fallback: string | undefined) {
  if (!targetDate) {
    return fallback ?? 'TBD';
  }

  const formatter = new Intl.DateTimeFormat('en-US', {
    timeZone: 'UTC',
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });

  const parts = formatter.formatToParts(targetDate);
  const day = parts.find((part) => part.type === 'day')?.value ?? '--';
  const month = (parts.find((part) => part.type === 'month')?.value ?? '---').toUpperCase();
  const year = parts.find((part) => part.type === 'year')?.value ?? '----';

  return `${day} ${month} ${year}`;
}

function formatScheduleTime(targetDate: Date, timeZone: string) {
  return new Intl.DateTimeFormat('en-US', {
    timeZone,
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  }).format(targetDate);
}

function getScheduleRows(targetDate: Date | null) {
  if (!targetDate) {
    return [
      { label: 'UTC', detail: 'WINDOW', value: 'TBD' },
      { label: 'LOCAL', detail: 'RELEASE', value: 'PENDING' },
    ];
  }

  return [
    { label: 'UTC', detail: 'COORDINATION', value: formatScheduleTime(targetDate, 'UTC') },
    { label: 'ET', detail: 'EASTERN', value: formatScheduleTime(targetDate, 'America/New_York') },
    { label: 'CT', detail: 'CENTRAL', value: formatScheduleTime(targetDate, 'America/Chicago') },
    { label: 'MT', detail: 'MOUNTAIN', value: formatScheduleTime(targetDate, 'America/Denver') },
    { label: 'PT', detail: 'PACIFIC', value: formatScheduleTime(targetDate, 'America/Los_Angeles') },
  ];
}

interface OperationsCardProps {
  activeEvent: Event | undefined;
}

export function OperationsCard({ activeEvent }: OperationsCardProps) {
  const targetDate = activeEvent?.startsAtUtc ? new Date(activeEvent.startsAtUtc) : null;
  const countdown = useCountdown(targetDate);
  const isPending = !targetDate || activeEvent?.date === 'TBA' || activeEvent?.date === 'TBD';
  const [isLive, setIsLive] = useState(targetDate ? Date.now() >= targetDate.getTime() : false);

  useEffect(() => {
    if (!targetDate) {
      return;
    }

    if (Date.now() >= targetDate.getTime()) {
      setIsLive(true);
      return;
    }

    const intervalId = window.setInterval(() => {
      if (Date.now() >= targetDate.getTime()) {
        setIsLive(true);
        window.clearInterval(intervalId);
      }
    }, 1000);

    return () => window.clearInterval(intervalId);
  }, [targetDate]);

  const eventMap = activeEvent?.map ?? 'Unknown Region';
  const operationTitle = (activeEvent?.title ?? 'Operation Pending').replace(/:/g, '').toUpperCase();
  const briefingDate = formatBriefingDate(targetDate, activeEvent?.date);
  const scheduleRows = useMemo(() => getScheduleRows(targetDate), [targetDate]);
  const statusLabel = isLive ? 'ACTIVE' : isPending ? 'PENDING' : 'DEPLOYING';
  const missionSummary = activeEvent?.id === 'takistan-desert-crown'
    ? 'High Command has gone rogue in Takistan. One or more admin targets have deployed into the AO, and all operators are authorized to track, identify, and eliminate them before they break contact and escape the region.'
    : activeEvent?.description ?? 'Mission parameters are being assembled. Stand by for updated tasking.';
  const primaryObjectives = activeEvent?.id === 'takistan-desert-crown'
    ? ['Locate HVT Alpha', 'Confirm target identity', 'Eliminate hostile command element']
    : ['Locate target zone', 'Confirm mission package', 'Complete primary tasking'];
  const secondaryObjectives = activeEvent?.id === 'takistan-desert-crown'
    ? ['Recover classified assets', 'Secure operational documents', 'Prevent target extraction']
    : ['Secure available intel', 'Maintain operational security', 'Extract with recovered assets'];
  const knownInformation = activeEvent?.id === 'takistan-desert-crown'
    ? ['Regional command traffic has shifted across central Takistan.', 'Multiple field reports indicate decoy movements near abandoned compounds.', 'Intercepted communications confirm hostile leadership is mobile and aware of pursuit.']
    : ['Mission package issued by operations command.', 'Target area remains under observation.', 'Further reporting pending field confirmation.'];
  const unknownInformation = activeEvent?.id === 'takistan-desert-crown'
    ? ['Exact target location', 'Escort strength and support elements', 'Preferred extraction route']
    : ['Final area of operations', 'Opposition strength', 'Exfiltration timeline'];
  const rewardPackage = ['[REDACTED]', '[REDACTED]', '[REDACTED]', '[REDACTED]'];
  const operatorNotes = activeEvent?.id === 'takistan-desert-crown'
    ? [
        'Mission parameters remain fluid.',
        'Target zone will be revealed at H-Hour.',
        'Radio discipline is mandatory.',
        'No external intelligence support authorized.',
      ]
    : [
        'Mission brief subject to revision.',
        'Stand by for updated insertion details.',
        'Maintain comms discipline until release.',
      ];
  const mapBackdrop = useMemo(() => {
    const svg = `
      <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 960 720' fill='none'>
        <rect width='960' height='720' fill='transparent'/>
        <path d='M130 182C205 140 296 110 392 104C488 98 581 129 648 178C715 227 782 319 781 406C780 493 731 572 644 611C557 650 436 650 329 628C222 606 132 557 102 471C72 385 55 288 130 182Z' fill='#C29B40' fill-opacity='0.055' stroke='#C29B40' stroke-opacity='0.18' stroke-width='2'/>
        <path d='M191 226C273 185 390 168 498 184C606 200 690 252 727 328C764 404 723 509 647 555C571 601 450 594 341 569C232 544 149 500 130 420C111 340 109 267 191 226Z' stroke='#E6E6E6' stroke-opacity='0.12' stroke-width='1.5'/>
        <path d='M242 272C321 241 412 234 492 245C572 256 645 289 671 345C697 401 668 477 606 516C544 555 451 557 372 544C293 531 220 500 196 440C172 380 163 303 242 272Z' stroke='#E6E6E6' stroke-opacity='0.08' stroke-width='1.2'/>
        <path d='M548 290L578 303L600 328L594 356L567 377L527 382L496 364L488 337L506 308L548 290Z' fill='#9E3A3A' fill-opacity='0.18' stroke='#9E3A3A' stroke-opacity='0.35'/>
        <circle cx='547' cy='338' r='8' fill='#9E3A3A' fill-opacity='0.55'/>
        <path d='M559 338H668' stroke='#E6E6E6' stroke-opacity='0.2' stroke-dasharray='6 8'/>
        <text x='682' y='343' fill='#E6E6E6' fill-opacity='0.28' font-size='18' font-family='IBM Plex Mono, monospace'>HVT GRID</text>
        <text x='168' y='604' fill='#E6E6E6' fill-opacity='0.14' font-size='64' letter-spacing='10' font-family='IBM Plex Mono, monospace'>TAKISTAN</text>
      </svg>`;

    return `url("data:image/svg+xml,${encodeURIComponent(svg)}")`;
  }, []);

  if (!activeEvent) {
    return (
      <Card className="max-w-6xl w-full overflow-hidden rounded-[28px] border border-white/10 bg-[#0E1116]/95 text-left shadow-[0_20px_70px_rgba(0,0,0,0.45)]">
        <div className="relative p-8 sm:p-10 lg:p-12">
          <div className="absolute inset-0 opacity-25 bg-[linear-gradient(to_bottom,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[length:100%_4px] pointer-events-none" />
          <p className="relative mb-4 font-mono text-[11px] uppercase tracking-[0.28em] text-[#C29B40]">
            TOP SECRET // CDN EYES ONLY
          </p>
          <h2 className="relative text-3xl font-semibold uppercase tracking-[0.12em] text-[#E6E6E6]">
            Operations Desk
          </h2>
          <p className="relative mt-4 max-w-2xl text-sm leading-7 text-[#9CA3AF]">
            The next mission dossier is being assembled. Classification, tasking, and release window will populate here once command finalizes the operation package.
          </p>
        </div>
      </Card>
    );
  }

  return (
    <Card className="max-w-6xl w-full overflow-hidden rounded-[28px] border border-white/10 bg-[#0E1116]/95 text-left shadow-[0_20px_70px_rgba(0,0,0,0.45)]">
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(194,155,64,0.08),transparent_34%),radial-gradient(circle_at_bottom_left,rgba(158,58,58,0.09),transparent_30%)]" />
        <div className="absolute inset-y-0 right-0 hidden w-[48%] lg:block opacity-55" style={{ backgroundImage: mapBackdrop, backgroundPosition: 'center', backgroundRepeat: 'no-repeat', backgroundSize: 'cover' }} />
        <div className="absolute inset-0 opacity-[0.08] bg-[linear-gradient(to_bottom,rgba(255,255,255,0.65)_1px,transparent_1px)] bg-[length:100%_4px] pointer-events-none" />
        <div className="absolute right-6 top-6 z-10 rounded-sm border border-[#9E3A3A]/55 bg-[#2A1414]/55 px-3 py-2 font-mono text-[10px] uppercase tracking-[0.24em] text-[#D7B0B0] backdrop-blur-sm sm:right-8 sm:top-8">
          TOP SECRET // DESERT CROWN // HVT MANHUNT
        </div>

        <div className="relative grid lg:grid-cols-[1.45fr_0.9fr]">
          <div className="border-b border-white/10 p-8 sm:p-10 lg:border-b-0 lg:border-r lg:p-12">
            <div className="mb-8 flex flex-col gap-5 border-b border-white/10 pb-8">
              <div className="flex flex-wrap items-center gap-3">
                <span className="rounded-full border border-[#C29B40]/45 bg-[#C29B40]/10 px-3 py-1 font-mono text-[10px] uppercase tracking-[0.28em] text-[#C29B40]">
                  TOP SECRET // CDN EYES ONLY
                </span>
                <span className="rounded-full border border-white/10 bg-white/[0.03] px-3 py-1 font-mono text-[10px] uppercase tracking-[0.24em] text-[#9CA3AF]">
                  MISSION DOSSIER
                </span>
              </div>

              <div>
                <p className="mb-3 font-mono text-[11px] uppercase tracking-[0.28em] text-[#9CA3AF]">
                  Special Activities Center // Forward Brief
                </p>
                <h2 className="font-charlie-surf text-4xl uppercase tracking-[0.18em] text-[#E6E6E6] sm:text-5xl lg:text-6xl">
                  {operationTitle}
                </h2>
              </div>

              <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                {[
                  ['CLASSIFICATION', 'TOP SECRET // CDN EYES ONLY'],
                  ['STATUS', statusLabel],
                  ['REGION', eventMap.toUpperCase()],
                  ['DATE', briefingDate],
                ].map(([label, value]) => (
                  <div key={label} className="rounded-2xl border border-white/10 bg-[#151A22]/88 px-4 py-4 backdrop-blur-sm">
                    <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-[#9CA3AF]">{label}</p>
                    <p className="mt-2 text-sm font-semibold uppercase tracking-[0.08em] text-[#E6E6E6]">{value}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-8">
              <section>
                <p className="mb-3 font-mono text-[11px] uppercase tracking-[0.28em] text-[#C29B40]">Mission Summary</p>
                <div className="rounded-2xl border border-white/10 bg-[#151A22]/82 p-5 backdrop-blur-sm">
                  <p className="max-w-3xl text-sm leading-7 text-[#D2D7DF]">{missionSummary}</p>
                </div>
              </section>

              <section className="grid gap-4 xl:grid-cols-2">
                <div className="rounded-2xl border border-white/10 bg-[#151A22]/82 p-5 backdrop-blur-sm">
                  <p className="mb-4 font-mono text-[11px] uppercase tracking-[0.28em] text-[#C29B40]">Operation Objectives // Primary</p>
                  <ul className="space-y-3">
                    {primaryObjectives.map((objective) => (
                      <li key={objective} className="flex items-start gap-3 text-sm text-[#E6E6E6]">
                        <Crosshair className="mt-0.5 h-4 w-4 shrink-0 text-[#C29B40]" />
                        <span>{objective}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="rounded-2xl border border-white/10 bg-[#151A22]/82 p-5 backdrop-blur-sm">
                  <p className="mb-4 font-mono text-[11px] uppercase tracking-[0.28em] text-[#C29B40]">Operation Objectives // Secondary</p>
                  <ul className="space-y-3">
                    {secondaryObjectives.map((objective) => (
                      <li key={objective} className="flex items-start gap-3 text-sm text-[#E6E6E6]">
                        <FileLock2 className="mt-0.5 h-4 w-4 shrink-0 text-[#9CA3AF]" />
                        <span>{objective}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </section>

              <section className="grid gap-4 xl:grid-cols-2">
                <div className="rounded-2xl border border-white/10 bg-[#151A22]/82 p-5 backdrop-blur-sm">
                  <p className="mb-4 font-mono text-[11px] uppercase tracking-[0.28em] text-[#C29B40]">Intelligence Section // Known Information</p>
                  <ul className="space-y-3">
                    {knownInformation.map((item) => (
                      <li key={item} className="flex items-start gap-3 text-sm leading-6 text-[#D2D7DF]">
                        <MapPinned className="mt-0.5 h-4 w-4 shrink-0 text-[#C29B40]" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="rounded-2xl border border-white/10 bg-[#151A22]/82 p-5 backdrop-blur-sm">
                  <p className="mb-4 font-mono text-[11px] uppercase tracking-[0.28em] text-[#C29B40]">Intelligence Section // Unknown Information</p>
                  <ul className="space-y-3">
                    {unknownInformation.map((item) => (
                      <li key={item} className="flex items-start gap-3 text-sm leading-6 text-[#D2D7DF]">
                        <ShieldAlert className="mt-0.5 h-4 w-4 shrink-0 text-[#9E3A3A]" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </section>

              <section>
                <p className="mb-3 font-mono text-[11px] uppercase tracking-[0.28em] text-[#C29B40]">Operator Notes</p>
                <div className="grid gap-3 sm:grid-cols-2">
                  {operatorNotes.map((note) => (
                    <div key={note} className="rounded-2xl border border-white/10 bg-[#151A22]/82 px-4 py-4 text-sm text-[#D2D7DF] backdrop-blur-sm">
                      {note}
                    </div>
                  ))}
                </div>
              </section>
            </div>
          </div>

          <aside className="space-y-5 bg-[#131922]/84 px-8 pb-8 pt-24 sm:px-10 sm:pb-10 sm:pt-24 lg:px-12 lg:pb-12 lg:pt-28">
            <section className="rounded-2xl border border-white/10 bg-[#151A22]/90 p-5 backdrop-blur-sm">
              <div className="mb-5 flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-[#C29B40]" />
                <p className="font-mono text-[11px] uppercase tracking-[0.28em] text-[#C29B40]">Target Profile</p>
              </div>
              <div className="space-y-3">
                {[
                  ['TARGET', 'HVT Alpha'],
                  ['STATUS', 'At Large'],
                  ['THREAT LEVEL', 'High'],
                  ['LAST SIGHTING', 'Classified'],
                  ['DISPOSITION', 'Hostile'],
                ].map(([label, value]) => (
                  <div key={label} className="flex items-center justify-between gap-4 border-b border-white/10 pb-3 last:border-b-0 last:pb-0">
                    <span className="font-mono text-[11px] uppercase tracking-[0.18em] text-[#9CA3AF]">{label}</span>
                    <span className="text-right text-sm font-semibold uppercase tracking-[0.08em] text-[#E6E6E6]">{value}</span>
                  </div>
                ))}
              </div>
            </section>

            <section className="rounded-2xl border border-white/10 bg-[#151A22]/90 p-5 backdrop-blur-sm">
              <div className="mb-4 flex items-center gap-2">
                <TimerReset className="h-4 w-4 text-[#C29B40]" />
                <p className="font-mono text-[11px] uppercase tracking-[0.28em] text-[#C29B40]">Deployment Window</p>
              </div>
              {isPending ? (
                <div className="space-y-3">
                  <p className="text-2xl font-semibold uppercase tracking-[0.12em] text-[#E6E6E6]">Window Pending</p>
                  <p className="text-sm leading-6 text-[#9CA3AF]">Target zone and final release time will be issued at command discretion.</p>
                </div>
              ) : isLive ? (
                <div className="space-y-3">
                  <p className="text-2xl font-semibold uppercase tracking-[0.12em] text-[#E6E6E6]">Operation Active</p>
                  <p className="text-sm leading-6 text-[#9CA3AF]">Units are deployed. Pursuit and engagement authority is live.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="flex gap-4 font-mono tabular-nums text-[#E6E6E6]">
                    {[
                      [countdown.days, 'D'],
                      [countdown.hours, 'H'],
                      [countdown.mins, 'M'],
                      [countdown.secs, 'S'],
                    ].map(([value, unit]) => (
                      <div key={unit} className="min-w-[3.4rem] rounded-xl border border-white/10 bg-black/15 px-3 py-2 text-center">
                        <p className="text-2xl font-semibold">{value}</p>
                        <p className="mt-1 text-[10px] uppercase tracking-[0.18em] text-[#9CA3AF]">{unit}</p>
                      </div>
                    ))}
                  </div>
                  <p className="text-sm leading-6 text-[#9CA3AF]">Countdown reflects the current deployment estimate and will update automatically.</p>
                </div>
              )}
            </section>

            <section className="rounded-2xl border border-white/10 bg-[#151A22]/90 p-5 backdrop-blur-sm">
              <div className="mb-4 flex items-center gap-2">
                <CalendarDays className="h-4 w-4 text-[#C29B40]" />
                <p className="font-mono text-[11px] uppercase tracking-[0.28em] text-[#C29B40]">Schedule</p>
              </div>
              <p className="mb-4 text-base font-semibold uppercase tracking-[0.08em] text-[#E6E6E6]">{briefingDate}</p>
              <div className="space-y-3">
                {scheduleRows.map((row) => (
                  <div key={row.label} className="flex items-center justify-between gap-3 border-b border-white/10 pb-3 last:border-b-0 last:pb-0">
                    <div>
                      <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-[#9CA3AF]">{row.label}</p>
                      <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-[#6F7784]">{row.detail}</p>
                    </div>
                    <p className="font-mono text-sm text-[#E6E6E6]">{row.value}</p>
                  </div>
                ))}
              </div>
            </section>

            <section className="rounded-2xl border border-white/10 bg-[#151A22]/90 p-5 backdrop-blur-sm">
              <div className="mb-4 flex items-center gap-2">
                <Activity className="h-4 w-4 text-[#C29B40]" />
                <p className="font-mono text-[11px] uppercase tracking-[0.28em] text-[#C29B40]">Reward Package // Recovered Assets</p>
              </div>
              <div className="flex flex-wrap gap-2.5">
                {rewardPackage.map((item, index) => (
                  <div key={item} className="rounded-md border border-[#C29B40]/25 bg-[#0F141B] px-3 py-2 font-mono text-[11px] uppercase tracking-[0.14em] text-[#D8C08A]">
                    <span className="mr-2 text-[#7C828D]">E-{String(index + 1).padStart(2, '0')}</span>
                    {item}
                  </div>
                ))}
              </div>
            </section>

            <section className="rounded-2xl border border-white/10 bg-[#151A22]/90 p-5 backdrop-blur-sm">
              <p className="mb-4 font-mono text-[11px] uppercase tracking-[0.28em] text-[#C29B40]">Operator Access</p>
              <div className="flex flex-col gap-3">
                <Button
                  asChild
                  variant="outline"
                  className="h-12 justify-between rounded-2xl border-white/10 bg-white/[0.02] px-4 font-mono text-[11px] uppercase tracking-[0.22em] text-[#E6E6E6] hover:border-[#C29B40]/35 hover:bg-white/[0.04] hover:text-[#E6E6E6]"
                >
                  <DiscordLink href={DISCORD_INVITE_URL}>
                    <span>Access Live Alerts</span>
                    <ArrowRight className="h-4 w-4" />
                  </DiscordLink>
                </Button>
                <Button
                  asChild
                  variant="outline"
                  className="h-12 justify-between rounded-2xl border-white/10 bg-white/[0.02] px-4 font-mono text-[11px] uppercase tracking-[0.22em] text-[#E6E6E6] hover:border-[#C29B40]/35 hover:bg-white/[0.04] hover:text-[#E6E6E6]"
                >
                  <Link href="/servers">
                    <span>Check Live Servers</span>
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </section>
          </aside>
        </div>
      </div>
    </Card>
  );
}
