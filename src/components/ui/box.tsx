import * as React from "react";
import { cn } from "@/lib/utils";

export interface BoxProps extends React.HTMLAttributes<HTMLElement> {
  as?: keyof JSX.IntrinsicElements;
}

const Box = React.forwardRef<HTMLElement, BoxProps>(
  ({ className, as: Component = "div", ...props }, ref) => {
    return React.createElement(Component, { ref, className: cn(className), ...props });
  }
);

Box.displayName = "Box";

export { Box };