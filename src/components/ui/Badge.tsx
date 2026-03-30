import { HTMLAttributes, forwardRef } from 'react';
import { cn } from '@/lib/utils';
import { VariantProps, cva } from 'class-variance-authority';

const badgeVariants = cva(
  "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium uppercase tracking-wide transition-colors focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-offset-2 backdrop-blur-md",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-neutral-800 text-neutral-100 shadow hover:bg-neutral-700",
        secondary:
          "border-transparent bg-slate-400/10 text-slate-400 border border-slate-400/20 shadow-[0_0_10px_rgba(148,163,184,0.1)] hover:bg-slate-400/20",
        outline:
          "border border-neutral-700/50 text-neutral-400 bg-black/20",
        success:
          "border-transparent bg-green-500/10 text-green-400 border border-green-500/20 shadow-[0_0_10px_rgba(34,197,94,0.1)]",
        destructive:
          "border-transparent bg-rose-500/10 text-rose-400 border border-rose-500/20 shadow-[0_0_10px_rgba(244,63,94,0.1)]",
        warning:
          "border-transparent bg-amber-500/10 text-amber-400 border border-amber-500/20",
        info:
          "border-transparent bg-sky-500/10 text-sky-400 border border-sky-500/20",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}

export { Badge, badgeVariants };
