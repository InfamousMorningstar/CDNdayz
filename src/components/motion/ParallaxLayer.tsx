"use client";

import { ReactNode, useRef } from 'react';
import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion';

interface ParallaxLayerProps {
  children: ReactNode;
  className?: string;
  /**
   * Parallax speed. Negative drifts up slower than scroll (background feel),
   * positive drifts down (foreground feel). Roughly px of travel across the
   * element's full scroll journey.
   */
  speed?: number;
}

/** Scroll-linked vertical parallax for layered depth. */
export function ParallaxLayer({ children, className, speed = -60 }: ParallaxLayerProps) {
  const ref = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  const y = useTransform(scrollYProgress, [0, 1], [speed, -speed]);

  if (prefersReducedMotion) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div ref={ref} style={{ y, willChange: 'transform' }} className={className}>
      {children}
    </motion.div>
  );
}
