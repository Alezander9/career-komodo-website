import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none",
  {
    variants: {
      variant: {
        primary:
          "bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))] shadow-md hover:bg-[hsl(var(--primary))]/90 hover:shadow-lg transition-all duration-200",
        outline:
          "border-2 border-[hsl(var(--primary))]/70 bg-transparent text-[hsl(var(--primary))] shadow-sm hover:bg-[hsl(var(--primary))]/10 hover:shadow-md transition-all duration-200",
        disabled:
          "bg-[hsl(var(--muted))] text-[hsl(var(--muted-foreground))] cursor-not-allowed opacity-70",
      },
      size: {
        default: "h-10 px-5 py-2",
        sm: "h-8 rounded-md px-3 text-xs",
        lg: "h-12 rounded-md px-8 text-base",
        icon: "size-10 p-2",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "default",
    },
  }
);

interface ButtonProps
  extends React.ComponentProps<"button">,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
  isDisabled?: boolean;
}

function Button({
  className,
  variant,
  size,
  asChild = false,
  isDisabled = false,
  disabled,
  ...props
}: ButtonProps) {
  const Comp = asChild ? Slot : "button";

  // Apply disabled variant if isDisabled or disabled is true
  const actualVariant = isDisabled || disabled ? "disabled" : variant;

  return (
    <Comp
      data-slot="button"
      className={cn(
        buttonVariants({ variant: actualVariant, size, className })
      )}
      disabled={isDisabled || disabled}
      {...props}
    />
  );
}

export { Button, buttonVariants };
