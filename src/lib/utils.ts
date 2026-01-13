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

export const STATUS_LABELS: Record<string, string> = {
  draft: 'Draft',
  scripted: 'Scripted',
  planned: 'Planned',
  to_film: 'To Film',
  filmed: 'Filmed',
  editing: 'Editing',
  scheduled: 'Scheduled',
  published: 'Published',
  archived: 'Archived',
}

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
