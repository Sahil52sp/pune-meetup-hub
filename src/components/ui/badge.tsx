import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";
import { Box } from "@/components/ui/box";

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default: "border-transparent bg-primary text-primary-foreground hover:bg-primary/80",
        secondary: "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80",
        destructive: "border-transparent bg-destructive text-destructive-foreground hover:bg-destructive/80",
        outline: "text-foreground",
        tech: "border-transparent bg-category-tech/10 text-category-tech border-category-tech/20",
        business: "border-transparent bg-category-business/10 text-category-business border-category-business/20",
        arts: "border-transparent bg-category-arts/10 text-category-arts border-category-arts/20",
        sports: "border-transparent bg-category-sports/10 text-category-sports border-category-sports/20",
        networking: "border-transparent bg-category-networking/10 text-category-networking border-category-networking/20",
        workshop: "border-transparent bg-category-workshop/10 text-category-workshop border-category-workshop/20",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return <Box className={cn(badgeVariants({ variant }), className)} {...props} />;
}

export { Badge, badgeVariants };
