"use client";

import { useEffect, useMemo, useState } from 'react';

type EggToast = {
  id: number;
  title: string;
  body: string;
};

const KONAMI = [
  'ArrowUp',
  'ArrowUp',
  'ArrowDown',
  'ArrowDown',
  'ArrowLeft',
  'ArrowRight',
  'ArrowLeft',
  'ArrowRight',
  'b',
  'a',
];

function isTypingTarget(target: EventTarget | null): boolean {
  if (!(target instanceof HTMLElement)) return false;
  const tag = target.tagName;
  return tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT' || target.isContentEditable;
}

export function EasterEggs() {
  const [toasts, setToasts] = useState<EggToast[]>([]);

  const keyQueue: string[] = useMemo(() => [], []);
  const letterQueue: string[] = useMemo(() => [], []);

  useEffect(() => {
    const pushToast = (title: string, body: string) => {
      const id = Date.now() + Math.floor(Math.random() * 1000);
      setToasts((prev) => [...prev, { id, title, body }]);
      setTimeout(() => {
        setToasts((prev) => prev.filter((toast) => toast.id !== id));
      }, 4200);
    };

    const onKeyDown = (event: KeyboardEvent) => {
      if (isTypingTarget(event.target)) return;

      const key = event.key.length === 1 ? event.key.toLowerCase() : event.key;
      keyQueue.push(key);
      if (keyQueue.length > KONAMI.length) keyQueue.shift();

      if (keyQueue.length === KONAMI.length && KONAMI.every((expected, i) => expected === keyQueue[i])) {
        pushToast('Achievement Unlocked', 'You entered the old code. Loot luck +5.');
        keyQueue.length = 0;
      }

      if (event.key.length === 1 && /^[a-z]$/i.test(event.key)) {
        letterQueue.push(event.key.toLowerCase());
        if (letterQueue.length > 5) letterQueue.shift();
        if (letterQueue.join('') === 'beans') {
          pushToast('Stash Found', 'Canned beans secured. Morale restored.');
          letterQueue.length = 0;
        }
      }
    };

    const onLogoStreak = () => {
      pushToast('Hidden Signal', 'You tapped the logo stash. Respect.');
    };

    window.addEventListener('keydown', onKeyDown);
    window.addEventListener('cdn:easter-logo-streak', onLogoStreak);

    // Friendly console clue for curious players.
    console.info('[CDN OPS] Looking for secrets? Try the classics.');

    return () => {
      window.removeEventListener('keydown', onKeyDown);
      window.removeEventListener('cdn:easter-logo-streak', onLogoStreak);
    };
  }, [keyQueue, letterQueue]);

  return (
    <div className="pointer-events-none fixed bottom-4 right-4 z-[80] flex w-[min(22rem,calc(100vw-2rem))] flex-col gap-2">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className="rounded-2xl border border-red-500/30 bg-black/70 px-4 py-3 shadow-[0_10px_40px_rgba(0,0,0,0.45)] backdrop-blur-md"
        >
          <p className="text-[10px] font-mono uppercase tracking-[0.18em] text-red-400">{toast.title}</p>
          <p className="mt-1 text-sm text-neutral-200">{toast.body}</p>
        </div>
      ))}
    </div>
  );
}
