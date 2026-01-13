import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

const badgeVariants = cva(
  'inline-flex items-center rounded-md border px-2 py-0.5 text-xs font-medium transition-colors focus:outline-none focus:ring-1 focus:ring-ring',
  {
    variants: {
      variant: {
        default: 'border-transparent bg-primary text-primary-foreground',
        secondary: 'border-transparent bg-secondary text-secondary-foreground',
        destructive: 'border-transparent bg-destructive/10 text-destructive',
        success: 'border-transparent bg-success/10 text-success',
        warning: 'border-transparent bg-warning/10 text-warning',
        outline: 'text-foreground border-border',
        // Status-based variants - more muted colors
        draft: 'border-transparent bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400',
        scripted: 'border-transparent bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400',
        planned: 'border-transparent bg-purple-50 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400',
        to_film: 'border-transparent bg-amber-50 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400',
        filmed: 'border-transparent bg-orange-50 text-orange-600 dark:bg-orange-900/30 dark:text-orange-400',
        editing: 'border-transparent bg-pink-50 text-pink-600 dark:bg-pink-900/30 dark:text-pink-400',
        scheduled: 'border-transparent bg-indigo-50 text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-400',
        published: 'border-transparent bg-green-50 text-green-600 dark:bg-green-900/30 dark:text-green-400',
        archived: 'border-transparent bg-gray-100 text-gray-500 dark:bg-gray-800 dark:text-gray-500',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return <div className={cn(badgeVariants({ variant }), className)} {...props} />
}

export { Badge, badgeVariants }
