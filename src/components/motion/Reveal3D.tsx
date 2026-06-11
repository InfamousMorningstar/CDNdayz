"use client";

import { ReactNode } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { cn } from '@/lib/utils';

type Direction = 'up' | 'down' | 'left' | 'right';

interface Reveal3DProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  duration?: number;
  /** Direction the element travels FROM as it reveals. */
  from?: Direction;
  /** Degrees of 3D rotation at rest state before reveal. */
  tilt?: number;
  /** Reveal once or every time it enters the viewport. */
  once?: boolean;
  amount?: number;
}

const offsets: Record<Direction, { x: number; y: number; axis: 'rotateX' | 'rotateY'; sign: 1 | -1 }> = {
  up: { x: 0, y: 56, axis: 'rotateX', sign: 1 },
  down: { x: 0, y: -56, axis: 'rotateX', sign: -1 },
  left: { x: 64, y: 0, axis: 'rotateY', sign: -1 },
  right: { x: -64, y: 0, axis: 'rotateY', sign: 1 },
};

/**
 * Scroll-triggered 3D entrance: elements rise out of depth with perspective
 * rotation and a focus-pull blur, like debris settling into place.
 */
export function Reveal3D({
  children,
  className,
  delay = 0,
  duration = 0.85,
  from = 'up',
  tilt = 14,
  once = true,
  amount = 0.25,
}: Reveal3DProps) {
  const prefersReducedMotion = useReducedMotion();
  const o = offsets[from];

  if (prefersReducedMotion) {
    return <div className={className}>{children}</div>;
  }

  return (
    <div className={cn('[perspective:1200px]', className)}>
      <motion.div
        initial={{
          opacity: 0,
          x: o.x,
          y: o.y,
          scale: 0.96,
          filter: 'blur(10px)',
          [o.axis]: o.sign * tilt,
        }}
        whileInView={{
          opacity: 1,
          x: 0,
          y: 0,
          scale: 1,
          filter: 'blur(0px)',
          [o.axis]: 0,
        }}
        viewport={{ once, amount }}
        transition={{ duration, delay, ease: [0.16, 1, 0.3, 1] }}
        style={{ transformStyle: 'preserve-3d', willChange: 'transform, opacity, filter' }}
        className="h-full"
      >
        {children}
      </motion.div>
    </div>
  );
}
