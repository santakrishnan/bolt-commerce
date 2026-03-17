import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { X } from 'lucide-react'

import { cn } from '@/lib/utils'
import { Button } from '@/components/button'

const chipVariants = cva(
  'inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2',
  {
    variants: {
      variant: {
        default:
          'border-transparent bg-primary text-primary-foreground hover:bg-primary/80',
        secondary:
          'border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80',
        outline:
          'border-input bg-background text-foreground hover:bg-accent hover:text-accent-foreground',
        destructive:
          'border-transparent bg-destructive text-destructive-foreground hover:bg-destructive/80',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
)

export interface ChipProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof chipVariants> {
  onRemove?: () => void
  removable?: boolean
}

const Chip = React.forwardRef<HTMLDivElement, ChipProps>(
  ({ className, variant, children, onRemove, removable = false, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(chipVariants({ variant }), className)}
        {...props}
      >
        {children}
        {removable && (
          <Button
            variant="ghost"
            size="icon"
            className="h-4 w-4 rounded-full p-0 opacity-70"
            onClick={(e) => {
              e.stopPropagation()
              onRemove?.()
            }}
            aria-label="Remove chip"
          >
            <X className="h-3 w-3" />
          </Button>
        )}
      </div>
    )
  }
)
Chip.displayName = 'Chip'

export { Chip, chipVariants }
