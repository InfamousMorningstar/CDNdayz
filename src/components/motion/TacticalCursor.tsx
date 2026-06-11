"use client";

import { useEffect, useState } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';

/**
 * Custom tactical crosshair cursor: a precise red dot with a trailing
 * targeting ring that expands and spins over interactive elements.
 * Desktop fine-pointer only; the native cursor is hidden via CSS class.
 */
export function TacticalCursor() {
  const [enabled, setEnabled] = useState(false);
  const [hovering, setHovering] = useState(false);
  const [visible, setVisible] = useState(false);

  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  const ringX = useSpring(x, { stiffness: 320, damping: 28, mass: 0.6 });
  const ringY = useSpring(y, { stiffness: 320, damping: 28, mass: 0.6 });

  useEffect(() => {
    const finePointer = window.matchMedia('(pointer: fine)').matches;
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!finePointer || reducedMotion) return;

    setEnabled(true);
    document.documentElement.classList.add('tactical-cursor-active');

    const onMove = (e: MouseEvent) => {
      x.set(e.clientX);
      y.set(e.clientY);
      setVisible(true);
      const target = e.target as HTMLElement | null;
      setHovering(!!target?.closest('a, button, [role="button"], input, select, textarea, summary, [data-cursor-target]'));
    };
    const onLeave = () => setVisible(false);

    window.addEventListener('mousemove', onMove, { passive: true });
    document.documentElement.addEventListener('mouseleave', onLeave);

    return () => {
      document.documentElement.classList.remove('tactical-cursor-active');
      window.removeEventListener('mousemove', onMove);
      document.documentElement.removeEventListener('mouseleave', onLeave);
    };
  }, [x, y]);

  if (!enabled) return null;

  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 z-[200] hidden lg:block">
      {/* Center dot */}
      <motion.div
        className="absolute w-1.5 h-1.5 -ml-[3px] -mt-[3px] rounded-full bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.9)]"
        style={{ x, y, opacity: visible ? 1 : 0 }}
      />
      {/* Targeting ring with crosshair ticks */}
      <motion.div
        className="absolute -ml-4 -mt-4 w-8 h-8"
        style={{ x: ringX, y: ringY, opacity: visible ? 1 : 0 }}
        animate={{
          scale: hovering ? 1.8 : 1,
          rotate: hovering ? 45 : 0,
        }}
        transition={{ type: 'spring', stiffness: 260, damping: 20 }}
      >
        <div className={`absolute inset-0 rounded-full border transition-colors duration-200 ${hovering ? 'border-red-400/90' : 'border-red-500/40'}`} />
        {/* Crosshair ticks at N/E/S/W */}
        <span className="absolute left-1/2 -top-0.5 w-px h-1.5 -ml-px bg-red-500/80" />
        <span className="absolute left-1/2 -bottom-0.5 w-px h-1.5 -ml-px bg-red-500/80" />
        <span className="absolute top-1/2 -left-0.5 h-px w-1.5 -mt-px bg-red-500/80" />
        <span className="absolute top-1/2 -right-0.5 h-px w-1.5 -mt-px bg-red-500/80" />
      </motion.div>
    </div>
  );
}
