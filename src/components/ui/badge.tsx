import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-primary text-primary-foreground hover:bg-primary/80",
        secondary:
          "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80",
        destructive:
          "border-transparent bg-destructive text-destructive-foreground hover:bg-destructive/80",
        outline: "text-foreground",
      },
      color: {
        default: "",
        orange: "border-orange-400 bg-orange-400/20 text-orange-400 hover:bg-orange-400/30",
        red: "border-red-400 bg-red-400/20 text-red-400 hover:bg-red-400/30",
        yellow: "border-yellow-400 bg-yellow-400/20 text-yellow-400 hover:bg-yellow-400/30",
        green: "border-green-400 bg-green-400/20 text-green-400 hover:bg-green-400/30",
      },
    },
    defaultVariants: {
      variant: "default",
      color: "default",
    },
  },
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {
      color?: "default" | "orange" | "red" | "yellow" | "green"
    }

function Badge({ className, variant, color, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant, color }), className)} {...props} />
  );
}

export { Badge, badgeVariants };
