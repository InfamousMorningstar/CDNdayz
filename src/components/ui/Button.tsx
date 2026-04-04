import { ButtonHTMLAttributes, forwardRef } from 'react';
import { cn } from '@/lib/utils';
import { VariantProps, cva } from 'class-variance-authority';
import { Slot } from "@radix-ui/react-slot";

const buttonVariants = cva(
  "inline-flex items-center justify-center rounded-full text-sm font-semibold tracking-tight transition-all focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-red-500 disabled:pointer-events-none disabled:opacity-50 font-sans touch-manipulation select-none",
  {
    variants: {
      variant: {
        default:
          "bg-red-700 text-white hover:bg-red-600 shadow-[0_0_15px_rgba(220,38,38,0.2)] hover:shadow-[0_0_25px_rgba(220,38,38,0.4)] border border-red-500/20 active:scale-[0.98]",
        outline:
          "border border-white/10 bg-black/40 hover:bg-white/5 hover:text-white hover:border-red-500/30 text-neutral-300 backdrop-blur-sm active:scale-[0.98]",
        ghost: "hover:bg-white/5 hover:text-white text-neutral-400 active:scale-[0.98]",
        destructive:
          "bg-rose-900/80 text-white hover:bg-rose-800 border border-rose-500/20 shadow-sm",
        link: "text-red-500 underline-offset-4 hover:underline normal-case tracking-normal font-sans",
      },
      size: {
        default: "h-11 sm:h-11 min-h-[44px] px-6 py-2",
        sm: "h-10 sm:h-8 min-h-[40px] sm:min-h-0 px-4 text-xs sm:text-[10px]",
        lg: "h-14 px-10 text-base",
        icon: "h-9 w-9",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
