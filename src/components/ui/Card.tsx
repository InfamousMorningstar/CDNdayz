"use client";

import { HTMLAttributes, forwardRef } from 'react';
import { cn } from '@/lib/utils';
import { VariantProps, cva } from 'class-variance-authority';
import { motion, HTMLMotionProps } from 'framer-motion';

const cardVariants = cva(
  "rounded-2xl overflow-hidden backdrop-blur-xl transition-all duration-300 pointer-events-auto",
  {
    variants: {
      variant: {
        default:
          "bg-white/5 border border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.3)] hover:bg-white/10 hover:shadow-[0_8px_32px_rgba(220,38,38,0.1)]",
        ghost:
          "bg-transparent border-0 shadow-none hover:bg-white/5",
        solid:
          "bg-neutral-900 border border-neutral-800 rounded-2xl",
        outline:
          "bg-transparent border border-white/10 hover:border-red-500/30 hover:bg-white/5",
        "glass-gradient":
          "bg-gradient-to-br from-white/10 to-transparent border border-white/20 shadow-2xl backdrop-blur-2xl",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

interface CardProps extends HTMLMotionProps<"div">, VariantProps<typeof cardVariants> {}

const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ className, variant, ...props }, ref) => {
    return (
      <motion.div
        className={cn(cardVariants({ variant, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Card.displayName = "Card";

export { Card, cardVariants };
