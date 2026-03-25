import { HTMLAttributes, forwardRef } from 'react';
import { cn } from '@/lib/utils';
import { VariantProps, cva } from 'class-variance-authority';

const badgeVariants = cva(
  "inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wide transition-all focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-offset-2 backdrop-blur-lg border border-transparent shadow-[0_2px_10px_rgba(0,0,0,0.1)]",
  {
    variants: {
      variant: {
        default:
          "bg-white/10 text-neutral-100 hover:bg-white/20 border-white/10",
        secondary:
          "bg-slate-500/10 text-slate-300 border-slate-500/20 hover:bg-slate-500/20",
        outline:
          "border-white/20 text-neutral-300 bg-white/5 hover:bg-white/10",
        success:
          "bg-green-500/10 text-green-400 border-green-500/20 shadow-[0_0_15px_rgba(34,197,94,0.1)]",
        destructive:
          "bg-rose-500/10 text-rose-400 border-rose-500/20 shadow-[0_0_15px_rgba(244,63,94,0.1)]",
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
