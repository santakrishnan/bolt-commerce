import { cn, Button as ShadcnButton } from "@tfs-ucmp/ui";
import { cva, type VariantProps } from "class-variance-authority";
import * as React from "react";

const appButtonVariants = cva(
  "inline-flex cursor-pointer items-center justify-center gap-[var(--spacing-2xs)] whitespace-nowrap rounded-full font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        primary:
          "bg-actions-primary text-[color:var(--color-actions-primary-foreground)] hover:bg-actions-primary-hover active:bg-actions-primary-hover disabled:bg-states-disabled disabled:text-disabled-foreground",
        secondary:
          "bg-actions-secondary text-[color:var(--color-actions-secondary-foreground)] hover:bg-actions-secondary-hover active:bg-actions-secondary-hover disabled:bg-states-disabled disabled:text-disabled-foreground",
        tertiary:
          "border-1 border-actions-tertiary-border bg-transparent text-[color:var(--color-actions-tertiary-foreground)] hover:bg-actions-tertiary-hover active:bg-actions-tertiary-hover disabled:border-primary/50 disabled:bg-states-disabled disabled:text-disabled-foreground",
    
      },
      size: {
        xs: "h-7 px-[var(--spacing-md)] py-2.5 font-semibold text-[length:var(--text-sm)] leading-[125%] tracking-[-0.14px]",
        sm: "h-8 px-[var(--spacing-lg)] py-0 font-semibold text-[length:var(--text-xs)] leading-[125%] tracking-[-0.12px]",
        md: "h-10 px-[var(--spacing-xl)] py-0 font-semibold text-[length:var(--text-sm)] leading-[125%] tracking-[-0.14px]",
        lg: "h-12 px-[var(--spacing-2xl)] py-0 font-semibold text-[length:var(--text-sm)] leading-[125%] tracking-[-0.16px]",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "md",
    },
  }
);

export interface ButtonProps
  extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "size">,
    VariantProps<typeof appButtonVariants> {
  icon?: React.ReactNode;
  iconPosition?: "left" | "right";
  asChild?: boolean;
}

const AppButton = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, icon, iconPosition = "left", asChild, children, ...props }, ref) => {
    return (
      <ShadcnButton
        asChild={asChild}
        className={cn(appButtonVariants({ variant, size, className }))}
        ref={ref}
        size={null}
        variant={null}
        {...props}
      >
        {asChild ? (
          children
        ) : (
          <>
            {icon && iconPosition === "left" && <span className="inline-flex shrink-0">{icon}</span>}
            {children}
            {icon && iconPosition === "right" && <span className="inline-flex shrink-0">{icon}</span>}
          </>
        )}
      </ShadcnButton>
    );
  }
);
AppButton.displayName = "AppButton";

export { AppButton, appButtonVariants };
