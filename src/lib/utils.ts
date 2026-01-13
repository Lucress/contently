import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(date: Date | string, options?: Intl.DateTimeFormatOptions): string {
  const d = typeof date === 'string' ? new Date(date) : date
  return new Intl.DateTimeFormat('fr-FR', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    ...options,
  }).format(d)
}

export function formatDateTime(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date
  return new Intl.DateTimeFormat('fr-FR', {
    day: 'numeric',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
  }).format(d)
}

export function formatCurrency(amount: number, currency: string = 'EUR'): string {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency,
  }).format(amount)
}

export function formatNumber(num: number): string {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + 'M'
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'K'
  }
  return num.toString()
}

export function getInitials(name: string | null | undefined): string {
  if (!name) return '?'
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)+/g, '')
}

export function truncate(text: string, length: number): string {
  if (text.length <= length) return text
  return text.slice(0, length) + '...'
}

export function getDomainFromEmail(email: string): string {
  const parts = email.split('@')
  return parts[1] || ''
}

export function generateId(): string {
  return Math.random().toString(36).substring(2, 15)
}

export function debounce<T extends (...args: unknown[]) => unknown>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null
  return (...args: Parameters<T>) => {
    if (timeout) clearTimeout(timeout)
    timeout = setTimeout(() => func(...args), wait)
  }
}

export function groupBy<T>(array: T[], key: keyof T): Record<string, T[]> {
  return array.reduce((result, item) => {
    const groupKey = String(item[key])
    if (!result[groupKey]) {
      result[groupKey] = []
    }
    result[groupKey].push(item)
    return result
  }, {} as Record<string, T[]>)
}

export const STATUS_COLORS: Record<string, string> = {
  draft: 'bg-gray-100 text-gray-700',
  scripted: 'bg-blue-100 text-blue-700',
  planned: 'bg-purple-100 text-purple-700',
  to_film: 'bg-yellow-100 text-yellow-700',
  filmed: 'bg-orange-100 text-orange-700',
  editing: 'bg-pink-100 text-pink-700',
  scheduled: 'bg-indigo-100 text-indigo-700',
  published: 'bg-green-100 text-green-700',
  archived: 'bg-gray-100 text-gray-500',
}

export const STATUS_LABELS: Record<string, string> = {
  draft: 'Brouillon',
  scripted: 'Scripté',
  planned: 'Planifié',
  to_film: 'À tourner',
  filmed: 'Tourné',
  editing: 'Montage',
  scheduled: 'Programmé',
  published: 'Publié',
  archived: 'Archivé',
}

export const DEAL_STATUS_LABELS: Record<string, string> = {
  lead: 'Lead',
  contacted: 'Contacté',
  negotiating: 'Négociation',
  proposal_sent: 'Proposition envoyée',
  accepted: 'Accepté',
  in_progress: 'En cours',
  delivered: 'Livré',
  invoiced: 'Facturé',
  paid: 'Payé',
  completed: 'Terminé',
  lost: 'Perdu',
  cancelled: 'Annulé',
}

export const DEAL_STATUS_COLORS: Record<string, string> = {
  lead: 'bg-gray-100 text-gray-700',
  contacted: 'bg-blue-100 text-blue-700',
  negotiating: 'bg-yellow-100 text-yellow-700',
  proposal_sent: 'bg-purple-100 text-purple-700',
  accepted: 'bg-green-100 text-green-700',
  in_progress: 'bg-orange-100 text-orange-700',
  delivered: 'bg-teal-100 text-teal-700',
  invoiced: 'bg-indigo-100 text-indigo-700',
  paid: 'bg-emerald-100 text-emerald-700',
  completed: 'bg-green-100 text-green-800',
  lost: 'bg-red-100 text-red-700',
  cancelled: 'bg-gray-100 text-gray-500',
}

export const PLATFORM_LABELS: Record<string, string> = {
  tiktok: 'TikTok',
  instagram_reels: 'Instagram Reels',
  youtube_shorts: 'YouTube Shorts',
  youtube: 'YouTube',
  linkedin: 'LinkedIn',
  twitter: 'Twitter/X',
  other: 'Autre',
}
