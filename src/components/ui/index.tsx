import { type VariantProps, cva } from 'class-variance-authority'
import { cn } from '@/lib/utils'
import { forwardRef } from 'react'

// ── Badge ────────────────────────────────────────────────────
const badgeVariants = cva(
  'inline-flex items-center text-[10px] font-medium px-2 py-0.5 rounded',
  {
    variants: {
      variant: {
        green:  'bg-[#EAF3DE] text-[#27500A]',
        amber:  'bg-[#FAEEDA] text-[#633806]',
        blue:   'bg-[#E6F1FB] text-[#0C447C]',
        red:    'bg-[#FCEBEB] text-[#791F1F]',
        purple: 'bg-[#EEEDFE] text-[#3C3489]',
        teal:   'bg-[#E1F5EE] text-[#085041]',
        gray:   'bg-[var(--bg-secondary)] text-[var(--text-secondary)]',
      },
    },
    defaultVariants: { variant: 'gray' },
  }
)

interface BadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {}

export function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <span className={cn(badgeVariants({ variant }), className)} {...props} />
  )
}

// ── Button ───────────────────────────────────────────────────
const buttonVariants = cva(
  `inline-flex items-center justify-center gap-2 h-9 px-4 text-sm font-medium
   rounded-md border transition-all active:scale-[0.98]
   disabled:opacity-50 disabled:cursor-not-allowed`,
  {
    variants: {
      variant: {
        default: `bg-transparent border-[var(--border-default)]
                  text-[var(--text-primary)] hover:bg-[var(--bg-secondary)]`,
        primary: 'bg-[#639922] text-white border-transparent hover:bg-[#3B6D11]',
        danger:  'bg-[#FCEBEB] text-[#791F1F] border-[#F09595] hover:bg-[#F7C1C1]',
        ghost:   'border-transparent text-[var(--text-secondary)] hover:bg-[var(--bg-secondary)]',
      },
      size: {
        sm: 'h-7 px-3 text-xs',
        md: 'h-9 px-4 text-sm',
        lg: 'h-11 px-6 text-base',
      },
    },
    defaultVariants: { variant: 'default', size: 'md' },
  }
)

interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, ...props }, ref) => (
    <button
      ref={ref}
      className={cn(buttonVariants({ variant, size }), className)}
      {...props}
    />
  )
)
Button.displayName = 'Button'

// ── Card ─────────────────────────────────────────────────────
interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  surface?: boolean
}

export function Card({ className, surface, ...props }: CardProps) {
  return (
    <div
      className={cn(
        surface
          ? 'bg-[var(--bg-secondary)] rounded-lg p-4'
          : 'bg-[var(--bg-primary)] border border-[var(--border-subtle)] rounded-lg p-4',
        className
      )}
      {...props}
    />
  )
}

// ── KpiCard ──────────────────────────────────────────────────
interface KpiCardProps {
  label: string
  value: string | number
  delta?: string
  deltaType?: 'success' | 'warning' | 'danger' | 'neutral'
  className?: string
}

const deltaColors = {
  success: 'text-[#3B6D11]',
  warning: 'text-[#BA7517]',
  danger:  'text-[#A32D2D]',
  neutral: 'text-[var(--text-secondary)]',
}

export function KpiCard({ label, value, delta, deltaType = 'neutral', className }: KpiCardProps) {
  return (
    <div className={cn('bg-[var(--bg-secondary)] rounded-md p-3', className)}>
      <div className="text-xs text-[var(--text-secondary)] mb-1">{label}</div>
      <div className="text-[22px] font-medium leading-none">{value}</div>
      {delta && (
        <div className={cn('text-[10px] mt-1', deltaColors[deltaType])}>
          {delta}
        </div>
      )}
    </div>
  )
}

// ── Input ────────────────────────────────────────────────────
export const Input = forwardRef<
  HTMLInputElement,
  React.InputHTMLAttributes<HTMLInputElement>
>(({ className, ...props }, ref) => (
  <input
    ref={ref}
    className={cn(
      `w-full h-9 px-3 text-sm rounded-md border
       bg-[var(--bg-primary)] text-[var(--text-primary)]
       placeholder:text-[var(--text-tertiary)]
       border-[var(--border-default)]
       focus:outline-none focus:ring-2 focus:ring-[#639922]/30 focus:border-[#639922]
       transition`,
      className
    )}
    {...props}
  />
))
Input.displayName = 'Input'

// ── ProgressBar ──────────────────────────────────────────────
interface ProgressBarProps {
  value: number        // 0–100
  max?: number
  color?: string
  className?: string
}

export function ProgressBar({ value, max = 100, color = '#639922', className }: ProgressBarProps) {
  const pct = Math.min(100, Math.max(0, (value / max) * 100))
  return (
    <div className={cn('h-1 rounded-full overflow-hidden bg-[var(--bg-secondary)]', className)}>
      <div
        className="h-full rounded-full transition-all"
        style={{ width: `${pct}%`, background: color }}
      />
    </div>
  )
}

// ── Skeleton ─────────────────────────────────────────────────
export function Skeleton({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        'animate-pulse rounded bg-[var(--bg-secondary)]',
        className
      )}
    />
  )
}
