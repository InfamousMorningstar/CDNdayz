"use client";

import { HTMLAttributes, forwardRef } from 'react';
import { cn } from '@/lib/utils';
import { VariantProps, cva } from 'class-variance-authority';
import { motion, HTMLMotionProps } from 'framer-motion';

const cardVariants = cva(
  "rounded-lg overflow-hidden backdrop-blur-md transition-all duration-300 pointer-events-auto",
  {
    variants: {
      variant: {
        default:
          "bg-black/40 border border-white/5 shadow-xl hover:bg-black/60",
        ghost:
          "bg-transparent border-0 shadow-none hover:bg-white/5",
        solid:
          "bg-neutral-900 border border-neutral-800",
        outline:
          "bg-transparent border border-white/10 hover:border-red-500/30 hover:shadow-[0_0_20px_rgba(220,38,38,0.05)]",
        "glass-gradient":
          "bg-gradient-to-br from-white/5 to-transparent border border-white/10 shadow-2xl backdrop-blur-xl",
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
