import { cva, type VariantProps } from 'class-variance-authority'
import type * as React from 'react'
import Image from 'next/image'

import { cn } from '@/lib/utils'

const badgeVariants = cva(
  'flex h-(--spacing-lg) w-fit items-center justify-center gap-(--spacing-xs) rounded-sm border-transparent px-2 shadow-none ',
  {
    variants: {
      variant: {
        default: 'border-transparent bg-primary text-primary-foreground shadow hover:bg-primary-hover',
        excellentPrice:
          'border-transparent bg-brand-success text-white shadow-none hover:bg-success-badge whitespace-nowrap pb-[2px] text-center font-semibold text-2xs leading-normal text-[length:var(--text-2xs)]',
        secondary:
          'border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80',
        destructive:
          'border-transparent bg-destructive text-destructive-foreground shadow hover:bg-destructive/80',
        outline: 'text-foreground text-[length:var(--text-xs)] text-[var(--color-states-muted-foreground)]',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {
  icon?: string
  text?: string
}

function Badge({ className, variant, icon, text, children, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props}>
      {icon && (
        <Image
          alt=""
          aria-hidden="true"
          className="size-(--size-icon-sm)"
          height={16}
          src={`/images/vdp/${icon}.svg`}
          width={16}
        />
      )}
      {text && (
        <span>
          {text}
        </span>
      )}
      {children}
    </div>
  )
}

export { Badge, badgeVariants }
