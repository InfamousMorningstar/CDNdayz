"use client";

import { createContext, useContext, useEffect, useRef, useState } from 'react';

type Theme = 'dark' | 'light';

type ThemeToggleOrigin = {
  x: number;
  y: number;
};

interface ThemeContextValue {
  theme: Theme;
  toggle: (origin?: ThemeToggleOrigin) => void;
}

const ThemeContext = createContext<ThemeContextValue>({
  theme: 'dark',
  toggle: () => {},
});

export function useTheme() {
  return useContext(ThemeContext);
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>('dark');
  const transitionTimerRef = useRef<number | null>(null);

  const prefersReducedMotion = () =>
    typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  useEffect(() => {
    const stored = localStorage.getItem('cdn-theme') as Theme | null;
    const preferred = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    const initial = stored ?? preferred;
    setTheme(initial);
    document.documentElement.classList.toggle('dark', initial === 'dark');

    return () => {
      if (transitionTimerRef.current !== null) {
        window.clearTimeout(transitionTimerRef.current);
      }
    };
  }, []);

  const toggle = (origin?: ThemeToggleOrigin) => {
    const next = theme === 'dark' ? 'light' : 'dark';
    const flashX = origin?.x ?? window.innerWidth / 2;
    const flashY = origin?.y ?? window.innerHeight / 2;

    const applyTheme = () => {
      localStorage.setItem('cdn-theme', next);
      document.documentElement.classList.toggle('dark', next === 'dark');
      setTheme(next);
    };

    document.documentElement.style.setProperty('--theme-flash-x', `${flashX}px`);
    document.documentElement.style.setProperty('--theme-flash-y', `${flashY}px`);
    document.documentElement.classList.add('theme-switching');

    if (transitionTimerRef.current !== null) {
      window.clearTimeout(transitionTimerRef.current);
    }

    const canUseViewTransitions =
      !prefersReducedMotion() &&
      typeof document !== 'undefined' &&
      'startViewTransition' in document;

    if (canUseViewTransitions) {
      (document as Document & { startViewTransition: (cb: () => void) => void }).startViewTransition(() => {
        applyTheme();
      });
    } else {
      applyTheme();
    }

    transitionTimerRef.current = window.setTimeout(() => {
      document.documentElement.classList.remove('theme-switching');
      transitionTimerRef.current = null;
    }, 940);
  };

  return (
    <ThemeContext.Provider value={{ theme, toggle }}>
      {children}
    </ThemeContext.Provider>
  );
}
