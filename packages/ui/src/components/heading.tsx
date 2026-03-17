/**
 * Heading Component
 *
 * A flexible heading component that supports all heading levels (h1-h6) with
 * consistent typography based on design tokens. Includes responsive sizing
 * that adapts between mobile and desktop breakpoints.
 *
 * @example
 * // Basic usage (responsive by default)
 * <Heading>Default H1</Heading>
 *
 * @example
 * // With level and weight variants
 * <Heading level={2} weight="semibold">Semibold H2</Heading>
 * <Heading level={3} weight="bold">Bold H3</Heading>
 *
 * @example
 * // With custom element and classes
 * <Heading as="h3" level={2} weight="bold" className="text-red-500">
 *   Bold H3 styled as H2
 * </Heading>
 *
 * @example
 * // Inline Tailwind overrides
 * <Heading level={4} className="text-blue-600 font-black">
 *   Custom styled heading
 * </Heading>
 *
 * @remarks
 * Typography scales responsively:
 * - Mobile: smaller text sizes optimized for narrow screens
 * - Desktop (md:): larger text sizes for wider viewports
 */

import { cva, type VariantProps } from "class-variance-authority";
import * as React from "react";

import { cn } from "@/lib/utils";

const headingVariants = cva("", {
  variants: {
    level: {
      1: "text-[length:var(--text-2xl)] leading-[115%] md:text-[length:var(--text-4xl)]",
      2: "text-[length:var(--text-lg)] leading-[125%] md:text-[length:var(--text-2xl)]",
      3: "text-[length:var(--text-xl)] leading-[115%] md:text-[length:var(--text-lg)]",
      4: "text-[length:var(--text-body-lg)] leading-[115%] md:text-[length:var(--text-xl)]",
      5: "text-[length:var(--text-md)] leading-[115%]",
    },
    weight: {
      normal: "font-[var(--font-weight-normal)]",
      semibold: "font-[var(--font-weight-semibold)]",
      bold: "font-[var(--font-weight-bold)]",
    },
  },
  compoundVariants: [
    // h2 semibold and bold get tighter line-height
    {
      level: 2,
      weight: ["semibold", "bold"],
      className: "leading-[115%]",
    },
    // h3 bold gets custom size on mobile
    {
      level: 3,
      weight: "bold",
      className: "text-[length:var(--text-body-lg)]",
    },
  ],
  defaultVariants: {
    level: 1,
    weight: "normal",
  },
});

export interface HeadingProps
  extends React.HTMLAttributes<HTMLHeadingElement>,
    VariantProps<typeof headingVariants> {
  as?: "h1" | "h2" | "h3" | "h4" | "h5" | "h6";
}

const Heading = React.forwardRef<HTMLHeadingElement, HeadingProps>(
  ({ className, level, weight, as, children, ...props }, ref) => {
    const Component = as || (`h${level || 1}` as "h1" | "h2" | "h3" | "h4" | "h5" | "h6");

    return (
      <Component
        ref={ref}
        className={cn(headingVariants({ level, weight }), className)}
        {...props}
      >
        {children}
      </Component>
    );
  }
);

Heading.displayName = "Heading";

export { Heading, headingVariants };
