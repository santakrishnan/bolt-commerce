import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'

import { cn } from '@/lib/utils'

const badgeVariants = cva(
  'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ring-inset',
  {
    variants: {
      variant: {
        default:
          'bg-gray-100 text-gray-800 ring-gray-200 dark:bg-gray-800 dark:text-gray-100 dark:ring-gray-700',
        secondary: 'bg-gray-800 text-white ring-gray-900',
        destructive: 'bg-red-100 text-red-800 ring-red-200',
        outline: 'bg-transparent text-gray-800 ring-gray-200',
        subtle: 'bg-gray-200 text-gray-800',
        ghost: 'bg-transparent text-gray-700',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {}

const Badge = React.forwardRef<HTMLSpanElement, BadgeProps>(
  ({ className, variant, ...props }, ref) => {
    return <span ref={ref} className={cn(badgeVariants({ variant, className }))} {...props} />
  }
)
Badge.displayName = 'Badge'

export { Badge, badgeVariants }
export default Badge
