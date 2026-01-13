'use client'

import * as React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion } from 'framer-motion'
import {
  LayoutDashboard,
  Lightbulb,
  Sparkles,
  Calendar,
  Video,
  Handshake,
  Mail,
  DollarSign,
  BarChart3,
  Settings,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import { useLanguage } from '@/lib/i18n'
import { LanguageSwitcher } from '@/components/language-switcher'

interface NavItem {
  titleKey: 'dashboard' | 'ideas' | 'inspirations' | 'planner' | 'production' | 'collab' | 'brands' | 'deals' | 'emails' | 'revenue' | 'analytics' | 'settings'
  href: string
  icon: React.ElementType
  badge?: string | number
}

const mainNavItems: NavItem[] = [
  { titleKey: 'dashboard', href: '/dashboard', icon: LayoutDashboard },
  { titleKey: 'inspirations', href: '/inspirations', icon: Sparkles },
  { titleKey: 'ideas', href: '/ideas', icon: Lightbulb },
  { titleKey: 'planner', href: '/planner', icon: Calendar },
  { titleKey: 'production', href: '/production', icon: Video },
]

const businessNavItems: NavItem[] = [
  { titleKey: 'collab', href: '/collab', icon: Handshake },
  { titleKey: 'emails', href: '/emails', icon: Mail },
  { titleKey: 'revenue', href: '/revenue', icon: DollarSign },
]

interface SidebarProps {
  isCollapsed: boolean
  onToggle: () => void
}

export function Sidebar({ isCollapsed, onToggle }: SidebarProps) {
  const pathname = usePathname()
  const { t } = useLanguage()

  const NavLink = ({ item }: { item: NavItem }) => {
    const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`)
    const Icon = item.icon
    const title = t.nav[item.titleKey]

    return (
      <Link
        href={item.href}
        className={cn(
          'sidebar-link group relative',
          isActive && 'active'
        )}
      >
        <Icon className="h-5 w-5 shrink-0" />
        {!isCollapsed && (
          <motion.span
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -10 }}
            className="truncate"
          >
            {title}
          </motion.span>
        )}
        {!isCollapsed && item.badge && (
          <span className="ml-auto text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full">
            {item.badge}
          </span>
        )}
        {isActive && (
          <motion.div
            layoutId="sidebar-indicator"
            className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-primary rounded-r-full"
          />
        )}
      </Link>
    )
  }

  const SettingsLink = () => {
    const isActive = pathname === '/settings' || pathname.startsWith('/settings/')
    return (
      <Link
        href="/settings"
        className={cn(
          'sidebar-link group relative',
          isActive && 'active'
        )}
      >
        <Settings className="h-5 w-5 shrink-0" />
        {!isCollapsed && (
          <motion.span
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -10 }}
            className="truncate"
          >
            {t.nav.settings}
          </motion.span>
        )}
        {isActive && (
          <motion.div
            layoutId="sidebar-indicator"
            className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-primary rounded-r-full"
          />
        )}
      </Link>
    )
  }

  return (
    <motion.aside
      initial={false}
      animate={{ width: isCollapsed ? 72 : 256 }}
      transition={{ duration: 0.2, ease: 'easeInOut' }}
      className={cn(
        'fixed left-0 top-0 z-40 h-screen border-r border-border bg-background flex flex-col'
      )}
    >
      {/* Logo */}
      <div className={cn(
        'flex items-center h-16 px-4 border-b border-border',
        isCollapsed ? 'justify-center' : 'justify-between'
      )}>
        {!isCollapsed && (
          <Link href="/dashboard" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-brand-500 to-brand-700 flex items-center justify-center">
              <span className="text-white font-bold text-lg">C</span>
            </div>
            <span className="font-semibold text-lg">Contently</span>
          </Link>
        )}
        {isCollapsed && (
          <Link href="/dashboard">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-brand-500 to-brand-700 flex items-center justify-center">
              <span className="text-white font-bold text-lg">C</span>
            </div>
          </Link>
        )}
      </div>

      {/* Navigation */}
      <ScrollArea className="flex-1 py-4">
        <nav className="px-3 space-y-1">
          {/* Main Section */}
          {!isCollapsed && (
            <p className="px-3 mb-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              {t.nav.creation}
            </p>
          )}
          {mainNavItems.map((item) => (
            <NavLink key={item.href} item={item} />
          ))}

          <Separator className="my-4" />

          {/* Business Section */}
          {!isCollapsed && (
            <p className="px-3 mb-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              {t.nav.business}
            </p>
          )}
          {businessNavItems.map((item) => (
            <NavLink key={item.href} item={item} />
          ))}
        </nav>
      </ScrollArea>

      {/* Footer */}
      <div className="border-t border-border p-3 space-y-2">
        <SettingsLink />
        {!isCollapsed && <LanguageSwitcher />}
        <Button
          variant="ghost"
          size="icon"
          onClick={onToggle}
          className={cn(
            'w-full h-9',
            isCollapsed ? 'justify-center' : 'justify-end'
          )}
        >
          {isCollapsed ? (
            <ChevronRight className="h-4 w-4" />
          ) : (
            <ChevronLeft className="h-4 w-4" />
          )}
        </Button>
      </div>
    </motion.aside>
  )
}
