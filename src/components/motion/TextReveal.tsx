"use client";

import { ReactNode, Children } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface TextRevealProps {
  /** Words/spans to reveal. Strings are split on spaces; elements reveal as a unit. */
  children: ReactNode;
  className?: string;
  delay?: number;
  stagger?: number;
}

/**
 * Scroll-triggered heading reveal: each word flips up out of depth like a
 * stamped classification marking. Wrap colored spans to reveal them whole.
 */
export function TextReveal({ children, className, delay = 0, stagger = 0.055 }: TextRevealProps) {
  const prefersReducedMotion = useReducedMotion();

  if (prefersReducedMotion) {
    return <span className={className}>{children}</span>;
  }

  const units: ReactNode[] = [];
  Children.forEach(children, (child) => {
    if (typeof child === 'string') {
      child.split(/\s+/).filter(Boolean).forEach((word) => units.push(word));
    } else if (child != null) {
      units.push(child);
    }
  });

  return (
    <span className={cn('inline-block [perspective:600px]', className)}>
      {units.map((unit, i) => (
        <span key={i} className="inline-block overflow-hidden align-bottom pb-[0.12em] -mb-[0.12em]">
          <motion.span
            className="inline-block"
            initial={{ y: '110%', rotateX: -60, opacity: 0 }}
            whileInView={{ y: '0%', rotateX: 0, opacity: 1 }}
            viewport={{ once: true, amount: 0.6 }}
            transition={{ duration: 0.7, delay: delay + i * stagger, ease: [0.16, 1, 0.3, 1] }}
            style={{ transformStyle: 'preserve-3d', transformOrigin: 'bottom' }}
          >
            {unit}
          </motion.span>
          {i < units.length - 1 && <span>&nbsp;</span>}
        </span>
      ))}
    </span>
  );
}
