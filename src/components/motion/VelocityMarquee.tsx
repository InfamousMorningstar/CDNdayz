"use client";

import { useRef } from 'react';
import {
  motion,
  useAnimationFrame,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
  useVelocity,
} from 'framer-motion';
import { cn } from '@/lib/utils';

const wrap = (min: number, max: number, v: number) => {
  const range = max - min;
  return min + ((((v - min) % range) + range) % range);
};

interface VelocityMarqueeProps {
  text: string;
  className?: string;
  /** Base drift in %/second. Negative drifts left. */
  baseSpeed?: number;
  /** Visual style of the repeated text. */
  variant?: 'outline' | 'solid';
}

/**
 * Giant marquee strip whose speed and direction react to scroll velocity —
 * flick the page and the text whips with you.
 */
export function VelocityMarquee({ text, className, baseSpeed = -2.5, variant = 'outline' }: VelocityMarqueeProps) {
  const prefersReducedMotion = useReducedMotion();
  const baseX = useMotionValue(0);
  const { scrollY } = useScroll();
  const scrollVelocity = useVelocity(scrollY);
  const smoothVelocity = useSpring(scrollVelocity, { damping: 50, stiffness: 380 });
  const velocityFactor = useTransform(smoothVelocity, [0, 1200], [0, 4], { clamp: false });
  const directionRef = useRef(baseSpeed < 0 ? -1 : 1);

  const x = useTransform(baseX, (v) => `${wrap(-25, 0, v)}%`);

  useAnimationFrame((_, delta) => {
    if (prefersReducedMotion) return;
    const vf = velocityFactor.get();
    if (vf < -0.1) directionRef.current = baseSpeed < 0 ? 1 : -1;
    else if (vf > 0.1) directionRef.current = baseSpeed < 0 ? -1 : 1;

    let moveBy = directionRef.current * Math.abs(baseSpeed) * (delta / 1000);
    moveBy += moveBy * Math.abs(vf);
    baseX.set(baseX.get() + moveBy);
  });

  const phrase = `${text}  •  `;

  return (
    <div
      aria-hidden="true"
      className={cn(
        'relative overflow-hidden whitespace-nowrap select-none py-3 sm:py-4 border-y border-gray-200/70 dark:border-white/5 bg-white/40 dark:bg-black/40',
        className
      )}
    >
      <motion.div className="inline-flex" style={{ x }}>
        {Array.from({ length: 4 }).map((_, i) => (
          <span
            key={i}
            className={cn(
              'font-charlie-surf uppercase tracking-[0.08em] text-4xl sm:text-5xl lg:text-6xl leading-none',
              variant === 'outline' ? 'marquee-outline-text' : 'text-red-600/90'
            )}
          >
            {phrase}
          </span>
        ))}
      </motion.div>
      {/* Edge fade */}
      <div className="absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-background to-transparent pointer-events-none" />
      <div className="absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-background to-transparent pointer-events-none" />
    </div>
  );
}
