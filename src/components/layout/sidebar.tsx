'use client'

import * as React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
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
          'flex items-center gap-3 px-3 py-2 text-sm rounded-md transition-colors',
          isActive 
            ? 'bg-accent text-foreground font-medium' 
            : 'text-muted-foreground hover:text-foreground hover:bg-accent/50'
        )}
      >
        <Icon className="h-4 w-4 shrink-0" />
        {!isCollapsed && (
          <span className="truncate">
            {title}
          </span>
        )}
        {!isCollapsed && item.badge && (
          <span className="ml-auto text-xs bg-muted text-muted-foreground px-1.5 py-0.5 rounded">
            {item.badge}
          </span>
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
          'flex items-center gap-3 px-3 py-2 text-sm rounded-md transition-colors',
          isActive 
            ? 'bg-accent text-foreground font-medium' 
            : 'text-muted-foreground hover:text-foreground hover:bg-accent/50'
        )}
      >
        <Settings className="h-4 w-4 shrink-0" />
        {!isCollapsed && (
          <span className="truncate">
            {t.nav.settings}
          </span>
        )}
      </Link>
    )
  }

  return (
    <aside
      className={cn(
        'fixed left-0 top-0 z-40 h-screen border-r border-border bg-background flex flex-col transition-[width] duration-150',
        isCollapsed ? 'w-[72px]' : 'w-64'
      )}
    >
      {/* Logo */}
      <div className={cn(
        'flex items-center h-14 px-4 border-b border-border',
        isCollapsed ? 'justify-center' : 'justify-between'
      )}>
        {!isCollapsed && (
          <Link href="/dashboard" className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-md bg-primary flex items-center justify-center">
              <span className="text-primary-foreground font-semibold text-sm">C</span>
            </div>
            <span className="font-semibold">Contently</span>
          </Link>
        )}
        {isCollapsed && (
          <Link href="/dashboard">
            <div className="w-7 h-7 rounded-md bg-primary flex items-center justify-center">
              <span className="text-primary-foreground font-semibold text-sm">C</span>
            </div>
          </Link>
        )}
      </div>

      {/* Navigation */}
      <ScrollArea className="flex-1 py-3">
        <nav className="px-3 space-y-1">
          {/* Main Section */}
          {!isCollapsed && (
            <p className="px-3 mb-2 text-[11px] font-medium text-muted-foreground uppercase tracking-wider">
              {t.nav.creation}
            </p>
          )}
          {mainNavItems.map((item) => (
            <NavLink key={item.href} item={item} />
          ))}

          <div className="my-3 mx-3 border-t border-border" />

          {/* Business Section */}
          {!isCollapsed && (
            <p className="px-3 mb-2 text-[11px] font-medium text-muted-foreground uppercase tracking-wider">
              {t.nav.business}
            </p>
          )}
          {businessNavItems.map((item) => (
            <NavLink key={item.href} item={item} />
          ))}
        </nav>
      </ScrollArea>

      {/* Footer */}
      <div className="border-t border-border p-3 space-y-1">
        <SettingsLink />
        {!isCollapsed && <LanguageSwitcher />}
        <Button
          variant="ghost"
          size="icon-sm"
          onClick={onToggle}
          className={cn(
            'w-full',
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
    </aside>
  )
}
