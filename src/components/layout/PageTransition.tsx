"use client";

import { ReactNode } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { usePathname } from 'next/navigation';

interface PageTransitionProps {
  children: ReactNode;
}

export function PageTransition({ children }: PageTransitionProps) {
  const pathname = usePathname();
  const prefersReducedMotion = useReducedMotion();

  const enterInitial = prefersReducedMotion
    ? { opacity: 0 }
    : { opacity: 0, y: 36, scale: 0.985, filter: 'blur(8px) saturate(130%)' };

  const enterAnimate = prefersReducedMotion
    ? { opacity: 1 }
    : { opacity: 1, y: 0, scale: 1, filter: 'blur(0px) saturate(100%)' };

  const enterExit = prefersReducedMotion
    ? { opacity: 0 }
    : { opacity: 0, y: -28, scale: 1.01, filter: 'blur(6px) saturate(140%)' };

  return (
    <>
      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={pathname}
          initial={enterInitial}
          animate={enterAnimate}
          exit={enterExit}
          transition={{ duration: prefersReducedMotion ? 0.12 : 0.42, ease: [0.16, 1, 0.3, 1] }}
        >
          {children}
        </motion.div>
      </AnimatePresence>

      <AnimatePresence initial={false} mode="wait">
        <motion.div
          key={`route-sweep-${pathname}`}
          aria-hidden="true"
          className="pointer-events-none fixed inset-0 z-[90]"
        >
          <motion.div
            className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-transparent via-red-500 to-transparent shadow-[0_0_18px_rgba(239,68,68,0.9)]"
            initial={{ opacity: 0, scaleX: 0.2 }}
            animate={{ opacity: 1, scaleX: 1 }}
            exit={{ opacity: 0, scaleX: 1.1 }}
            transition={{ duration: prefersReducedMotion ? 0.12 : 0.36, ease: [0.22, 1, 0.36, 1] }}
            style={{ transformOrigin: 'center' }}
          />

          <motion.div
            className="absolute top-0 left-[-35%] h-full w-[42%] bg-gradient-to-r from-transparent via-red-500/22 to-transparent"
            style={{ transform: 'skewX(-20deg)' }}
            initial={{ x: '-10%', opacity: 0 }}
            animate={{ x: '190%', opacity: prefersReducedMotion ? 0 : 0.8 }}
            exit={{ opacity: 0 }}
            transition={{ duration: prefersReducedMotion ? 0.12 : 0.48, ease: [0.2, 1, 0.3, 1] }}
          />

          <motion.div
            className="absolute inset-0 bg-gradient-to-b from-red-500/10 via-transparent to-transparent"
            initial={{ opacity: 0 }}
            animate={{ opacity: prefersReducedMotion ? 0 : 0.6 }}
            exit={{ opacity: 0 }}
            transition={{ duration: prefersReducedMotion ? 0.12 : 0.28, ease: 'easeOut' }}
          />
        </motion.div>
      </AnimatePresence>
    </>
  );
}
