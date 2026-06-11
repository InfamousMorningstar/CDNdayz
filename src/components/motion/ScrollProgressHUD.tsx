"use client";

import { useEffect, useState } from 'react';
import { motion, useMotionValueEvent, useReducedMotion, useScroll, useSpring } from 'framer-motion';

/**
 * Tactical scroll HUD: a thin red progress rail across the top plus a
 * mono percentage readout that appears once the user starts scrolling.
 */
export function ScrollProgressHUD() {
  const prefersReducedMotion = useReducedMotion();
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 180, damping: 28, restDelta: 0.001 });
  const [percent, setPercent] = useState(0);
  const [engaged, setEngaged] = useState(false);

  useMotionValueEvent(scrollYProgress, 'change', (v) => {
    setPercent(Math.round(v * 100));
    setEngaged(v > 0.02);
  });

  if (prefersReducedMotion) return null;

  return (
    <>
      <motion.div
        aria-hidden="true"
        className="fixed top-0 left-0 right-0 h-[2px] z-[80] origin-left bg-gradient-to-r from-red-700 via-red-500 to-amber-500 shadow-[0_0_12px_rgba(239,68,68,0.7)]"
        style={{ scaleX }}
      />
      <motion.div
        aria-hidden="true"
        initial={{ opacity: 0, x: 12 }}
        animate={{ opacity: engaged ? 1 : 0, x: engaged ? 0 : 12 }}
        transition={{ duration: 0.3, ease: 'easeOut' }}
        className="fixed bottom-5 right-4 z-[80] hidden lg:flex items-center gap-2 px-2.5 py-1.5 rounded-md border border-red-500/25 bg-black/55 backdrop-blur-md pointer-events-none select-none"
      >
        <span className="relative flex h-1.5 w-1.5">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-500 opacity-60" />
          <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-red-500" />
        </span>
        <span className="font-mono text-[10px] tracking-[0.22em] text-red-300/90 tabular-nums uppercase">
          Scan {String(percent).padStart(3, '0')}%
        </span>
      </motion.div>
    </>
  );
}
