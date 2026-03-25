import { ButtonHTMLAttributes, forwardRef } from 'react';
import { cn } from '@/lib/utils';
import { VariantProps, cva } from 'class-variance-authority';
import { Slot } from "@radix-ui/react-slot";

const buttonVariants = cva(
  "inline-flex items-center justify-center rounded-full text-sm font-semibold transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500 disabled:pointer-events-none disabled:opacity-50 tracking-wide font-sans active:scale-95",
  {
    variants: {
      variant: {
        default:
          "bg-gradient-to-br from-red-600 to-red-700 text-white hover:from-red-500 hover:to-red-600 shadow-[0_4px_20px_rgba(220,38,38,0.3)] hover:shadow-[0_6px_25px_rgba(220,38,38,0.5)] border border-red-500/20 backdrop-blur-sm",
        outline:
          "border border-white/20 bg-white/5 hover:bg-white/10 hover:text-white hover:border-white/40 text-neutral-200 backdrop-blur-md shadow-[0_4px_20px_rgba(0,0,0,0.2)]",
        ghost: "hover:bg-white/10 hover:text-white text-neutral-300 backdrop-blur-sm",
        destructive:
          "bg-rose-900/80 text-white hover:bg-rose-800 border border-rose-500/20 shadow-sm backdrop-blur-sm",
        link: "text-red-500 underline-offset-4 hover:underline normal-case tracking-normal",
      },
      size: {
        default: "h-11 px-8 py-2.5",
        sm: "h-8 px-4 text-xs",
        lg: "h-14 px-10 text-lg",
        icon: "h-10 w-10",
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
