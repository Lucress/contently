import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount)
}

export function formatDate(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(d)
}

export function getInitials(name: string): string {
  return name
    .split(' ')
    .map(word => word[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)
}

// 7-step linear pipeline: idea → scripted → to_film → filmed → editing → scheduled → published
export const STATUS_LABELS: Record<string, string> = {
  idea:      'Idea',
  scripted:  'Scripted',
  to_film:   'To Film',
  filmed:    'Filmed',
  editing:   'Editing',
  scheduled: 'Scheduled',
  published: 'Published',
  archived:  'Archived',
  // Legacy values kept for backward compat — display as Idea
  draft:     'Idea',
  planned:   'Idea',
}

export const STATUS_COLORS: Record<string, string> = {
  idea:      '#f59e0b',
  scripted:  '#3b82f6',
  to_film:   '#8b5cf6',
  filmed:    '#a855f7',
  editing:   '#f97316',
  scheduled: '#06b6d4',
  published: '#22c55e',
  archived:  '#6b7280',
  draft:     '#f59e0b',
  planned:   '#f59e0b',
}

// Ordered pipeline for UI iteration (excludes archived and legacy aliases)
export const STATUS_PIPELINE = [
  { key: 'idea',      label: 'Idea',      color: '#f59e0b' },
  { key: 'scripted',  label: 'Scripted',  color: '#3b82f6' },
  { key: 'to_film',   label: 'To Film',   color: '#8b5cf6' },
  { key: 'filmed',    label: 'Filmed',    color: '#a855f7' },
  { key: 'editing',   label: 'Editing',   color: '#f97316' },
  { key: 'scheduled', label: 'Scheduled', color: '#06b6d4' },
  { key: 'published', label: 'Published', color: '#22c55e' },
] as const

export const DEAL_STATUS_LABELS: Record<string, string> = {
  lead: 'Lead',
  pitched: 'Pitched',
  negotiating: 'Negotiating',
  contracted: 'Contracted',
  in_progress: 'In Progress',
  delivered: 'Delivered',
  paid: 'Paid',
  completed: 'Completed',
  cancelled: 'Cancelled',
}
